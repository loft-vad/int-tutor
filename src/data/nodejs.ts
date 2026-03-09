import type { Question } from '@/types/content';

export const nodejsQuestions: Question[] = [
  {
    id: 'node-001',
    type: 'flashcard',
    topic: 'nodejs',
    difficulty: 'intermediate',
    tags: ['event-loop', 'libuv', 'phases'],
    front: 'What are the phases of the Node.js event loop?',
    back: 'The Node.js event loop runs in phases (in order):\n\n1. **timers** — setTimeout, setInterval callbacks\n2. **pending callbacks** — I/O errors deferred\n3. **idle/prepare** — internal use\n4. **poll** — retrieve I/O events; execute I/O callbacks\n5. **check** — setImmediate callbacks\n6. **close callbacks** — e.g., socket.on("close")\n\nBetween each phase: **process.nextTick** and **Promise microtasks** run.',
    explanation: 'setImmediate runs in the check phase (after poll), while setTimeout(fn, 0) runs in the timers phase. process.nextTick runs before any I/O phase.',
    createdAt: '2024-01-01',
  },
  {
    id: 'node-002',
    type: 'multiple-choice',
    topic: 'nodejs',
    difficulty: 'intermediate',
    tags: ['process.nextTick', 'setImmediate', 'event-loop'],
    prompt: 'What is the execution order?\n```js\nsetImmediate(() => console.log("setImmediate"));\nprocess.nextTick(() => console.log("nextTick"));\nPromise.resolve().then(() => console.log("promise"));\nconsole.log("sync");\n```',
    options: [
      { id: 'a', text: 'sync → nextTick → promise → setImmediate' },
      { id: 'b', text: 'sync → promise → nextTick → setImmediate' },
      { id: 'c', text: 'sync → setImmediate → nextTick → promise' },
      { id: 'd', text: 'nextTick → sync → promise → setImmediate' },
    ],
    correctOptionId: 'a',
    timeLimitSeconds: 30,
    explanation: 'Synchronous code runs first, then process.nextTick queue, then Promise microtasks (both run before I/O), then setImmediate (check phase).',
    createdAt: '2024-01-01',
  },
  {
    id: 'node-003',
    type: 'flashcard',
    topic: 'nodejs',
    difficulty: 'intermediate',
    tags: ['streams', 'backpressure'],
    front: 'What is backpressure in Node.js streams?',
    back: 'Backpressure occurs when a **writable stream** cannot process data as fast as the **readable stream** produces it, causing memory buildup.\n\nThe `pipe` method handles backpressure automatically by pausing the readable when the writable is full:\n\n```js\nreadable.pipe(writable); // automatic backpressure\n```\n\nWith manual handling:\n```js\nif (!writable.write(chunk)) {\n  readable.pause(); // pause until drain\n  writable.once("drain", () => readable.resume());\n}\n```',
    explanation: 'Backpressure is critical for memory efficiency when processing large files or streams. Always use pipe() or async iteration.',
    createdAt: '2024-01-01',
  },
  {
    id: 'node-004',
    type: 'multiple-choice',
    topic: 'nodejs',
    difficulty: 'beginner',
    tags: ['require', 'ES-modules', 'import'],
    prompt: 'What is the key difference between CommonJS `require()` and ES Module `import`?',
    options: [
      { id: 'a', text: 'require() is synchronous; import is asynchronous (static analysis at compile time)' },
      { id: 'b', text: 'require() only works in browsers; import works in Node.js' },
      { id: 'c', text: 'import is faster because it uses binary format' },
      { id: 'd', text: 'There is no difference, they are interchangeable' },
    ],
    correctOptionId: 'a',
    timeLimitSeconds: 30,
    explanation: 'require() loads modules synchronously at runtime. ES Module imports are statically analyzed at parse time, enabling tree-shaking and top-level await. ES Modules are the standard; use them in new projects.',
    createdAt: '2024-01-01',
  },
  {
    id: 'node-005',
    type: 'flashcard',
    topic: 'nodejs',
    difficulty: 'intermediate',
    tags: ['EventEmitter', 'events', 'pub-sub'],
    front: 'How does Node.js EventEmitter work?',
    back: 'EventEmitter implements the Observer/pub-sub pattern:\n\n```js\nconst { EventEmitter } = require("events");\nconst emitter = new EventEmitter();\n\n// Subscribe\nemitter.on("data", (chunk) => console.log(chunk));\nemitter.once("end", () => console.log("done")); // fires once\n\n// Publish\nemitter.emit("data", Buffer.from("hello"));\nemitter.emit("end");\n```\n\nMax listeners default is 10 (prevents memory leak warnings). Use `emitter.setMaxListeners(n)` or `Infinity` for known cases.',
    explanation: 'Most of Node.js (streams, HTTP, sockets) extends EventEmitter. Unhandled "error" events throw — always attach an error listener.',
    createdAt: '2024-01-01',
  },
  {
    id: 'node-006',
    type: 'coding-challenge',
    topic: 'nodejs',
    difficulty: 'intermediate',
    tags: ['streams', 'pipeline', 'transform'],
    mode: 'read',
    prompt: 'Study this pattern: using Node.js streams with `pipeline` to process a file efficiently without loading it all into memory.',
    starterCode: `const { pipeline } = require('stream/promises');
const { createReadStream, createWriteStream } = require('fs');
const { createGzip } = require('zlib');

async function compressFile(src, dest) {
  await pipeline(
    createReadStream(src),      // Readable: reads file chunks
    createGzip(),               // Transform: compresses each chunk
    createWriteStream(dest)     // Writable: writes compressed chunks
  );
  console.log(\`Compressed \${src} → \${dest}\`);
}

// This handles backpressure automatically and
// cleans up all streams on error or completion.
compressFile('large-file.log', 'large-file.log.gz');`,
    solutionCode: `// Same as starter — this is the correct pattern.
// Key points:
// - pipeline() is the modern replacement for .pipe() chains
// - It propagates errors and destroys all streams on failure
// - Each stream processes chunks without loading the full file
// - Memory usage stays constant regardless of file size`,
    language: 'javascript',
    hints: [
      'stream/promises provides a promisified pipeline()',
      'pipeline() properly handles error propagation unlike .pipe()',
      'Transform streams sit between readable and writable — they receive and emit chunks',
    ],
    explanation: 'Stream pipelines let you process files of any size with bounded memory. pipeline() is preferred over .pipe() because it handles errors across all streams.',
    createdAt: '2024-01-01',
  },
  {
    id: 'node-007',
    type: 'multiple-choice',
    topic: 'nodejs',
    difficulty: 'advanced',
    tags: ['worker_threads', 'cluster', 'CPU-bound'],
    prompt: 'When should you use `worker_threads` vs `cluster` module in Node.js?',
    options: [
      { id: 'a', text: 'worker_threads for CPU-bound work; cluster for scaling HTTP servers across CPU cores' },
      { id: 'b', text: 'They are identical, use either one' },
      { id: 'c', text: 'cluster for CPU-bound; worker_threads for I/O-bound' },
      { id: 'd', text: 'cluster is deprecated; always use worker_threads' },
    ],
    correctOptionId: 'a',
    timeLimitSeconds: 30,
    explanation: 'worker_threads share memory (SharedArrayBuffer) and are ideal for CPU-intensive tasks (image processing, crypto). cluster forks processes and distributes incoming connections — ideal for HTTP server scaling across cores.',
    createdAt: '2024-01-01',
  },
  {
    id: 'node-008',
    type: 'flashcard',
    topic: 'nodejs',
    difficulty: 'beginner',
    tags: ['Buffer', 'encoding', 'binary'],
    front: 'What is a Node.js Buffer and when do you use it?',
    back: 'A `Buffer` is a **fixed-size raw binary data** store outside V8\'s heap, used when working with:\n- File I/O (reading binary files)\n- Network streams\n- Cryptography\n- Image/video processing\n\n```js\nconst buf = Buffer.from("Hello", "utf8");\nconsole.log(buf); // <Buffer 48 65 6c 6c 6f>\nconsole.log(buf.toString("base64")); // "SGVsbG8="\nconsole.log(buf.length); // 5 (bytes)\n```\n\nDo not use `new Buffer()` (deprecated) — use `Buffer.from()`, `Buffer.alloc()`.',
    explanation: 'Strings in JavaScript are UTF-16, but network protocols often use binary/UTF-8. Buffers bridge this gap without encoding/decoding overhead.',
    createdAt: '2024-01-01',
  },
  {
    id: 'node-009',
    type: 'coding-challenge',
    topic: 'nodejs',
    difficulty: 'intermediate',
    tags: ['http', 'server', 'routing'],
    mode: 'complete',
    prompt: 'Complete this minimal HTTP server that routes GET /users and GET /health.',
    starterCode: `const http = require('http');

const server = http.createServer((req, res) => {
  // Handle routes:
  // GET /health → 200 { status: "ok" }
  // GET /users → 200 [{ id: 1, name: "Alice" }]
  // anything else → 404 { error: "Not found" }
});

server.listen(3000, () => console.log('Listening on :3000'));`,
    solutionCode: `const http = require('http');

const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok' }));
  } else if (req.method === 'GET' && req.url === '/users') {
    res.writeHead(200);
    res.end(JSON.stringify(users));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(3000, () => console.log('Listening on :3000'));`,
    language: 'javascript',
    hints: [
      'Check req.method and req.url to route requests',
      'Set Content-Type header before calling writeHead',
      'Use res.writeHead(statusCode) to set the status',
      'res.end() sends the response body as a string',
    ],
    explanation: 'Node\'s http module is low-level. In production use Express or Fastify, but understanding raw http.createServer() is important for interviews.',
    createdAt: '2024-01-01',
  },
  {
    id: 'node-010',
    type: 'multiple-choice',
    topic: 'nodejs',
    difficulty: 'intermediate',
    tags: ['process', 'environment', 'signals'],
    prompt: 'How do you handle graceful shutdown in a Node.js server?',
    options: [
      { id: 'a', text: 'process.exit(0) immediately when receiving SIGTERM' },
      { id: 'b', text: 'Listen for SIGTERM/SIGINT, stop accepting new connections, wait for existing ones to finish' },
      { id: 'c', text: 'Use cluster.disconnect()' },
      { id: 'd', text: 'Node.js handles graceful shutdown automatically' },
    ],
    correctOptionId: 'b',
    timeLimitSeconds: 30,
    explanation: 'Graceful shutdown: 1) stop accepting new requests (server.close()), 2) wait for in-flight requests to complete, 3) close database connections, 4) process.exit(). This prevents data loss and incomplete transactions.',
    createdAt: '2024-01-01',
  },
];
