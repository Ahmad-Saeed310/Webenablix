# Webenablix – Developer Learning Roadmap

This guide tells you exactly what to learn to read, understand, and modify **this specific project**. Every topic maps directly to code that already exists in the repo.

---

## How to Use This Guide

- Work through each section in order — each one builds on the last.
- After each concept, find the matching file in this repo and read it.
- You do not need to master everything at once. Use the **"Where it appears"** links to practice on real code.

---

## Part 1 — Python Concepts (Backend)

### 1.1 Python Basics You Must Know First

| Concept | Why it matters here |
|---------|-------------------|
| Variables, data types (str, int, bool, list, dict) | Every model field in `server.py` uses these |
| Functions (`def`, `return`, arguments) | Every route handler is a function |
| f-strings | Used in logging and URL building throughout `server.py` |
| `import` / module system | Every service file imports from others (`from services.auth_service import ...`) |
| `try / except / finally` | All API calls in `scanner.py` and `auth_service.py` are wrapped with this |
| `if / elif / else` | Score calculations and conditional logic everywhere |
| Lists and list comprehensions | `[a.url for a in audits]` patterns in `server.py` |
| Dictionaries | MongoDB documents are Python `dict` objects |
| `with` statement (context managers) | Used in `scanner.py` with Playwright's `async with async_playwright()` |
| Classes and `self` | Every Pydantic model is a class; the `WebsiteScanner` in `scanner.py` is a class |

**Where to look:** [backend/server.py](backend/server.py), [backend/services/scanner.py](backend/services/scanner.py)

---

### 1.2 `async` / `await` — Critical for This Project

Almost **every function in the backend is async**. If you don't understand this, you cannot read any of the code.

```python
# This is what you will see everywhere:
async def scan_website(self, url: str) -> Dict[str, Any]:
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page    = await browser.new_page()
        await page.goto(url)
```

**What to learn:**
- What `async def` means vs a regular `def`
- What `await` does — it pauses until a slow operation (network, DB, browser) finishes
- Why it matters: the server handles many users at once without freezing

**Where to look:** [backend/services/scanner.py](backend/services/scanner.py) — the entire file uses this pattern  
[backend/services/ai_service.py](backend/services/ai_service.py) — `async def generate_alt_text_for_images`

**Learn from:** https://realpython.com/async-io-python/

---

### 1.3 Type Hints

This project uses type hints everywhere. You need to read them to understand what data goes in and out of every function.

```python
# From server.py — reads as:
# "scan_url takes a 'body' of type AuditCreate and returns a FullAuditResponse"
async def scan_url(body: AuditCreate) -> FullAuditResponse:

# From scanner.py
async def scan_website(self, url: str) -> Dict[str, Any]:

# Optional means the value can be None
company: Optional[str] = None
```

**What to learn:** `str`, `int`, `bool`, `List[X]`, `Dict[K, V]`, `Optional[X]`, `Any`

**Where to look:** [backend/server.py lines 46–195](backend/server.py)

---

### 1.4 Pydantic Models (`BaseModel`)

Pydantic is how this project **validates all incoming and outgoing data**. Every form submission, every API response, every database document goes through a Pydantic model.

```python
# From server.py
class UserCreate(BaseModel):
    email: EmailStr          # validates it's a real email address
    password: str
    name: str
    company: Optional[str] = None   # optional field with a default of None

class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    company: Optional[str] = None
    message: str
```

**What to learn:**
- Declaring a model by extending `BaseModel`
- Field types and `Optional`
- `Field(default_factory=...)` — generates values like UUIDs and timestamps automatically
- `ConfigDict(extra="allow")` — allows extra fields from MongoDB to pass through
- `EmailStr` — validates email format automatically

**Where to look:** [backend/server.py lines 46–195](backend/server.py), [backend/services/auth_service.py](backend/services/auth_service.py)

---

### 1.5 FastAPI — The Web Framework

FastAPI is the framework that turns Python functions into HTTP API endpoints.

```python
# From server.py — the key patterns:

# 1. Create the app
app = FastAPI(title="Webenablix API")

# 2. Group routes with a prefix
api_router = APIRouter(prefix="/api")

# 3. Define a route
@api_router.post("/audit")
async def scan_url(body: AuditCreate):
    result = await scanner.scan_website(body.url)
    return result

# 4. Return an error
raise HTTPException(status_code=404, detail="Audit not found")

# 5. Protect a route with auth (dependency injection)
@api_router.get("/dashboard")
async def dashboard(current_user = Depends(get_current_user)):
    ...
```

