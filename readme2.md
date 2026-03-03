# Webenablix – Migration Guide: Python/MongoDB → Node.js/PostgreSQL

A complete breakdown of everything required to convert this project from its current stack to a full Node.js + React + PostgreSQL stack.

---

## Current Stack vs. Target Stack

| Layer | Current | Target |
|-------|---------|--------|
| **Backend runtime** | Python 3.10+ | Node.js 18+ |
| **Backend framework** | FastAPI | Express.js (or Fastify) |
| **Database** | MongoDB (via Motor async driver) | PostgreSQL 15+ |
| **ORM / Query builder** | Motor (raw MongoDB queries) | Prisma ORM |
| **Authentication** | python-jose + passlib/bcrypt | jsonwebtoken + bcrypt (npm) |
| **Password hashing** | passlib (bcrypt) | bcryptjs |
| **Browser automation** | Playwright (Python) | Playwright (Node.js) |
| **HTML parsing** | BeautifulSoup4 | Cheerio |
| **AI / LLM** | `emergentintegrations` (Python SDK) | `axios` HTTP calls to same LLM API |
| **HTTP client** | httpx (async) | axios / node-fetch |
| **Validation** | Pydantic v2 | Zod |
| **Frontend** | React 19 + CRA + Craco | **No change needed** |
| **Styling** | Tailwind + Radix UI | **No change needed** |

---

## What Stays the Same (No Changes Required)

- The entire `frontend/` folder — React, components, pages, hooks, and styles are **not affected**.
- The `.env` variable for the frontend (`REACT_APP_BACKEND_URL`) stays the same.
- The REST API contract (route paths, request/response shapes) can stay identical, so the frontend does not need to be touched.

---

## Tools & Accounts You Will Need

| Tool | Purpose | Link |
|------|---------|------|
| **Node.js 18+** | Backend runtime | https://nodejs.org/ |
| **PostgreSQL 15+** | Relational database | https://www.postgresql.org/download/ |
| **pgAdmin 4** (optional) | PostgreSQL GUI | https://www.pgadmin.org/ |
| **Prisma CLI** | Database schema + migrations | installed via npm |
| **Yarn or npm** | Package manager | comes with Node.js |

---

## Step 1 — Set Up PostgreSQL

### Option A – Local Install

1. Download and install from https://www.postgresql.org/download/.
2. During installation set a password for the `postgres` superuser.
3. Create a database for the project:

```sql
-- run in psql or pgAdmin
CREATE DATABASE webenablix;
CREATE USER webenablix_user WITH ENCRYPTED PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE webenablix TO webenablix_user;
```

### Option B – Cloud (Free)

- **Neon** (serverless Postgres, free tier): https://neon.tech
- **Supabase** (free tier): https://supabase.com
- **Railway** (free trial): https://railway.app

Both give you a `DATABASE_URL` connection string in the format:

```
postgresql://user:password@host:5432/webenablix
```

---

## Step 2 — Create the New Node.js Backend

### 2.1 Initialise the project

```bash
mkdir backend-node
cd backend-node
npm init -y
```

### 2.2 Install all required packages

```bash
# Core framework
npm install express cors dotenv

# Database (Prisma ORM)
npm install @prisma/client
npm install --save-dev prisma

# Authentication
npm install jsonwebtoken bcryptjs

# Validation (replaces Pydantic)
npm install zod

# HTTP client (replaces httpx)
npm install axios

# Browser automation – same library, different language binding
npm install playwright
npx playwright install chromium

# HTML parsing (replaces BeautifulSoup4)
npm install cheerio

# Misc
npm install uuid

# Dev tools
npm install --save-dev nodemon
```

### 2.3 Full `package.json` scripts section

```json
"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js",
  "prisma:migrate": "prisma migrate dev",
  "prisma:generate": "prisma generate",
  "prisma:studio": "prisma studio"
}
```

---

## Step 3 — Define the PostgreSQL Schema with Prisma

### 3.1 Initialise Prisma

```bash
npx prisma init
```

This creates `prisma/schema.prisma` and a `.env` file. Add your connection string:

```env
DATABASE_URL="postgresql://webenablix_user:yourpassword@localhost:5432/webenablix"
```

### 3.2 Schema — MongoDB collections → PostgreSQL tables

The current MongoDB collections and their equivalent Prisma models:

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ── users (currently in MongoDB) ──────────────────────────
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  company   String?
  password  String
  plan      String   @default("free")
  createdAt DateTime @default(now()) @map("created_at")

  audits    Audit[]
  leads     Lead[]

  @@map("users")
}

