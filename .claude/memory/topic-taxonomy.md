# Topics are split to mirror the evaluation matrix, not for tidiness

The app has two **tracks** (`fullstack-js`, `ai-engineer`) and 20 topics.

## Why the AI track is 9 topics rather than one "AI" topic
The GenAI evaluation matrix scores each competency **separately** (AI fundamentals, prompt
engineering, RAG, vector DBs, agents, LLM APIs, AI security, Python, AI-assisted dev).
Per-topic progress in the app therefore maps 1:1 onto the matrix rows a candidate is
actually assessed on — you can see that your RAG is strong and your agent knowledge is not.
Collapsing them into one topic would destroy that signal.

## Why `angular` and `web-components` are separate
Stencil, custom elements, and Shadow DOM knowledge is reusable outside Angular (React, Vue,
plain HTML), and the Angular-integration questions are a distinct interview area from
Angular core. They cross-reference each other by tag.

## Difficulty maps to matrix levels
`beginner` = Novice, `intermediate` = Intermediate, `advanced` = Advanced/Expert.
This is not arbitrary — filtering by difficulty filters by the level you are interviewing for.

## Adding a topic
Four edits, listed in `.claude/knowledge/content-authoring.md`. Everything else is driven
off `ALL_TOPICS` and `allQuestions`.

Related: [[content-pipeline]], [[source-materials]]
