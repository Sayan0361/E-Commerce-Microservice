
# Startup Guide

## Prerequisites
- Docker Engine running
- Node.js installed
- A database client (e.g., TablePlus, pgAdmin)

## Setup

### 1. Install dependencies
```bash
npm i
```

### 2. Configure environment
Copy `.env.example` to `.env` and update with your values:
```bash
cp .env.example .env
```

### 3. Start PostgreSQL container
```bash
npm run start:db
```

### 4. Connect to database
Using the credentials from your `.env` file, create a database connection in your client (TablePlus, pgAdmin, etc.)

### 5. Initialize database
Run the SQL migrations from the `sql_migrations` folder

### 6. Start development server
```bash
npm run dev
```

## Testing

- Import endpoints from `serverless.yml` into Postman
- Review handler files for request/response structure and usage
- Refer to handler implementations in `app/handlers/` for endpoint details

## Deployment

This service uses the Serverless Framework for deployment