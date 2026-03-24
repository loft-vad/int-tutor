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
    color: 'text-black',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-400',
    description: 'Closures, prototypes, event loop, scope, and ES6+',
  },
  typescript: {
    id: 'typescript',
    label: 'TypeScript',
    icon: 'TS',
    color: 'text-black',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-400',
    description: 'Types, generics, utility types, and type narrowing',
  },
  react: {
    id: 'react',
    label: 'React',
    icon: '⚛',
    color: 'text-black',
    bgColor: 'bg-cyan-100',
    borderColor: 'border-cyan-400',
    description: 'Hooks, rendering, performance, and patterns',
  },
  nodejs: {
    id: 'nodejs',
    label: 'Node.js',
    icon: 'N',
    color: 'text-black',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-400',
    description: 'Event loop, streams, modules, and the runtime',
  },
  'async-patterns': {
    id: 'async-patterns',
    label: 'Async Patterns',
    icon: '⚡',
    color: 'text-black',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-400',
    description: 'Promises, async/await, concurrency, and error handling',
  },
  'data-structures': {
    id: 'data-structures',
    label: 'Data Structures',
    icon: '🌲',
    color: 'text-black',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-400',
    description: 'Arrays, trees, graphs, and algorithmic patterns',
  },
  'system-design': {
    id: 'system-design',
    label: 'System Design',
    icon: '🏗',
    color: 'text-black',
    bgColor: 'bg-slate-100',
    borderColor: 'border-slate-400',
    description: 'Scalability, caching, APIs, and architecture patterns',
  },
  aws: {
    id: 'aws',
    label: 'AWS',
    icon: '☁',
    color: 'text-black',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-400',
    description: 'Core AWS services, IAM, networking, and cloud architecture',
  },
};

export const ALL_TOPICS: Topic[] = Object.keys(TOPIC_META) as Topic[];
