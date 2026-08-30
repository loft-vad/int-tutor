# Plan — AI Engineer Role Preparation Track

Status legend: `[ ]` todo · `[~]` in progress · `[x]` done

## Goal
Extend Interview Trainer from a fullstack-JS prep app into a **dual-track** app:
1. **Fullstack JS/TS track** (existing, extended)
2. **AI Engineer / GenAI App Developer track** (new)

Driven by three source artifacts (see `.claude/knowledge/`):
- `TechCheck_GenAI-App_Dev - stable novice.xlsx` — GenAI App Dev evaluation matrix (N/I/A/E levels)
- `AI dev skills eval matrix - raw matrix.csv` — same matrix, raw
- `System Design Interview` (Alex Xu, Vol. 1) — system design depth
- geeksforgeeks TypeScript + Node.js interview question sets
- Angular modern topics + Stencil web components (EAA integration)

## Workstreams

### WS1 — Content: AI Engineer track  `[x]`
New topics, each a file in `src/data/`:
- [x] `ai-fundamentals`   — LLM mechanics, AI/ML/GenAI vocabulary, transformers, tokens, context windows
- [x] `prompt-engineering`— zero/few-shot, CoT/ToT/GoT, structured prompts, sampling params, evaluation
- [x] `rag`               — naive→advanced RAG, chunking, retrievers, rerankers, evaluation
- [x] `vector-databases`  — embeddings storage, HNSW/IVF/PQ, hybrid search, metadata filtering
- [x] `ai-agents`         — tool calling, MCP, A2A, memory, multi-agent, LangGraph/CrewAI/AutoGen
- [x] `llm-integration`   — LLM APIs, LangChain/LlamaIndex, streaming, cost, rate limits, retries
- [x] `ai-security`       — prompt injection, jailbreaking, OWASP LLM Top 10, guardrails, PII
- [x] `python-ai`         — Python for AI engineers, venv/poetry, async, pydantic, notebooks
- [x] `ai-assisted-dev`   — using AI coding assistants safely (matrix Sheet1 N-1..N-7)

### WS2 — Content: extend existing topics  `[x]`
- [x] `system-design` — Alex Xu ch.1–16: scaling, estimation, framework, rate limiter, consistent
      hashing, KV store, unique IDs, URL shortener, crawler, notifications, news feed, chat,
      autocomplete, YouTube, Google Drive
- [x] `typescript`   — full geeksforgeeks set (50 Q) + modern TS (satisfies, const type params, …)
- [x] `nodejs`       — full geeksforgeeks set (74 Q) + modern Node (ESM, worker_threads, perf hooks)
- [x] `angular`      — NEW topic: signals, standalone, control flow, DI, RxJS, change detection, SSR
- [x] `web-components` — NEW topic: Stencil, custom elements, Shadow DOM, Angular/EAA integration

### WS3 — Cross-device progress (Firebase)  `[x]`
- [x] `FirebaseAdapter` (Firestore) implementing `StorageAdapter`
- [x] `SyncedAdapter` — composes local (IndexedDB) + remote, offline-first, last-write-wins merge
- [x] Factory wiring in `src/storage/adapters.ts` driven by `NEXT_PUBLIC_FIREBASE_*` env
- [x] Anonymous auth by default, upgradable to Google sign-in
- [x] `SyncPanel` UI on the settings page (only additive React)
- [x] `.env.example` + setup docs
- Constraint honoured: **zero changes to Zustand stores / hooks / existing components**

### WS4 — Repo-shareable knowledge base  `[x]`
- [x] `.claude/PLAN.md` (this file)
- [x] `.claude/knowledge/*.md` — distilled source material, checked in for the team
- [x] `.claude/memory/*.md` — durable project decisions
- [x] `CLAUDE.md` updated to point at both

### WS5 — Ship  `[x]`
- [x] Firebase project `int-tutor` created and configured (Firestore, anonymous +
      Google auth, rules published, `loft-vad.github.io` authorized)
- [x] Six `NEXT_PUBLIC_FIREBASE_*` secrets set on the repo; workflow passes them
      as build-time `env:`
- [x] CI runs `npm run check` before building
- [x] Deployed to GitHub Pages and verified in a real browser
- [x] Post-deploy fixes: sync concurrency, font application, Settings entry point
      (see `.claude/memory/`)

## Decisions log
| # | Decision | Rationale |
|---|---|---|
| 1 | Firestore over Supabase/custom API | Zero-backend, generous free tier, first-class offline persistence, anonymous auth |
| 2 | `SyncedAdapter` composing local+remote rather than a bare `FirebaseAdapter` | Keeps the PWA usable offline; remote is a sync target, not the read path |
| 3 | Sync is opt-in via env vars | App must keep working with no Firebase project configured |
| 4 | `angular` and `web-components` as separate topics | Stencil/custom-element knowledge is reusable outside Angular; separate topics give cleaner filtering |
| 5 | AI track split into 9 topics, not one `ai` topic | Matrix scores each competency separately; per-topic progress mirrors the eval matrix |
| 6 | Difficulty maps to matrix levels | `beginner`=Novice, `intermediate`=Intermediate, `advanced`=Advanced/Expert |
| 7 | Dedicated Firebase project, not a shared one | One ruleset and one user pool per project; sharing couples two apps' security |
| 8 | Bundled Geist font, no `system-ui` in the stack | The face must not vary by operating system |
| 9 | Settings reached via a dashboard gear, not a 6th nav item | Six bottom-nav items at 375px squeeze each to ~62px |
| 10 | Sync errors log to console with the provider error code | They were swallowed into state, which made the failure undebuggable |
