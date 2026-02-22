# Interview Trainer PWA — Developer Guide

## Project Overview
A mobile-first Progressive Web App for fullstack JavaScript/TypeScript interview prep. Covers React, Next.js, TypeScript, JavaScript fundamentals, Node.js, async patterns, and data structures via flashcards, multiple-choice quizzes, and coding challenges.

## Tech Stack
- **Next.js 14** (App Router, TypeScript strict, `src/` dir, `@/*` alias)
- **Tailwind CSS** (mobile-first)
- **Zustand** — state management with custom IndexedDB persist middleware
- **idb** — IndexedDB wrapper
- **@serwist/next** — PWA/service worker
- **react-markdown + remark-gfm** — markdown rendering
- **@monaco-editor/react** — code editor (lazy-loaded)
- **shiki** — syntax highlighting
- **nanoid** — session IDs

## Key Rules

### Never touch the React code when adding server sync
The `StorageAdapter` interface in `src/types/storage.ts` is the seam. To add server sync:
1. Write `RemoteAdapter` implementing `StorageAdapter`
2. Update factory in `src/storage/adapters.ts`
Zustand stores, hooks, and components require zero changes.

### State management
- **Zustand** for all app state (not React Context)
- Progress/settings persist to IndexedDB via custom middleware
- Session state is ephemeral (not persisted)

### Components
- Minimal `use client` — only leaf components that need browser APIs
- Heavy components (Monaco editor) must be lazy-loaded via `next/dynamic`
- Wrap lazy components in `<Suspense>`

### Data files
To add questions: edit any file in `src/data/`. Add objects to the exported array. No other code changes needed.

## Folder Structure
```
src/
├── app/          # Next.js App Router pages
├── components/   # React components (ui, flashcard, quiz, coding, stats, layout)
├── config/       # Static config (topics metadata)
├── data/         # Question content (TS data files)
├── hooks/        # Custom React hooks
├── lib/          # Pure utility functions (algorithm, filters, etc.)
├── storage/      # StorageAdapter implementations + factory
├── store/        # Zustand stores + middleware
└── types/        # TypeScript interfaces
```

## Development
```bash
npm run dev          # localhost:3000
npm run build        # production build (needed for PWA testing)
npm start            # serve production build
```

## Adding Content
Edit files in `src/data/`. Each file exports an array of `Question` objects. The `src/data/index.ts` re-exports everything as `allQuestions`.

## Learning Algorithm
- 5 consecutive correct → `learned`
- Any wrong → `consecutiveCorrect` resets, status → `learning`
- Session queue: `learning` first → `new` → (skipped excluded)
- Skip sets `status: 'skipped'`; un-skip from stats page
