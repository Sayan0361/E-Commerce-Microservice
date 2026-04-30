# Startup Guide

## Prerequisites

* Docker Engine running
* Node.js installed
* A database client (e.g., TablePlus, pgAdmin)

---

## Setup

### 1. Install dependencies

```bash
npm install
```

---

### 2. Configure environment

Copy `.env.example` to `.env` and update required values:

```bash
cp .env.example .env
```

Ensure at least:

* `DB_HOST`
* `DB_PORT`
* `DB_USER`
* `DB_PASSWORD`
* `DB_NAME`
* `JWT_SECRET`

---

### 3. Start PostgreSQL container

```bash
npm run start:db
```

To stop and reset the database (recommended if facing migration issues):

```bash
npm run stop:db
docker compose down -v
npm run start:db
```

---

### 4. Connect to database

Use credentials from `.env` in your database client (TablePlus, pgAdmin, etc.)

---

### 5. Run migrations

⚠️ Important:

* Ensure migration files exist inside the `migrations/` folder before running this.

Run:

```bash
npm run migrate:up
```

Rollback last migration:

```bash
npm run migrate:down
```

---

### 6. Start development server

```bash
npm run dev
```

---

## Testing

* Use Postman or any API client
* Refer to `serverless.yml` for available endpoints and routes
* Check handler implementations in:

```
app/handlers/
```

for request/response structure

---

## Deployment

This service uses the Serverless Framework:

```bash
npm run deploy
```
