# Extractify

AI-powered structured data extraction platform using **SGLang** constrained decoding. Paste unstructured text (invoices, resumes, emails, articles) and get guaranteed valid JSON output matching a predefined or custom schema.

## Description

Extractify is a full-stack web application that leverages large language models with constrained decoding to extract structured data from unstructured text. It provides a dashboard with extraction history, usage analytics, rate limiting by tier (free/pro/enterprise), and user authentication.

## Purpose

Automate the tedious process of manually parsing documents into structured formats. By using SGLang's JSON schema constrained decoding, every extraction is guaranteed to produce valid JSON — no hallucinated keys, no missing fields.

## Architecture

```
┌───────────────────────┐      ┌─────────────────────┐
│  Next.js 14 App       │      │  Python SGLang       │
│  - NextAuth.js        │─────▶│  Service (FastAPI)   │
│  - Dashboard UI       │◀─────│  Port 8100           │
│  - API Routes         │      └─────────────────────┘
│  - Prisma ORM         │               │
│  Port 3000            │               ▼
└───────────┬───────────┘      ┌─────────────────────┐
            │                  │  SGLang Server       │
            ▼                  │  (Qwen2.5-7B)       │
    ┌──────────────┐           │  Port 30000          │
    │   Database   │           └─────────────────────┘
    └──────────────┘
```

## Tech Stack

**Frontend & Backend (Next.js 14 - App Router):**
- React 18, Tailwind CSS
- Framer Motion, GSAP, Lenis (smooth scroll)
- Three.js / React Three Fiber (3D visuals)
- Recharts (analytics charts)

**Auth & Data:**
- NextAuth.js (credentials provider, JWT sessions)
- Prisma ORM (SQLite for dev, Postgres/MySQL for prod)
- bcryptjs (password hashing)

**AI Extraction Service (Python):**
- FastAPI + Uvicorn
- httpx (async HTTP to SGLang server)
- Pydantic (request/response validation)
- SGLang with Qwen2.5-7B-Instruct (constrained JSON decoding)

## Supported Extraction Schemas

| Schema   | Fields extracted                                           |
|----------|------------------------------------------------------------|
| Invoice  | invoice_number, date, vendor, total_amount, line_items     |
| Resume   | name, email, phone, skills, experience, education          |
| Email    | sender, recipient, subject, action_items, sentiment        |
| Article  | title, author, summary, key_points, topics, date           |

## Setting Up the Environment

### Prerequisites

- Node.js 18+
- Python 3.10+
- A GPU machine for SGLang (or use the mock server for development)

### 1. Next.js App

```bash
cd extractify
npm install
```

Create a `.env` file:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-random-secret"
NEXTAUTH_URL="http://localhost:3000"
SGLANG_SERVICE_URL="http://localhost:8100"
```

Initialize the database and run:

```bash
npx prisma db push
npm run dev
```

### 2. Python SGLang Service

```bash
cd sglang-service
pip install -r requirements.txt
uvicorn main:app --port 8100
```

### 3. SGLang Server (GPU required)

```bash
python -m sglang.launch_server --model Qwen/Qwen2.5-7B-Instruct --port 30000
```

For development without a GPU, use the mock server:

```bash
python sglang-service/mock_sglang_server.py
```

### 4. Open the app

Visit `http://localhost:3000` — you'll be redirected to the dashboard (login required).

## Deploying to Production

### Frontend (Vercel) — Auto-deploys on push

1. Connect your GitHub repo to [Vercel](https://vercel.com)
2. Framework will be auto-detected as Next.js
3. Set environment variables in Vercel dashboard:
   - `DATABASE_URL` — a hosted Postgres connection string (use [Neon](https://neon.tech), [Supabase](https://supabase.com), or [PlanetScale](https://planetscale.com))
   - `NEXTAUTH_SECRET` — a random secret string
   - `NEXTAUTH_URL` — your Vercel deployment URL
   - `SGLANG_SERVICE_URL` — your deployed Python service URL

> **Important:** SQLite (`file:./dev.db`) does NOT work on Vercel. You must switch to a hosted database for production. Update `prisma/schema.prisma` datasource to `postgresql` and use a Postgres connection string.

### SGLang Python Service (Render/Railway) — Auto-deploys on push

1. Connect your GitHub repo to [Render](https://render.com) → New Web Service
2. Set **Root Directory** to `sglang-service`
3. **Build Command:** `pip install -r requirements.txt`
4. **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variable: `SGLANG_URL` = your GPU server running the model

> The SGLang model server itself needs a GPU instance (e.g., RunPod, Lambda, or a self-hosted machine). The Python FastAPI service is just a lightweight proxy that can run on any platform.

## Switching Prisma to Postgres (for Vercel deployment)

Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then run:

```bash
npx prisma generate
npx prisma db push
```

Set `DATABASE_URL` in Vercel to your Postgres connection string (e.g., from Neon: `postgresql://user:pass@host/dbname?sslmode=require`).
