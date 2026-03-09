import type { Question } from '@/types/content';

export const dataStructuresQuestions: Question[] = [
  {
    id: 'ds-001',
    type: 'flashcard',
    topic: 'data-structures',
    difficulty: 'beginner',
    tags: ['big-o', 'complexity'],
    front: 'What is Big-O notation and what does O(1), O(n), O(n²) mean?',
    back: '**Big-O** describes how an algorithm\'s time (or space) grows relative to input size *n*.\n\n| Notation | Name | Example |\n|----------|------|---------|\n| O(1) | Constant | Array index access |\n| O(log n) | Logarithmic | Binary search |\n| O(n) | Linear | Array scan |\n| O(n log n) | Linearithmic | Merge sort |\n| O(n²) | Quadratic | Nested loops |\n| O(2ⁿ) | Exponential | Recursive Fibonacci |\n\nBig-O expresses the **worst-case upper bound** and drops constants and lower-order terms.',
    explanation: 'Interviewers expect you to state complexity for every algorithm you write or describe.',
    createdAt: '2024-01-01',
  },
  {
    id: 'ds-002',
    type: 'multiple-choice',
    topic: 'data-structures',
    difficulty: 'beginner',
    tags: ['arrays', 'complexity'],
    prompt: 'What is the time complexity of inserting an element at the beginning of a JavaScript array (`arr.unshift(x)`)?',
    options: [
      { id: 'a', text: 'O(1)' },
      { id: 'b', text: 'O(log n)' },
      { id: 'c', text: 'O(n)' },
      { id: 'd', text: 'O(n²)' },
    ],
    correctOptionId: 'c',
    timeLimitSeconds: 25,
    explanation: 'Inserting at the front requires shifting every existing element one position to the right — O(n). Appending with push() is amortized O(1).',
    createdAt: '2024-01-01',
  },
  {
    id: 'ds-003',
    type: 'flashcard',
    topic: 'data-structures',
    difficulty: 'intermediate',
    tags: ['hash-map', 'object'],
    front: 'How does a hash map work, and what are its average-case complexities?',
    back: 'A **hash map** maps keys to values using a hash function:\n1. Hash the key to get an index\n2. Store the value at that index in an underlying array\n3. Handle collisions via chaining (linked list per bucket) or open addressing\n\n**Average-case complexities:**\n- Get: O(1)\n- Set: O(1)\n- Delete: O(1)\n- Has: O(1)\n\n**Worst-case** (all keys hash to same bucket): O(n)\n\nIn JavaScript, plain objects and `Map` are both hash maps. Prefer `Map` when keys are non-string or insertion order matters.',
    explanation: 'Hash maps are the go-to structure for lookup-heavy problems. Know the trade-offs vs. sorted arrays/trees.',
    createdAt: '2024-01-01',
  },
  {
    id: 'ds-004',
    type: 'multiple-choice',
    topic: 'data-structures',
    difficulty: 'intermediate',
    tags: ['stack', 'queue'],
    prompt: 'Which data structure is best for implementing a "back" button in a browser (keeping the history of visited pages)?',
    options: [
      { id: 'a', text: 'Queue (FIFO)' },
      { id: 'b', text: 'Stack (LIFO)' },
      { id: 'c', text: 'Binary search tree' },
      { id: 'd', text: 'Linked list' },
    ],
    correctOptionId: 'b',
    timeLimitSeconds: 25,
    explanation: 'A stack (LIFO — Last In, First Out) is perfect: each new page is pushed onto the history stack; pressing "back" pops the most recent page. Implemented with an array using push/pop in JavaScript.',
    createdAt: '2024-01-01',
  },
  {
    id: 'ds-005',
    type: 'flashcard',
    topic: 'data-structures',
    difficulty: 'intermediate',
    tags: ['linked-list'],
    front: 'What are the trade-offs between a linked list and an array?',
    back: '| Operation | Array | Linked List |\n|-----------|-------|-------------|\n| Index access | O(1) | O(n) |\n| Insert/delete at front | O(n) | O(1) |\n| Insert/delete at back | O(1) amortized | O(1) with tail pointer |\n| Insert/delete middle | O(n) | O(n) to find, O(1) to splice |\n| Memory | Contiguous, cache-friendly | Scattered, pointer overhead |\n\n**Use linked list when:** frequent insert/delete at ends, unknown/dynamic size\n**Use array when:** frequent random access, cache performance matters',
    explanation: 'JavaScript doesn\'t have native linked lists but they appear frequently in interview problems (reversing, detecting cycles, merging sorted lists).',
    createdAt: '2024-01-01',
  },
  {
    id: 'ds-006',
    type: 'coding-challenge',
    topic: 'data-structures',
    difficulty: 'intermediate',
    tags: ['two-pointers', 'array'],
    mode: 'fix',
    prompt: 'This function should find two numbers in a sorted array that sum to a target using two pointers. Fix the bug.',
    starterCode: `function twoSum(nums: number[], target: number): [number, number] | null {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    if (sum < target) right--;   // bug here
    else left++;                 // bug here
  }
  return null;
}`,
    solutionCode: `function twoSum(nums: number[], target: number): [number, number] | null {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;   // sum too small → move left pointer right
    else right--;               // sum too large → move right pointer left
  }
  return null;
}`,
    language: 'typescript',
    hints: [
      'The array is sorted in ascending order',
      'If sum < target, we need a larger number — which pointer should move?',
      'If sum > target, we need a smaller number — which pointer should move?',
      'left++ increases the sum; right-- decreases the sum',
    ],
    explanation: 'Two-pointer technique: when the sum is too small, advance the left pointer to get a larger value; when too large, retreat the right pointer. This gives O(n) time, O(1) space.',
    createdAt: '2024-01-01',
  },
  {
    id: 'ds-007',
    type: 'flashcard',
    topic: 'data-structures',
    difficulty: 'intermediate',
    tags: ['binary-search-tree', 'tree'],
    front: 'What is a Binary Search Tree (BST) and what are its complexities?',
    back: 'A **BST** is a binary tree where:\n- Left child < parent\n- Right child > parent\n- This holds for every node recursively\n\n**Complexities (balanced tree):**\n- Search: O(log n)\n- Insert: O(log n)\n- Delete: O(log n)\n\n**Worst case (degenerate / sorted insertion):** O(n) — tree degrades into a linked list\n\nSelf-balancing variants (AVL, Red-Black) guarantee O(log n) by rebalancing after insert/delete.',
    explanation: 'BSTs enable efficient in-order traversal (sorted output), range queries, and predecessor/successor operations.',
    createdAt: '2024-01-01',
  },
  {
    id: 'ds-008',
    type: 'multiple-choice',
    topic: 'data-structures',
    difficulty: 'advanced',
    tags: ['graph', 'BFS', 'DFS'],
    prompt: 'You need to find the **shortest path** between two nodes in an **unweighted** graph. Which traversal should you use?',
    options: [
      { id: 'a', text: 'Depth-First Search (DFS)' },
      { id: 'b', text: 'Breadth-First Search (BFS)' },
      { id: 'c', text: 'Binary search' },
      { id: 'd', text: 'Either; they give identical results' },
    ],
    correctOptionId: 'b',
    timeLimitSeconds: 30,
    explanation: 'BFS explores nodes level by level (by distance from source), so the first time it reaches the target it has found the shortest path. DFS may find a path but not necessarily the shortest one.',
    createdAt: '2024-01-01',
  },
  {
    id: 'ds-009',
    type: 'coding-challenge',
    topic: 'data-structures',
    difficulty: 'intermediate',
    tags: ['stack', 'recursion'],
    mode: 'complete',
    prompt: 'Implement `isBalanced` to check whether a string\'s brackets are properly matched using a stack.',
    starterCode: `function isBalanced(s: string): boolean {
  const stack: string[] = [];
  const pairs: Record<string, string> = {
    ')': '(',
    ']': '[',
    '}': '{',
  };

  for (const char of s) {
    // Your implementation here
  }

  return stack.length === 0;
}`,
    solutionCode: `function isBalanced(s: string): boolean {
  const stack: string[] = [];
  const pairs: Record<string, string> = {
    ')': '(',
    ']': '[',
    '}': '{',
  };

  for (const char of s) {
    if ('([{'.includes(char)) {
      stack.push(char);
    } else if (pairs[char] !== undefined) {
      if (stack.pop() !== pairs[char]) return false;
    }
  }

  return stack.length === 0;
}`,
    language: 'typescript',
    hints: [
      'Push opening brackets onto the stack',
      'When you see a closing bracket, pop from the stack and check if it matches',
      'If pop returns undefined or the wrong bracket, the string is unbalanced',
      'After the loop, the stack must be empty for a balanced string',
    ],
    explanation: 'Classic stack problem: opening brackets are pushed, closing brackets must match the most-recently-pushed opener. Time O(n), space O(n).',
    createdAt: '2024-01-01',
  },
  {
    id: 'ds-010',
    type: 'flashcard',
    topic: 'data-structures',
    difficulty: 'advanced',
    tags: ['dynamic-programming', 'memoization'],
    front: 'What is dynamic programming and when should you use it?',
    back: '**Dynamic programming (DP)** solves problems by breaking them into overlapping subproblems and storing results to avoid redundant computation.\n\n**Two approaches:**\n- **Top-down (memoization)**: Recursion + cache. Natural to write.\n- **Bottom-up (tabulation)**: Build solution iteratively from base cases.\n\n**Use DP when:**\n1. Problem has **optimal substructure** (optimal solution built from optimal sub-solutions)\n2. Subproblems **overlap** (same subproblem solved multiple times)\n\n**Classic problems:** Fibonacci, knapsack, longest common subsequence, coin change, edit distance.',
    explanation: 'Without memoization, naive recursive Fibonacci is O(2ⁿ). With it: O(n). Recognizing the "overlapping subproblems" pattern is the key interview skill.',
    createdAt: '2024-01-01',
  },
  {
    id: 'ds-011',
    type: 'multiple-choice',
    topic: 'data-structures',
    difficulty: 'intermediate',
    tags: ['heap', 'priority-queue'],
    prompt: 'What data structure efficiently supports "always get the minimum element" in O(log n) time?',
    options: [
      { id: 'a', text: 'Sorted array' },
      { id: 'b', text: 'Hash map' },
      { id: 'c', text: 'Min-heap (priority queue)' },
      { id: 'd', text: 'Stack' },
    ],
    correctOptionId: 'c',
    timeLimitSeconds: 25,
    explanation: 'A min-heap keeps the minimum at the root and supports O(log n) insert and O(log n) extract-min. A sorted array gives O(1) min access but O(n) insert. Heaps are used in Dijkstra\'s algorithm, scheduling, and k-way merge.',
    createdAt: '2024-01-01',
  },
  {
    id: 'ds-012',
    type: 'flashcard',
    topic: 'data-structures',
    difficulty: 'beginner',
    tags: ['recursion', 'base-case'],
    front: 'What are the two required parts of every recursive function?',
    back: '1. **Base case** — the terminating condition that stops recursion:\n```js\nif (n <= 1) return n;\n```\n\n2. **Recursive case** — the step that reduces the problem toward the base case:\n```js\nreturn n * factorial(n - 1);\n```\n\nWithout a base case: infinite recursion → stack overflow.\nWithout progress toward the base case: same result.\n\n**Call stack depth** is typically O(n) for linear recursion. Deep recursion on large inputs requires converting to iteration or using tail-call optimization.',
    explanation: 'Every recursive function can be rewritten iteratively. Interviewers often ask for both versions.',
    createdAt: '2024-01-01',
  },
];
