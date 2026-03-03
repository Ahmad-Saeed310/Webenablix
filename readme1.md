# Webenablix – Local Setup Guide

A step-by-step guide to running the Webenablix project on your local machine.

---

## What You Need (Prerequisites)

Make sure the following are installed before you start:

| Tool | Version | Download |
|------|---------|----------|
| **Python** | 3.10 or higher | https://www.python.org/downloads/ |
| **Node.js** | 18 or higher | https://nodejs.org/ |
| **Yarn** | 1.22.x | `npm install -g yarn` |
| **MongoDB** | 6.0 or higher (local) **or** a free MongoDB Atlas cluster | https://www.mongodb.com/try/download/community |
| **Git** | any recent version | https://git-scm.com/ |

---

## Project Structure

```
Webenablix/
├── backend/      ← FastAPI Python server
└── frontend/     ← React (CRA + Craco) app
```

---

## 1 — Backend Setup

### 1.1 Open a terminal and navigate to the backend folder

```bash
cd Webenablix/backend
```

### 1.2 Create a Python virtual environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

### 1.3 Install Python dependencies

```bash
pip install -r requirements.txt
```

### 1.4 Create the backend `.env` file

Create a file named `.env` inside the `backend/` folder and fill in your values:

```env
# ── Required ──────────────────────────────────────────────
# MongoDB connection string
# Local example:   mongodb://localhost:27017
# Atlas example:   mongodb+srv://<user>:<password>@cluster0.xxxx.mongodb.net
MONGO_URL=mongodb://localhost:27017

# Name of the MongoDB database to use
DB_NAME=webenablix

# ── Optional (but recommended for production) ─────────────
# Secret key used to sign JWT tokens (change this to something random)
JWT_SECRET=your-secret-key-change-me

# API key for the AI/LLM features (accessibility recommendations & alt-text generation)
# Leave empty to disable AI features
EMERGENT_LLM_KEY=
```

### 1.5 Start the backend server

```bash
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

The API will be available at: **http://localhost:8001**  
Interactive docs (Swagger UI): **http://localhost:8001/docs**

---

## 2 — Frontend Setup

### 2.1 Open a **new** terminal and navigate to the frontend folder

```bash
cd Webenablix/frontend
```

### 2.2 Install Node dependencies

```bash
yarn install
```

### 2.3 Create the frontend `.env` file

Create a file named `.env` inside the `frontend/` folder:

```env
# URL pointing to the running backend server
REACT_APP_BACKEND_URL=http://localhost:8001
```

### 2.4 Start the React development server

```bash
yarn start
```

The app will open automatically at: **http://localhost:3000**

---

## 3 — Running Both Servers at the Same Time

You need **two terminal windows** open simultaneously:

| Terminal | Command |
|----------|---------|
| Terminal 1 (backend) | `uvicorn server:app --reload --host 0.0.0.0 --port 8001` (inside `backend/`) |
| Terminal 2 (frontend) | `yarn start` (inside `frontend/`) |

---

## 4 — Environment Variables Summary

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URL` | **Yes** | MongoDB connection string |
| `DB_NAME` | **Yes** | Database name |
| `JWT_SECRET` | No | Secret for signing auth tokens (has a default fallback) |
| `EMERGENT_LLM_KEY` | No | API key for AI features (alt-text, recommendations) |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `REACT_APP_BACKEND_URL` | **Yes** | Full URL of the backend API |

---

## 5 — MongoDB: Local vs. Cloud

### Option A – Local MongoDB

1. [Download and install MongoDB Community](https://www.mongodb.com/try/download/community).
2. Start the MongoDB service:
   - **Windows**: `net start MongoDB` or via the MongoDB Compass app
   - **macOS/Linux**: `brew services start mongodb-community` or `sudo systemctl start mongod`
3. Set `MONGO_URL=mongodb://localhost:27017` in `backend/.env`.

### Option B – MongoDB Atlas (free cloud)

1. Create a free account at https://cloud.mongodb.com.
2. Create a free M0 cluster.
3. Click **Connect → Connect your application** and copy the connection string.
4. Replace `<password>` with your database user password.
5. Paste it as `MONGO_URL` in `backend/.env`.

---

## 6 — Verify Everything Is Working

1. Open your browser and go to **http://localhost:3000** — you should see the Webenablix landing page.
2. Open **http://localhost:8001/docs** — you should see the FastAPI Swagger documentation.
3. Try the **Free Checker** page to run an accessibility scan; a successful result confirms the backend and frontend are communicating correctly.

---

## 7 — Running Tests

### Backend tests

```bash
cd Webenablix/backend
# Make sure the virtual environment is active and the server is running, then:
pytest tests/
```

### Frontend tests

```bash
cd Webenablix/frontend
yarn test
```

---

## Common Issues

| Problem | Fix |
|---------|-----|
| `ModuleNotFoundError` on backend start | Run `pip install -r requirements.txt` with your venv activated |
| `MONGO_URL` environment variable missing | Create `backend/.env` with a valid `MONGO_URL` |
| Frontend shows network errors | Check that `REACT_APP_BACKEND_URL` in `frontend/.env` matches the port the backend is running on |
| Port 8001 or 3000 already in use | Change the port in the uvicorn command or `package.json` start script, and update `REACT_APP_BACKEND_URL` accordingly |
| `yarn: command not found` | Run `npm install -g yarn` first |
