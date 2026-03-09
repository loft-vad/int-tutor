import type { Question } from '@/types/content';
import { javascriptFundamentalsQuestions } from './javascript-fundamentals';
import { typescriptQuestions } from './typescript';
import { reactQuestions } from './react';
import { nodejsQuestions } from './nodejs';
import { asyncPatternsQuestions } from './async-patterns';
import { dataStructuresQuestions } from './data-structures';
import { systemDesignQuestions } from './system-design';

export const allQuestions: Question[] = [
  ...javascriptFundamentalsQuestions,
  ...typescriptQuestions,
  ...reactQuestions,
  ...nodejsQuestions,
  ...asyncPatternsQuestions,
  ...dataStructuresQuestions,
  ...systemDesignQuestions,
];

export {
  javascriptFundamentalsQuestions,
  typescriptQuestions,
  reactQuestions,
  nodejsQuestions,
  asyncPatternsQuestions,
  dataStructuresQuestions,
  systemDesignQuestions,
};
