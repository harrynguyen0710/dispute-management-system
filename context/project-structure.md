# Project Structure

This document describes the reusable folder structure for the frontend and backend projects in this workspace.

## Workspace Root

```text
FraudSystem/
├─ README.md
├─ package.json
├─ pnpm-workspace.yaml
├─ context/
│  └─ project-structure.md
├─ frontend/
└─ backend/
```

## Frontend: React + TypeScript

Recommended layout:

```text
frontend/
├─ package.json
├─ index.html
├─ tsconfig.json
├─ vite.config.ts
├─ public/
└─ src/
   ├─ app/
   │  ├─ App.tsx
   │  ├─ main.tsx
   │  └─ routes/
   ├─ assets/
   ├─ components/
   │  ├─ common/
   │  └─ layout/
   ├─ features/
   │  └─ <feature-name>/
   ├─ hooks/
   ├─ services/
   │  ├─ api/
   │  └─ clients/
   ├─ state/
   ├─ styles/
   ├─ types/
   ├─ utils/
   └─ tests/
```

### Frontend folder purpose

- `app`: application bootstrap, routing, and app-level composition.
- `assets`: static files such as images, icons, and fonts.
- `components`: reusable UI pieces shared across features.
- `features`: feature-specific modules grouped by business capability.
- `hooks`: reusable React hooks.
- `services`: API clients, request wrappers, and data access helpers.
- `state`: shared application state logic if needed later.
- `styles`: global styles, themes, and design tokens.
- `types`: shared frontend TypeScript types.
- `utils`: pure helper functions.
- `tests`: frontend tests and test utilities.

## Backend: Node.js + TypeScript

Recommended layout:

```text
backend/
├─ package.json
├─ tsconfig.json
├─ src/
│  ├─ app.ts
│  ├─ server.ts
│  ├─ config/
│  ├─ controllers/
│  ├─ dtos/
│  ├─ errors/
│  ├─ interfaces/
│  ├─ logging/
│  ├─ middleware/
│  ├─ models/
│  ├─ repositories/
│  ├─ routes/
│  ├─ services/
│  ├─ types/
│  ├─ utils/
│  └─ tests/
```

### Backend folder purpose

- `app.ts`: Express app composition, middleware registration, and route wiring.
- `server.ts`: process bootstrap and server startup.
- `config`: environment and runtime configuration.
- `controllers`: HTTP request handlers.
- `dtos`: request and response data contracts.
- `errors`: custom business and application error types.
- `interfaces`: contracts for repositories, services, and shared abstractions.
- `logging`: logger setup and logging helpers.
- `middleware`: request lifecycle middleware such as error handling, validation, and auth.
- `models`: domain models and persistence entities.
- `repositories`: persistence access layer.
- `routes`: route definitions that connect controllers to HTTP endpoints.
- `services`: business logic and orchestration.
- `types`: backend TypeScript types and shared server-side contracts.
- `utils`: helpers and low-level utilities.
- `tests`: unit and integration tests.

## Backend Error Handling Pattern

Use a consistent flow:

1. Controllers validate input shape and call services.
2. Services throw typed business errors for expected failures.
3. Middleware converts errors into standardized HTTP responses.
4. Logging captures the request context, error type, and stack for unexpected failures.

## Development Notes

- Keep controllers thin.
- Keep business rules in services.
- Keep data access in repositories.
- Prefer explicit interfaces for dependencies that may be mocked in tests.
- Add shared contracts later only if the frontend and backend start needing the same source of truth.
