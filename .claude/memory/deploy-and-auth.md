# Deploying, and the GitHub auth trap

Repo: `loft-vad/int-tutor` · Live: <https://loft-vad.github.io/int-tutor/>

Deploy = **push to `master`**. That triggers `.github/workflows/nextjs.yml`
(lint + type-check + content validation → `next build` → Pages). There is no
separate deploy step.

## `gh auth switch` alone does NOT change what git pushes as

This cost real time. Two accounts were logged into `gh` (`vadzimkar` and
`loft-vad`), and pushes failed with 403. The obvious fix — switch the active `gh`
account — **would not have worked**, because git here uses `osxkeychain` and `gh`
is not registered as a git credential helper. Git reads its own stored
credential regardless of what `gh` considers active.

Diagnose which identity git will actually use:
```bash
git config --get-all credential.helper
printf "protocol=https\nhost=github.com\n\n" | git credential fill | grep '^username='
```

Fix — make git follow `gh` (one-time):
```bash
gh auth setup-git          # registers `!gh auth git-credential` for github.com
gh auth switch --user loft-vad
```
Alternatives: scope it per-repo with
`git config --local credential.helper '!gh auth git-credential'`, or bypass `gh`
entirely with `git remote set-url origin https://loft-vad@github.com/...`.

Until `gh auth setup-git` is run, `gh auth status` can say `loft-vad` while git
silently pushes as someone else — a genuine footgun.

## NEXT_PUBLIC_* must be env at build time

`NEXT_PUBLIC_*` values are **inlined during `next build`**, so repository secrets
alone never reach the bundle — they must be passed as `env:` on the build step.
The six `NEXT_PUBLIC_FIREBASE_*` secrets are set on the repo and wired in the
workflow. Unset secrets resolve to empty strings, `isFirebaseConfigured()` returns
false, and the app deploys local-only — a safe default.

Locally the same values live in `.env.local` (gitignored); `.env.example`
documents the shape.

## Verifying a deploy

- Static export emits `page.html`, **not** `page/index.html`. Request
  `/int-tutor/flashcards/rag` **without** a trailing slash. And watch for a double
  slash when the base URL already ends in `/` — that produces false 404s.
- To confirm env values reached the build, extract the chunk map from
  `_next/static/chunks/webpack-*.js` (`[0-9]+:"[a-f0-9]{16}"`) and grep the
  chunks. Firebase lives in a **lazy** chunk, so it is absent from `index.html`'s
  script tags — a non-recursive `grep chunks/*.js` will miss it.
- A deployed chunk hash identical to the local build's is strong evidence the same
  env was compiled in.
- The PWA service worker (`skipWaiting` + `clientsClaim`) can still serve a stale
  bundle on the first load after a deploy. Hard-reload, or add a cache-busting
  query param when testing.

Related: [[firebase-project-setup]], [[verification-discipline]]
