# Question banks are generated, not hand-written

The ~590 questions in `src/data/` were authored through a Python emitter
(`Bank` in the session scratchpad) that JSON-encodes every string before writing TypeScript.

## Why it matters
- Answers are markdown containing backticks, quotes, apostrophes, and fenced code blocks.
  Hand-escaping them into single-quoted TS literals is where errors creep in; JSON encoding
  makes it mechanical.
- Multiple-choice options are **deterministically rotated** by a hash of the prompt, so the
  correct answer is not always option A. Without this the quiz is trivially guessable — the
  first pass had 100% of answers on "a". The rotation is stable across regeneration, so
  question IDs and answers do not churn.

## The invariant that must not break
`npm run validate:content` (`scripts/validate-content.mjs`) enforces:
- no duplicate question IDs — **duplicates silently merge two questions' progress**;
- every `correctOptionId` names an option that exists;
- every declared topic has questions;
- answer positions are not skewed past 45%.

Run `npm run check` (lint + tsc + validate) before committing content.

## Hand-editing is fine
The generated files are normal TypeScript and are meant to be edited directly from here on.
Follow the ID convention in `.claude/knowledge/content-authoring.md` and **never renumber
an existing ID** — IDs are the progress keys.

Related: [[topic-taxonomy]], [[source-materials]]
