# Architecture

The App Router client workspace uses TipTap for editing and Route Handlers for all mutations. A storage adapter selects PostgreSQL when `DATABASE_URL` exists, otherwise a JSON file for local-only development. PostgreSQL is the required production path.

## Data model

`documents`: `id`, `title`, `content` (TipTap JSON), `owner_id`, `shared_with` (JSON array), `created_at`, `updated_at`.

The two demo users are static application data. The user selector writes only an HTTP-only cookie; server handlers derive the active user from it and never accept a client-submitted owner identifier.

## API routes

- `POST /api/auth/switch` sets the simulated user session.
- `GET/POST /api/documents` lists accessible documents or creates an owned document.
- `GET/PATCH/DELETE /api/documents/[id]` reads, updates, or deletes; PATCH and DELETE require ownership.
- `POST/DELETE /api/documents/[id]/share` shares or revokes; both require ownership.

## Access model

Owners may read, edit, rename, delete, and share. Shared users may only read. Route Handlers enforce this through reusable policy functions, not UI controls.

## Intentional exclusions

Real-time editing, comments, history, PDF export, real auth, advanced roles, and rendered Markdown are excluded to preserve delivery scope.
