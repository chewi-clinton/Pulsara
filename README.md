# Nexora

SMM growth & virtual OTP number platform.

- `backend/` — Django 5 + DRF API (apps: accounts, orders, services, payments, providers, admin_panel)
- `frontend/` — Next.js 15 (App Router, Tailwind) — page/component placeholders ready for implementation
- `nginx/` — reverse proxy config for the dockerized deployment
- `docker-compose.yml` / `.env.example` — local & VPS deployment setup

See [DOCUMENTATION.md](DOCUMENTATION.md) for the full architecture, API contracts, and DB schema.

## Backend quickstart
```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp ../.env.example ../.env   # fill in values
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## Frontend quickstart
```bash
cd frontend
npm install
npm run dev
```
