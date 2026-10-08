# Surface Talent Website recovery snapshot

This archive is a clean, history-free source snapshot of the final website.

- Repository: `/Users/chukwuka/Updated Surface Talent Website`
- Branch: `codex/hero-h-final-polish-20260903`
- Source commit: `5b5aa3ec6d7decfc3e55fae96c44001b7eaf5617`
- Source commit timestamp: `2026-09-03T20:56:59+01:00`
- Production Worker: `surface-talent-website`
- Production deployment version: `6af1de96-fb34-4a00-8333-1c757c37b9f9`
- Production URLs: `https://surfacetalent.co.uk/`, `https://www.surfacetalent.co.uk/`
- Snapshot created: `2026-09-03`

## Why Git history is not included

The source snapshot is clean, but a redacted historical secret scan found one
`generic-api-key` match in `docs/launch/owner-actions.md` at historical commit
`27cbf1d83dcfafeed1739e105f15b46b2918666b`. The original `.git` directory is
therefore intentionally excluded. The source files in this snapshot are the
complete tree at the source commit above.

## Exclusions

The archive excludes `.git`, `.env*`, `node_modules`, `.next`, `.open-next`,
`.wrangler`, Playwright output, Lighthouse output, design dumps, browser
profiles, caches, temporary screenshots, logs and temporary deployment files.

## Recovery

Extract the archive, install dependencies with `npm ci`, then run
`npm run build:production`. The deployment command is documented in the
repository README and `AGENTS.md`.

## Verification recorded before local deletion

- Current snapshot secret scan: `gitleaks detect --no-git` passed with zero findings.
- Historical scan: completed with one redacted finding described above.
- Production lint, typecheck, build and diff checks passed.
- Production favicon and manifest endpoints returned the committed icon bytes.
- The archive is tested with `tar -tzf` and its SHA-256 is recorded beside it.