**What to learn:**
- Route decorators: `@app.get`, `@app.post`, `@app.put`, `@app.delete`
- Path parameters: `/audits/{audit_id}`
- Query parameters: `/audits?limit=5`
- Request body (Pydantic model as parameter)
- `HTTPException` for returning errors
- `Depends()` — dependency injection (used for authentication)
- `APIRouter` — grouping routes with a prefix
- CORS middleware — why it's needed and how it's configured at the bottom of `server.py`

**Where to look:** [backend/server.py](backend/server.py) — the entire file is FastAPI routes  
**Official docs:** https://fastapi.tiangolo.com/tutorial/

---

### 1.6 Motor — Async MongoDB Driver

Motor is how the backend reads and writes to MongoDB. It mirrors standard MongoDB queries but with `await`.

```python
# From server.py — real examples from this codebase:

# Find one document
user = await db.users.find_one({"email": email})

# Find many documents
audits = await db.audits.find({}).sort("created_at", -1).limit(10).to_list(10)

# Insert a document
result = await db.contacts.insert_one(contact_dict)

# Count documents
count = await db.audits.count_documents({})
```

**What to learn:**
- `find_one({filter})` — get one document
- `find({filter})` — get multiple documents
- `.sort()`, `.limit()`, `.to_list()` — chaining on find
- `insert_one(dict)` — insert a document
- `update_one({filter}, {"$set": {updates}})` — update a document
- MongoDB document structure — every document has a `_id` field automatically

**Where to look:** [backend/server.py](backend/server.py) — search for `await db.`

---

### 1.7 JWT Authentication

The auth system uses JWT (JSON Web Tokens) to keep users logged in. You need to understand this to add protected routes or modify login behavior.

```python
# From auth_service.py

# 1. When user logs in — create a token
token = jwt.encode({"user_id": user_id, "exp": expire}, JWT_SECRET, algorithm="HS256")

# 2. When user makes a request — verify the token
decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])

# 3. Hash password when registering
hashed = pwd_context.hash(plain_password)

# 4. Verify password on login
is_valid = pwd_context.verify(plain_password, hashed_password)
```

**What to learn:**
- What a JWT is (header.payload.signature)
- How `bcrypt` hashing works (one-way, cannot be reversed)
- `Depends(get_current_user)` in FastAPI — how it auto-validates the token on protected routes
- The `Authorization: Bearer <token>` HTTP header pattern

**Where to look:** [backend/services/auth_service.py](backend/services/auth_service.py)

---

### 1.8 Environment Variables & `.env` Files

```python
# From server.py
load_dotenv(ROOT_DIR / '.env')      # load the .env file
mongo_url = os.environ['MONGO_URL'] # read a required variable (crashes if missing)
jwt_secret = os.environ.get('JWT_SECRET', 'default') # read with a fallback
```

**What to learn:** `os.environ`, `os.environ.get()`, `python-dotenv`, why secrets never go in code

**Where to look:** [backend/.env](backend/.env), [backend/server.py lines 1–15](backend/server.py)

---

### 1.9 Playwright (Headless Browser Automation)

The scanner uses Playwright to open websites in a real Chrome browser and run accessibility tests.

```python
# From scanner.py — simplified version of what's there
async with async_playwright() as p:
    browser = await p.chromium.launch(headless=True)
    page    = await browser.new_page()
    await page.goto(url, timeout=30000)
    
    # Inject axe-core and run accessibility audit
    results = await page.evaluate(AXE_CORE_SCRIPT)
    
    await browser.close()
```

**What to learn:**
- `chromium.launch(headless=True)` — invisible browser
- `page.goto(url)` — navigate to a URL
- `page.evaluate(script)` — run JavaScript inside the browser page
- `page.content()` — get the HTML of the page

**Where to look:** [backend/services/scanner.py](backend/services/scanner.py)  
**Docs:** https://playwright.dev/python/

---

## Part 2 — React Concepts (Frontend)

### 2.1 React Basics

