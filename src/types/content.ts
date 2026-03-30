export type Topic =
  | 'javascript-fundamentals'
  | 'typescript'
  | 'react'
  | 'nodejs'
  | 'async-patterns'
  | 'data-structures'
  | 'system-design'
  | 'aws'
  | 'databases';

export type QuestionType = 'flashcard' | 'multiple-choice' | 'coding-challenge';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

interface QuestionBase {
  id: string;
  type: QuestionType;
  topic: Topic;
  difficulty: DifficultyLevel;
  tags: string[];
  explanation: string;
  createdAt: string;
}

export interface FlashcardQuestion extends QuestionBase {
  type: 'flashcard';
  front: string;
  back: string;
}

export interface ChoiceOption {
  id: string;
  text: string;
}

export interface MultipleChoiceQuestion extends QuestionBase {
  type: 'multiple-choice';
  prompt: string;
  options: ChoiceOption[];
  correctOptionId: string;
  timeLimitSeconds: number;
}

export interface CodingChallenge extends QuestionBase {
  type: 'coding-challenge';
  mode: 'read' | 'fix' | 'complete';
  prompt: string;
  starterCode: string;
  solutionCode: string;
  language: 'javascript' | 'typescript';
  hints: string[];
}

export type Question = FlashcardQuestion | MultipleChoiceQuestion | CodingChallenge;