// ── audits (scan results) ─────────────────────────────────
model Audit {
  id                  String   @id @default(uuid())
  userId              String?  @map("user_id")
  url                 String
  pageTitle           String?  @map("page_title")
  accessibilityScore  Int?     @map("accessibility_score")
  seoScore            Int?     @map("seo_score")
  performanceScore    Int?     @map("performance_score")
  mobileScore         Int?     @map("mobile_score")
  securityScore       Int?     @map("security_score")
  // Store complex nested arrays as JSON columns
  accessibilityIssues Json?    @map("accessibility_issues")
  seoIssues           Json?    @map("seo_issues")
  imagesWithoutAlt    Json?    @map("images_without_alt")
  performanceMetrics  Json?    @map("performance_metrics")
  mobileIssues        Json?    @map("mobile_issues")
  securityIssues      Json?    @map("security_issues")
  structuredData      Json?    @map("structured_data")
  recommendations     Json?
  createdAt           DateTime @default(now()) @map("created_at")

  user User? @relation(fields: [userId], references: [id])

  @@map("audits")
}

// ── leads (free checker form submissions) ────────────────
model Lead {
  id        String   @id @default(uuid())
  email     String
  name      String?
  company   String?
  website   String?
  userId    String?  @map("user_id")
  createdAt DateTime @default(now()) @map("created_at")

  user User? @relation(fields: [userId], references: [id])

  @@map("leads")
}

// ── contacts (contact form) ───────────────────────────────
model Contact {
  id        String   @id @default(uuid())
  name      String
  email     String
  message   String
  createdAt DateTime @default(now()) @map("created_at")

  @@map("contacts")
}

// ── status_checks (health ping log) ──────────────────────
model StatusCheck {
  id         String   @id @default(uuid())
  clientName String   @map("client_name")
  createdAt  DateTime @default(now()) @map("created_at")

  @@map("status_checks")
}
```

### 3.3 Run the first migration

```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

## Step 4 — Rewrite the Backend Files

### What needs to be rewritten (file-by-file)

| Current file | Action | Node.js equivalent |
|---|---|---|
| `backend/server.py` | Full rewrite | `backend-node/src/server.js` |
| `backend/services/auth_service.py` | Full rewrite | `backend-node/src/services/authService.js` |
| `backend/services/ai_service.py` | Full rewrite | `backend-node/src/services/aiService.js` |
| `backend/services/scanner.py` | Full rewrite | `backend-node/src/services/scanner.js` |
| `backend/services/__init__.py` | Delete (Python-only) | Not needed |
| `backend/requirements.txt` | Delete | `package.json` replaces it |

---

### 4.1 `server.js` — Express replaces FastAPI

**FastAPI pattern (current)**
```python
app = FastAPI()

@app.get("/api/status")
async def status():
    return {"status": "ok"}
```

**Express equivalent (new)**
```javascript
import express from 'express';
const app = express();

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(8001);
```

---

### 4.2 `authService.js` — JWT + bcrypt

**Python (current)**
```python
from jose import jwt
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"])
token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
hashed = pwd_context.hash(password)
```

**Node.js equivalent (new)**
```javascript
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
const hashed = await bcrypt.hash(password, 12);
const valid  = await bcrypt.compare(plain, hashed);
```

---

### 4.3 `scanner.js` — Playwright is the same library

The scanner uses Playwright for headless browser automation and axe-core injection. Playwright has an **official Node.js package** (`playwright`) with an almost identical API:

**Python (current)**
```python
from playwright.async_api import async_playwright

async with async_playwright() as p:
    browser = await p.chromium.launch()
    page    = await browser.new_page()
    await page.goto(url)
    result  = await page.evaluate(AXE_CORE_SCRIPT)
```

**Node.js equivalent (new)**
```javascript
import { chromium } from 'playwright';

const browser = await chromium.launch();
const page    = await browser.newPage();
await page.goto(url);
const result  = await page.evaluate(AXE_CORE_SCRIPT);
```

HTML parsing changes from BeautifulSoup to Cheerio:

**Python (current)**
```python
from bs4 import BeautifulSoup
soup = BeautifulSoup(html, 'html.parser')
imgs = soup.find_all('img')
```

**Node.js equivalent (new)**
```javascript
import * as cheerio from 'cheerio';
const $ = cheerio.load(html);
const imgs = $('img').toArray();
```

