# GenAI Application Development — Evaluation Matrix (distilled)

Source: `TechCheck_GenAI-App_Dev - stable novice.xlsx` (sheet `7-24-2025`) and
`AI dev skills eval matrix - raw matrix.csv`. Matrix version **1.1.3 Stable**.

## Scoring model

Self/interviewer score per competency, 0–4:

| Mark | Meaning |
|---|---|
| 0 | No idea about the topic |
| 1 | Some theoretical knowledge; can do simple tasks and read code samples |
| 2 | Can do normal tasks without constant supervision |
| 3 | Appropriate experience; can perform the majority of real-life tasks |
| 4 | Deep understanding, knows the underwater stones, can mentor |

Levels: **N** Novice · **I** Intermediate · **A** Advanced · **E** Expert.
Each row carries a per-level *weight* (0.1–2.0): `≤0.9` lesser important,
`0.91–1.2` important, `>1.21` very important. A weight of `0.1` at level N means
"not expected of a novice"; `2` at level E means "decisive for an expert".

Level definitions from the sheet:
- **Novice** — "person who *heard something*" and knows the basics.
- **Intermediate** — Novice + able to implement with limited supervision; no
  solution/architectural decisions required.
- **Advanced** — able to implement blocks of solutions without supervision; can make
  solution/architectural decisions.
- **Expert** — as Advanced, plus mentoring and novel/advanced architecture.

Mapping used in the app: `difficulty: 'beginner'` = N, `'intermediate'` = I,
`'advanced'` = A/E.

---

## NOVICE competencies (weights N=1.0–1.2)

1. **AI fundamentals — terms and concepts.** DS, ML, NN, AI, SL, LLM, GenAI, AI Agents, RAG, NLP.
2. **Prompt engineering.** Creating prompts that achieve specific goals; analysing prompt
   data to improve future prompts; using prompts to guide user behaviour; systematic prompt
   engineering; zero-shot, few-shot, CoT, ToT, GoT. Tuning: temperature, seed, top-k, top-p.
3. **Data structures: Vectors** (dynamic arrays/lists) — add/remove/access, vector vs
   fixed-size array.
4. **Data structures: Graphs** — nodes/vertices, edges, directed/undirected,
   weighted/unweighted; adjacency list vs matrix; BFS/DFS.
5. **RegEx** — role in programming, basic syntax, literal chars and character sets,
   quantifiers `*` `+` `?`, testing tools.
6. **SQL DBs** — tables, rows, columns, primary/foreign keys, views; CRUD; joins; basic
   configuration (buffer pool size, connection limits).
7. **NoSQL DBs** — non-relational concept; MongoDB, Cassandra, Redis; CRUD on a single
   document/key-value pair; index concepts.
8. **File formats in your primary language** — txt, doc, xaml, html, csv, json, yaml:
   read, write, upload, send; naming the tools/libraries.
9. **API Integration** — web sockets, CORS.
10. **Architectures** — monolith, n-tier, onion, microservices, event-driven, serverless:
    basic principles.
11. **LLM APIs** — simple apps on LLM APIs; prompt-engineering techniques; API rate limits
    and costs; basic error scenarios; request libraries.
12. **DevOps** — Docker containerization, CI/CD, monitoring.
13. **Naïve RAG** — basic principles, use cases, flow schema, embeddings; build the simplest
    vector-based (naive) RAG; FAISS.
14. **Chain Framework** (LangChain *or* LlamaIndex *or* Semantic Kernel) — purpose of the
    framework; what a "chain" is (memory, context); install/setup; docs; role of LLMs in the
    framework; simple single-step chain; basic prompt templates; chat.
15. **Chunking Strategies & Retriever Strategies** — understanding of.
16. **Cloud** (one of AWS/GCP/Azure) — storage, databases, container services; basic
    principles and APIs (associate-level certification territory).
17. **Common AI security issues** — prompt injection, prompt leaking, jailbreaking,
    alignment hacking, authorized user / guardrails.
18. **Python** — install, project start (poetry, venv, pip), syntax, control flow, functions,
    modules/imports, file handling, lists/dicts/tuples, try-except, pip, VS Code / Jupyter.
19. **Jupyter Notebooks** — use cases, install, cells/toolbar/menus, markdown cells, running
    Python, export (.ipynb/.html/.pdf), shortcuts, extensions.

## INTERMEDIATE competencies (= Novice +, weights I=0.9–1.2, A/E=1.2–2)

- **Prompt Engineering** — + prompt evaluation and optimization.
- **NoSQL Databases** — document / key-value / wide-column / graph models; aggregation
  pipelines (MongoDB), secondary indexes (Cassandra); schema design for document stores;
  distributed NoSQL, replication and sharding; language integration (PyMongo, Mongoose).
- **NoSQL Querying** — query language/API of at least one NoSQL DB; ORMs; query optimisation.
- **SQL Databases** — normalization (1NF/2NF/3NF); transactions; ACID.
- **SQL Querying** — joins, subqueries, aggregations, window functions; optimization.
- **SQL Performance** — using indexes effectively.
- **Vector Databases** — configuration options, choosing a DB, initialization, management;
  pre-trained embeddings (OpenAI, Hugging Face, Sentence Transformers); language
  integration; scaling (sharding, replication).
- **Vector Querying** — the vector DB query language/API; similarity and nearest-neighbour
  search; filtering and conditional queries.
- **Vector Performance** — choosing/configuring indexes; HNSW, IVF; optimization.
- **AI Security & Risk Mitigation** — adversarial attacks, model inversion; GDPR and data
  privacy; data sanitization.
