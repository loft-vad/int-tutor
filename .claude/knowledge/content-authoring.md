# Content authoring guide

## Adding questions

1. Pick (or create) a file in `src/data/`. One file per `Topic`.
2. Append objects to the exported array. No other code changes needed for existing topics.
3. `npm run build` type-checks the whole bank — a malformed question is a compile error.

## Adding a whole topic

Four edits, in this order:
1. `src/types/content.ts` — add the slug to the `Topic` union.
2. `src/config/topics.ts` — add a `TOPIC_META` entry (label, icon, colors, description).
   Keep `color: 'text-black'` — the chips render on light backgrounds.
3. `src/data/<topic>.ts` — export `const <camelCase>Questions: Question[]`.
4. `src/data/index.ts` — import and spread into `allQuestions`, and re-export.

Everything else (routing, filters, stats, session builder) is driven off `ALL_TOPICS` and
`allQuestions` and needs no changes.

## ID convention

`<prefix>-<type>-<nnn>` where type is `fc` (flashcard), `mc` (multiple-choice), or
`cc` (coding-challenge). Prefixes in use:

| Prefix | Topic | Prefix | Topic |
|---|---|---|---|
| `js` | javascript-fundamentals | `ai` | ai-fundamentals |
| `ts` | typescript | `pe` | prompt-engineering |
| `rx` | react | `rag` | rag |
| `node` | nodejs | `vdb` | vector-databases |
| `async` | async-patterns | `agt` | ai-agents |
| `ds` | data-structures | `llm` | llm-integration |
| `sd` | system-design | `sec` | ai-security |
| `aws` | aws | `py` | python-ai |
| `db` | databases | `aid` | ai-assisted-dev |
| `ng` | angular | `wc` | web-components |

IDs are the progress keys — **never renumber an existing ID**, it orphans progress.

## Difficulty ↔ skill level

| `difficulty` | GenAI matrix level | Meaning |
|---|---|---|
| `beginner` | Novice (N) | Heard of it, knows the basics, reads code samples |
| `intermediate` | Intermediate (I) | Implements with limited supervision |
| `advanced` | Advanced / Expert (A/E) | Makes architectural decisions, mentors |

## Style rules for answers

- `front` / `prompt`: one crisp question. No "Explain in detail…".
- `back`: markdown. Lead with the one-sentence answer, then bullets, then a fenced code
  block if it earns its place. Aim for what fits on a phone screen without scrolling twice.
- `explanation`: the *interview* angle — the follow-up they'll ask, the trade-off, the
  common wrong answer. This is where the value is; don't restate `back`.
- Multiple-choice distractors must be plausible. A giveaway option wastes the card.
- `tags`: lowercase, hyphenated, reused across the bank so filtering works.
