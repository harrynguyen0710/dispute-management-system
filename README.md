# FraudSystem

A reusable full-stack TypeScript workspace with a React frontend and a Node.js backend.

## Project Structure

```text
FraudSystem/
├── frontend/    # React + TypeScript application
└── backend/     # Node.js + TypeScript API
```

## Prerequisites

* Node.js 20+
* npm 11+

## Getting Started

### 1. Environment Setup (Required Before Running)

Before running the application, copy the template environment configuration file (`env.copy` / `.env.copy`) to create the `.env` file for both backend and frontend.

#### Backend Environment Setup

Copy `backend/env.copy` to `backend/.env`:

```bash
# Linux / macOS
cp backend/env.copy backend/.env

# Windows (PowerShell)
Copy-Item backend/env.copy backend/.env

# Windows (cmd)
copy backend\env.copy backend\.env
```

Default backend variables (`backend/.env`):
- `PORT=4000` — Port on which backend API server runs
- `LOG_LEVEL=info` — Logging output level (`info`, `debug`, `warn`, `error`)
- `DATA_STORE_PATH=data/cases-store.json` — File path for embedded JSON store

#### Frontend Environment Setup

Copy `frontend/env.copy` to `frontend/.env`:

```bash
# Linux / macOS
cp frontend/env.copy frontend/.env

# Windows (PowerShell)
Copy-Item frontend/env.copy frontend/.env

# Windows (cmd)
copy frontend\env.copy frontend\.env
```

Default frontend variables (`frontend/.env`):
- `VITE_API_BASE=http://localhost:4000/api` — Base URL for communicating with backend API

---

### 2. Install Dependencies

From the project root:

```bash
npm install
```

### 3. Set Up Backend Data

The backend uses an embedded JSON file store that is seeded from a CSV file.

Initialize the data store and seed it with sample data:

```bash
npm run data:setup --workspace backend
```

### 4. Start the Project

Run both the frontend and backend:

```bash
npm run dev
```

Or run them individually:

```bash
npm run dev:frontend
npm run dev:backend
```

## Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```

## Test

```bash
npm run test
```