| Concept | Where it appears in this project |
|---------|----------------------------------|
| JSX syntax (`<Component />`) | Every `.jsx` file |
| Functional components | All components are functions, e.g. `const Header = () => {...}` |
| Props | `<CookieConsent onClose={() => setShowCookieConsent(false)} />` |
| Conditional rendering (`&&`, ternary) | `{showCookieConsent && <CookieConsent />}` in `App.js` |
| List rendering (`array.map()`) | Dashboard renders lists of sites and audits |
| Event handlers (`onClick`, `onChange`, `onSubmit`) | All forms in `AuthPage.jsx`, `DashboardPage.jsx` |

**Where to look:** [frontend/src/App.js](frontend/src/App.js), [frontend/src/components/Header.jsx](frontend/src/components/Header.jsx)

---

### 2.2 `useState` — Managing Component State

`useState` is used all throughout this project to track form inputs, loading states, fetched data, and UI visibility.

```javascript
// From AuthPage.jsx
const [loading, setLoading]   = useState(false);  // tracks if the form is submitting
const [error,   setError]     = useState('');      // shows error messages
const [formData, setFormData] = useState({         // holds form field values
  email: '', password: '', name: '', company: ''
});

// From App.js
const [showCookieConsent, setShowCookieConsent] = useState(true);
const [showReportModal,   setShowReportModal]   = useState(false);
```

**What to learn:**
- `const [value, setValue] = useState(initialValue)`
- Updating state: `setValue(newValue)` or `setValue(prev => prev + 1)`
- State causes a re-render — the component redraws when state changes
- Updating objects in state: `setFormData({ ...formData, email: 'new@email.com' })`

**Where to look:** [frontend/src/pages/AuthPage.jsx](frontend/src/pages/AuthPage.jsx), [frontend/src/pages/DashboardPage.jsx](frontend/src/pages/DashboardPage.jsx)

---

### 2.3 `useEffect` — Running Code on Load / Data Fetching

`useEffect` is how this project loads data from the backend when a page opens.

```javascript
// From DashboardPage.jsx — runs once when the component mounts
useEffect(() => {
  const storedUser = getUser();
  const token = getToken();

  if (!token || !storedUser) {
    navigate('/login');   // redirect if not logged in
    return;
  }

  setUser(storedUser);
  fetchData();            // call the backend API
}, [navigate]);           // [] means "run once on mount"
```

**What to learn:**
- `useEffect(callback, [dependencies])`
- Empty array `[]` = run once when component mounts
- Variables in the array = run again when those variables change
- Cleanup functions (return a function from `useEffect` to clean up)

**Where to look:** [frontend/src/pages/DashboardPage.jsx](frontend/src/pages/DashboardPage.jsx), [frontend/src/pages/AuthPage.jsx](frontend/src/pages/AuthPage.jsx)

---

### 2.4 `fetch` — Calling the Backend API

Every page that reads or writes data uses `fetch` to talk to the FastAPI backend.

```javascript
// From DashboardPage.jsx — real code from this project

// GET request — fetch recent audits
const auditsRes = await fetch(`${API_URL}/api/audits?limit=5`);
if (auditsRes.ok) {
  const audits = await auditsRes.json();
  setRecentAudits(audits);
}

// POST request — submit a new scan
const res = await fetch(`${API_URL}/api/audit`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: newSiteUrl })
});
```

**What to learn:**
- GET vs POST requests
- `response.ok` — true if status is 200–299
- `response.json()` — parse JSON body
- The `async/await` pattern with fetch
- Error handling with `try/catch`
- Sending auth token: `headers: { 'Authorization': 'Bearer ' + token }`

**Where to look:** [frontend/src/pages/DashboardPage.jsx](frontend/src/pages/DashboardPage.jsx), [frontend/src/pages/FreeCheckerPage.jsx](frontend/src/pages/FreeCheckerPage.jsx)

---

### 2.5 React Router

The entire page navigation is handled by React Router. The app is a Single Page Application — the URL changes but the page never actually reloads.

```javascript
// From App.js — route definitions
<BrowserRouter>
  <Routes>
    <Route path="/"          element={<HomePage />} />
    <Route path="/login"     element={<AuthPage />} />
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/pricing"   element={<PricingPage />} />
  </Routes>
</BrowserRouter>

// From DashboardPage.jsx — programmatic navigation
const navigate = useNavigate();
navigate('/login');   // redirect the user
```

