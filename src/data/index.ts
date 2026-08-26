import type { Question } from '@/types/content';

// ── Fullstack JS/TS track ──────────────────────────────────
import { javascriptFundamentalsQuestions } from './javascript-fundamentals';
import { typescriptQuestions } from './typescript';
import { reactQuestions } from './react';
import { angularQuestions } from './angular';
import { webComponentsQuestions } from './web-components';
import { nodejsQuestions } from './nodejs';
import { asyncPatternsQuestions } from './async-patterns';
import { dataStructuresQuestions } from './data-structures';
import { systemDesignQuestions } from './system-design';
import { awsQuestions } from './aws';
import { databasesQuestions } from './databases';

// ── AI Engineer track ──────────────────────────────────────
import { aiFundamentalsQuestions } from './ai-fundamentals';
import { promptEngineeringQuestions } from './prompt-engineering';
import { ragQuestions } from './rag';
import { vectorDatabasesQuestions } from './vector-databases';
import { aiAgentsQuestions } from './ai-agents';
import { llmIntegrationQuestions } from './llm-integration';
import { aiSecurityQuestions } from './ai-security';
import { pythonAiQuestions } from './python-ai';
import { aiAssistedDevQuestions } from './ai-assisted-dev';

export const allQuestions: Question[] = [
  ...javascriptFundamentalsQuestions,
  ...typescriptQuestions,
  ...reactQuestions,
  ...angularQuestions,
  ...webComponentsQuestions,
  ...nodejsQuestions,
  ...asyncPatternsQuestions,
  ...dataStructuresQuestions,
  ...systemDesignQuestions,
  ...awsQuestions,
  ...databasesQuestions,
  ...aiFundamentalsQuestions,
  ...promptEngineeringQuestions,
  ...ragQuestions,
  ...vectorDatabasesQuestions,
  ...aiAgentsQuestions,
  ...llmIntegrationQuestions,
  ...aiSecurityQuestions,
  ...pythonAiQuestions,
  ...aiAssistedDevQuestions,
];

export {
  javascriptFundamentalsQuestions,
  typescriptQuestions,
  reactQuestions,
  angularQuestions,
  webComponentsQuestions,
  nodejsQuestions,
  asyncPatternsQuestions,
  dataStructuresQuestions,
  systemDesignQuestions,
  awsQuestions,
  databasesQuestions,
  aiFundamentalsQuestions,
  promptEngineeringQuestions,
  ragQuestions,
  vectorDatabasesQuestions,
  aiAgentsQuestions,
  llmIntegrationQuestions,
  aiSecurityQuestions,
  pythonAiQuestions,
  aiAssistedDevQuestions,
};
