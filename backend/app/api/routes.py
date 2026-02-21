from sqlalchemy import or_
from sqlalchemy.orm import Session

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm

from app.api.deps import get_current_user
from app.core.security import create_access_token, get_password_hash, verify_password
from app.db.session import get_db
from app.models.models import Activity, Company, Contact, Deal, User
from app.schemas.schemas import (
    ActivityCreate,
    ActivityRead,
    CompanyCreate,
    CompanyRead,
    ContactCreate,
    ContactRead,
    DealCreate,
    DealRead,
    SearchResult,
    Token,
    UserCreate,
    UserRead,
)

router = APIRouter(prefix='/api')


@router.post('/auth/register', response_model=UserRead)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail='User already exists')
    user = User(email=user_in.email, full_name=user_in.full_name, hashed_password=get_password_hash(user_in.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post('/auth/login', response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail='Incorrect email or password')
    return Token(access_token=create_access_token(user.email))


@router.get('/auth/me', response_model=UserRead)
def me(current_user: User = Depends(get_current_user)):
    return current_user


@router.get('/deals', response_model=list[DealRead])
def list_deals(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    deals = db.query(Deal).all()
    return [
        DealRead.model_validate(
            deal,
            update={
                'company_name': deal.company.name if deal.company else None,
                'owner_name': deal.owner.full_name if deal.owner else None,
            },
        )
        for deal in deals
    ]


@router.post('/deals', response_model=DealRead)
def create_deal(payload: DealCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    deal = Deal(**payload.model_dump(), owner_id=current_user.id)
    db.add(deal)
    db.commit()
    db.refresh(deal)
    return DealRead.model_validate(deal, update={'company_name': deal.company.name if deal.company else None, 'owner_name': current_user.full_name})


@router.get('/contacts', response_model=list[ContactRead])
def list_contacts(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    contacts = db.query(Contact).all()
    return [ContactRead.model_validate(c, update={'company_name': c.company.name if c.company else None}) for c in contacts]


@router.post('/contacts', response_model=ContactRead)
def create_contact(payload: ContactCreate, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    contact = Contact(**payload.model_dump())
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return ContactRead.model_validate(contact, update={'company_name': contact.company.name if contact.company else None})


@router.delete('/contacts/{contact_id}')
def delete_contact(contact_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    contact = db.get(Contact, contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail='Contact not found')
    db.delete(contact)
    db.commit()
    return {'ok': True}


@router.get('/companies', response_model=list[CompanyRead])
def list_companies(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return db.query(Company).all()


@router.post('/companies', response_model=CompanyRead)
def create_company(payload: CompanyCreate, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    company = Company(**payload.model_dump())
    db.add(company)
    db.commit()
    db.refresh(company)
    return company


@router.get('/activities', response_model=list[ActivityRead])
def list_activities(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    activities = db.query(Activity).all()
    return [ActivityRead.model_validate(a, update={'owner_name': a.owner.full_name if a.owner else None}) for a in activities]


@router.post('/activities', response_model=ActivityRead)
def create_activity(payload: ActivityCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    activity = Activity(**payload.model_dump(), owner_id=current_user.id)
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return ActivityRead.model_validate(activity, update={'owner_name': current_user.full_name})


@router.get('/search', response_model=SearchResult)
def search(q: str, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    pattern = f'%{q}%'
    deals = db.query(Deal).filter(Deal.name.ilike(pattern)).limit(10).all()
    contacts = db.query(Contact).filter(or_(Contact.first_name.ilike(pattern), Contact.last_name.ilike(pattern), Contact.email.ilike(pattern))).limit(10).all()
    companies = db.query(Company).filter(Company.name.ilike(pattern)).limit(10).all()
    return SearchResult(
        deals=[DealRead.model_validate(d, update={'company_name': d.company.name if d.company else None, 'owner_name': d.owner.full_name if d.owner else None}) for d in deals],
        contacts=[ContactRead.model_validate(c, update={'company_name': c.company.name if c.company else None}) for c in contacts],
        companies=[CompanyRead.model_validate(c) for c in companies],
    )
