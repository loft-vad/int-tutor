'use client';

import { create } from 'zustand';
import type { Question, Topic } from '@/types/content';

interface SessionState {
  sessionId: string | null;
  currentTopic: Topic | null;
  queue: Question[];
  currentIndex: number;
  score: number;
  totalAnswered: number;
  startedAt: string | null;
}

interface SessionActions {
  startSession(sessionId: string, topic: Topic, queue: Question[]): void;
  advanceQueue(): void;
  recordSessionAnswer(correct: boolean): void;
  endSession(): void;
}

type SessionStore = SessionState & SessionActions;

export const useSessionStore = create<SessionStore>()((set) => ({
  sessionId: null,
  currentTopic: null,
  queue: [],
  currentIndex: 0,
  score: 0,
  totalAnswered: 0,
  startedAt: null,

  startSession(sessionId, topic, queue) {
    set({
      sessionId,
      currentTopic: topic,
      queue,
      currentIndex: 0,
      score: 0,
      totalAnswered: 0,
      startedAt: new Date().toISOString(),
    });
  },

  advanceQueue() {
    set((state) => ({ currentIndex: state.currentIndex + 1 }));
  },

  recordSessionAnswer(correct) {
    set((state) => ({
      score: state.score + (correct ? 1 : 0),
      totalAnswered: state.totalAnswered + 1,
    }));
  },

  endSession() {
    set({
      sessionId: null,
      currentTopic: null,
      queue: [],
      currentIndex: 0,
      startedAt: null,
    });
  },
}));
