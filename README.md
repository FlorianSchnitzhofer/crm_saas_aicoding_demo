# CRM SaaS (Pipedrive-like)

TypeScript/React UI + Python/FastAPI backend with MariaDB persistence.

## Features
- Pipeline/Kanban deals board
- Contacts and companies management
- Activities list
- JWT authentication (login endpoint + protected APIs)
- Search box filtering (UI + `/api/search` endpoint)
- OpenAPI docs at `/api/docs`
- SQLAlchemy models + Alembic migrations
- Production container with health checks

## Run locally with Docker
```bash
docker compose up --build
```

App runs on `http://localhost:8000`.

## First-time auth bootstrap
Register a user:
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@crm.local","full_name":"Demo User","password":"demo1234"}'
```
Then login in the UI with that email/password.

## Environment variables
- `DATABASE_URL` (required in production)
- `SECRET_KEY` (required in production)
- `ACCESS_TOKEN_EXPIRE_MINUTES`
- `APP_ENV`

## Azure App Service (Web App for Containers)
1. Build and push image to ACR/Docker Hub:
   ```bash
   docker build -t <registry>/crm-saas:latest .
   docker push <registry>/crm-saas:latest
   ```
2. Create Azure resources (`az` CLI):
   ```bash
   az group create -n crm-rg -l eastus
   az appservice plan create -g crm-rg -n crm-plan --sku B1 --is-linux
   az webapp create -g crm-rg -p crm-plan -n <webapp-name> \
     -i <registry>/crm-saas:latest
   ```
3. Configure container registry credentials (if private):
   ```bash
   az webapp config container set -g crm-rg -n <webapp-name> \
     --container-image-name <registry>/crm-saas:latest \
     --container-registry-url https://<registry-host> \
     --container-registry-user <user> \
     --container-registry-password <password>
   ```
4. Set required app settings/secrets:
   ```bash
   az webapp config appsettings set -g crm-rg -n <webapp-name> --settings \
     DATABASE_URL='mysql+pymysql://<user>:<pass>@<azure-mariadb-host>:3306/crm?ssl_ca=/etc/ssl/certs/ca-certificates.crt' \
     SECRET_KEY='<long-random-secret>' \
     APP_ENV='production' \
     WEBSITES_PORT='8000'
   ```
5. Ensure DB firewall/network allows App Service outbound IPs and create schema/user in Azure Database for MariaDB.
6. Browse `https://<webapp-name>.azurewebsites.net` and verify `/healthz` and `/api/docs`.

