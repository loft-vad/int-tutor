import type { Topic, Track } from '@/types';

export interface TopicMeta {
  id: Topic;
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  track: Track;
}

export interface TrackMeta {
  id: Track;
  label: string;
  description: string;
  icon: string;
}

export const TRACK_META: Record<Track, TrackMeta> = {
  'fullstack-js': {
    id: 'fullstack-js',
    label: 'Fullstack JS/TS',
    description: 'JavaScript, TypeScript, React, Angular, Node.js, and system design',
    icon: '🧩',
  },
  'ai-engineer': {
    id: 'ai-engineer',
    label: 'AI Engineer',
    description: 'GenAI app development — LLMs, prompting, RAG, agents, and AI security',
    icon: '🤖',
  },
};

export const TOPIC_META: Record<Topic, TopicMeta> = {
  'javascript-fundamentals': {
    id: 'javascript-fundamentals',
    label: 'JavaScript',
    icon: 'JS',
    color: 'text-black',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-400',
    description: 'Closures, prototypes, event loop, scope, and ES6+',
    track: 'fullstack-js',
  },
  typescript: {
    id: 'typescript',
    label: 'TypeScript',
    icon: 'TS',
    color: 'text-black',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-400',
    description: 'Types, generics, utility types, and type narrowing',
    track: 'fullstack-js',
  },
  react: {
    id: 'react',
    label: 'React',
    icon: '⚛',
    color: 'text-black',
    bgColor: 'bg-cyan-100',
    borderColor: 'border-cyan-400',
    description: 'Hooks, rendering, performance, and patterns',
    track: 'fullstack-js',
  },
  angular: {
    id: 'angular',
    label: 'Angular',
    icon: 'A',
    color: 'text-black',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-400',
    description: 'Signals, standalone APIs, DI, RxJS, change detection, and SSR',
    track: 'fullstack-js',
  },
  'web-components': {
    id: 'web-components',
    label: 'Web Components',
    icon: '🧱',
    color: 'text-black',
    bgColor: 'bg-indigo-100',
    borderColor: 'border-indigo-400',
    description: 'Stencil, custom elements, Shadow DOM, and Angular/EAA integration',
    track: 'fullstack-js',
  },
  nodejs: {
    id: 'nodejs',
    label: 'Node.js',
    icon: 'N',
    color: 'text-black',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-400',
    description: 'Event loop, streams, modules, and the runtime',
    track: 'fullstack-js',
  },
  'async-patterns': {
    id: 'async-patterns',
    label: 'Async Patterns',
    icon: '⚡',
    color: 'text-black',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-400',
    description: 'Promises, async/await, concurrency, and error handling',
    track: 'fullstack-js',
  },
  'data-structures': {
    id: 'data-structures',
    label: 'Data Structures',
    icon: '🌲',
    color: 'text-black',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-400',
    description: 'Arrays, trees, graphs, and algorithmic patterns',
    track: 'fullstack-js',
  },
  'system-design': {
    id: 'system-design',
    label: 'System Design',
    icon: '🏗',
    color: 'text-black',
    bgColor: 'bg-slate-100',
    borderColor: 'border-slate-400',
    description: 'Scaling, estimation, and the classic Alex Xu design problems',
    track: 'fullstack-js',
  },
  aws: {
    id: 'aws',
    label: 'AWS',
    icon: '☁',
    color: 'text-black',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-400',
    description: 'Core AWS services, IAM, networking, and cloud architecture',
    track: 'fullstack-js',
  },
  databases: {
    id: 'databases',
    label: 'Databases',
    icon: '🗄',
    color: 'text-black',
    bgColor: 'bg-rose-100',
    borderColor: 'border-rose-400',
    description: 'SQL, indexing, replication, partitioning, and query performance',
    track: 'fullstack-js',
  },

  // ── AI Engineer track ──────────────────────────────────────
  'ai-fundamentals': {
    id: 'ai-fundamentals',
    label: 'AI Fundamentals',
    icon: '🧠',
    color: 'text-black',
    bgColor: 'bg-violet-100',
    borderColor: 'border-violet-400',
    description: 'LLM mechanics, AI/ML/GenAI vocabulary, transformers, and tokens',
    track: 'ai-engineer',
  },
  'prompt-engineering': {
    id: 'prompt-engineering',
    label: 'Prompt Engineering',
    icon: '✍️',
    color: 'text-black',
    bgColor: 'bg-fuchsia-100',
    borderColor: 'border-fuchsia-400',
    description: 'Zero/few-shot, CoT, structured prompts, sampling params, and evaluation',
    track: 'ai-engineer',
  },
  rag: {
    id: 'rag',
    label: 'RAG',
    icon: '🔎',
    color: 'text-black',
    bgColor: 'bg-teal-100',
    borderColor: 'border-teal-400',
    description: 'Ingestion, chunking, embeddings, retrievers, rerankers, and evaluation',
    track: 'ai-engineer',
  },
  'vector-databases': {
    id: 'vector-databases',
    label: 'Vector DBs',
    icon: '📐',
    color: 'text-black',
    bgColor: 'bg-sky-100',
    borderColor: 'border-sky-400',
    description: 'ANN indexes (HNSW, IVF, PQ), hybrid search, and metadata filtering',
    track: 'ai-engineer',
  },
  'ai-agents': {
    id: 'ai-agents',
    label: 'AI Agents',
    icon: '🕹',
    color: 'text-black',
    bgColor: 'bg-lime-100',
    borderColor: 'border-lime-400',
    description: 'Tool calling, MCP, A2A, memory, multi-agent, LangGraph and CrewAI',
    track: 'ai-engineer',
  },
  'llm-integration': {
    id: 'llm-integration',
    label: 'LLM Integration',
    icon: '🔌',
    color: 'text-black',
    bgColor: 'bg-emerald-100',
    borderColor: 'border-emerald-400',
    description: 'LLM APIs, LangChain, streaming, cost, rate limits, and cloud GenAI services',
    track: 'ai-engineer',
  },
  'ai-security': {
    id: 'ai-security',
    label: 'AI Security',
    icon: '🛡',
    color: 'text-black',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-400',
    description: 'Prompt injection, jailbreaks, OWASP LLM Top 10, guardrails, and privacy',
    track: 'ai-engineer',
  },
  'python-ai': {
    id: 'python-ai',
    label: 'Python for AI',
    icon: '🐍',
    color: 'text-black',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-500',
    description: 'Environments, async, pydantic, notebooks, regex, and file formats',
    track: 'ai-engineer',
  },
  'ai-assisted-dev': {
    id: 'ai-assisted-dev',
    label: 'AI-Assisted Dev',
    icon: '🤝',
    color: 'text-black',
    bgColor: 'bg-stone-100',
    borderColor: 'border-stone-400',
    description: 'Working safely and effectively with AI coding assistants',
    track: 'ai-engineer',
  },
};

export const ALL_TOPICS: Topic[] = Object.keys(TOPIC_META) as Topic[];

export const ALL_TRACKS: Track[] = Object.keys(TRACK_META) as Track[];

export function topicsForTrack(track: Track): Topic[] {
  return ALL_TOPICS.filter((t) => TOPIC_META[t].track === track);
}