**What to learn:**
- `<BrowserRouter>`, `<Routes>`, `<Route path="..." element={...} />`
- `<Link to="/pricing">` — navigation without page reload
- `useNavigate()` — redirect programmatically in code
- `useParams()` — read URL parameters like `/audits/:id`

**Where to look:** [frontend/src/App.js](frontend/src/App.js)

---

### 2.6 `localStorage` — Keeping Users Logged In

After login, the JWT token is saved to `localStorage` so the user stays logged in after a page refresh.

```javascript
// From AuthPage.jsx — after successful login
localStorage.setItem('webenablix_token', data.access_token);
localStorage.setItem('webenablix_user',  JSON.stringify(data.user));

// From DashboardPage.jsx — reading it back
const getToken = () => localStorage.getItem('webenablix_token');
const getUser  = () => JSON.parse(localStorage.getItem('webenablix_user'));

// Logging out
localStorage.removeItem('webenablix_token');
localStorage.removeItem('webenablix_user');
```

**Where to look:** [frontend/src/pages/AuthPage.jsx](frontend/src/pages/AuthPage.jsx), [frontend/src/pages/DashboardPage.jsx](frontend/src/pages/DashboardPage.jsx)

---

### 2.7 Tailwind CSS — Styling

Every component uses Tailwind utility classes instead of writing separate CSS files.

```jsx
// Real code from this project
<div className="min-h-screen bg-white">
<h1 className="text-4xl font-bold text-gray-900 mb-4">
<button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
```

**What to learn:**
- Spacing: `p-4`, `px-6`, `py-3`, `m-4`, `mb-4`, `gap-4`
- Colors: `bg-blue-600`, `text-gray-900`, `border-gray-200`
- Layout: `flex`, `grid`, `grid-cols-3`, `items-center`, `justify-between`
- Responsive: `md:grid-cols-2`, `lg:text-xl`
- States: `hover:bg-blue-700`, `focus:ring-2`

**Where to look:** Every `.jsx` file — pick any one and read the `className` attributes  
**Docs:** https://tailwindcss.com/docs

---

### 2.8 shadcn/ui Components

This project uses pre-built UI components from shadcn/ui. You don't need to build buttons and cards yourself — they're already in `frontend/src/components/ui/`.

```javascript
// Real imports from DashboardPage.jsx
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';

// Usage in JSX
<Card>
  <CardHeader>
    <CardTitle>Recent Scans</CardTitle>
  </CardHeader>
  <CardContent>
    <Input placeholder="Enter website URL" value={url} onChange={...} />
    <Button onClick={handleScan}>Scan Now</Button>
  </CardContent>
</Card>
```

**What to learn:** Browse `frontend/src/components/ui/` to see what components are available. Each file is a reusable component you can drop into any page.

**Where to look:** [frontend/src/components/ui/](frontend/src/components/ui/)  
**Docs:** https://ui.shadcn.com/docs/components

---

## Part 3 — MongoDB Concepts

### 3.1 Core MongoDB Ideas

MongoDB stores data as **documents** (JSON-like objects) grouped into **collections** (like tables in SQL).

| SQL term | MongoDB term | In this project |
|----------|-------------|-----------------|
| Table | Collection | `users`, `audits`, `leads`, `contacts` |
| Row | Document | One user record, one audit result |
| Column | Field | `email`, `url`, `created_at` |
| Primary key | `_id` | Auto-generated by MongoDB |

---

### 3.2 Queries Used in This Project

```python
# INSERT — save a new user
await db.users.insert_one({
    "id": str(uuid.uuid4()),
    "email": email,
    "name": name,
    "password": hashed_password,
    "created_at": datetime.now(timezone.utc)
})

# FIND ONE — look up a user by email
user = await db.users.find_one({"email": email})

# FIND MANY — get 10 latest audits
audits = await db.audits.find({}).sort("created_at", -1).limit(10).to_list(10)

# FIND with filter — audits for a specific URL
audits = await db.audits.find({"url": url}).to_list(100)

# COUNT
total = await db.audits.count_documents({})

# UPDATE
await db.users.update_one({"id": user_id}, {"$set": {"plan": "pro"}})
```

**Where to look:** [backend/server.py](backend/server.py) — search for `await db.`

---

### 3.3 MongoDB Compass (GUI)

Since you have MongoDB installed, use **MongoDB Compass** (installed alongside MongoDB) to:
- Browse `webenablix` database visually
- See documents after running a scan
- Run queries manually to test
- Delete test data during development

