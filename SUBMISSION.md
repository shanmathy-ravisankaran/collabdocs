# Submission

## Completed

- Dashboard with owned and shared document lists
- Create, rename, delete, save, reopen, autosave, and persistent TipTap content
- Formatting toolbar, validated `.txt`/`.md` import, simulated sharing and revocation
- Backend authorization, PostgreSQL production path, and automated access/import tests

## Demo accounts

Alex Morgan (`alex@collabdocs.demo`) and Jordan Lee (`jordan@collabdocs.demo`).

## Verification results

`npx tsc --noEmit`, `npm run lint`, `npm test`, and `npm run build` pass locally. The automated suite contains four passing cases for owner/shared permissions and file-import validation. Browser-level verification and a public deployment still require a running local browser and provisioned PostgreSQL deployment respectively.

## Deployment

Product URL: _to be added after deployment_

Walkthrough video: _to be added after recording_

Configure `DATABASE_URL` with durable PostgreSQL before deployment. No credentials or deployment URL are committed.
