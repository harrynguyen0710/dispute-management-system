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

### 1. Install Dependencies

From the project root:

```bash
npm install
```

### 2. Set Up Backend Data

The backend uses an embedded JSON file store that is seeded from a CSV file.

Initialize the data store and seed it with sample data:

```bash
npm run data:setup --workspace backend
```

### 3. Start the Project

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