import type { Question } from '@/types/content';

export const reactQuestions: Question[] = [
  {
    id: 'react-001',
    type: 'flashcard',
    topic: 'react',
    difficulty: 'beginner',
    tags: ['useState', 'hooks'],
    front: 'When does React re-render a component?',
    back: 'React re-renders when:\n1. **State changes** — `setState` or `useState` setter called\n2. **Props change** — parent passes new values\n3. **Context changes** — consumed context value updates\n4. **Parent re-renders** — by default, children re-render too (unless `React.memo`)\n\nRe-render ≠ DOM update. React diffs the virtual DOM and only updates changed real DOM nodes.',
    explanation: 'Understanding re-renders helps you apply React.memo, useMemo, and useCallback only where needed.',
    createdAt: '2024-01-01',
  },
  {
    id: 'react-002',
    type: 'multiple-choice',
    topic: 'react',
    difficulty: 'intermediate',
    tags: ['useEffect', 'dependencies'],
    prompt: 'What happens when you pass an empty array `[]` as the dependency array to `useEffect`?',
    options: [
      { id: 'a', text: 'The effect runs on every render' },
      { id: 'b', text: 'The effect never runs' },
      { id: 'c', text: 'The effect runs once after the initial render' },
      { id: 'd', text: 'The effect runs when the component unmounts' },
    ],
    correctOptionId: 'c',
    timeLimitSeconds: 30,
    explanation: 'An empty dependency array tells React the effect has no reactive dependencies, so it only runs once after the first render — equivalent to componentDidMount. The cleanup function runs on unmount.',
    createdAt: '2024-01-01',
  },
  {
    id: 'react-003',
    type: 'flashcard',
    topic: 'react',
    difficulty: 'intermediate',
    tags: ['useMemo', 'useCallback', 'performance'],
    front: 'What is the difference between `useMemo` and `useCallback`?',
    back: '- **`useMemo`** memoizes a **computed value**:\n```tsx\nconst expensiveValue = useMemo(\n  () => computeExpensive(a, b),\n  [a, b]\n);\n```\n\n- **`useCallback`** memoizes a **function reference**:\n```tsx\nconst handleClick = useCallback(\n  () => doSomething(id),\n  [id]\n);\n```\n\n`useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`.',
    explanation: 'Both prevent unnecessary re-renders. useCallback is mainly useful when passing callbacks to memoized child components.',
    createdAt: '2024-01-01',
  },
  {
    id: 'react-004',
    type: 'multiple-choice',
    topic: 'react',
    difficulty: 'intermediate',
    tags: ['key', 'reconciliation', 'lists'],
    prompt: 'Why should you avoid using array index as the `key` prop in lists?',
    options: [
      { id: 'a', text: 'It causes a syntax error in JSX' },
      { id: 'b', text: 'React doesn\'t allow numeric keys' },
      { id: 'c', text: 'When items are reordered or removed, React may incorrectly reuse DOM nodes leading to stale state' },
      { id: 'd', text: 'It makes the component class-based instead of functional' },
    ],
    correctOptionId: 'c',
    timeLimitSeconds: 30,
    explanation: 'Keys help React identify which items changed. If index is used and items shift (e.g., after deletion), React reuses the wrong DOM node/component state. Use stable, unique IDs instead.',
    createdAt: '2024-01-01',
  },
  {
    id: 'react-005',
    type: 'flashcard',
    topic: 'react',
    difficulty: 'advanced',
    tags: ['useReducer', 'state-management'],
    front: 'When should you use `useReducer` instead of `useState`?',
    back: 'Prefer `useReducer` when:\n- State has **complex logic** or multiple sub-values\n- Next state **depends on previous state** in non-trivial ways\n- Multiple actions affect the same state\n- You want **predictable state transitions** (easy to test)\n\n```tsx\nconst [state, dispatch] = useReducer(reducer, initialState);\ndispatch({ type: "INCREMENT", payload: 1 });\n```\n\n`useState` is fine for simple, independent pieces of state.',
    explanation: 'useReducer follows the Redux pattern — a pure reducer function maps (state, action) → nextState, making transitions explicit and testable.',
    createdAt: '2024-01-01',
  },
  {
    id: 'react-006',
    type: 'coding-challenge',
    topic: 'react',
    difficulty: 'intermediate',
    tags: ['custom-hooks', 'useEffect', 'localStorage'],
    mode: 'complete',
    prompt: 'Implement a `useLocalStorage` hook that syncs state with localStorage.',
    starterCode: `import { useState } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  // Your implementation here
}

// Usage:
// const [name, setName] = useLocalStorage('name', '');`,
    solutionCode: `import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore write errors
    }
  }, [key, value]);

  return [value, setValue] as const;
}`,
    language: 'typescript',
    hints: [
      'Initialize state with a function (lazy initializer) that reads from localStorage',
      'Use useEffect to sync back to localStorage when value changes',
      'Wrap in try/catch — localStorage can throw in private browsing mode',
      'Return `as const` to get a readonly tuple with precise types',
    ],
    explanation: 'Custom hooks encapsulate side effects. The lazy initializer pattern avoids re-reading localStorage on every render.',
    createdAt: '2024-01-01',
  },
  {
    id: 'react-007',
    type: 'multiple-choice',
    topic: 'react',
    difficulty: 'advanced',
    tags: ['React.memo', 'performance', 're-renders'],
    prompt: 'When does `React.memo` still cause a re-render despite memoization?',
    options: [
      { id: 'a', text: 'When the parent re-renders' },
      { id: 'b', text: 'When a prop changes by reference (e.g., a new object/array/function created inline)' },
      { id: 'c', text: 'When the component has internal state changes' },
      { id: 'd', text: 'Both B and C' },
    ],
    correctOptionId: 'd',
    timeLimitSeconds: 30,
    explanation: 'React.memo does shallow comparison of props. New object/array/function references always fail equality. Internal state changes always trigger re-renders regardless of memo. Use useCallback/useMemo for stable references.',
    createdAt: '2024-01-01',
  },
  {
    id: 'react-008',
    type: 'flashcard',
    topic: 'react',
    difficulty: 'intermediate',
    tags: ['useRef', 'refs', 'DOM'],
    front: 'What are the two main uses of `useRef`?',
    back: '1. **DOM access**: Get a reference to a DOM element:\n```tsx\nconst inputRef = useRef<HTMLInputElement>(null);\n<input ref={inputRef} />\ninputRef.current?.focus();\n```\n\n2. **Mutable value without re-render**: Store any mutable value that persists across renders but doesn\'t trigger re-render when changed:\n```tsx\nconst countRef = useRef(0);\ncountRef.current++; // no re-render\n```\n\nUnlike state, mutating `.current` does **not** cause a re-render.',
    explanation: 'useRef is useful for tracking previous values, storing timer IDs, or imperatively controlling DOM elements (focus, scroll, video playback).',
    createdAt: '2024-01-01',
  },
  {
    id: 'react-009',
    type: 'multiple-choice',
    topic: 'react',
    difficulty: 'beginner',
    tags: ['controlled-components', 'forms'],
    prompt: 'What is a controlled component in React?',
    options: [
      { id: 'a', text: 'A component wrapped in React.memo' },
      { id: 'b', text: 'A form element whose value is driven by React state' },
      { id: 'c', text: 'A component that uses Redux for state' },
      { id: 'd', text: 'A component without any props' },
    ],
    correctOptionId: 'b',
    timeLimitSeconds: 30,
    explanation: 'In a controlled component, form data is managed by React state. The input value is set from state, and onChange updates state. In contrast, uncontrolled components use refs to read values from the DOM directly.',
    createdAt: '2024-01-01',
  },
  {
    id: 'react-010',
    type: 'flashcard',
    topic: 'react',
    difficulty: 'advanced',
    tags: ['Suspense', 'lazy', 'code-splitting'],
    front: 'How does React `Suspense` work?',
    back: 'Suspense lets components **declare loading states** for async operations:\n\n```tsx\nimport { lazy, Suspense } from \'react\';\nconst Chart = lazy(() => import(\'./Chart\'));\n\nfunction App() {\n  return (\n    <Suspense fallback={<Spinner />}>\n      <Chart />\n    </Suspense>\n  );\n}\n```\n\nWhen `Chart` is loading, Suspense renders the `fallback`. Works with:\n- `React.lazy` for code splitting\n- Data fetching libraries that integrate with Suspense (React Query, Relay, Next.js)',
    explanation: 'Suspense enables declarative loading states without manual loading flags. Combined with lazy(), it automatically code-splits components.',
    createdAt: '2024-01-01',
  },
  {
    id: 'react-011',
    type: 'coding-challenge',
    topic: 'react',
    difficulty: 'advanced',
    tags: ['forwardRef', 'useImperativeHandle', 'refs'],
    mode: 'read',
    prompt: 'Study this pattern: using `forwardRef` and `useImperativeHandle` to expose an imperative API from a component.',
    starterCode: `import { forwardRef, useRef, useImperativeHandle } from 'react';

interface InputHandle {
  focus(): void;
  clear(): void;
}

const CustomInput = forwardRef<InputHandle, { placeholder?: string }>(
  ({ placeholder }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focus() {
        inputRef.current?.focus();
      },
      clear() {
        if (inputRef.current) inputRef.current.value = '';
      },
    }));

    return <input ref={inputRef} placeholder={placeholder} />;
  }
);

// Usage:
function Form() {
  const inputRef = useRef<InputHandle>(null);
  return (
    <>
      <CustomInput ref={inputRef} placeholder="Type here..." />
      <button onClick={() => inputRef.current?.focus()}>Focus</button>
      <button onClick={() => inputRef.current?.clear()}>Clear</button>
    </>
  );
}`,
    solutionCode: `// This is already the solution — study the pattern above.
// Key points:
// 1. forwardRef wraps the component to accept a ref from the parent
// 2. useImperativeHandle defines what methods are exposed via the ref
// 3. The internal inputRef is kept private inside the component
// 4. TypeScript: InputHandle interface types the ref handle`,
    language: 'typescript',
    hints: [
      'forwardRef allows a parent to pass a ref to a child component',
      'useImperativeHandle customizes what the ref exposes',
      'This pattern is useful for input components, canvas, video players',
    ],
    explanation: 'forwardRef + useImperativeHandle lets you expose a clean imperative API while keeping implementation details private. Prefer this over exposing the raw DOM element.',
    createdAt: '2024-01-01',
  },
];
