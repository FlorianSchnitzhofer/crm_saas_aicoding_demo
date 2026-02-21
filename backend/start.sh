#!/usr/bin/env bash
set -euo pipefail
alembic -c /app/backend/alembic.ini upgrade head
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
