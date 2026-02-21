from datetime import date

from pydantic import BaseModel, ConfigDict, EmailStr


class Token(BaseModel):
    access_token: str
    token_type: str = 'bearer'


class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    full_name: str


class CompanyBase(BaseModel):
    name: str
    industry: str | None = None
    website: str | None = None
    email: str | None = None
    phone: str | None = None
    address: str | None = None
    city: str | None = None
    country: str | None = None
    employees: int | None = None
    revenue: float | None = None


class CompanyCreate(CompanyBase):
    pass


class CompanyRead(CompanyBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class ContactBase(BaseModel):
    first_name: str
    last_name: str
    email: str | None = None
    phone: str | None = None
    position: str | None = None
    department: str | None = None
    company_id: int | None = None


class ContactCreate(ContactBase):
    pass


class ContactRead(ContactBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    company_name: str | None = None


class DealBase(BaseModel):
    name: str
    value: float
    stage: str
    probability: int = 0
    description: str | None = None
    close_date: date | None = None
    company_id: int | None = None


class DealCreate(DealBase):
    pass


class DealRead(DealBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    company_name: str | None = None
    owner_name: str | None = None


class ActivityBase(BaseModel):
    subject: str
    status: str = 'planned'
    due_date: date | None = None
    notes: str | None = None
    deal_id: int | None = None
    contact_id: int | None = None


class ActivityCreate(ActivityBase):
    pass


class ActivityRead(ActivityBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_name: str | None = None


class SearchResult(BaseModel):
    deals: list[DealRead]
    contacts: list[ContactRead]
    companies: list[CompanyRead]
