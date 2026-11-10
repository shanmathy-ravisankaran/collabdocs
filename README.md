# CollabDocs

A lightweight Google Docs-style workspace built with Next.js, TipTap, and PostgreSQL-ready persistence.

## Prerequisites

- Node.js 20.9 or later
- npm
- PostgreSQL only when using durable hosted storage (recommended: a free Neon database)

## Windows PowerShell setup

```powershell
Set-Location C:\Users\shaha\projects\collabdocs
npm install
Copy-Item .env.example .env.local
# Edit .env.local and set DATABASE_URL for PostgreSQL, or leave it unset for local development.
npm run dev
```

Open `http://localhost:3000`. Verify the app with:

```powershell
npm test
npx tsc --noEmit
npm run lint
npm run build
```

## Demo users

- Alex Morgan — `alex@collabdocs.demo`
- Jordan Lee — `jordan@collabdocs.demo`

The sidebar selector sets an HTTP-only demo-session cookie. It is deliberately simulated authentication, not production-grade identity or authorization.

## Persistence and deployment

With `DATABASE_URL` configured, the app creates its `documents` table on first request and persists documents, TipTap JSON content, ownership, and sharing relationships in PostgreSQL. This suits a free Neon + Vercel deployment. Without it, local development uses `.data/documents.json`; do not use that fallback for serverless production.

## Limitations

No real-time co-editing, comments, version history, PDF export, real authentication, or advanced permission roles are included. Markdown imports are safely imported as editable plain text; Markdown syntax is not rendered.
