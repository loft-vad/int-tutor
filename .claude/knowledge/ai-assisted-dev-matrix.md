# AI-Assisted Development — Novice competency rows

Source: `TechCheck_GenAI-App_Dev - stable novice.xlsx`, sheet `Sheet1`.
All rows are Novice-weighted `N=1.2, I=1.0, A=0.5, E=0.1` (N-5.3 is `N=1.0`),
i.e. **must-have for a novice, assumed at higher levels**.

| ID | Area | Competency |
|---|---|---|
| N-1.1 | AI Foundations | Understands what LLMs are and how they generate output; knows **context window, hallucination, temperature, determinism, inference, fine-tuning, grounding** at a conceptual level |
| N-1.2 | AI Foundations | Knows core AI/ML vocabulary — **AI vs ML vs GenAI, multimodal, RAG, embeddings, vector DB, semantic search, AI agents, agentic workflow, tool calling, MCP, orchestration** |
| N-2.1 | Prompt Engineering | Prompt-engineering fundamentals; zero-shot and few-shot prompts; structures prompts with **context / task / constraints / output format**; uses CoT and XML-like tags |
| N-2.3 | Prompt Engineering | Iteratively refines prompts — identifies what was unclear in a bad response and adjusts via **constraints or examples** rather than starting over |
| N-3.1 | Tool Setup & Configuration | Installs and configures an AI coding assistant in an IDE; creates a basic **instruction file**; sets a custom system prompt; understands **instruction hierarchy** |
| N-3.2 | Tool Setup & Configuration | Knows the difference between **inline suggestions, chat mode, and command-based** AI interactions; selects the right mode per task; uses a **plan-first** approach for complex tasks |
| N-4.1 | AI-Assisted Coding | Uses AI to generate utility functions, boilerplate, and component templates from plain-English descriptions; **reviews AI-generated code before committing** |
| N-4.2 | AI-Assisted Coding | Generates basic unit tests and inline documentation (JSDoc/TSDoc) using AI; **specifies edge cases in prompts**; identifies trivial tests that don't cover important logic |
| N-5.1 | Code Review & Safety | Reviews AI-generated code for **logic errors, edge cases, security issues, and codebase-convention violations** before accepting |
| N-5.2 | Code Review & Safety | Knows AI may suggest file changes or terminal commands; **reads every AI-suggested shell command and multi-file diff** before applying; rejects risky suggestions |
| N-5.3 | Code Review & Safety | Uses AI to explore an unfamiliar codebase — find components, explain logic, summarise module dependencies; **verifies AI descriptions against actual source** |
| N-6.1 | Task Research & Decomposition | Uses AI to clarify requirements, research technical approaches, and break a task into a **step-by-step implementation plan before coding** |
| N-7.1 | Bug Investigation | Uses AI to analyse error messages and stack traces; **provides relevant code context**; validates that AI-suggested fixes address the **root cause, not the symptom** |

## Note on the two matrices

The xlsx contains **two different matrices**:
- Sheet `7-24-2025` — the **GenAI App Developer** matrix (building AI products). Feeds the
  9 AI-track topics.
- Sheet `Sheet1` — the **AI-assisted developer** matrix (using AI to build any software).
  Feeds the `ai-assisted-dev` topic.

They are complementary, not duplicates: the first is "can you build with LLMs", the second
is "can you work effectively alongside an AI coding assistant". Interviews for an
"AI Engineer" role increasingly test both.
