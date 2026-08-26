# Source materials are distilled into `.claude/knowledge/`, not committed

The content came from four sources that are **deliberately not in the repo**:

| Source | Why not committed |
|---|---|
| `TechCheck_GenAI-App_Dev - stable novice.xlsx` | Internal evaluation spreadsheet |
| `AI dev skills eval matrix - raw matrix.csv` | Same |
| *System Design Interview*, Alex Xu | Licensed book |
| geeksforgeeks TypeScript / Node.js pages | Third-party content |

What **is** committed is the distillation in `.claude/knowledge/*.md` — the competency
lists, the chapter notes, the question coverage checklists. That gives every teammate the
same context without redistributing anyone's material, and it is what the question banks
are traceable to.

## Traceability
Questions carry tags linking them back:
- `n-1.1`, `n-2.3`, `n-5.2`… → xlsx `Sheet1` AI-assisted-dev rows
- `alex-xu-ch1` … `alex-xu-ch15` → book chapters
- `gfg` → the geeksforgeeks question sets
- `modern-ts`, `modern-node` → material added beyond the source lists

So `grep -r "alex-xu-ch6" src/data/` shows exactly what the key-value-store chapter produced.

## If the sources change
Re-derive the knowledge doc first, then update the questions. The knowledge docs are the
interface between the private sources and the public repo.

Related: [[content-pipeline]], [[topic-taxonomy]]
