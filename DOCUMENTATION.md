# SMM & OTP Platform — Full Project Documentation

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Tech Stack](#3-tech-stack)
4. [Database Schema](#4-database-schema)
5. [Backend — Django API](#5-backend--django-api)
6. [Frontend — Next.js Pages](#6-frontend--nextjs-pages)
7. [Admin Panel Pages](#7-admin-panel-pages)
8. [Payment Integration](#8-payment-integration)
9. [Provider Integration](#9-provider-integration)
10. [Background Jobs (Celery)](#10-background-jobs-celery)
11. [Docker Deployment (VPS)](#11-docker-deployment-vps)
12. [Environment Variables](#12-environment-variables)
13. [Folder Structure](#13-folder-structure)

---

## 1. Project Overview

A single web platform offering two digital services:

- **Social Media Growth (SMM)** — Users buy followers, likes, views, and comments for TikTok, Instagram, Facebook, YouTube, and Twitter/X.
- **Virtual OTP Numbers** — Users rent a temporary phone number to receive a one-time verification code for any platform.

### Business Model
- Direct pay-per-order. No subscriptions. No user wallet.
- Customers pay via crypto (CryptoMus) or card/mobile money (Flutterwave).
- Platform buys wholesale from providers and sells at a marked-up price.
- Margin = sell price − provider cost.

### Provider Summary
| Service | Primary Provider | Fallback |
|---|---|---|
| SMM (followers/likes/etc.) | SMMFollowers API | — |
| OTP Numbers | SMSPool API | 5sim API |
| Crypto Payments | CryptoMus | — |
| Card + Mobile Money | Flutterwave | — |

---

## 2. Architecture

```
┌──────────────────────────┐         ┌───────────────────────────┐
│   Next.js Frontend       │  HTTPS  │   Django Backend (DRF)    │
│   (Vercel or Docker)     │ ──────► │   (Gunicorn + Nginx)      │
│                          │         │                           │
│  - Public pages          │         │  - REST API endpoints     │
│  - Order flows           │         │  - Business logic         │
│  - OTP live display      │         │  - PostgreSQL database    │
│  - Order tracking        │         │  - Celery background jobs │
│  - Admin dashboard       │         │  - Webhook handlers       │
└──────────────────────────┘         └───────────────────────────┘
        Port 3000                              Port 8000
                                               │
                               ┌───────────────┼───────────────┐
                               │               │               │
                         PostgreSQL          Redis         SMMFollowers
                         (database)         (cache +       SMSPool
                                            Celery)        5sim
                                                           CryptoMus
                                                           Flutterwave
```

### Request Flow
1. User interacts with Next.js frontend
2. Frontend makes HTTP requests to Django API (`/api/...`)
3. Django processes logic, calls provider APIs, writes to DB
4. Django returns JSON response to frontend
5. Frontend renders result

### Payment Flow
1. User submits order on frontend
2. Frontend calls Django `/api/orders/` → order created with `status: pending_payment`
3. Django calls CryptoMus or Flutterwave to generate payment link
4. Frontend redirects user to payment link
5. User pays
6. Payment provider sends webhook to Django `/api/webhooks/`
7. Django verifies webhook signature, marks order as paid
8. Django calls provider API (SMMFollowers or SMSPool) to fulfil order
9. Frontend polls order status, shows live updates

---

## 3. Tech Stack

### Backend
| Component | Technology |
|---|---|
| Framework | Django 5.x |
| REST API | Django REST Framework (DRF) |
| Database | PostgreSQL 16 |
| Background Jobs | Celery 5.x |
| Message Broker | Redis 7 |
| Cache | Redis 7 |
| HTTP Client | Requests |
| Auth | DRF Simple JWT |
| WSGI Server | Gunicorn |
| Reverse Proxy | Nginx |
| Containerisation | Docker + Docker Compose |

### Frontend
| Component | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | JavaScript |
| Styling | Tailwind CSS |
| HTTP Client | Axios |
| Charts | Recharts |
| State Management | Zustand |
| Icons | Lucide React |
| Containerisation | Docker |

---

## 4. Database Schema

### `orders_smmorder`
```
id                  SERIAL PRIMARY KEY
service_id          INTEGER (FK → services_smmservice)
target_url          TEXT NOT NULL
quantity            INTEGER NOT NULL
cost_price          DECIMAL(10,4)       -- what you paid provider
sell_price          DECIMAL(10,4)       -- what customer paid
status              VARCHAR(20)         -- pending_payment | paid | processing | in_progress | completed | failed | refunded
provider_order_id   VARCHAR(100)        -- ID returned by SMMFollowers
customer_email      VARCHAR(255) NULL
payment_method      VARCHAR(20)         -- cryptomus | flutterwave
payment_ref         VARCHAR(255) NULL   -- provider payment reference
created_at          TIMESTAMP DEFAULT NOW()
updated_at          TIMESTAMP
```

### `orders_otporder`
```
id                  SERIAL PRIMARY KEY
platform            VARCHAR(50)         -- instagram | tiktok | whatsapp | facebook | google | etc.
country_code        VARCHAR(10)         -- US | GB | CM | etc.
phone_number        VARCHAR(30) NULL    -- assigned number
otp_code            VARCHAR(20) NULL    -- received OTP
provider            VARCHAR(20)         -- smspool | 5sim
provider_session_id VARCHAR(100) NULL
cost_price          DECIMAL(10,4)
sell_price          DECIMAL(10,4)
status              VARCHAR(20)         -- pending_payment | paid | waiting_sms | received | expired | cancelled | refunded
customer_email      VARCHAR(255) NULL
payment_method      VARCHAR(20)
payment_ref         VARCHAR(255) NULL
expires_at          TIMESTAMP NULL      -- 20 min after number assigned
created_at          TIMESTAMP DEFAULT NOW()
updated_at          TIMESTAMP
```

### `services_smmservice`
```
id                  SERIAL PRIMARY KEY
provider_service_id VARCHAR(50)         -- ID from SMMFollowers
name                VARCHAR(255)
platform            VARCHAR(50)         -- tiktok | instagram | facebook | youtube | twitter
category            VARCHAR(50)         -- followers | likes | views | comments | shares
cost_per_1000       DECIMAL(10,4)       -- what SMMFollowers charges you
sell_per_1000       DECIMAL(10,4)       -- what you charge customers
min_quantity        INTEGER
max_quantity        INTEGER
is_active           BOOLEAN DEFAULT TRUE
description         TEXT NULL
synced_at           TIMESTAMP
created_at          TIMESTAMP DEFAULT NOW()
```

### `services_otpservice`
```
id                  SERIAL PRIMARY KEY
platform            VARCHAR(50)         -- instagram | tiktok | whatsapp | etc.
country_code        VARCHAR(10)
country_name        VARCHAR(100)
provider            VARCHAR(20)         -- smspool | 5sim
provider_service_id VARCHAR(100)
cost_price          DECIMAL(10,4)
sell_price          DECIMAL(10,4)
is_active           BOOLEAN DEFAULT TRUE
synced_at           TIMESTAMP
```

### `payments_payment`
```
id                  SERIAL PRIMARY KEY
order_type          VARCHAR(10)         -- smm | otp
order_id            INTEGER
amount              DECIMAL(10,2)
currency            VARCHAR(10)
method              VARCHAR(20)         -- cryptomus | flutterwave
status              VARCHAR(20)         -- pending | paid | failed | expired
provider_ref        VARCHAR(255) NULL
webhook_payload     JSONB NULL
created_at          TIMESTAMP DEFAULT NOW()
updated_at          TIMESTAMP
```

### `accounts_adminuser`
```
id                  SERIAL PRIMARY KEY (Django built-in User model)
email               VARCHAR(255) UNIQUE
password            VARCHAR (hashed)
is_staff            BOOLEAN DEFAULT TRUE
is_superuser        BOOLEAN DEFAULT FALSE
created_at          TIMESTAMP
```

---

## 5. Backend — Django API

Base URL: `https://api.yourdomain.com`

All endpoints return JSON. Authenticated admin endpoints require `Authorization: Bearer <token>` header.

---

### 5.1 Services

#### `GET /api/services/smm/`
Returns the full SMM service catalog.

**Query params:**
- `platform` — filter by platform (tiktok | instagram | facebook | youtube | twitter)
- `category` — filter by category (followers | likes | views | comments)

**Response:**
```json
{
  "results": [
    {
      "id": 1,
      "name": "TikTok Followers — High Quality",
      "platform": "tiktok",
      "category": "followers",
      "sell_per_1000": "6.00",
      "min_quantity": 100,
      "max_quantity": 100000,
      "description": "Real-looking accounts, 30-day refill"
    }
  ]
}
```

---

#### `GET /api/services/otp/`
Returns all available OTP platforms and countries.

**Query params:**
- `platform` — filter by platform

**Response:**
```json
{
  "results": [
    {
      "id": 5,
      "platform": "instagram",
      "country_code": "US",
      "country_name": "United States",
      "sell_price": "0.85",
      "is_active": true
    }
  ]
}
```

---

### 5.2 Orders — SMM

#### `POST /api/orders/smm/`
Create a new SMM order and generate a payment link.

**Request body:**
```json
{
  "service_id": 1,
  "target_url": "https://www.tiktok.com/@username",
  "quantity": 1000,
  "payment_method": "cryptomus",
  "customer_email": "user@email.com"
}
```

**Response:**
```json
{
  "order_id": "smm_abc123",
  "payment_url": "https://pay.cryptomus.com/pay/xyz",
  "amount": "6.00",
  "currency": "USD",
  "expires_at": "2026-06-05T12:30:00Z"
}
```

---

#### `GET /api/orders/smm/<order_id>/`
Get the current status of an SMM order.

**Response:**
```json
{
  "order_id": "smm_abc123",
  "status": "in_progress",
  "service_name": "TikTok Followers — High Quality",
  "target_url": "https://www.tiktok.com/@username",
  "quantity": 1000,
  "sell_price": "6.00",
  "payment_method": "cryptomus",
  "created_at": "2026-06-05T12:00:00Z"
}
```

---

### 5.3 Orders — OTP

#### `POST /api/orders/otp/`
Create a new OTP order and generate payment link.

**Request body:**
```json
{
  "service_id": 5,
  "payment_method": "flutterwave",
  "customer_email": "user@email.com"
}
```

**Response:**
```json
{
  "order_id": "otp_def456",
  "payment_url": "https://checkout.flutterwave.com/v3/hosted/pay/abc",
  "amount": "0.85",
  "currency": "USD"
}
```

---

#### `GET /api/orders/otp/<order_id>/`
Poll this endpoint every 3 seconds on the OTP waiting page.

**Response:**
```json
{
  "order_id": "otp_def456",
  "status": "waiting_sms",
  "phone_number": "+12025551234",
  "platform": "instagram",
  "country": "United States",
  "otp_code": null,
  "expires_at": "2026-06-05T12:20:00Z",
  "seconds_remaining": 847
}
```

When OTP arrives:
```json
{
  "order_id": "otp_def456",
  "status": "received",
  "phone_number": "+12025551234",
  "otp_code": "483921",
  "expires_at": "2026-06-05T12:20:00Z"
}
```

---

#### `POST /api/orders/otp/<order_id>/cancel/`
Cancel an OTP order before SMS is received. Triggers refund.

**Response:**
```json
{
  "order_id": "otp_def456",
  "status": "cancelled",
  "refund_status": "processing"
}
```

---

### 5.4 Webhooks

#### `POST /api/webhooks/cryptomus/`
Receives payment confirmation from CryptoMus.
- Verifies MD5 signature
- Finds order by `order_id` in payload
- Updates order status to `paid`
- Triggers order fulfilment

#### `POST /api/webhooks/flutterwave/`
Receives payment confirmation from Flutterwave.
- Verifies `verif-hash` header against `FLUTTERWAVE_WEBHOOK_HASH` env var
- Finds order by `tx_ref` in payload
- Updates order status to `paid`
- Triggers order fulfilment

---

### 5.5 Admin Endpoints (JWT Protected)

#### `POST /api/admin/auth/login/`
**Request:** `{ "email": "...", "password": "..." }`
**Response:** `{ "access": "<jwt>", "refresh": "<jwt>" }`

#### `POST /api/admin/auth/refresh/`
**Request:** `{ "refresh": "<token>" }`
**Response:** `{ "access": "<new_jwt>" }`

---

#### `GET /api/admin/dashboard/`
**Response:**
```json
{
  "revenue_today": "245.50",
  "revenue_week": "1820.00",
  "revenue_total": "24500.00",
  "orders_today": 48,
  "orders_pending": 3,
  "orders_failed": 2,
  "active_otp_sessions": 7,
  "top_services": [
    { "name": "TikTok Followers", "orders": 120, "revenue": "720.00" }
  ]
}
```

---

#### `GET /api/admin/orders/`
**Query params:** `type` (smm|otp), `status`, `date_from`, `date_to`, `page`

**Response:** Paginated list of all orders.

#### `GET /api/admin/orders/<order_id>/`
Full order detail including payment info and provider response.

#### `POST /api/admin/orders/<order_id>/refund/`
Manually trigger a refund for any order.

#### `POST /api/admin/orders/<order_id>/retry/`
Re-submit a failed order to the provider.

---

#### `GET /api/admin/services/smm/`
List all SMM services with cost and sell prices.

#### `PATCH /api/admin/services/smm/<id>/`
Update a service's sell price, name, description, or active status.
**Request:** `{ "sell_per_1000": "8.00", "is_active": true }`

#### `POST /api/admin/services/smm/sync/`
Trigger a manual sync of services from SMMFollowers API.

---

#### `GET /api/admin/services/otp/`
List all OTP services with cost and sell prices.

#### `PATCH /api/admin/services/otp/<id>/`
Update OTP service sell price or active status.

#### `POST /api/admin/services/otp/sync/`
Trigger a manual sync from SMSPool + 5sim.

---

#### `GET /api/admin/analytics/`
**Query params:** `period` (7d | 30d | 90d | all)

**Response:**
```json
{
  "revenue_by_day": [
    { "date": "2026-06-01", "smm": "120.00", "otp": "45.00" }
  ],
  "revenue_by_method": { "cryptomus": "800.00", "flutterwave": "320.00" },
  "revenue_by_category": { "smm": "700.00", "otp": "420.00" },
  "margin_summary": { "total_cost": "230.00", "total_revenue": "1120.00", "profit": "890.00" }
}
```

---

#### `GET /api/admin/settings/`
Returns current provider API key statuses (masked, not full keys).

#### `POST /api/admin/settings/`
Update provider API keys and settings.
```json
{
  "smmfollowers_api_key": "...",
  "smspool_api_key": "...",
  "fivesim_api_key": "...",
  "cryptomus_merchant_id": "...",
  "cryptomus_payment_key": "...",
  "flutterwave_public_key": "...",
  "flutterwave_secret_key": "...",
  "flutterwave_webhook_hash": "..."
}
```

---

## 6. Frontend — Next.js Pages

Base URL: `https://yourdomain.com`

---

### `GET /`
**Landing Page**

Sections:
- Hero — headline, subheadline, two CTA buttons (Start SMM / Get OTP Number)
- Features — 4 cards: platforms supported, HD/no watermark, instant delivery, secure payment
- How it works — 3 steps for SMM, 3 steps for OTP (tabbed)
- Pricing teaser — starting from price for most popular services
- Supported platforms — logos of TikTok, Instagram, Facebook, YouTube, Twitter, WhatsApp
- Payment methods — CryptoMus, Flutterwave logos
- FAQ accordion
- Footer — links, copyright

---

### `GET /smm`
**SMM Service Catalog**

Layout:
- Left sidebar: filter by platform (TikTok | Instagram | Facebook | YouTube | Twitter) and category (Followers | Likes | Views | Comments)
- Right: grid of service cards

Each service card shows:
- Platform icon + service name
- Price per 1000
- Min/max quantity
- Estimated delivery
- "Order Now" button → opens order modal

Order modal:
- Target URL input
- Quantity slider + number input
- Live total price calculation
- Email input (optional)
- Payment method selector (Crypto / Card + Mobile Money)
- "Proceed to Payment" button

---

### `GET /otp`
**OTP Number Service**

Layout:
- Search/filter: select platform (Instagram, TikTok, WhatsApp, Facebook, Google, Telegram, etc.)
- Country grid: shows available countries with flag, name, and price per activation
- "Get Number" button on each → opens payment modal

Payment modal:
- Summary of selected platform + country + price
- Email input (optional)
- Payment method selector
- "Pay and Get Number" button

---

### `GET /order/smm/[id]`
**SMM Order Tracking**

Displays:
- Order ID + status badge
- Service name, target URL, quantity
- Amount paid + payment method
- Progress indicator (pending → processing → in_progress → completed)
- Auto-refreshes every 10 seconds until status is `completed` or `failed`
- If failed: refund notice shown

---

### `GET /order/otp/[id]`
**OTP Live Display**

This is the most interactive page.

States:
1. **Waiting for payment** — shows payment link if not yet paid
2. **Number assigned** — displays the phone number in large text, countdown timer, "Cancel and Refund" button
3. **OTP received** — shows OTP code in large bold text, green success state, "Copy" button
4. **Expired** — shows expiry message + refund notice
5. **Cancelled** — shows cancellation + refund confirmation

Behaviour:
- Polls `GET /api/orders/otp/<id>/` every 3 seconds
- Countdown timer counts down from 20 minutes
- Stops polling when status is `received`, `expired`, or `cancelled`

---

### `GET /track`
**Order Lookup**

Simple form:
- Input: Order ID
- Button: Track Order
- Redirects to `/order/smm/<id>` or `/order/otp/<id>` based on order type

---

### `GET /faq`
**FAQ Page**

Static page with accordion answers to common questions:
- How long does delivery take?
- What happens if followers drop?
- What if OTP doesn't arrive?
- How do I get a refund?
- What payment methods are accepted?
- Is it safe?

---

## 7. Admin Panel Pages

Base URL: `https://yourdomain.com/admin`

All admin pages require JWT auth. Redirect to `/admin/login` if not authenticated.

---

### `GET /admin/login`
**Admin Login**

- Email + password form
- Calls `POST /api/admin/auth/login/`
- Stores JWT in httpOnly cookie or localStorage
- Redirects to `/admin/dashboard`

---

### `GET /admin/dashboard`
**Main Dashboard**

Cards row:
- Revenue today
- Revenue this week
- Total orders today
- Active OTP sessions
- Failed orders (last 24h)

Charts:
- Revenue by day (line chart — last 30 days, SMM vs OTP)
- Orders by status (donut chart)
- Revenue by payment method (bar chart)

Recent orders table (last 10, with quick links).

---

### `GET /admin/orders`
**All Orders**

Full orders table with:
- Columns: ID, Type (SMM/OTP), Status, Service, Amount, Payment Method, Date
- Filters: Type, Status, Date range, Search by order ID
- Pagination
- Click row → `/admin/orders/<id>`

---

### `GET /admin/orders/[id]`
**Order Detail**

Displays:
- Full order info
- Payment info (method, ref, amount)
- Provider info (provider order ID, provider response)
- Timeline (created → paid → processing → completed)
- Actions: Refund button, Retry button (if failed)

---

### `GET /admin/services/smm`
**SMM Service Management**

Table of all SMM services with columns:
- Service name
- Platform
- Category
- Cost per 1000 (from provider)
- Sell per 1000 (your price — editable inline)
- Margin %
- Active toggle
- Min/Max quantity

Actions:
- Edit sell price inline
- Toggle active/inactive
- Sync services button (calls `/api/admin/services/smm/sync/`)

---

### `GET /admin/services/otp`
**OTP Service Management**

Table of OTP services:
- Platform
- Country
- Provider (SMSPool / 5sim)
- Cost price
- Sell price (editable inline)
- Margin %
- Active toggle

Actions:
- Edit sell price inline
- Toggle active/inactive
- Sync button

---

### `GET /admin/analytics`
**Analytics**

Period selector: 7 days / 30 days / 90 days / All time

Charts:
- Revenue by day (line — SMM vs OTP)
- Revenue by payment method (pie)
- Top 10 services by revenue (horizontal bar)
- Profit margin over time (line)

Summary cards:
- Total revenue
- Total cost
- Gross profit
- Profit margin %

---

### `GET /admin/settings`
**Settings**

Sections:

**Provider API Keys**
- SMMFollowers API Key (masked input + update button)
- SMSPool API Key
- 5sim API Key
- Test connection button for each

**Payment Keys**
- CryptoMus Merchant ID
- CryptoMus Payment Key
- Flutterwave Public Key
- Flutterwave Secret Key
- Flutterwave Webhook Hash

**Platform Settings**
- Site name
- Contact email
- Support message (shown on order pages)

---

## 8. Payment Integration

### 8.1 CryptoMus

**Docs:** https://doc.cryptomus.com/payments

**Create Payment:**
```
POST https://api.cryptomus.com/v1/payment
Headers:
  merchant: <CRYPTOMUS_MERCHANT_ID>
  sign: MD5(base64(json_body) + CRYPTOMUS_PAYMENT_KEY)

Body:
{
  "amount": "6.00",
  "currency": "USD",
  "order_id": "smm_abc123",
  "url_callback": "https://api.yourdomain.com/api/webhooks/cryptomus/",
  "url_return": "https://yourdomain.com/order/smm/smm_abc123",
  "lifetime": 1800
}
```

**Webhook Verification:**
```python
import hashlib, base64, json

def verify_cryptomus_webhook(payload: dict, payment_key: str) -> bool:
    sign = payload.pop("sign", None)
    json_str = json.dumps(payload, separators=(',', ':'))
    expected = hashlib.md5(
        (base64.b64encode(json_str.encode()).decode() + payment_key).encode()
    ).hexdigest()
    return sign == expected
```

**Webhook payload status to watch:** `paid`, `paid_over`

---

### 8.2 Flutterwave

**Docs:** https://developer.flutterwave.com

**Create Payment Link:**
```
POST https://api.flutterwave.com/v3/payments
Headers:
  Authorization: Bearer <FLUTTERWAVE_SECRET_KEY>

Body:
{
  "tx_ref": "otp_def456",
  "amount": "0.85",
  "currency": "USD",
  "redirect_url": "https://yourdomain.com/order/otp/otp_def456",
  "customer": {
    "email": "user@email.com"
  },
  "customizations": {
    "title": "OTP Number Purchase",
    "logo": "https://yourdomain.com/logo.png"
  }
}
```

**Webhook Verification:**
```python
def verify_flutterwave_webhook(request_headers: dict, webhook_hash: str) -> bool:
    return request_headers.get("verif-hash") == webhook_hash
```

**Webhook payload status to watch:** `charge.completed` with `data.status == "successful"`

---

## 9. Provider Integration

### 9.1 SMMFollowers

**Base URL:** Their API URL (check their dashboard after signup)

**Get Services:**
```
POST <BASE_URL>
Body: key=<API_KEY>&action=services
```

**Place Order:**
```
POST <BASE_URL>
Body: key=<API_KEY>&action=add&service=<service_id>&link=<url>&quantity=<qty>
Response: { "order": 12345 }
```

**Check Order Status:**
```
POST <BASE_URL>
Body: key=<API_KEY>&action=status&order=<order_id>
Response: { "status": "Completed", "start_count": 500, "remains": 0 }
```

**Status mapping:**
| SMMFollowers status | Your status |
|---|---|
| Pending | processing |
| In progress | in_progress |
| Completed | completed |
| Partial | completed (partial) |
| Cancelled | failed |

---

### 9.2 SMSPool (Primary OTP)

**Docs:** https://www.smspool.net/article/how-to-use-the-smspool-api

**Get Available Countries for Platform:**
```
GET https://api.smspool.net/country/retrieve_all
    ?key=<API_KEY>
```

**Request Number:**
```
GET https://api.smspool.net/purchase/sms
    ?key=<API_KEY>
    &country=<country_code>
    &service=<service_name>
```

**Response:**
```json
{
  "success": 1,
  "number": "12025551234",
  "order_id": "smspool_order_789",
  "expires_in": 1200
}
```

**Check for OTP:**
```
GET https://api.smspool.net/sms/check
    ?key=<API_KEY>
    &orderid=<order_id>
```

**Response when OTP received:**
```json
{
  "status": 3,
  "sms": "Your Instagram code is 483921"
}
```

**Status codes:** 1 = waiting, 2 = expired, 3 = received, 4 = used

**Cancel Number:**
```
GET https://api.smspool.net/sms/cancel
    ?key=<API_KEY>
    &orderid=<order_id>
```

---

### 9.3 5sim (Fallback OTP)

**Docs:** https://5sim.net/docs

**Get Price for Service:**
```
GET https://5sim.net/v1/guest/prices?country=<country>&product=<platform>
Headers: Authorization: Bearer <API_KEY>
```

**Buy Number:**
```
GET https://5sim.net/v1/user/buy/activation/<country>/<operator>/<product>
Headers: Authorization: Bearer <API_KEY>
```

**Check for SMS:**
```
GET https://5sim.net/v1/user/check/<order_id>
Headers: Authorization: Bearer <API_KEY>
```

**Cancel Number:**
```
GET https://5sim.net/v1/user/cancel/<order_id>
Headers: Authorization: Bearer <API_KEY>
```

---

### 9.4 Provider Fallback Logic

```python
def get_otp_number(platform, country):
    # Try SMSPool first
    try:
        result = smspool.buy_number(platform, country)
        if result.get("success"):
            return { "provider": "smspool", "data": result }
    except Exception as e:
        log.warning(f"SMSPool failed: {e}")

    # Fall back to 5sim
    try:
        result = fivesim.buy_number(platform, country)
        return { "provider": "5sim", "data": result }
    except Exception as e:
        raise Exception("No numbers available from any provider")
```

---

## 10. Background Jobs (Celery)

### Job 1 — Sync SMM Services
**Schedule:** Every 6 hours
**Task:** Fetch all services from SMMFollowers API, update `services_smmservice` table, deactivate removed services.

### Job 2 — Sync OTP Services
**Schedule:** Every 6 hours
**Task:** Fetch available services/prices from SMSPool and 5sim, update `services_otpservice` table.

### Job 3 — Expire OTP Sessions
**Schedule:** Every 1 minute
**Task:** Find OTP orders with `status=waiting_sms` and `expires_at < now()`. Mark them as `expired`. Trigger auto-refund.

### Job 4 — Poll OTP Status
**Schedule:** Every 5 seconds (using Celery beat)
**Task:** For all active OTP orders (`status=waiting_sms`), poll SMSPool or 5sim for incoming SMS. Update `otp_code` and set `status=received` if SMS arrived.

### Job 5 — Poll SMM Order Status
**Schedule:** Every 2 minutes
**Task:** For all SMM orders with `status=processing` or `in_progress`, check status from SMMFollowers. Update accordingly.

### Job 6 — Process Refunds
**Trigger:** Celery task called when order fails or expires
**Task:** Mark payment as refunded. Log refund event. (Manual payout from CryptoMus/Flutterwave dashboard — no automatic payout API used at MVP)

---

## 11. Docker Deployment (VPS)

### File Structure
```
smm-otp-platform/
├── backend/
│   ├── Dockerfile
│   └── ...Django project...
├── frontend/
│   ├── Dockerfile
│   └── ...Next.js project...
├── nginx/
│   └── nginx.conf
└── docker-compose.yml
```

---

### `docker-compose.yml`
```yaml
version: "3.9"

services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: smmotpdb
      POSTGRES_USER: smmuser
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - internal

  redis:
    image: redis:7-alpine
    networks:
      - internal

  backend:
    build: ./backend
    command: gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 4
    environment:
      DATABASE_URL: postgres://smmuser:${DB_PASSWORD}@db:5432/smmotpdb
      REDIS_URL: redis://redis:6379/0
    env_file: .env
    depends_on:
      - db
      - redis
    networks:
      - internal
      - web

  celery_worker:
    build: ./backend
    command: celery -A config worker --loglevel=info
    env_file: .env
    depends_on:
      - db
      - redis
    networks:
      - internal

  celery_beat:
    build: ./backend
    command: celery -A config beat --loglevel=info
    env_file: .env
    depends_on:
      - db
      - redis
    networks:
      - internal

  frontend:
    build: ./frontend
    environment:
      NEXT_PUBLIC_API_URL: https://api.yourdomain.com
    networks:
      - web

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl
    depends_on:
      - backend
      - frontend
    networks:
      - web

volumes:
  postgres_data:

networks:
  internal:
  web:
```

---

### `nginx/nginx.conf`
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/ssl/fullchain.pem;
    ssl_certificate_key /etc/ssl/privkey.pem;

    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    listen 443 ssl;
    server_name api.yourdomain.com;

    ssl_certificate /etc/ssl/fullchain.pem;
    ssl_certificate_key /etc/ssl/privkey.pem;

    location / {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

### Backend `Dockerfile`
```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py collectstatic --noinput

EXPOSE 8000
```

### Frontend `Dockerfile`
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

---

### Deploy Commands (on VPS)
```bash
# First deploy
git clone <repo> smm-otp-platform
cd smm-otp-platform
cp .env.example .env       # fill in all values
docker compose build
docker compose up -d
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py createsuperuser

# Redeploy after changes
git pull
docker compose build backend frontend
docker compose up -d --no-deps backend frontend
docker compose exec backend python manage.py migrate
```

---

## 12. Environment Variables

### `.env` (root, shared by Docker Compose)
```env
# Database
DB_PASSWORD=your_secure_password

# Django
SECRET_KEY=your_django_secret_key
DEBUG=False
ALLOWED_HOSTS=api.yourdomain.com
FRONTEND_URL=https://yourdomain.com

# Redis
REDIS_URL=redis://redis:6379/0

# SMM Provider
SMMFOLLOWERS_API_KEY=
SMMFOLLOWERS_API_URL=

# OTP Providers
SMSPOOL_API_KEY=
FIVESIM_API_KEY=

# CryptoMus
CRYPTOMUS_MERCHANT_ID=
CRYPTOMUS_PAYMENT_KEY=

# Flutterwave
FLUTTERWAVE_PUBLIC_KEY=
FLUTTERWAVE_SECRET_KEY=
FLUTTERWAVE_WEBHOOK_HASH=

# Email (Resend SMTP)
RESEND_API_KEY=
DEFAULT_FROM_EMAIL=noreply@yourdomain.com

# Frontend (Next.js)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

---

## 13. Folder Structure

### Backend (Django)
```
backend/
├── config/
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── celery.py
├── apps/
│   ├── orders/
│   │   ├── models.py         (SMMOrder, OTPOrder)
│   │   ├── views.py          (order endpoints)
│   │   ├── serializers.py
│   │   ├── tasks.py          (Celery tasks)
│   │   └── urls.py
│   ├── services/
│   │   ├── models.py         (SMMService, OTPService)
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   ├── payments/
│   │   ├── models.py         (Payment)
│   │   ├── views.py          (webhook handlers)
│   │   ├── cryptomus.py      (CryptoMus client)
│   │   ├── flutterwave.py    (Flutterwave client)
│   │   └── urls.py
│   ├── providers/
│   │   ├── smmfollowers.py   (SMMFollowers client)
│   │   ├── smspool.py        (SMSPool client)
│   │   ├── fivesim.py        (5sim client)
│   │   └── otp_router.py     (fallback logic)
│   └── admin_panel/
│       ├── views.py          (admin API endpoints)
│       ├── serializers.py
│       └── urls.py
├── requirements.txt
└── Dockerfile
```

### Frontend (Next.js)
```
frontend/
├── src/
│   └── app/
│       ├── page.js                     (landing)
│       ├── smm/page.js                 (SMM catalog)
│       ├── otp/page.js                 (OTP service)
│       ├── track/page.js               (order lookup)
│       ├── order/
│       │   ├── smm/[id]/page.js        (SMM tracking)
│       │   └── otp/[id]/page.js        (OTP live display)
│       ├── faq/page.js
│       └── admin/
│           ├── login/page.js
│           ├── dashboard/page.js
│           ├── orders/page.js
│           ├── orders/[id]/page.js
│           ├── services/smm/page.js
│           ├── services/otp/page.js
│           ├── analytics/page.js
│           └── settings/page.js
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Footer.js
│   │   ├── ServiceCard.js
│   │   ├── OrderModal.js
│   │   ├── OtpDisplay.js
│   │   ├── StatusBadge.js
│   │   └── admin/
│   │       ├── Sidebar.js
│   │       ├── StatsCard.js
│   │       └── OrdersTable.js
│   └── lib/
│       ├── api.js              (Axios instance pointing to Django)
│       └── auth.js             (JWT handling for admin)
├── package.json
└── Dockerfile
```

---

*Document version: 1.0 — Generated 2026-06-05*
*Stack: Django 5 + DRF (backend) · Next.js 15 (frontend) · PostgreSQL · Redis · Celery · Docker*
