# Webenablix — Web Accessibility Platform

> A full-featured SaaS web accessibility platform comparable to accessiBe, UserWay, and EqualWeb. Webenablix helps website owners achieve WCAG 2.1 compliance, reduce ADA lawsuit risk, and improve user experience for people with disabilities.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features & Functionalities](#features--functionalities)
- [Backend API Endpoints](#backend-api-endpoints)
- [Database](#database)
- [Authentication](#authentication)
- [Frontend Pages](#frontend-pages)
- [Accessibility Widget](#accessibility-widget)
- [Libraries & Dependencies](#libraries--dependencies)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Testing](#testing)
- [Roadmap](#roadmap)

---

## Overview

Webenablix is a multi-tenant SaaS platform that provides:

- An embeddable **accessibility widget** with 30+ tools and 8 disability profiles
- An **AI-powered site scanner** that audits any URL for WCAG compliance, SEO, performance, and security
- A **dashboard** for managing sites, viewing audit reports, and configuring widgets
- A **lead generation** and contact system for the marketing site

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19 (Create React App via CRACO) |
| **Routing** | React Router DOM v7 |
| **Styling** | Tailwind CSS v3, tailwindcss-animate |
| **UI Component Library** | shadcn/ui (Radix UI primitives) |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **Forms** | React Hook Form + Zod validation |
| **HTTP Client** | Axios |
| **Backend Framework** | FastAPI (Python) |
| **ASGI Server** | Uvicorn |
| **Database** | MongoDB (via Motor — async driver) |
| **ODM / Validation** | Pydantic v2 |
| **Authentication** | JWT (python-jose + passlib/bcrypt) |
| **AI Integration** | OpenAI GPT, Google Gemini (google-genai), LiteLLM |
| **Web Scraping / Scanning** | Playwright (headless Chromium), BeautifulSoup4, httpx |
| **Accessibility Engine** | axe-core 4.8 (injected via Playwright), axe-selenium-python |
| **Cloud Storage** | AWS S3 (boto3) |
| **Payments** | Stripe |
| **Testing (Backend)** | Pytest, Selenium |
| **Testing (Frontend)** | React Scripts (Jest) |
| **Linting / Formatting** | Flake8, Black, isort, ESLint |

---

## Project Structure

```
Webenablix/
├── backend/
│   ├── server.py               # FastAPI app — all routes, models, middleware
│   ├── requirements.txt        # Python dependencies
│   └── services/
│       ├── __init__.py
│       ├── ai_service.py       # OpenAI / Gemini alt-text & recommendation generation
│       ├── auth_service.py     # JWT creation, bcrypt hashing, user CRUD
│       └── scanner.py          # Playwright-based website scanner + axe-core runner
├── frontend/
│   ├── package.json
│   ├── craco.config.js         # CRACO config (Webpack overrides)
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── plugins/
│   │   ├── health-check/       # Custom Webpack health-check plugin
│   │   └── visual-edits/       # Babel metadata + dev-server setup
│   └── src/
│       ├── App.js              # Router, layout, global widget mount
│       ├── components/
│       │   ├── AccessibilityWidget.jsx   # Floating widget (8 profiles, 5 tabs)
│       │   ├── Header.jsx
│       │   ├── Footer.jsx
│       │   ├── HeroSection.jsx
│       │   ├── FeaturesSection.jsx
│       │   ├── AuditSection.jsx
│       │   ├── WhyAccessibilitySection.jsx
│       │   ├── WidgetSection.jsx
│       │   ├── TrustedBySection.jsx
│       │   ├── Modals.jsx                # Cookie Consent, Accessibility Report
│       │   └── ui/                       # shadcn/ui component library
│       ├── pages/
│       │   ├── AuthPage.jsx
│       │   ├── DashboardPage.jsx
│       │   ├── PricingPage.jsx
│       │   ├── ProductsPage.jsx
│       │   ├── WidgetPage.jsx
│       │   ├── AuditPage.jsx
│       │   ├── FreeCheckerPage.jsx
│       │   ├── IndustriesPage.jsx
│       │   └── InstallationsPage.jsx
│       ├── data/
│       │   ├── mock.js           # Static/mock data for UI
│       │   └── navigation.js     # Header navigation config
│       ├── hooks/
│       │   └── use-toast.js
│       └── lib/
│           └── utils.js          # cn() utility (clsx + tailwind-merge)
├── memory/
│   └── PRD.md                  # Product Requirements Document
├── tests/                      # Root-level integration tests
├── backend_test.py             # Standalone backend test runner
└── README.md
```

---

## Features & Functionalities

### Marketing Site
- **Hero Section** — headline, CTA, live accessibility score counter
- **Features Section** — 30+ widget tools overview
- **Audit Section** — inline free checker form
- **Why Accessibility** — ADA/WCAG compliance education
- **Widget Section** — interactive demo of the embeddable widget
- **Trusted By Section** — social proof
- **Cookie Consent Modal** — GDPR-style banner
- **Accessibility Report Modal** — email capture for free PDF report

### Free Accessibility Checker (`/free-checker`)
- Input any URL to receive an instant audit
- Returns scores for: Accessibility, SEO, Performance, Mobile, Security
- Displays WCAG compliance level (A / AA / AAA)
- Shows lawsuit risk assessment (Low / Medium / High)
- Lists actionable issue recommendations

### Audit Page (`/products/audit`)
- Detailed breakdown of a full website scan
- Core Web Vitals (LCP, FID, CLS) with pass/fail status
- Mobile friendliness check
- Structured data / schema.org validation
- Security headers check (HTTPS, HSTS, CSP)

### Auth System (`/login`, `/register`)
- Email + password registration with bcrypt hashing
- JWT login with 7-day expiry
- Protected route support

### Dashboard (`/dashboard`)
- Overview statistics for managed sites
- Audit history with per-audit drill-down
- Site management (add/remove domains)

### Pricing (`/pricing`)
- Multi-tier plan cards (Free, Pro, Business, Enterprise)
- Feature comparison

### Installations (`/installations`)
- CMS integration guides (WordPress, Shopify, Wix, custom HTML)

### Products (`/products`, `/products/widget`)
- Widget feature descriptions and setup instructions

---

## Backend API Endpoints

All routes are prefixed with `/api`.

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/` | Health check | No |
| `POST` | `/api/audit` | Run full accessibility + SEO + performance scan | No |
| `GET` | `/api/audits` | Paginated audit history | No |
| `GET` | `/api/audit/{id}` | Single audit details | No |
| `POST` | `/api/leads` | Capture email lead | No |
| `POST` | `/api/contact` | Contact form submission | No |
| `GET` | `/api/stats` | Platform statistics | No |
| `POST` | `/api/auth/register` | Create new user account | No |
| `POST` | `/api/auth/login` | Login and receive JWT | No |
| `GET` | `/api/auth/me` | Get current user profile | Yes (Bearer JWT) |

### Audit Request / Response

**Request** (`POST /api/audit`):
```json
{
  "url": "https://example.com",
  "audit_type": "full"
}
```

**Response** includes:
```json
{
  "id": "uuid",
  "url": "https://example.com",
  "accessibility_score": 74,
  "seo_score": 88,
  "performance_score": 65,
  "mobile_score": 91,
  "security_score": 80,
  "overall_score": 79,
  "lawsuit_risk": "medium",
  "wcag_level": "AA",
  "accessibility_issues": [...],
  "seo_issues": [...],
  "core_web_vitals": { "lcp": 2.4, "fid": 85, "cls": 0.12 },
  "mobile_friendliness": { "is_mobile_friendly": true },
  "structured_data": { "has_schema": true },
  "security": { "has_https": true, "has_hsts": false },
  "total_issues": 18,
  "critical_issues": 4,
  "warnings": 9,
  "top_recommendations": [...],
  "page_title": "Example Domain",
  "scan_duration": 4.2
}
```

---

## Database

**Database:** MongoDB  
**Driver:** Motor (async) + PyMongo  
**Connection:** Configured via `MONGO_URL` environment variable

### Active Collections

| Collection | Purpose |
|---|---|
| `audits` | Full audit result documents |
| `leads` | Email lead captures |
| `contacts` | Contact form submissions |
| `status_checks` | API health-check records |
| `users` | Registered user accounts |

### Planned Collections (Roadmap)

| Collection | Purpose |
|---|---|
| `organizations` | Company / team groupings |
| `sites` | Managed website domains per account |
| `widget_configs` | Per-site widget customization settings |
| `scans` | Scheduled automatic scan results |
| `reports` | Generated PDF/CSV compliance reports |

---

## Authentication

- **Method:** JWT (JSON Web Tokens)
- **Algorithm:** `HS256`
- **Expiry:** 7 days
- **Password Hashing:** bcrypt via `passlib`
- **Token Transport:** `Authorization: Bearer <token>` header
- **Secret:** Configured via `JWT_SECRET` environment variable

---

## Frontend Pages

| Route | Page | Description |
|---|---|---|
| `/` | Home | Full marketing landing page |
| `/login` | Auth | Login form |
| `/register` | Auth | Registration form |
| `/dashboard` | Dashboard | User portal with stats and site management |
| `/pricing` | Pricing | Plan comparison and purchase |
| `/products` | Products | Product overview |
| `/products/widget` | Widget | Widget product detail |
| `/products/audit` | Audit | Audit tool product detail |
| `/free-checker` | Free Checker | Public URL accessibility scanner |
| `/industries` | Industries | Vertical-specific use cases |
| `/installations` | Installations | CMS integration guides |

---

## Accessibility Widget

The embeddable widget (`AccessibilityWidget.jsx`) is mounted globally across all pages and provides:

### 8 Disability Profiles

| Profile | Purpose |
|---|---|
| Vision Impaired | Larger text, high contrast, reduced visual noise |
| Color Blind | Color filters and adjustments |
| Dyslexia Friendly | Dyslexia-friendly font, increased spacing |
| ADHD Friendly | Reduced animations, focus aids |
| Cognitive | Simplified layout, reading guides |
| Motor Impaired | Keyboard nav, large click targets |
| Seizure Safe | Pauses animations, removes flashing content |
| Screen Reader | Optimized ARIA attributes and structure |

### 5 Feature Tabs

**Profiles** — Quick preset configuration buttons

**Content**
- Font size control
- Line height adjustment
- Letter spacing
- Word spacing
- Text alignment (left / center / right / justify)
- Dyslexia font toggle

**Visual**
- High contrast / low contrast / dark mode
- Saturation control
- Invert colors
- Highlight links
- Highlight headings
- Hide images
- Reading guide overlay
- Focus mode

**Navigation**
- Keyboard navigation mode
- Focus highlight
- Big cursor
- Pause animations
- Reduce motion

**Audio**
- Text-to-speech with speed rate control
- Voice commands

---

## Libraries & Dependencies

### Backend (Python)

| Library | Purpose |
|---|---|
| `fastapi` | REST API framework |
| `uvicorn` | ASGI server |
| `motor` | Async MongoDB driver |
| `pymongo` | MongoDB driver (sync utilities) |
| `pydantic` v2 | Data validation and serialization |
| `python-jose` | JWT encode / decode |
| `passlib[bcrypt]` | Password hashing |
| `python-dotenv` | `.env` file loading |
| `playwright` | Headless browser for real-page scanning |
| `beautifulsoup4` | HTML parsing |
| `httpx` | Async HTTP client |
| `openai` | OpenAI GPT API integration |
| `google-genai` | Google Gemini API integration |
| `litellm` | Unified LLM API abstraction |
| `stripe` | Payment processing |
| `boto3` | AWS S3 cloud storage |
| `pandas` / `numpy` | Data processing |
| `pillow` | Image handling |
| `selenium` / `axe-selenium-python` | Browser-based axe-core accessibility testing |
| `pytest` | Test runner |
| `black` / `flake8` / `isort` | Code formatting and linting |

### Frontend (JavaScript / React)

| Library | Purpose |
|---|---|
| `react` v19 | UI framework |
| `react-router-dom` v7 | Client-side routing |
| `tailwindcss` | Utility-first CSS framework |
| `@radix-ui/*` | Headless accessible UI primitives (shadcn/ui base) |
| `lucide-react` | SVG icon library |
| `recharts` | Charts and data visualization |
| `react-hook-form` | Form state management |
| `zod` | Schema validation |
| `@hookform/resolvers` | Zod adapter for react-hook-form |
| `axios` | HTTP requests to backend API |
| `class-variance-authority` | Component variant management |
| `clsx` + `tailwind-merge` | Conditional class name merging |
| `date-fns` | Date formatting utilities |
| `embla-carousel-react` | Carousel / slider component |
| `react-day-picker` | Date picker calendar |
| `sonner` | Toast notifications |
| `vaul` | Drawer / bottom sheet component |
| `cmdk` | Command palette |
| `input-otp` | OTP input component |
| `next-themes` | Dark / light theme switching |
| `react-resizable-panels` | Resizable layout panels |
| `@craco/craco` | Create React App Webpack config override |

---

## Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
# MongoDB
MONGO_URL=mongodb://localhost:27017
DB_NAME=webenablix

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# AI Providers (at least one required for AI features)
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=AI...

# AWS S3 (optional — for report storage)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
S3_BUCKET_NAME=webenablix-reports

# Stripe (optional — for billing)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string
- Playwright browsers installed

### Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS / Linux

# Install dependencies
pip install -r requirements.txt

# Install Playwright browsers
playwright install chromium

# Copy and fill in environment variables
copy .env.example .env

# Start the API server
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

- API: `http://localhost:8001`
- Swagger UI: `http://localhost:8001/docs`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm start
```

- App: `http://localhost:3000`

---

## Testing

### Backend

```bash
cd backend
pytest tests/ -v
```

Or from the project root:

```bash
python backend_test.py
```

### Frontend

```bash
cd frontend
npm test
```

### Test Reports

| File | Description |
|---|---|
| `test_result.md` | Latest test summary |
| `test_results_detailed.json` | Full JSON test results |
| `test_reports/iteration_1.json` | Iteration-specific results |
| `test_reports/pytest/pytest_results.xml` | JUnit-format Pytest output |

---

## Roadmap

### P0 — Critical
- [ ] Real Playwright-based accessibility scanning (replace mock data)
- [ ] AI alt-text generation for images (OpenAI Vision / Gemini)
- [ ] Full JWT authentication flow across the dashboard

### P1 — High Priority
- [ ] Admin dashboard — site management, widget config, report history
- [ ] Multi-site support per user account
- [ ] Scheduled automatic scans (cron-based monitoring)
- [ ] PDF / CSV WCAG compliance report export

### P2 — Medium Priority
- [ ] WordPress plugin for one-click widget installation
- [ ] Shopify app listing
- [ ] Team / organization management with roles
- [ ] Stripe subscription billing integration

### P3 — Future
- [ ] AI remediation engine (auto-patch common a11y issues)
- [ ] Chrome / Firefox browser extension
- [ ] White-label / agency mode
- [ ] Public REST API for third-party integrations

---

## License

Private — All rights reserved. © 2026 Webenablix / DigitalLinear.
