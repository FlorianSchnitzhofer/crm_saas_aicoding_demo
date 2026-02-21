from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.api.routes import router
from app.core.config import settings

app = FastAPI(title='CRM SaaS API', version='1.0.0', openapi_url='/api/openapi.json', docs_url='/api/docs', redoc_url='/api/redoc')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(router)


@app.get('/healthz')
def healthz():
    return {'status': 'ok'}


frontend_dist = Path(settings.frontend_dist_dir)
if frontend_dist.exists():
    app.mount('/assets', StaticFiles(directory=frontend_dist / 'assets'), name='assets')

    @app.get('/')
    @app.get('/{full_path:path}')
    def spa_fallback(full_path: str = ''):
        target = frontend_dist / full_path
        if full_path and target.exists() and target.is_file():
            return FileResponse(target)
        return FileResponse(frontend_dist / 'index.html')