- **LangChain — Chains and Extended Chains** — connecting multiple LLM calls.
- **LangChain — Memory Management** — state/context across calls (chatbot context).
- **LangChain — Parallel Chain Execution** — running chains concurrently.
- **LangChain — Branching Chain Execution** — branching logic on LLM output.
- **Document Ingestion** — structuring extracted text (titles, paragraphs, tables);
  metadata extraction (author, publication date) to enhance retrieval; complex layouts
  (multi-column, images, tables).
- **Chunking Strategy** — special cases (abbreviations, titles — don't split "Dr. Smith");
  large documents; text-structure based (headers/paragraphs/sentences) and
  document-structure based (HTML tags, JSON objects/arrays).
- **Embedding** — sentence embeddings for semantic similarity; contextual embeddings
  (BERT, ELMo) for context-aware QA.
- **Storing Embeddings in Vector DBs** — indexing strategies (HNSW in FAISS);
  high-dimensional embeddings (768-d BERT in Milvus); batch insertion/retrieval.
- **Response Generation — Post-Processing** — formatting to a style, filtering irrelevant
  information, validation checks for accuracy.
- **Vector/Graph DB integration with RAG** — connecting a graph DB to a RAG system;
  embedding graph data; indexing graph embeddings for fast retrieval.
- **Storing/Retrieving embeddings in SQL and NoSQL** — indexing document-ID columns,
  batch insert/retrieve, when NoSQL beats SQL for embedding storage.
- **AI Agents** — A2A, MCP, tool calling.

## ADVANCED / EXPERT competencies (weights A=1.2, E=1.2–2)

- **Data Structures: Graphs** — operations, edge, vertex, node.
- **Graph DBs** — concepts; querying (similarity search combined with other criteria,
  range search, k-NN, query performance optimization).
- **AWS GenAI Services** — service awareness (Bedrock, SageMaker), model/service choice,
  pricing, console/docs; Bedrock API (advanced features, cost/perf optimization, error
  handling, retries); prompt engineering for Bedrock models; SageMaker JumpStart and custom
  models (fine-tuning, endpoints, monitoring); content moderation & safety.
- **Azure GenAI Services** — Azure OpenAI Service, Azure AI Studio; API usage; prompt
  engineering; content moderation; **fine-tuning** (datasets, training, evaluation,
  troubleshooting).
- **GCP GenAI Services** — Vertex AI, Model Garden, Generative AI Studio; Vertex AI API
  (model tuning, cost/perf, retries); prompt engineering; Model Garden & PaLM 2;
  content moderation.
- **AI Security & Risk Mitigation** — risk assessment, security protocols for AI models,
  mitigating adversarial attacks, AI security frameworks.
- **Architectures (AI/ML)** — designing complex AI/ML architectures, comparing approaches,
  novel solutions, advanced patterns like transformers.
- **LLM APIs** — cost/performance optimization, custom integrations, mitigating biases.
- **LangChain** — complex workflows, performance/scalability, custom tools and components,
  external API integration, error handling and debugging, security risks.
- **RAG** — pipeline design, advanced retrieval strategies, diverse data, performance
  diagnosis; OCR ingestion; large-scale document collections; data quality and consistency;
  semantic-meaning-based splitting; application-specific splitting; dynamic splitting;
  evaluating split quality; evaluating embedding quality.
- **AI Agents** — complex agents, RL techniques, multi-agent systems, performance/resource
  optimization; hierarchical or role-based architectures; memory management (short-term,
  long-term, entity); tool-enhanced agents for multi-domain workflows; escalation protocols
  and human-in-the-loop; agent metrics (context adherence, response time, task completion
  rate); scalable multi-agent architectures; tool calling for multi-step problems.
- **Agent ADKs** — OpenAI ADK, Google ADK (one of).
- **Agent frameworks**
  - **LangGraph** — states as Runnables, graphs from nodes and edges, linear chains and
    branching, integrating LangChain tools/Runnables in nodes, data flow between steps.
  - **AutoGen** — agent types, basic multi-agent conversations, tool integration.
  - **CrewAI** — Agent / Task / Crew; roles and goals; built-in and custom tools.
- **Data Structures: Trees** — balancing (AVL, Red-Black) and trade-offs; B-trees, tries;
  applications (compiler design, decision trees); performance of tree algorithms.

---

## Coverage map → app topics

| Matrix area | App topic |
|---|---|
| AI fundamentals, architectures (AI/ML) | `ai-fundamentals` |
| Prompt engineering + tuning + evaluation | `prompt-engineering` |
| Naive→advanced RAG, ingestion, chunking, embeddings, retrievers | `rag` |
| Vector DBs, vector querying/performance, graph DBs | `vector-databases` |
| AI agents, A2A/MCP/tool calling, LangGraph/AutoGen/CrewAI, ADKs | `ai-agents` |
| LLM APIs, LangChain chains/memory/parallel/branching, cloud GenAI services | `llm-integration` |
| Prompt injection, jailbreaking, guardrails, GDPR, adversarial | `ai-security` |
| Python, Jupyter, file formats, regex | `python-ai` |
| xlsx Sheet1 (AI-assisted coding workflow) | `ai-assisted-dev` |
| SQL/NoSQL DBs, querying, performance | `databases` (existing) |
| Vectors, graphs, trees | `data-structures` (existing) |
| Architectures, API integration, DevOps | `system-design` (existing) |
| Cloud (AWS) | `aws` (existing) |
