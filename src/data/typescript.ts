import type { Question } from '@/types/content';

export const typescriptQuestions: Question[] = [
  {
    id: 'ts-001',
    type: 'flashcard',
    topic: 'typescript',
    difficulty: 'beginner',
    tags: ['type-inference', 'basics'],
    front: 'What is TypeScript\'s type inference?',
    back: 'TypeScript **automatically infers types** from values without explicit annotations:\n\n```ts\nlet name = "Alice";       // inferred: string\nlet count = 0;            // inferred: number\nconst arr = [1, 2, 3];    // inferred: number[]\n\nfunction add(a: number, b: number) {\n  return a + b; // inferred return: number\n}\n```\n\nTypeScript is "structurally typed" — if it looks like a duck, it is a duck.',
    explanation: 'Rely on inference where possible; annotate function parameters and return types for public APIs.',
    createdAt: '2024-01-01',
  },
  {
    id: 'ts-002',
    type: 'multiple-choice',
    topic: 'typescript',
    difficulty: 'intermediate',
    tags: ['generics', 'type-parameters'],
    prompt: 'What does this function signature mean?\n```ts\nfunction identity<T>(arg: T): T\n```',
    options: [
      { id: 'a', text: 'The function takes and returns any value' },
      { id: 'b', text: 'The return type is always the same as the input type, preserving type information' },
      { id: 'c', text: 'T must be a string' },
      { id: 'd', text: 'The function only works with objects' },
    ],
    correctOptionId: 'b',
    timeLimitSeconds: 30,
    explanation: 'Generics let you write type-safe code that works with any type. Unlike `any`, generics preserve the specific type so TypeScript knows the return type matches the input.',
    createdAt: '2024-01-01',
  },
  {
    id: 'ts-003',
    type: 'flashcard',
    topic: 'typescript',
    difficulty: 'intermediate',
    tags: ['utility-types', 'Partial', 'Required', 'Pick', 'Omit'],
    front: 'What are the common TypeScript utility types?',
    back: '- `Partial<T>` — all properties optional\n- `Required<T>` — all properties required\n- `Pick<T, K>` — keep only keys K\n- `Omit<T, K>` — remove keys K\n- `Record<K, V>` — object type with keys K and values V\n- `Readonly<T>` — all properties readonly\n- `ReturnType<T>` — extract return type of a function\n- `Parameters<T>` — extract parameter types as tuple\n- `NonNullable<T>` — remove null/undefined',
    explanation: 'Utility types let you transform existing types rather than redefining them, reducing duplication.',
    createdAt: '2024-01-01',
  },
  {
    id: 'ts-004',
    type: 'multiple-choice',
    topic: 'typescript',
    difficulty: 'intermediate',
    tags: ['type-narrowing', 'type-guards'],
    prompt: 'Which is the correct way to narrow a union type `string | number` to `string`?',
    options: [
      { id: 'a', text: '`if (value.isString())`' },
      { id: 'b', text: '`if (value as string)`' },
      { id: 'c', text: '`if (typeof value === "string")`' },
      { id: 'd', text: '`if (value instanceof String)`' },
    ],
    correctOptionId: 'c',
    timeLimitSeconds: 30,
    explanation: 'TypeScript uses control flow analysis to narrow types. `typeof` checks narrow primitive unions. `instanceof` narrows class instances. Type assertions (`as`) bypass narrowing without checking.',
    createdAt: '2024-01-01',
  },
  {
    id: 'ts-005',
    type: 'flashcard',
    topic: 'typescript',
    difficulty: 'advanced',
    tags: ['discriminated-unions', 'pattern-matching'],
    front: 'What is a discriminated union in TypeScript?',
    back: 'A union of types that each have a **common literal property** (the discriminant) allowing TypeScript to narrow the type:\n\n```ts\ntype Shape =\n  | { kind: "circle"; radius: number }\n  | { kind: "square"; side: number };\n\nfunction area(s: Shape): number {\n  switch (s.kind) {\n    case "circle": return Math.PI * s.radius ** 2;\n    case "square": return s.side ** 2;\n  }\n}\n```\n\nTypeScript knows `s.radius` is only available when `kind === "circle"`.',
    explanation: 'Discriminated unions are the TypeScript-idiomatic way to model algebraic data types. Prefer them over class hierarchies for data modeling.',
    createdAt: '2024-01-01',
  },
  {
    id: 'ts-006',
    type: 'coding-challenge',
    topic: 'typescript',
    difficulty: 'advanced',
    tags: ['generics', 'mapped-types', 'utility-types'],
    mode: 'complete',
    prompt: 'Implement a generic `DeepReadonly<T>` type that makes all nested properties readonly.',
    starterCode: `// Make all nested properties readonly
type DeepReadonly<T> = // your implementation here

// Test:
type Config = {
  server: { host: string; port: number };
  db: { url: string; name: string };
};

type ReadonlyConfig = DeepReadonly<Config>;
// ReadonlyConfig.server.host should be readonly`,
    solutionCode: `type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

type Config = {
  server: { host: string; port: number };
  db: { url: string; name: string };
};

type ReadonlyConfig = DeepReadonly<Config>;
// All nested properties are now readonly`,
    language: 'typescript',
    hints: [
      'Use a mapped type: `{ readonly [K in keyof T]: ... }`',
      'For object properties, recursively apply DeepReadonly',
      'Use a conditional type to check if a property is an object: `T[K] extends object ? ... : T[K]`',
    ],
    explanation: 'Mapped types let you transform every property of a type. Recursive conditional types enable deep transformations.',
    createdAt: '2024-01-01',
  },
  {
    id: 'ts-007',
    type: 'multiple-choice',
    topic: 'typescript',
    difficulty: 'advanced',
    tags: ['infer', 'conditional-types'],
    prompt: 'What does `infer` do in TypeScript conditional types?',
    options: [
      { id: 'a', text: 'Forces TypeScript to infer a type automatically' },
      { id: 'b', text: 'Declares a type variable to be captured within a conditional type pattern' },
      { id: 'c', text: 'Marks a type as inferred from runtime values' },
      { id: 'd', text: 'Only works with function types' },
    ],
    correctOptionId: 'b',
    timeLimitSeconds: 30,
    explanation: '`infer R` in `T extends (...args: any) => infer R ? R : never` captures the return type into variable R. It\'s used to extract parts of a type pattern.',
    createdAt: '2024-01-01',
  },
  {
    id: 'ts-008',
    type: 'flashcard',
    topic: 'typescript',
    difficulty: 'intermediate',
    tags: ['satisfies', 'type-checking'],
    front: 'What does the `satisfies` operator do in TypeScript 4.9+?',
    back: 'The `satisfies` operator validates that an expression matches a type **without widening** the type:\n\n```ts\ntype Color = "red" | "green" | "blue";\ntype Palette = Record<string, Color | [number, number, number]>;\n\n// satisfies checks the type but keeps narrow inference\nconst palette = {\n  red: [255, 0, 0],\n  green: "green",\n} satisfies Palette;\n\npalette.red[0]; // ✅ still typed as number[] (not widened)\npalette.green.toUpperCase(); // ✅ still typed as string\n```',
    explanation: '`satisfies` is preferable to type annotation when you want type-checking without losing precise literal/tuple types.',
    createdAt: '2024-01-01',
  },
  {
    id: 'ts-009',
    type: 'multiple-choice',
    topic: 'typescript',
    difficulty: 'intermediate',
    tags: ['interface', 'type-alias', 'difference'],
    prompt: 'Which is **only possible with `interface`** and not `type` alias?',
    options: [
      { id: 'a', text: 'Extending another type' },
      { id: 'b', text: 'Declaration merging (extending across files)' },
      { id: 'c', text: 'Describing function types' },
      { id: 'd', text: 'Using generics' },
    ],
    correctOptionId: 'b',
    timeLimitSeconds: 30,
    explanation: 'Interfaces support declaration merging — multiple declarations with the same name are merged. This is used by libraries to let users augment types. Type aliases cannot be merged.',
    createdAt: '2024-01-01',
  },
  {
    id: 'ts-010',
    type: 'coding-challenge',
    topic: 'typescript',
    difficulty: 'intermediate',
    tags: ['generics', 'type-safety'],
    mode: 'fix',
    prompt: 'Fix the type errors in this generic function that extracts a property from an array of objects.',
    starterCode: `function pluck(arr, key) {
  return arr.map(item => item[key]);
}

const users = [{ name: "Alice", age: 30 }, { name: "Bob", age: 25 }];
const names = pluck(users, "name"); // should be string[]`,
    solutionCode: `function pluck<T, K extends keyof T>(arr: T[], key: K): T[K][] {
  return arr.map(item => item[key]);
}

const users = [{ name: "Alice", age: 30 }, { name: "Bob", age: 25 }];
const names = pluck(users, "name");   // string[]
const ages = pluck(users, "age");     // number[]
// pluck(users, "invalid"); // ❌ TypeScript error`,
    language: 'typescript',
    hints: [
      'Use two type parameters: T for the array element type, K for the key',
      'Constrain K with `extends keyof T` to only allow valid keys',
      'The return type is `T[K][]` — an array of the property value type',
    ],
    explanation: 'Using `K extends keyof T` creates a constraint that ensures only valid property names are accepted, and `T[K]` gives you the exact return type.',
    createdAt: '2024-01-01',
  },
  {
    id: 'ts-011',
    type: 'flashcard',
    topic: 'typescript',
    difficulty: 'advanced',
    tags: ['template-literal-types'],
    front: 'What are template literal types in TypeScript?',
    back: 'Template literal types let you create new string types by combining existing ones:\n\n```ts\ntype Greeting = `Hello, ${string}`;\ntype EventName = "click" | "focus" | "blur";\ntype Handler = `on${Capitalize<EventName>}`;\n// "onClick" | "onFocus" | "onBlur"\n\ntype CSSProperty = `${string}-${string}`;\n// matches "background-color", "font-size", etc.\n```',
    explanation: 'Template literal types are powerful for creating type-safe string unions, useful for event names, CSS properties, route paths, etc.',
    createdAt: '2024-01-01',
  },
];