---

### 4.4 `aiService.js` — Same HTTP API, different SDK

The AI service currently uses the `emergentintegrations` Python SDK which calls an LLM over HTTP. In Node.js, replace it with direct `axios` calls to the same endpoint:

**Python (current)**
```python
from emergentintegrations.llm.chat import LlmChat, UserMessage
chat = LlmChat(api_key=EMERGENT_LLM_KEY, ...)
response = await chat.send(UserMessage(text=prompt))
```

**Node.js equivalent (new)**
```javascript
import axios from 'axios';

const response = await axios.post('https://api.emergentintegrations.com/v1/chat', {
  messages: [{ role: 'user', content: prompt }]
}, {
  headers: { Authorization: `Bearer ${process.env.EMERGENT_LLM_KEY}` }
});
```

---

### 4.5 Validation — Pydantic → Zod

**Python (current)**
```python
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    company: Optional[str] = None
```

**Node.js equivalent (new)**
```javascript
import { z } from 'zod';

const UserCreateSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(8),
  name:     z.string().min(1),
  company:  z.string().optional(),
});
```

---

### 4.6 Database queries — Motor (MongoDB) → Prisma (PostgreSQL)

**Python + MongoDB (current)**
```python
user = await db.users.find_one({"email": email})
await db.users.insert_one(user_dict)
```

**Node.js + Prisma (new)**
```javascript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const user = await prisma.user.findUnique({ where: { email } });
const newUser = await prisma.user.create({ data: { email, name, password } });
```

---

## Step 5 — New Environment Variables

Create `backend-node/.env`:

```env
# PostgreSQL
DATABASE_URL=postgresql://webenablix_user:yourpassword@localhost:5432/webenablix

# JWT
JWT_SECRET=your-secret-key-change-me

# AI features
EMERGENT_LLM_KEY=

# Server
PORT=8001
```

---

## Step 6 — Frontend Changes (Minimal)

The React frontend requires **no structural changes**. The only thing to verify:

1. `frontend/.env` still points to the Node.js server:
   ```env
   REACT_APP_BACKEND_URL=http://localhost:8001
   ```
2. All API response shapes must match what the current FastAPI routes return — keep the same JSON keys and the frontend will work without any code edits.

---

## Summary: What You Are Actually Writing From Scratch

| File | Lines of Python to migrate | Effort |
|------|---------------------------|--------|
| `server.py` | ~1,239 lines | High |
| `services/auth_service.py` | ~163 lines | Low (1:1 mapping) |
| `services/ai_service.py` | ~208 lines | Low (axios calls) |
| `services/scanner.py` | ~672 lines | Medium (Playwright API is nearly identical) |

**Frontend: 0 lines need to change.**

---

## Migration Checklist

- [ ] Install PostgreSQL locally or create a cloud database
- [ ] Create `backend-node/` folder and run `npm init`
- [ ] Install all Node.js packages (Step 2.2)
- [ ] Initialise Prisma and write `schema.prisma` (Step 3)
- [ ] Run `prisma migrate dev` to create tables
- [ ] Rewrite `server.js` with Express routes
- [ ] Rewrite `authService.js` (jsonwebtoken + bcryptjs)
- [ ] Rewrite `scanner.js` (Playwright + Cheerio)
- [ ] Rewrite `aiService.js` (axios HTTP calls)
- [ ] Create `backend-node/.env` with `DATABASE_URL` and `JWT_SECRET`
- [ ] Start Node.js server: `npm run dev`
- [ ] Confirm `frontend/.env` still points to port 8001
- [ ] Start frontend: `yarn start` (unchanged)
- [ ] Test all routes against the Swagger-equivalent (or Postman)
- [ ] Migrate any existing MongoDB data to PostgreSQL (if needed)

---

## Recommended Folder Structure for New Backend

```
backend-node/
├── .env
├── package.json
├── prisma/
│   └── schema.prisma
└── src/
    ├── server.js          ← Express app + route registration
    ├── routes/
    │   ├── auth.js        ← /api/auth/register, /api/auth/login
    │   ├── audits.js      ← /api/audits, /api/scan
    │   ├── leads.js       ← /api/leads
    │   └── contacts.js    ← /api/contact
    ├── services/
    │   ├── authService.js
    │   ├── scanner.js
    │   └── aiService.js
    ├── middleware/
    │   └── auth.js        ← JWT verification middleware
    └── lib/
        └── prisma.js      ← Prisma client singleton
```
