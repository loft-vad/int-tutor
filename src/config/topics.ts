import type { Topic } from '@/types';

export interface TopicMeta {
  id: Topic;
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

export const TOPIC_META: Record<Topic, TopicMeta> = {
  'javascript-fundamentals': {
    id: 'javascript-fundamentals',
    label: 'JavaScript',
    icon: 'JS',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-300',
    description: 'Closures, prototypes, event loop, scope, and ES6+',
  },
  typescript: {
    id: 'typescript',
    label: 'TypeScript',
    icon: 'TS',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    description: 'Types, generics, utility types, and type narrowing',
  },
  react: {
    id: 'react',
    label: 'React',
    icon: '⚛',
    color: 'text-cyan-700',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-300',
    description: 'Hooks, rendering, performance, and patterns',
  },
  nodejs: {
    id: 'nodejs',
    label: 'Node.js',
    icon: 'N',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300',
    description: 'Event loop, streams, modules, and the runtime',
  },
  'async-patterns': {
    id: 'async-patterns',
    label: 'Async Patterns',
    icon: '⚡',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
    description: 'Promises, async/await, concurrency, and error handling',
  },
  'data-structures': {
    id: 'data-structures',
    label: 'Data Structures',
    icon: '🌲',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300',
    description: 'Arrays, trees, graphs, and algorithmic patterns',
  },
  'system-design': {
    id: 'system-design',
    label: 'System Design',
    icon: '🏗',
    color: 'text-slate-700',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-300',
    description: 'Scalability, caching, APIs, and architecture patterns',
  },
};

export const ALL_TOPICS: Topic[] = Object.keys(TOPIC_META) as Topic[];
