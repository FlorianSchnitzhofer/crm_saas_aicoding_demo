from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', extra='ignore')

    app_name: str = 'CRM SaaS API'
    app_env: str = 'development'
    secret_key: str = 'change-me'
    access_token_expire_minutes: int = 60 * 24
    algorithm: str = 'HS256'

    database_url: str = 'mysql+pymysql://crm_user:crm_password@mariadb:3306/crm'

    frontend_dist_dir: str = '/app/frontend-dist'


settings = Settings()
