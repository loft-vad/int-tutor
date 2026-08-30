# Project memory

Durable decisions and hard-won lessons for this repo, checked in so every
teammate (and every Claude Code session) starts with the same knowledge.
One file per topic.

This is the **project-scoped** counterpart to a personal `~/.claude` memory:
nothing here is user-specific, and everything here should still be true in six
months.

## Architecture and content

| File | What it records |
|---|---|
| `storage-seam.md` | Why `StorageAdapter` exists and the rule that protects it |
| `content-pipeline.md` | How the question banks are generated and validated |
| `topic-taxonomy.md` | Why topics are split the way they are |
| `source-materials.md` | Where the content came from, and what is deliberately not committed |

## Operations

| File | What it records |
|---|---|
| `firebase-project-setup.md` | Console setup, why anonymous alone is not sync, rules semantics |
| `deploy-and-auth.md` | How deploys work, and why `gh auth switch` alone does not fix pushes |

## Bugs that cost real time — read before touching these areas

| File | What it records |
|---|---|
| `verification-discipline.md` | **Green CI shipped three broken features.** Verify in a browser. |
| `sync-concurrency.md` | Never cache the uid; dedupe in-flight promises, not just results |
| `ui-wiring-gotchas.md` | `next/font` variables do not apply themselves; unlinked routes |

Add a file when a decision or a debugging session would otherwise have to be
re-derived from the diff.
