import type { Question } from '@/types/content';

export const javascriptFundamentalsQuestions: Question[] = [
  {
    id: 'js-001',
    type: 'flashcard',
    topic: 'javascript-fundamentals',
    difficulty: 'intermediate',
    tags: ['closures', 'scope'],
    front: 'What is a closure in JavaScript?',
    back: 'A closure is a function that retains access to its **outer lexical scope** even after the outer function has returned. The inner function "closes over" the variables in its enclosing scope.\n\n```js\nfunction makeCounter() {\n  let count = 0;\n  return () => ++count;\n}\nconst counter = makeCounter();\ncounter(); // 1\ncounter(); // 2\n```',
    explanation: 'Closures are fundamental to module patterns, currying, memoization, and event handlers in JavaScript.',
    createdAt: '2024-01-01',
  },
  {
    id: 'js-002',
    type: 'multiple-choice',
    topic: 'javascript-fundamentals',
    difficulty: 'beginner',
    tags: ['hoisting', 'var'],
    prompt: 'What does `console.log(x)` output when placed **before** `var x = 5`?',
    options: [
      { id: 'a', text: 'ReferenceError: x is not defined' },
      { id: 'b', text: 'undefined' },
      { id: 'c', text: '5' },
      { id: 'd', text: 'null' },
    ],
    correctOptionId: 'b',
    timeLimitSeconds: 30,
    explanation: '`var` declarations are hoisted to the top of their scope and initialized with `undefined`. Only the declaration is hoisted, not the assignment.',
    createdAt: '2024-01-01',
  },
  {
    id: 'js-003',
    type: 'flashcard',
    topic: 'javascript-fundamentals',
    difficulty: 'intermediate',
    tags: ['event-loop', 'concurrency'],
    front: 'Explain the JavaScript Event Loop.',
    back: 'The event loop continuously checks if the **call stack** is empty, then pushes the next task from the **task queue** (macrotasks) onto the stack. **Microtasks** (Promises, queueMicrotask) run after each task, before the next macrotask.\n\nOrder: synchronous code → microtasks → macrotasks',
    explanation: 'Understanding the event loop explains why setTimeout callbacks run after Promise callbacks even if both are "resolved".',
    createdAt: '2024-01-01',
  },
  {
    id: 'js-004',
    type: 'multiple-choice',
    topic: 'javascript-fundamentals',
    difficulty: 'intermediate',
    tags: ['event-loop', 'promises', 'setTimeout'],
    prompt: 'What is the output order?\n```js\nconsole.log(\'A\');\nsetTimeout(() => console.log(\'B\'), 0);\nPromise.resolve().then(() => console.log(\'C\'));\nconsole.log(\'D\');\n```',
    options: [
      { id: 'a', text: 'A, B, C, D' },
      { id: 'b', text: 'A, D, B, C' },
      { id: 'c', text: 'A, D, C, B' },
      { id: 'd', text: 'A, C, D, B' },
    ],
    correctOptionId: 'c',
    timeLimitSeconds: 45,
    explanation: 'Synchronous code (A, D) runs first, then microtasks like Promise.then (C), then macrotasks like setTimeout (B).',
    createdAt: '2024-01-01',
  },
  {
    id: 'js-005',
    type: 'flashcard',
    topic: 'javascript-fundamentals',
    difficulty: 'intermediate',
    tags: ['this', 'context'],
    front: 'How does `this` behave in arrow functions vs regular functions?',
    back: '**Regular functions**: `this` is determined at **call time** (dynamic binding). It depends on how the function is called.\n\n**Arrow functions**: `this` is **lexically bound** — inherited from the enclosing scope at definition time. Arrow functions have no own `this`.\n\n```js\nconst obj = {\n  name: "Alice",\n  regular() { return this.name; },       // "Alice"\n  arrow: () => this.name,                 // undefined (or global)\n};\n```',
    explanation: 'Arrow functions are ideal for callbacks where you want to preserve the outer `this` (e.g., inside class methods).',
    createdAt: '2024-01-01',
  },
  {
    id: 'js-006',
    type: 'multiple-choice',
    topic: 'javascript-fundamentals',
    difficulty: 'beginner',
    tags: ['let', 'const', 'var', 'scope'],
    prompt: 'Which statement about `let` and `const` is **false**?',
    options: [
      { id: 'a', text: 'Both are block-scoped' },
      { id: 'b', text: 'Both are hoisted but not initialized (TDZ)' },
      { id: 'c', text: 'const prevents reassignment but not mutation' },
      { id: 'd', text: 'let and const are both function-scoped like var' },
    ],
    correctOptionId: 'd',
    timeLimitSeconds: 30,
    explanation: '`let` and `const` are block-scoped, not function-scoped. `var` is function-scoped. All three are hoisted, but `let`/`const` remain in the Temporal Dead Zone until their declaration.',
    createdAt: '2024-01-01',
  },
  {
    id: 'js-007',
    type: 'flashcard',
    topic: 'javascript-fundamentals',
    difficulty: 'intermediate',
    tags: ['prototypes', 'inheritance'],
    front: 'What is prototypal inheritance in JavaScript?',
    back: 'Every JavaScript object has an internal `[[Prototype]]` link. When a property is not found on an object, the engine traverses the **prototype chain** until it finds the property or reaches `null`.\n\n```js\nconst animal = { breathes: true };\nconst dog = Object.create(animal);\ndog.bark = true;\nconsole.log(dog.breathes); // true (from prototype)\n```\n\n`Object.create`, `class extends`, and `new` all set up this chain.',
    explanation: 'ES6 `class` syntax is syntactic sugar over prototypal inheritance — there are no true classes in JavaScript.',
    createdAt: '2024-01-01',
  },
  {
    id: 'js-008',
    type: 'coding-challenge',
    topic: 'javascript-fundamentals',
    difficulty: 'intermediate',
    tags: ['closures', 'functions', 'memoization'],
    mode: 'complete',
    prompt: 'Implement a `memoize` function that caches the result of any function call based on its arguments.',
    starterCode: `function memoize(fn) {
  // Your implementation here
}

// Usage:
const expensiveAdd = memoize((a, b) => {
  console.log('Computing...');
  return a + b;
});
// expensiveAdd(1, 2) → "Computing..." → 3
// expensiveAdd(1, 2) → 3  (cached, no log)`,
    solutionCode: `function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}`,
    language: 'javascript',
    hints: [
      'Use a Map to store cached results with serialized args as the key',
      'Use JSON.stringify(args) to create a cache key from the arguments array',
      'Use fn.apply(this, args) to preserve the `this` context',
    ],
    explanation: 'Memoization uses closures to maintain a persistent cache between calls. It trades memory for computation speed.',
    createdAt: '2024-01-01',
  },
  {
    id: 'js-009',
    type: 'multiple-choice',
    topic: 'javascript-fundamentals',
    difficulty: 'advanced',
    tags: ['WeakMap', 'garbage-collection'],
    prompt: 'What is the key advantage of `WeakMap` over `Map`?',
    options: [
      { id: 'a', text: 'WeakMap is faster for lookups' },
      { id: 'b', text: 'WeakMap keys are weakly held — objects can be garbage collected even if in the map' },
      { id: 'c', text: 'WeakMap allows primitive values as keys' },
      { id: 'd', text: 'WeakMap is iterable like Map' },
    ],
    correctOptionId: 'b',
    timeLimitSeconds: 30,
    explanation: 'WeakMap holds weak references to object keys. If an object has no other references, it can be garbage collected even if it\'s a key in a WeakMap. This prevents memory leaks. WeakMap is not iterable.',
    createdAt: '2024-01-01',
  },
  {
    id: 'js-010',
    type: 'flashcard',
    topic: 'javascript-fundamentals',
    difficulty: 'beginner',
    tags: ['spread', 'rest', 'destructuring'],
    front: 'What is the difference between the spread operator and rest parameters?',
    back: '**Spread** (`...arr`) **expands** an iterable into individual elements:\n```js\nconst a = [1, 2];\nconst b = [...a, 3, 4]; // [1, 2, 3, 4]\nMath.max(...a);          // 2\n```\n\n**Rest** (`...args`) **collects** remaining arguments into an array:\n```js\nfunction sum(first, ...rest) {\n  return rest.reduce((a, b) => a + b, first);\n}\nsum(1, 2, 3, 4); // 10\n```',
    explanation: 'Same syntax, opposite effect: spread expands, rest collects. Rest must be the last parameter.',
    createdAt: '2024-01-01',
  },
  {
    id: 'js-011',
    type: 'coding-challenge',
    topic: 'javascript-fundamentals',
    difficulty: 'advanced',
    tags: ['prototypes', 'inheritance', 'OOP'],
    mode: 'fix',
    prompt: 'The following code has a bug with `this` binding. Fix it so `greet` works correctly when called as a callback.',
    starterCode: `class Person {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return \`Hello, I'm \${this.name}\`;
  }
}

const alice = new Person('Alice');

// BUG: this loses context when passed as callback
const button = { onclick: alice.greet };
console.log(button.onclick()); // Expected: "Hello, I'm Alice"`,
    solutionCode: `class Person {
  constructor(name) {
    this.name = name;
    // Option 1: bind in constructor
    this.greet = this.greet.bind(this);
  }

  greet() {
    return \`Hello, I'm \${this.name}\`;
  }
}

// OR Option 2: use arrow function
class Person2 {
  constructor(name) {
    this.name = name;
  }

  greet = () => \`Hello, I'm \${this.name}\`;
}

const alice = new Person('Alice');
const button = { onclick: alice.greet };
console.log(button.onclick()); // "Hello, I'm Alice"`,
    language: 'javascript',
    hints: [
      'The problem is that `this` is determined by how a function is called, not where it\'s defined',
      'Use .bind(this) in the constructor to permanently bind the method',
      'Alternatively, use an arrow function class field which lexically binds `this`',
    ],
    explanation: 'When a method is detached from its object and called as a standalone function, `this` is no longer bound to the object. Use `.bind()` or arrow functions to fix this.',
    createdAt: '2024-01-01',
  },
  {
    id: 'js-012',
    type: 'multiple-choice',
    topic: 'javascript-fundamentals',
    difficulty: 'intermediate',
    tags: ['array-methods', 'reduce'],
    prompt: 'What does the following code return?\n```js\n[1, 2, 3, 4].reduce((acc, n) => acc + n, 10);\n```',
    options: [
      { id: 'a', text: '10' },
      { id: 'b', text: '20' },
      { id: 'c', text: '15' },
      { id: 'd', text: 'NaN' },
    ],
    correctOptionId: 'b',
    timeLimitSeconds: 30,
    explanation: 'reduce starts with the initial value 10 and accumulates: 10+1=11, 11+2=13, 13+3=16, 16+4=20.',
    createdAt: '2024-01-01',
  },
];