Connect to: `mongodb://localhost:27017`

---

## Part 4 — General Developer Tools

### 4.1 REST APIs & HTTP

This entire project communicates through a REST API. The frontend calls the backend over HTTP.

**What to learn:**
- HTTP methods: `GET` (read), `POST` (create), `PUT`/`PATCH` (update), `DELETE` (remove)
- Status codes: `200` OK, `201` Created, `400` Bad Request, `401` Unauthorized, `404` Not Found, `500` Server Error
- Request structure: URL + method + headers + body
- Response structure: status code + body (usually JSON)
- What CORS is and why the backend has `CORSMiddleware` — browser security that blocks API calls from different origins

**Test the API yourself:** Open http://localhost:8001/docs — every endpoint in this project is listed there with a "Try it out" button.

---

### 4.2 JSON

All data between the frontend and backend is JSON. Make sure you can read and write it confidently.

```json
{
  "url": "https://example.com",
  "accessibility_score": 78,
  "issues": [
    { "type": "error", "code": "WCAG_1_1_1", "message": "Image missing alt text" }
  ],
  "created_at": "2026-03-03T12:00:00Z"
}
```

---

### 4.3 `.env` Files & Secrets

Never put passwords, API keys, or secrets in code. This project uses `.env` files for this:

```
MONGO_URL=mongodb://localhost:27017
JWT_SECRET=my-secret-key
EMERGENT_LLM_KEY=sk-...
```

The `.env` files are listed in `.gitignore` so they never get committed to Git.

---

### 4.4 Git Basics

**What to learn:**
- `git status` — see what files changed
- `git add .` — stage all changes
- `git commit -m "message"` — save a snapshot
- `git push` — upload to GitHub
- `git pull` — download latest changes
- `git checkout -b feature-name` — create a new branch before working on something new

---

## Part 5 — Suggested Learning Order

Follow this sequence to go from zero to comfortably editing this project:

```
Week 1 — Python foundations
  ├── Variables, functions, classes, lists, dicts
  ├── try/except
  └── async/await basics

Week 2 — Backend
  ├── Type hints + Pydantic models
  ├── FastAPI routes (GET, POST)
  ├── Reading/writing to MongoDB with Motor
  └── Read through backend/server.py top to bottom

Week 3 — Frontend
  ├── JavaScript/ES6 (arrow functions, destructuring, spread, async/await)
  ├── React: useState, useEffect, JSX, props
  ├── fetch() API calls
  └── React Router

Week 4 — Styling & UI
  ├── Tailwind CSS utility classes
  ├── shadcn/ui components (browse the ui/ folder)
  └── Read through AuthPage.jsx and DashboardPage.jsx

Week 5 — Full picture
  ├── Trace one complete feature end-to-end:
  │     browser form  →  fetch()  →  FastAPI route
  │     →  Pydantic validation  →  MongoDB insert
  │     →  JSON response  →  React state update  →  UI render
  └── Make your first small change (add a field, change a label, add a route)
```

---

## Quick Reference — Where Is What

| Feature | Frontend file | Backend file |
|---------|--------------|--------------|
| Login / Register | [src/pages/AuthPage.jsx](frontend/src/pages/AuthPage.jsx) | [services/auth_service.py](backend/services/auth_service.py) |
| Dashboard | [src/pages/DashboardPage.jsx](frontend/src/pages/DashboardPage.jsx) | `GET /api/audits`, `GET /api/stats` in [server.py](backend/server.py) |
| Free accessibility checker | [src/pages/FreeCheckerPage.jsx](frontend/src/pages/FreeCheckerPage.jsx) | `POST /api/audit` in [server.py](backend/server.py) |
| Actual scanning logic | — | [services/scanner.py](backend/services/scanner.py) |
| AI alt-text / recommendations | — | [services/ai_service.py](backend/services/ai_service.py) |
| Navigation / routing | [src/App.js](frontend/src/App.js) | — |
| Reusable UI components | [src/components/ui/](frontend/src/components/ui/) | — |
| Shared section components | [src/components/](frontend/src/components/) | — |
| Mock / static data | [src/data/mock.js](frontend/src/data/mock.js) | — |
| Database models (shapes) | — | [server.py lines 46–195](backend/server.py) |
