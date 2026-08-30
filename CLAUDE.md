# Interview Trainer PWA — Developer Guide

## Project Overview
A mobile-first Progressive Web App for technical interview prep, covering **two tracks**:

1. **Fullstack JS/TS** — JavaScript, TypeScript, React, Angular, Web Components (Stencil),
   Node.js, async patterns, data structures, system design, AWS, databases.
2. **AI Engineer / GenAI App Developer** — AI fundamentals, prompt engineering, RAG,
   vector databases, AI agents, LLM integration, AI security, Python for AI, and
   AI-assisted development.

Study modes: flashcards (spaced repetition), timed multiple-choice quizzes, and coding
challenges. ~590 questions across 20 topics.

## Shared knowledge base — read this first

Everything a teammate (or a new Claude Code session) needs is checked into `.claude/`:

| Path | What it is |
|---|---|
| `.claude/PLAN.md` | The extension plan and the decisions log |
| `.claude/knowledge/` | Distilled source material behind every question bank |
| `.claude/memory/` | Durable project decisions — read before changing architecture |

Start with `.claude/knowledge/README.md` and `.claude/memory/README.md`.

**Before adding content**, read `.claude/knowledge/content-authoring.md`.
**Before changing storage**, read `.claude/memory/storage-seam.md`.
**Before touching sync, styling, or navigation**, read
`.claude/memory/verification-discipline.md` — three features shipped broken
through a fully green `npm run check`.

## Tech Stack
- **Next.js 14** (App Router, TypeScript strict, `src/` dir, `@/*` alias)
- **Tailwind CSS** (mobile-first)
- **Zustand** — state management with custom IndexedDB persist middleware
- **idb** — IndexedDB wrapper
- **firebase** — *optional* cross-device sync (Firestore + anonymous/Google auth)
- **@serwist/next** — PWA/service worker
- **react-markdown + remark-gfm** — markdown rendering
- **@monaco-editor/react** — code editor (lazy-loaded)
- **shiki** — syntax highlighting
- **nanoid** — session IDs

## Key Rules

### Never touch the React code when changing storage
The `StorageAdapter` interface in `src/types/storage.ts` is the seam. To add a backend:
1. Write an adapter implementing `StorageAdapter`
2. Update the factory in `src/storage/adapters.ts`

Zustand stores, hooks, and components require zero changes. Cross-device sync was added
this way — see `.claude/memory/storage-seam.md`.

### State management
- **Zustand** for all app state (not React Context)
- Progress/settings persist through the `StorageAdapter` seam
- Session state is ephemeral (not persisted)

### Components
- Minimal `use client` — only leaf components that need browser APIs
- Heavy components (Monaco editor) must be lazy-loaded via `next/dynamic`
- Wrap lazy components in `<Suspense>`

### Verify in a browser, not just in CI
`npm run check` proves the parts are well-formed. It cannot prove they are wired
together — it passed while sync was permission-denied, the whole app rendered in
a serif, and Settings had no link pointing at it. Load the page before calling a
change done:

```bash
B="$HOME/.claude/skills/gstack/browse/dist/browse"
$B goto http://localhost:PORT/page.html
$B console                                              # errors
$B js "getComputedStyle(document.body).fontFamily"      # styling applied?
$B js "document.body.innerText.includes('Expected')"    # rendered?
```

When adding a route, add its entry point in the same change.

### Content
- To add questions: edit any file in `src/data/`. No other code changes needed.
- To add a **topic**: four edits, listed in `.claude/knowledge/content-authoring.md`.
- **Never renumber an existing question ID** — IDs are the progress keys, so renumbering
  orphans a user's progress.
- Run `npm run check` before committing content.

## Folder Structure
```
.claude/
├── PLAN.md         # extension plan + decisions log
├── knowledge/      # distilled source material (repo-shareable)
└── memory/         # durable project decisions
src/
├── app/            # Next.js App Router pages
├── components/     # React components (ui, flashcard, quiz, coding, stats, layout, sync)
├── config/         # topics + tracks metadata
├── data/           # question content, one file per topic
├── hooks/          # custom React hooks
├── lib/            # pure utilities (algorithm, filters, markdown)
├── storage/        # StorageAdapter implementations + factory
├── store/          # Zustand stores + middleware
└── types/          # TypeScript interfaces
scripts/
└── validate-content.mjs
```

## Development
```bash
npm run dev               # localhost:3000
npm run build             # production build (needed for PWA testing)
npm start                 # serve production build
npm run lint
npm run validate:content  # duplicate IDs, bad answers, empty topics, answer skew
npm run check             # lint + tsc --noEmit + validate:content
```

## Topics and tracks

Topics are registered in `src/config/topics.ts`, each with a `track`. The dashboard groups
by track; `topicsForTrack(track)` is the accessor. Topic granularity mirrors the GenAI
evaluation matrix so per-topic progress maps onto the competencies you are assessed on —
see `.claude/memory/topic-taxonomy.md`.

Difficulty maps to matrix levels: `beginner` = Novice, `intermediate` = Intermediate,
`advanced` = Advanced/Expert.

## Content provenance

Questions carry tags linking them to their source, so coverage is greppable:

| Tag | Source |
|---|---|
| `n-1.1` … `n-7.1` | GenAI matrix `Sheet1` (AI-assisted development rows) |
| `alex-xu-ch1` … `alex-xu-ch15` | *System Design Interview*, Alex Xu |
| `gfg` | geeksforgeeks TypeScript / Node.js question sets |
| `modern-ts`, `modern-node` | Added beyond the source lists |

Source files themselves are **not** committed (licensed book, internal spreadsheets) —
the distillation in `.claude/knowledge/` is. See `.claude/memory/source-materials.md`.

## Cross-device sync (optional)

Unset `NEXT_PUBLIC_FIREBASE_*` and the app is local-only, exactly as before — the Firebase
SDK is dynamically imported and never enters the bundle. Set them and progress syncs via
Firestore, offline-first, with per-card last-write-wins merge.

Setup: copy `.env.example` → `.env.local`, then follow
`.claude/knowledge/firebase-sync.md`. Security rules live in `firestore.rules`.

## Learning Algorithm
- 5 consecutive correct → `learned`
- Any wrong → `consecutiveCorrect` resets, status → `learning`
- Session queue: `learning` first → `new` → (skipped excluded)
- Skip sets `status: 'skipped'`; un-skip from stats page
