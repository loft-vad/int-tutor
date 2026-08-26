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
  {
    id: 'node-011',
    type: 'flashcard',
    topic: 'nodejs',
    difficulty: 'intermediate',
    tags: ['express', 'middleware', 'koa'],
    front: 'Explain the Express/Koa middleware pattern. How does `next()` work?',
    back: 'Middleware functions execute in order, each receiving `(req, res, next)` (Express) or `(ctx, next)` (Koa). Calling `next()` passes control to the next middleware.\n\n**Express** — linear pipeline:\n```js\napp.use((req, res, next) => {\n  console.log("before");\n  next();          // pass to next middleware\n  // code here runs after downstream middleware\n});\n```\n\n**Koa** — "onion" model with async/await:\n```js\napp.use(async (ctx, next) => {\n  console.log("before");\n  await next();   // downstream\n  console.log("after"); // runs on the way back up\n});\n```\n\nIf `next()` is not called, the chain stops. Error-handling middleware in Express takes 4 args: `(err, req, res, next)`.',
    explanation: 'Middleware is the backbone of Express/Koa. Understanding the execution order and error propagation is essential for building maintainable APIs.',
    createdAt: '2024-01-01',
  },
  {
    id: 'node-012',
    type: 'multiple-choice',
    topic: 'nodejs',
    difficulty: 'intermediate',
    tags: ['error-handling', 'uncaughtException', 'unhandledRejection'],
    prompt: 'What is the recommended way to handle `unhandledRejection` in a production Node.js app?',
    options: [
      { id: 'a', text: 'Ignore it — Node.js handles unhandled rejections automatically' },
      { id: 'b', text: 'Log the error and continue processing requests normally' },
      { id: 'c', text: 'Log the error, clean up resources, and exit the process (let a process manager restart it)' },
      { id: 'd', text: 'Wrap every single function in a try-catch block' },
    ],
    correctOptionId: 'c',
    timeLimitSeconds: 30,
    explanation: 'Unhandled rejections indicate unknown application state. Best practice: log the error with stack trace, close open connections gracefully, then exit. A process manager (PM2, systemd) restarts the process. Since Node.js 15+, unhandled rejections throw by default.',
    createdAt: '2024-01-01',
  },
  {
    id: 'node-013',
    type: 'flashcard',
    topic: 'nodejs',
    difficulty: 'intermediate',
    tags: ['security', 'helmet', 'cors', 'validation'],
    front: 'What are key security practices for a Node.js HTTP server?',
    back: '1. **Helmet** — sets security headers (X-Content-Type-Options, Strict-Transport-Security, CSP, etc.)\n```js\napp.use(helmet());\n```\n\n2. **CORS** — restrict which origins can call your API\n```js\napp.use(cors({ origin: "https://myapp.com" }));\n```\n\n3. **Input validation** — never trust user input; use zod, joi, or express-validator\n```js\nconst schema = z.object({ email: z.string().email() });\nschema.parse(req.body); // throws on invalid\n```\n\n4. **Rate limiting** — prevent brute-force/DDoS (`express-rate-limit`)\n5. **Parameterized queries** — prevent SQL/NoSQL injection\n6. **Keep dependencies updated** — run `npm audit` regularly\n7. **Never expose stack traces** in production error responses',
    explanation: 'Security is not optional. These practices form the baseline for any production Node.js API. Helmet alone sets 11+ security headers with one line.',
    createdAt: '2024-01-01',
  },
  {
    id: 'node-014',
    type: 'multiple-choice',
    topic: 'nodejs',
    difficulty: 'advanced',
    tags: ['performance', 'memory-leak', 'heap-snapshot', 'profiling'],
    prompt: 'How do you diagnose a memory leak in a Node.js application?',
    options: [
      { id: 'a', text: 'Increase the heap size with --max-old-space-size and hope it goes away' },
      { id: 'b', text: 'Take heap snapshots at intervals using --inspect or v8.writeHeapSnapshot(), compare them in Chrome DevTools to find growing objects' },
      { id: 'c', text: 'Restart the server every hour with a cron job' },
      { id: 'd', text: 'Use console.log to print memory usage and read the logs manually' },
    ],
    correctOptionId: 'b',
    timeLimitSeconds: 30,
    explanation: 'Heap snapshots (v8.writeHeapSnapshot() or Chrome DevTools via --inspect) let you compare allocations over time. Objects that grow between snapshots are likely leaks. Common causes: unbounded caches, event listeners not removed, closures holding references, and global variables.',
    createdAt: '2024-01-01',
  },
  {
    id: 'node-015',
    type: 'flashcard',
    topic: 'nodejs',
    difficulty: 'beginner',
    tags: ['package-management', 'package-json', 'lockfile', 'semver'],
    front: 'What is the role of `package-lock.json` and how does semver work in `package.json`?',
    back: '**package-lock.json** locks the exact dependency tree (including transitive deps) so every install produces identical `node_modules/`.\n\n**Semver** — `MAJOR.MINOR.PATCH`:\n- `^1.2.3` — allows `>=1.2.3 <2.0.0` (minor + patch updates)\n- `~1.2.3` — allows `>=1.2.3 <1.3.0` (patch updates only)\n- `1.2.3` — exact version\n\n**Rules:**\n- Always commit `package-lock.json` to source control\n- Use `npm ci` in CI/CD (installs from lockfile, faster, deterministic)\n- Run `npm audit` to check for known vulnerabilities\n- Use `npm outdated` to see available updates',
    explanation: 'Without a lockfile, different developers or CI environments might get different dependency versions, leading to "works on my machine" bugs.',
    createdAt: '2024-01-01',
  },
  {
    id: 'node-016',
    type: 'coding-challenge',
    topic: 'nodejs',
    difficulty: 'intermediate',
    tags: ['testing', 'jest', 'supertest', 'mocking'],
    mode: 'complete',
    prompt: 'Complete the Jest test that uses supertest to test an Express API endpoint. The app has a GET /api/users route that returns a JSON array of users.',
    starterCode: `const request = require('supertest');
const app = require('./app'); // Express app (not listening)

describe('GET /api/users', () => {
  it('should return 200 and a list of users', async () => {
    // Use supertest to make a GET request
    // Assert status is 200
    // Assert body is an array with length > 0
    // Assert each user has an 'id' and 'name' property
  });
});`,
    solutionCode: `const request = require('supertest');
const app = require('./app');

describe('GET /api/users', () => {
  it('should return 200 and a list of users', async () => {
    const res = await request(app).get('/api/users');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach((user) => {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
    });
  });
});`,
    language: 'javascript',
    hints: [
      'supertest wraps the app — call request(app).get(path)',
      'The response object has status, headers, and body properties',
      'Use expect(Array.isArray(res.body)).toBe(true) to check for array',
      'Use toHaveProperty to check object keys',
    ],
    explanation: 'Supertest binds to a random port, so you export the Express app without calling .listen(). This allows parallel test execution without port conflicts. Always test status codes, content type, and response shape.',
    createdAt: '2024-01-01',
  },
  {
    id: 'node-017',
    type: 'flashcard',
    topic: 'nodejs',
    difficulty: 'intermediate',
    tags: ['rest-api', 'design-patterns', 'http-methods'],
    front: 'What are the key principles of RESTful API design in Node.js?',
    back: '1. **Use nouns, not verbs** — `/users`, not `/getUsers`\n2. **HTTP methods map to CRUD:**\n   - `GET /users` — list\n   - `GET /users/:id` — read one\n   - `POST /users` — create\n   - `PUT /users/:id` — full update\n   - `PATCH /users/:id` — partial update\n   - `DELETE /users/:id` — remove\n3. **Status codes** — 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 404 Not Found, 422 Unprocessable Entity, 500 Internal Server Error\n4. **Pagination** — `?page=2&limit=20` or cursor-based\n5. **Versioning** — `/api/v1/users`\n6. **Filtering/sorting** — `?sort=-createdAt&status=active`\n7. **HATEOAS** — include links to related resources (optional but ideal)',
    explanation: 'RESTful conventions make your API predictable and self-documenting. Consistency in URL structure and status codes reduces integration friction.',
    createdAt: '2024-01-01',
  },
  {
    id: 'node-018',
    type: 'multiple-choice',
    topic: 'nodejs',
    difficulty: 'intermediate',
    tags: ['authentication', 'jwt', 'sessions'],
    prompt: 'What is a key difference between JWT-based and session-based authentication?',
    options: [
      { id: 'a', text: 'JWTs are stored on the server; sessions are stored on the client' },
      { id: 'b', text: 'JWTs are stateless (the token contains the claims); sessions store state on the server (e.g., in Redis)' },
      { id: 'c', text: 'Sessions are more scalable because they have no server storage' },
      { id: 'd', text: 'JWTs cannot expire, while sessions always expire' },
    ],
    correctOptionId: 'b',
    timeLimitSeconds: 30,
    explanation: 'JWTs encode user claims in the token itself (stateless) — no server lookup needed, but they cannot be individually revoked without a blocklist. Sessions store a session ID in a cookie and keep data server-side (Redis/DB) — easy to revoke but require shared storage for horizontal scaling.',
    createdAt: '2024-01-01',
  },
  {
    id: 'node-019',
    type: 'flashcard',
    topic: 'nodejs',
    difficulty: 'intermediate',
    tags: ['database', 'connection-pooling', 'orm'],
    front: 'Why use connection pooling for database access in Node.js, and how do ORMs help?',
    back: '**Connection pooling** reuses a fixed set of database connections instead of opening/closing per request:\n```js\nconst pool = new Pool({\n  host: "localhost",\n  max: 20,          // max connections in pool\n  idleTimeoutMillis: 30000,\n});\nconst { rows } = await pool.query("SELECT * FROM users");\n```\n\n**Why?**\n- Creating a TCP + TLS connection per query is slow (~50ms)\n- Pools keep warm connections ready (~1ms)\n- Prevents overwhelming the database with too many connections\n\n**ORMs** (Prisma, Drizzle, Sequelize, TypeORM) provide:\n- Schema definition & migrations\n- Type-safe queries (especially Prisma/Drizzle)\n- Built-in connection pooling\n- Protection against SQL injection via parameterized queries',
    explanation: 'Always use connection pooling in production. Without it, each request opens a new connection, leading to connection exhaustion under load.',
    createdAt: '2024-01-01',
  },
  {
    id: 'node-020',
    type: 'coding-challenge',
    topic: 'nodejs',
    difficulty: 'intermediate',
    tags: ['child-process', 'exec', 'spawn', 'fork'],
    mode: 'read',
    prompt: 'Study the differences between `exec`, `spawn`, and `fork` for running child processes in Node.js.',
    starterCode: `const { exec, spawn, fork } = require('child_process');

// exec — buffers entire output, runs in shell, good for short commands
exec('ls -la', (err, stdout, stderr) => {
  if (err) throw err;
  console.log(stdout); // entire output as string
});

// spawn — streams output, no shell by default, good for long-running processes
const child = spawn('find', ['.', '-name', '*.js']);
child.stdout.on('data', (chunk) => {
  console.log(\`chunk: \${chunk}\`); // streamed output
});
child.on('close', (code) => console.log(\`exited: \${code}\`));

// fork — special spawn for Node.js scripts, creates IPC channel
const worker = fork('./heavy-computation.js');
worker.send({ data: [1, 2, 3] });          // parent → child
worker.on('message', (result) => {          // child → parent
  console.log('Result:', result);
});`,
    solutionCode: `// Key differences:
// exec  — shell: yes, output: buffered (string), use for: short shell commands
// spawn — shell: no,  output: streamed,          use for: long-running processes, large output
// fork  — shell: no,  output: streamed + IPC,    use for: Node.js scripts needing message passing
//
// Security: exec runs in a shell, so user input can cause command injection.
// Always prefer spawn with an args array for untrusted input.
// fork creates a new V8 instance — use for CPU-intensive work.`,
    language: 'javascript',
    hints: [
      'exec buffers the entire stdout/stderr — can cause OOM for large output',
      'spawn streams data — constant memory regardless of output size',
      'fork automatically sets up an IPC channel for parent-child messaging',
    ],
    explanation: 'Use exec for quick shell commands, spawn for long-running processes or large output, and fork for offloading CPU work to a child Node.js process with IPC.',
    createdAt: '2024-01-01',
  },
  {
    id: 'node-021',
    type: 'multiple-choice',
    topic: 'nodejs',
    difficulty: 'intermediate',
    tags: ['caching', 'redis', 'in-memory'],
    prompt: 'When should you use Redis over an in-memory cache (like a Map) in a Node.js application?',
    options: [
      { id: 'a', text: 'Always use Redis — in-memory caching is never appropriate' },
      { id: 'b', text: 'When you have multiple server instances that need to share cache state, or when cache must survive process restarts' },
      { id: 'c', text: 'Only when caching strings — Redis cannot cache objects' },
      { id: 'd', text: 'In-memory Map is always better because it has zero network latency' },
    ],
    correctOptionId: 'b',
    timeLimitSeconds: 30,
    explanation: 'In-memory caches (Map, lru-cache) are fast but local to one process and lost on restart. Redis is shared across instances, persistent, and supports TTL, pub/sub, and data structures. Use in-memory for single-process apps with small data; use Redis for distributed or persistent caching.',
    createdAt: '2024-01-01',
  },
  {
    id: 'node-022',
    type: 'flashcard',
    topic: 'nodejs',
    difficulty: 'beginner',
    tags: ['logging', 'monitoring', 'observability'],
    front: 'What are best practices for logging and monitoring in Node.js?',
    back: '**Logging:**\n- Use a structured logger (pino, winston) — never `console.log` in production\n- Log as JSON for machine parsing:\n```js\nconst pino = require("pino");\nconst logger = pino({ level: "info" });\nlogger.info({ userId: 123, action: "login" }, "User logged in");\n// {"level":30,"userId":123,"action":"login","msg":"User logged in"}\n```\n- Use log levels: `error > warn > info > debug > trace`\n- Include request IDs for tracing across services\n- Never log sensitive data (passwords, tokens, PII)\n\n**Monitoring:**\n- Health check endpoint (`GET /health`)\n- Metrics (Prometheus + Grafana): request rate, latency, error rate\n- APM tools (Datadog, New Relic) for tracing\n- Alerting on error rate spikes and memory/CPU thresholds',
    explanation: 'Structured logging enables filtering, searching, and alerting. Pino is the fastest Node.js logger. Always correlate logs with request IDs for debugging distributed systems.',
    createdAt: '2024-01-01',
  },
  {
    id: 'node-023',
    type: 'multiple-choice',
    topic: 'nodejs',
    difficulty: 'beginner',
    tags: ['environment-variables', 'config', 'dotenv'],
    prompt: 'What is the best way to manage configuration and secrets in a Node.js application?',
    options: [
      { id: 'a', text: 'Hardcode config values directly in source code for simplicity' },
      { id: 'b', text: 'Use environment variables (process.env), with a .env file for local dev (via dotenv) and a secrets manager in production' },
      { id: 'c', text: 'Store secrets in a JSON config file committed to Git' },
      { id: 'd', text: 'Pass all config as command-line arguments' },
    ],
    correctOptionId: 'b',
    timeLimitSeconds: 30,
    explanation: 'Environment variables are the 12-factor app standard. Use dotenv for local development (.env in .gitignore), and inject secrets via your platform\'s secrets manager (AWS Secrets Manager, Vault, K8s secrets) in production. Validate env vars at startup with a library like envalid or zod.',
    createdAt: '2024-01-01',
  },
  {
    id: 'node-024',
    type: 'coding-challenge',
    topic: 'nodejs',
    difficulty: 'beginner',
    tags: ['debugging', 'repl', 'inspect'],
    mode: 'read',
    prompt: 'Study the key debugging and REPL techniques available in Node.js.',
    starterCode: `// 1. Built-in debugger — launch with --inspect flag
// $ node --inspect app.js
// Opens a WebSocket debugger; connect via chrome://inspect

// 2. Breakpoints in code
debugger; // execution pauses here when debugger is attached

// 3. REPL — interactive Node.js shell
// $ node
// > const arr = [1, 2, 3];
// > arr.map(x => x * 2)
// [2, 4, 6]
// > .help  — shows REPL commands
// > .exit  — exits REPL

// 4. Inspect specific module behavior
// $ node -e "console.log(require('os').cpus().length)"

// 5. Debug with environment variables
// $ NODE_DEBUG=http node app.js
// Enables verbose debug output for the http module

// 6. VS Code: add launch.json with "type": "node"
// Sets breakpoints directly in the editor`,
    solutionCode: `// Summary of debugging tools:
// --inspect          → Chrome DevTools debugger (breakpoints, profiling)
// --inspect-brk      → Same but pauses on first line
// debugger statement  → Programmatic breakpoint
// NODE_DEBUG=module   → Built-in module debug output
// node --prof         → V8 profiler (generates tick log)
// node -e "code"      → Quick one-liner execution
// REPL (.break, .clear, .editor, .exit, .help, .load, .save)
//
// In production, use --inspect only behind a secure tunnel.`,
    language: 'javascript',
    hints: [
      'Use --inspect-brk to pause before any code executes',
      'NODE_DEBUG accepts module names like http, net, fs, tls',
      'The REPL supports .editor for multi-line input mode',
    ],
    explanation: 'Node.js has powerful built-in debugging tools. The --inspect flag connects to Chrome DevTools for breakpoints, heap snapshots, and CPU profiling. The REPL is great for quick experiments.',
    createdAt: '2024-01-01',
  },
  {
    id: 'node-025',
    type: 'flashcard',
    topic: 'nodejs',
    difficulty: 'beginner',
    tags: ['npm-scripts', 'automation', 'task-runner'],
    front: 'How do npm scripts work and what are common patterns?',
    back: '`scripts` in `package.json` define CLI commands:\n```json\n"scripts": {\n  "dev": "next dev",\n  "build": "next build",\n  "start": "next start",\n  "lint": "eslint . --fix",\n  "test": "jest --coverage",\n  "test:watch": "jest --watch",\n  "precommit": "lint-staged",\n  "db:migrate": "prisma migrate deploy"\n}\n```\n\n**Lifecycle hooks:**\n- `pretest` runs before `test`, `posttest` runs after\n- `prepare` runs after `npm install` (useful for husky setup)\n\n**Chaining:**\n- `&&` — sequential (stop on failure)\n- `npm-run-all --parallel lint test` — parallel execution\n\n**Running:** `npm run <name>` or `npx <package>` for one-off commands.\n\nnpm scripts replace Gulp/Grunt for most use cases.',
    explanation: 'npm scripts are the standard task runner for Node.js projects. They require no extra dependencies and are familiar to all Node.js developers.',
    createdAt: '2024-01-01',
  },
  {
    id: 'node-026',
    type: 'coding-challenge',
    topic: 'nodejs',
    difficulty: 'intermediate',
    tags: ['fs', 'fs-promises', 'file-system'],
    mode: 'fix',
    prompt: 'Fix this file utility that reads a directory, filters for .json files, and returns their parsed contents. There are 3 bugs.',
    starterCode: `const fs = require('fs');
const path = require('path');

async function readJsonFiles(dir) {
  // Bug 1: using sync method in async function
  const files = fs.readdirSync(dir);

  const jsonFiles = files.filter(f => f.endsWith('.json'));

  const results = [];
  for (const file of jsonFiles) {
    // Bug 2: not joining the directory path
    const content = await fs.promises.readFile(file, 'utf8');
    // Bug 3: not handling JSON parse errors
    const data = JSON.parse(content);
    results.push({ file, data });
  }

  return results;
}`,
    solutionCode: `const fs = require('fs');
const path = require('path');

async function readJsonFiles(dir) {
  // Fix 1: use async readdir
  const files = await fs.promises.readdir(dir);

  const jsonFiles = files.filter(f => f.endsWith('.json'));

  const results = [];
  for (const file of jsonFiles) {
    // Fix 2: join directory path with filename
    const filePath = path.join(dir, file);
    const content = await fs.promises.readFile(filePath, 'utf8');
    // Fix 3: wrap JSON.parse in try-catch
    try {
      const data = JSON.parse(content);
      results.push({ file, data });
    } catch (err) {
      console.error(\`Failed to parse \${file}: \${err.message}\`);
    }
  }

  return results;
}`,
    language: 'javascript',
    hints: [
      'Use fs.promises.readdir() instead of the sync version in async code',
      'readdir returns filenames only — you need path.join(dir, file) for the full path',
      'JSON.parse can throw on malformed JSON — always wrap it in try-catch',
    ],
    explanation: 'Always use fs/promises in async code. Sync methods block the event loop. Use path.join for cross-platform path construction, and handle JSON parse errors gracefully.',
    createdAt: '2024-01-01',
  },
  {
    id: 'node-027',
    type: 'coding-challenge',
    topic: 'nodejs',
    difficulty: 'advanced',
    tags: ['websocket', 'real-time', 'ws'],
    mode: 'complete',
    prompt: 'Complete this WebSocket chat server using the `ws` library. It should broadcast incoming messages to all other connected clients.',
    starterCode: `const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Handle incoming messages
  // Broadcast to all OTHER connected clients
  // Handle client disconnect
});

console.log('WebSocket server running on ws://localhost:8080');`,
    solutionCode: `const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (data) => {
    const message = data.toString();
    console.log('Received:', message);

    // Broadcast to all OTHER connected clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === 1) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err.message);
  });
});

console.log('WebSocket server running on ws://localhost:8080');`,
    language: 'javascript',
    hints: [
      'Listen for the "message" event on each ws connection',
      'Use wss.clients to iterate over all connected clients',
      'Check client.readyState === 1 (OPEN) before sending',
      'Exclude the sender (client !== ws) to avoid echo',
    ],
    explanation: 'WebSockets provide full-duplex communication. The ws library is the most popular Node.js WebSocket server. In production, use Socket.IO for auto-reconnection, rooms, and fallback to HTTP long-polling.',
    createdAt: '2024-01-01',
  },
  {
    id: 'node-028',
    type: 'multiple-choice',
    topic: 'nodejs',
    difficulty: 'advanced',
    tags: ['pm2', 'cluster', 'process-management', 'production'],
    prompt: 'What does PM2 provide for Node.js production deployments that the built-in `cluster` module does not?',
    options: [
      { id: 'a', text: 'PM2 only restarts crashed processes — same as cluster' },
      { id: 'b', text: 'Zero-downtime reloads, log management, startup scripts, monitoring dashboard, and automatic restart with configurable policies' },
      { id: 'c', text: 'PM2 replaces Node.js entirely with a custom runtime' },
      { id: 'd', text: 'PM2 is only useful for development, not production' },
    ],
    correctOptionId: 'b',
    timeLimitSeconds: 30,
    explanation: 'PM2 is a production process manager that adds: cluster mode (pm2 start app.js -i max), zero-downtime reload (pm2 reload), log rotation, startup scripts (pm2 startup), monitoring (pm2 monit), and ecosystem config files. The built-in cluster module only forks workers — you must handle restarts, logging, and deployment yourself.',
    createdAt: '2024-01-01',
  },
  // ── Flashcards ────────────────────────────────────────────────
  {
    id: "node-fc-001",
    type: "flashcard",
    topic: "nodejs",
    difficulty: "beginner",
    tags: ["architecture", "event-loop", "libuv", "gfg"],
    front: "How does Node.js work, and why is it single-threaded?",
    back: "Node runs your JavaScript on **one thread** (the V8 main thread) driving an **event loop**, with **libuv** underneath providing async I/O and a worker thread pool.\n\n```\nJS code → V8 → Node bindings → libuv → OS async I/O (epoll/kqueue/IOCP)\n                                     → thread pool (fs, dns, crypto, zlib)\n```\n\nSingle-threaded for the *JavaScript* because:\n- No locks, no data races, no shared-memory bugs — a vastly simpler programming model.\n- Threads are expensive; an event loop handles tens of thousands of idle connections cheaply.\n\nThe key correction to the common myth: Node is not single-threaded overall. Network I/O is genuinely async at the OS level, and file, DNS, crypto, and zlib work runs on libuv's thread pool (default 4, set by `UV_THREADPOOL_SIZE`).",
    explanation: "The nuance that impresses: single-threaded *execution* with multi-threaded *I/O*. And the consequence — a CPU-bound loop blocks everything, because there's only one thread running your code — which is what `worker_threads` exists to solve.",
    createdAt: "2026-08-26",
  },
  {
    id: "node-fc-002",
    type: "flashcard",
    topic: "nodejs",
    difficulty: "advanced",
    tags: ["event-loop", "phases", "gfg"],
    front: "What are the phases of the Node.js event loop?",
    back: "```\n   ┌──────────────────────────┐\n┌─>│         timers           │  setTimeout, setInterval callbacks\n│  ├──────────────────────────┤\n│  │    pending callbacks     │  deferred I/O callbacks (e.g. TCP errors)\n│  ├──────────────────────────┤\n│  │      idle, prepare       │  internal\n│  ├──────────────────────────┤\n│  │          poll            │  retrieve new I/O events; execute I/O callbacks\n│  ├──────────────────────────┤\n│  │          check           │  setImmediate callbacks\n│  ├──────────────────────────┤\n│  │      close callbacks     │  socket.on('close', ...)\n└──┴──────────────────────────┘\n```\n\n**Between every phase** (and between each callback in modern Node), Node drains:\n1. The `process.nextTick` queue — **higher priority**.\n2. The microtask queue — resolved Promises, `queueMicrotask`.\n\nSo `nextTick` beats `Promise.then`, and both beat the next event loop phase.",
    explanation: "Being able to name the phases in order and place `nextTick`/microtasks *between* them is the full answer. The practical consequence: a recursive `process.nextTick` starves the event loop entirely — the loop never advances to the poll phase.",
    createdAt: "2026-08-26",
  },
  {
    id: "node-fc-003",
    type: "flashcard",
    topic: "nodejs",
    difficulty: "advanced",
    tags: ["timers", "event-loop", "gfg"],
    front: "`setImmediate` vs `setTimeout(fn, 0)` vs `process.nextTick` — what's the order?",
    back: "```js\nsetTimeout(() => console.log('timeout'), 0);\nsetImmediate(() => console.log('immediate'));\nprocess.nextTick(() => console.log('nextTick'));\nPromise.resolve().then(() => console.log('promise'));\n\n// nextTick → promise → then timeout/immediate (order varies!)\n```\n\n- **`process.nextTick`** — runs before anything else, on the nextTick queue. Highest priority.\n- **Promise microtasks** — after nextTick, before the loop continues.\n- **`setTimeout(fn, 0)`** — the **timers** phase.\n- **`setImmediate`** — the **check** phase.\n\nIn the **main module**, timeout-vs-immediate ordering is **non-deterministic** — it depends on how long process startup took relative to the 1 ms timer floor.\n\nInside an **I/O callback**, `setImmediate` **always** fires first, because the check phase directly follows poll.",
    explanation: "That deterministic-inside-I/O rule is the interview-grade detail. It's also the practical guidance: use `setImmediate` when you want to yield after I/O, because it's the only one with guaranteed ordering there.",
    createdAt: "2026-08-26",
  },
  {
    id: "node-fc-004",
    type: "flashcard",
    topic: "nodejs",
    difficulty: "beginner",
    tags: ["concurrency", "event-loop", "gfg"],
    front: "If Node is single-threaded, how does it handle concurrency?",
    back: "Through **non-blocking I/O plus the event loop**, not threads.\n\nWhen you call `fs.readFile`, Node hands the work to libuv and **returns immediately**. The thread is free to handle other requests. When the read finishes, the callback is queued and runs in the poll phase.\n\nSo thousands of concurrent connections are cheap, because at any moment almost all of them are *waiting*, not computing.\n\nThis works brilliantly for **I/O-bound** workloads (APIs, proxies, real-time) and badly for **CPU-bound** ones — a synchronous 500 ms computation blocks every other request for 500 ms.\n\nFor CPU-bound work: `worker_threads` (shared memory, same process) or `cluster`/child processes (separate memory).",
    explanation: "The framing to use: Node achieves **concurrency** (many things in flight) without **parallelism** (many things executing at once) — until you add workers. That distinction answers most follow-up questions on this topic.",
    createdAt: "2026-08-26",
  },
  {
    id: "node-fc-005",
    type: "flashcard",
    topic: "nodejs",
    difficulty: "intermediate",
    tags: ["streams", "pipeline", "gfg"],
    front: "What are streams and why do they matter?",
    back: "Streams process data in **chunks** instead of loading everything into memory.\n\n```js\n// Loads the whole file into RAM — dies on a 4 GB file\nconst data = await fs.promises.readFile('huge.csv');\n\n// Constant memory regardless of file size\nawait pipeline(\n  createReadStream('huge.csv'),\n  createGzip(),\n  createWriteStream('huge.csv.gz'),\n);\n```\n\nFour types: **Readable**, **Writable**, **Duplex** (both, e.g. a TCP socket), **Transform** (a duplex that modifies, e.g. gzip).\n\nModes: **flowing** (data pushed via `'data'` events) and **paused** (pulled via `.read()`).\n\nAlways use `pipeline` from `node:stream/promises` rather than `.pipe()` — `.pipe()` does **not** forward errors or clean up the source on a downstream failure, which leaks file descriptors.",
    explanation: "The `pipeline`-over-`pipe` point is the one that separates someone who has debugged a production stream leak. `.pipe()` returning the destination makes chaining pretty, but its error handling is genuinely broken.",
    createdAt: "2026-08-26",
  },
  {
    id: "node-fc-006",
    type: "flashcard",
    topic: "nodejs",
    difficulty: "advanced",
    tags: ["streams", "backpressure", "gfg"],
    front: "What is backpressure and how do streams handle it?",
    back: "Backpressure is what happens when a producer is faster than a consumer. Without handling it, data buffers in memory until the process runs out.\n\n```js\n// BAD — ignores the return value of write()\nreadable.on('data', chunk => writable.write(chunk));\n\n// GOOD — write() returns false when the buffer is full\nreadable.on('data', chunk => {\n  if (!writable.write(chunk)) {\n    readable.pause();\n    writable.once('drain', () => readable.resume());\n  }\n});\n\n// BEST — pipeline handles all of this for you\nawait pipeline(readable, writable);\n```\n\n`write()` returns `false` once `highWaterMark` (default 16 KB, or 16 objects) is exceeded; the `'drain'` event signals it's safe to resume.",
    explanation: "This is the canonical Node memory-leak scenario: piping a fast source into a slow sink without backpressure handling. It's also the strongest argument for `pipeline` — it implements this correctly so you don't have to.",
    createdAt: "2026-08-26",
  },
  {
    id: "node-fc-007",
    type: "flashcard",
    topic: "nodejs",
    difficulty: "intermediate",
    tags: ["buffer", "binary", "gfg"],
    front: "What is a Buffer and when do you need one?",
    back: "A fixed-length chunk of **raw binary data** outside V8's heap — Node's answer to binary I/O before `Uint8Array` existed. `Buffer` is a subclass of `Uint8Array`.\n\n```js\nconst buf = Buffer.from('héllo', 'utf8');\nbuf.length;                 // 6 bytes — not 5 characters!\nbuf.toString('base64');\nBuffer.alloc(1024);         // zero-filled — safe\nBuffer.allocUnsafe(1024);   // faster, but contains old memory — must overwrite\n```\n\nUses: file contents, network packets, crypto, image manipulation, and anything where you need exact byte control.\n\nThe classic bug: **a multi-byte character split across two chunks**. Concatenating `chunk.toString()` per chunk corrupts UTF-8. Either collect Buffers and `Buffer.concat` before decoding, or use `StringDecoder`.",
    explanation: "The split-character bug is subtle and real: it only manifests with non-ASCII input at a specific chunk boundary, so it passes every English-language test and breaks in production. `allocUnsafe` leaking old memory contents is the other one worth naming.",
    createdAt: "2026-08-26",
  },
  {
    id: "node-fc-008",
    type: "flashcard",
    topic: "nodejs",
    difficulty: "intermediate",
    tags: ["esm", "commonjs", "modules", "gfg"],
    front: "CommonJS vs ES Modules in Node — what actually differs?",
    back: "| | CommonJS | ESM |\n|---|---|---|\n| Syntax | `require` / `module.exports` | `import` / `export` |\n| Loading | **Synchronous**, runtime | **Asynchronous**, statically analysed |\n| Resolution | Runtime, dynamic paths allowed | Static; needs file extensions |\n| `__dirname` | Available | Use `import.meta.dirname` (20.11+) |\n| Top-level await | No | **Yes** |\n| Tree shaking | Poor | Good (static structure) |\n| Can import the other | `require` of ESM: only via `import()`, or sync in Node 22+ | `import` of CJS: yes, default export only |\n\nEnable ESM with `\"type\": \"module\"` in package.json, or a `.mjs` extension.\n\nModern packages ship **conditional exports** so both work:\n```json\n{ \"exports\": { \".\": { \"import\": \"./index.mjs\", \"require\": \"./index.cjs\" } } }\n```",
    explanation: "The dual-package hazard is worth mentioning: if both builds get loaded, you have two copies of the module with separate state — which breaks singletons and `instanceof` checks. That's the real cost of dual publishing.",
    createdAt: "2026-08-26",
  },
  {
    id: "node-fc-009",
    type: "flashcard",
    topic: "nodejs",
    difficulty: "advanced",
    tags: ["worker-threads", "cluster", "cpu-bound", "gfg"],
    front: "What is `worker_threads`, and when do you use it over `cluster` or `child_process`?",
    back: "```js\n// main.js\nconst { Worker } = require('node:worker_threads');\nconst worker = new Worker('./heavy.js', { workerData: { n: 1e9 } });\nworker.on('message', result => console.log(result));\n```\n\n| | Memory | Startup | Use for |\n|---|---|---|---|\n| **worker_threads** | Shared process; can share memory via `SharedArrayBuffer` | ~ms | **CPU-bound work** in-process — parsing, crypto, image processing |\n| **cluster** | Separate processes, shared server port | ~50 ms+ | Scaling an **HTTP server** across cores |\n| **child_process** | Separate process | ~50 ms+ | Running **external programs**, or isolating untrusted code |\n\nRule: `worker_threads` for CPU work, `cluster` for HTTP throughput, `child_process` for running other programs.\n\nMessage passing uses **structured clone**, so data is copied — large payloads have real transfer cost unless you use `transferList` or `SharedArrayBuffer`.",
    explanation: "The copying cost is the gotcha: naively sending a 200 MB buffer to a worker serialises and copies it, often erasing the benefit. `ArrayBuffer` transfer (zero-copy, but the sender loses access) is the fix.",
    createdAt: "2026-08-26",
  },
  {
    id: "node-fc-010",
    type: "flashcard",
    topic: "nodejs",
    difficulty: "advanced",
    tags: ["cluster", "scaling", "gfg"],
    front: "How does the `cluster` module work?",
    back: "```js\nconst cluster = require('node:cluster');\nconst os = require('node:os');\n\nif (cluster.isPrimary) {\n  for (let i = 0; i < os.availableParallelism(); i++) cluster.fork();\n  cluster.on('exit', (worker) => {\n    console.log(`worker ${worker.process.pid} died, restarting`);\n    cluster.fork();\n  });\n} else {\n  require('./server');   // each worker runs a full server\n}\n```\n\nThe primary process creates workers (via `child_process.fork`) that **share a server port** — the OS or the primary distributes incoming connections (round-robin by default on non-Windows).\n\nConsequences: workers have **separate memory**, so in-process state (sessions, caches, rate-limit counters) must move to Redis or similar.\n\nIn containerised deployments, running one Node process per container and scaling containers is often simpler than cluster.",
    explanation: "The shared-state consequence is what people get wrong: an in-memory session store or rate limiter works perfectly in development with one process and breaks silently under cluster, because each worker has its own copy.",
    createdAt: "2026-08-26",
  },
  {
    id: "node-fc-011",
    type: "flashcard",
    topic: "nodejs",
    difficulty: "intermediate",
    tags: ["express", "middleware", "gfg"],
    front: "What is middleware in Express, and how does the chain work?",
    back: "A function with the signature `(req, res, next)` that runs in order for matching requests:\n\n```js\napp.use(express.json());                     // parse JSON bodies\napp.use((req, res, next) => {                // custom\n  req.startedAt = Date.now();\n  next();                                     // pass to the next middleware\n});\napp.get('/users', authenticate, listUsers);  // route-level\n\n// Error handler — FOUR arguments, and registered LAST\napp.use((err, req, res, next) => {\n  res.status(err.status ?? 500).json({ error: err.message });\n});\n```\n\nTwo rules that cause most bugs:\n1. You must call `next()` (or send a response), or the request **hangs forever**.\n2. The error handler is identified by having **four parameters** and must be registered after all routes.\n\nIn Express 4, an error thrown in an **async** handler is not caught — you must `next(err)` or use a wrapper. Express 5 handles rejected promises automatically.",
    explanation: "The async-error gap in Express 4 is the classic production bug: an async route rejects, nothing catches it, and the client hangs until timeout while the server logs an unhandled rejection. Worth naming explicitly.",
    createdAt: "2026-08-26",
  },
  {
    id: "node-fc-012",
    type: "flashcard",
    topic: "nodejs",
    difficulty: "intermediate",
    tags: ["cors", "http", "security", "gfg"],
    front: "What is CORS and how do you handle it in Node?",
    back: "A **browser** security mechanism: a page on origin A can't read a response from origin B unless B opts in with headers.\n\n```js\napp.use(cors({\n  origin: ['https://app.example.com'],   // never `true` or '*' with credentials\n  credentials: true,\n  methods: ['GET', 'POST'],\n}));\n```\n\nKey points:\n- **Preflight** — for non-simple requests (custom headers, `PUT`, JSON content type), the browser sends an `OPTIONS` request first; you must answer it.\n- `Access-Control-Allow-Origin: *` is **incompatible with** `credentials: true` — you must echo a specific origin.\n- CORS is enforced **by the browser only**. It is not a server-side access control; curl and any server ignore it entirely.\n\nCache preflights with `Access-Control-Max-Age` to avoid an extra round trip per request.",
    explanation: "The 'CORS is not security' point is the one interviewers listen for. It protects the *user's* browser session from a malicious site — it does nothing to protect your API from a direct request, which is what authentication is for.",
    createdAt: "2026-08-26",
  },
  {
    id: "node-fc-013",
    type: "flashcard",
    topic: "nodejs",
    difficulty: "advanced",
    tags: ["asynclocalstorage", "context", "observability"],
    front: "What is `AsyncLocalStorage` and what problem does it solve?",
    back: "Request-scoped context that propagates through async calls without threading a parameter through every function — Node's equivalent of thread-local storage.\n\n```js\nconst { AsyncLocalStorage } = require('node:async_hooks');\nconst als = new AsyncLocalStorage();\n\napp.use((req, res, next) => {\n  als.run({ requestId: crypto.randomUUID(), userId: req.user?.id }, next);\n});\n\n// Anywhere, arbitrarily deep, with no plumbing\nfunction log(msg) {\n  const { requestId } = als.getStore() ?? {};\n  console.log(JSON.stringify({ requestId, msg }));\n}\n```\n\nUses: correlation IDs in logs, distributed tracing, per-request DB transactions, multi-tenant context.\n\nCost: a measurable (though much reduced in modern Node) performance overhead, and the store is lost if you cross into a callback registered outside the `run()` scope.",
    explanation: "This is how every APM and tracing library works under the hood. It's also the clean answer to 'how do you get a request ID into a log line in a deeply nested service function?' without polluting every signature.",
    createdAt: "2026-08-26",
  },
  {
    id: "node-fc-014",
    type: "flashcard",
    topic: "nodejs",
    difficulty: "advanced",
    tags: ["abortcontroller", "cancellation"],
    front: "How do you use `AbortController` in Node?",
    back: "A standard way to cancel async operations, supported across fs, http, streams, timers, and `fetch`:\n\n```js\nconst ac = new AbortController();\nsetTimeout(() => ac.abort(), 5000);\n\ntry {\n  const res = await fetch(url, { signal: ac.signal });\n} catch (e) {\n  if (e.name === 'AbortError') { /* cancelled */ }\n}\n\n// Shorthand for a timeout\nawait fetch(url, { signal: AbortSignal.timeout(5000) });\n\n// Combine several reasons to cancel\nconst signal = AbortSignal.any([ac.signal, AbortSignal.timeout(5000)]);\n```\n\nWhy it matters: without cancellation, an abandoned request keeps consuming a socket, a database connection, and CPU. In a proxy or an LLM gateway, propagating the client's disconnect upstream is a direct cost saving.",
    explanation: "`AbortSignal.timeout()` and `AbortSignal.any()` are recent and less known. Propagating cancellation end-to-end — client disconnect → upstream request abort — is a genuinely valuable production practice worth calling out.",
    createdAt: "2026-08-26",
  },
  {
    id: "node-fc-015",
    type: "flashcard",
    topic: "nodejs",
    difficulty: "intermediate",
    tags: ["error-handling", "gfg"],
    front: "How do you handle errors properly in Node?",
    back: "```js\n// Async: always await inside try/catch, or attach .catch\ntry { await doWork(); } catch (err) { logger.error({ err }); }\n\n// EventEmitter: an 'error' event with no listener CRASHES the process\nemitter.on('error', err => logger.error({ err }));\n\n// Last resort — log and exit, do not continue\nprocess.on('uncaughtException', (err) => {\n  logger.fatal({ err });\n  process.exit(1);\n});\nprocess.on('unhandledRejection', (reason) => { throw reason; });\n```\n\nPrinciples:\n- **Operational errors** (network failure, bad input) → handle and recover.\n- **Programmer errors** (bugs) → crash and restart. Continuing after an unknown-state bug corrupts data.\n- Never swallow an error with an empty `catch {}`.\n- Use `Error` objects with `cause` (`new Error('x', { cause: err })`) to preserve stack chains.\n\nSince Node 15, an unhandled rejection **terminates the process** by default.",
    explanation: "The operational-versus-programmer distinction is Joyent's classic framing and still the right one. It answers 'should uncaughtException keep the server alive?' — no; log, exit, and let your supervisor restart a clean process.",
    createdAt: "2026-08-26",
  },
  {
    id: "node-fc-016",
    type: "flashcard",
    topic: "nodejs",
    difficulty: "advanced",
    tags: ["graceful-shutdown", "kubernetes", "production"],
    front: "How do you implement graceful shutdown?",
    back: "```js\nconst server = app.listen(3000);\nlet shuttingDown = false;\n\nasync function shutdown(signal) {\n  if (shuttingDown) return;\n  shuttingDown = true;\n  logger.info(`${signal} received, shutting down`);\n\n  server.close(async () => {          // stop accepting new connections\n    await db.end();                    // drain the pool\n    await queue.close();\n    process.exit(0);\n  });\n\n  setTimeout(() => process.exit(1), 10_000).unref();   // hard deadline\n}\n\nprocess.on('SIGTERM', () => shutdown('SIGTERM'));\nprocess.on('SIGINT',  () => shutdown('SIGINT'));\n```\n\nWhy it matters: Kubernetes sends `SIGTERM` and then `SIGKILL` after a grace period. Without this, in-flight requests are dropped on every deploy.\n\nAlso: add a **readiness probe** that fails immediately on SIGTERM, so the load balancer stops routing to you *before* connections are closed. `.unref()` on the deadline timer stops it holding the process open.",
    explanation: "The readiness-probe-first ordering is the detail that actually eliminates dropped requests. Closing the server before the LB notices still refuses connections that were already routed to you.",
    createdAt: "2026-08-26",
  },
  {
    id: "node-fc-017",
    type: "flashcard",
    topic: "nodejs",
    difficulty: "advanced",
    tags: ["memory-leak", "debugging", "profiling"],
    front: "How do you diagnose a memory leak in Node?",
    back: "1. **Confirm it** — track `process.memoryUsage().heapUsed` over time. A sawtooth that trends upward is a leak; flat sawtooth is normal GC.\n2. **Heap snapshots** — `node --inspect`, take snapshots in Chrome DevTools at t0 and t1, and use the **comparison view** to see what grew.\n3. **Or in-process**: `require('node:v8').writeHeapSnapshot()` triggered by a signal.\n4. **Look for the usual suspects**:\n   - Listeners added per request and never removed (watch for the `MaxListenersExceededWarning`).\n   - An unbounded `Map`/array used as a cache — use `lru-cache` or a `WeakMap`.\n   - Closures capturing large objects.\n   - Timers never cleared.\n   - Global accumulators (a logs array, a requests array).\n5. **`--max-old-space-size`** raises the ceiling; it does not fix a leak.\n\n`clinic doctor` and `0x` are good starting points for a first look.",
    explanation: "The snapshot *comparison* view is the practical technique — a single snapshot tells you what's in memory, but the diff between two tells you what's accumulating, which is the actual question.",
    createdAt: "2026-08-26",
  },
  {
    id: "node-fc-018",
    type: "flashcard",
    topic: "nodejs",
    difficulty: "intermediate",
    tags: ["testing", "node-test", "modern-node"],
    front: "What is the built-in test runner in modern Node?",
    back: "```js\nimport { test, describe, before, mock } from 'node:test';\nimport assert from 'node:assert/strict';\n\ndescribe('userService', () => {\n  before(() => { /* setup */ });\n\n  test('creates a user', async (t) => {\n    const save = t.mock.method(db, 'save', async () => ({ id: '1' }));\n    const user = await createUser({ name: 'Ada' });\n    assert.equal(user.id, '1');\n    assert.equal(save.mock.callCount(), 1);\n  });\n\n  test('skipped', { skip: 'flaky' }, () => {});\n});\n```\n\n```bash\nnode --test                    # discover and run\nnode --test --watch\nnode --test --experimental-test-coverage\n```\n\nStable since Node 20. No dependency, no config, TAP output, built-in mocking and coverage. For many services it replaces Jest entirely — and it's dramatically faster to start.",
    explanation: "Mentioning `node:test` signals you're current on the runtime. The honest caveat: Jest and Vitest still have richer ecosystems (snapshot testing, better watch UX, browser environments), so it's a real choice rather than an obvious win.",
    createdAt: "2026-08-26",
  },
  {
    id: "node-fc-019",
    type: "flashcard",
    topic: "nodejs",
    difficulty: "beginner",
    tags: ["modules", "node-protocol", "security"],
    front: "What are `node:` protocol imports and why use them?",
    back: "```js\nimport fs from 'node:fs/promises';\nimport { EventEmitter } from 'node:events';\nconst path = require('node:path');\n```\n\nReasons:\n- **Unambiguous** — `require('fs')` could resolve to an npm package named `fs` (a real supply-chain attack vector); `node:fs` always means the builtin.\n- **Faster resolution** — no filesystem lookup through `node_modules`.\n- **Some modules require it** — `node:test` and `node:sea` are only available with the prefix.\n- **Signals intent** clearly to readers and to bundlers.\n\nIt's now the recommended style throughout the Node docs.",
    explanation: "The shadowing attack is the strongest argument: publishing a package called `fs` or `path` and getting it into someone's dependency tree is a known technique. The `node:` prefix makes builtin resolution unspoofable.",
    createdAt: "2026-08-26",
  },
  {
    id: "node-fc-020",
    type: "flashcard",
    topic: "nodejs",
    difficulty: "beginner",
    tags: ["environment", "config", "gfg"],
    front: "How do you manage environment variables and configuration in Node?",
    back: "```js\n// Node 20.6+ — no dotenv dependency needed\n// node --env-file=.env app.js\n\nconst config = {\n  port: Number(process.env.PORT ?? 3000),\n  dbUrl: process.env.DATABASE_URL,\n  isProd: process.env.NODE_ENV === 'production',\n};\n\nif (!config.dbUrl) throw new Error('DATABASE_URL is required');\n```\n\nRules:\n- **Validate at startup** (Zod/envalid) so a missing variable is a boot failure, not a 3am error.\n- Everything from `process.env` is a **string** — coerce explicitly. `Boolean('false')` is `true`.\n- Never commit `.env`; commit `.env.example`.\n- **`NODE_ENV=production`** matters: Express and many libraries enable caching and disable verbose errors based on it. Setting it to anything else in production costs real performance.\n\nPrefer real secret managers over env vars for secrets in production.",
    explanation: "The `Boolean('false') === true` trap catches people constantly. And the `NODE_ENV` performance point is concrete — Express's view caching and error verbosity both key off it, so a typo there is a silent slowdown.",
    createdAt: "2026-08-26",
  },
  {
    id: "node-fc-021",
    type: "flashcard",
    topic: "nodejs",
    difficulty: "intermediate",
    tags: ["eventemitter", "gfg"],
    front: "What is the EventEmitter, and what are its pitfalls?",
    back: "```js\nconst { EventEmitter } = require('node:events');\nclass Job extends EventEmitter {}\n\nconst job = new Job();\njob.on('progress', p => console.log(p));\njob.once('done', () => cleanup());\njob.emit('progress', 50);\n```\n\nPitfalls:\n1. **An `'error'` event with no listener throws** and crashes the process. Always attach an error listener.\n2. **Listeners are synchronous** — a slow listener blocks the emitter and the event loop.\n3. **Memory leaks** — adding a listener per request without removing it. Node warns at 11 listeners (`MaxListenersExceededWarning`), which is a leak signal, not a limit to raise.\n4. **`emit` returns `false`** if there were no listeners — the event is silently lost.\n5. Use `once(emitter, 'event')` from `node:events` for a promise-based single wait.",
    explanation: "The `MaxListenersExceededWarning` is Node telling you about a bug. The wrong response — `setMaxListeners(100)` — hides a leak that will keep growing; the right one is finding what adds a listener without removing it.",
    createdAt: "2026-08-26",
  },
  {
    id: "node-fc-022",
    type: "flashcard",
    topic: "nodejs",
    difficulty: "intermediate",
    tags: ["databases", "connection-pool", "gfg"],
    front: "How do you handle database connections in a Node service?",
    back: "Use a **connection pool**, created once at startup and shared:\n\n```js\nconst pool = new Pool({\n  connectionString: process.env.DATABASE_URL,\n  max: 20,                       // must fit within the DB's max_connections\n  idleTimeoutMillis: 30_000,\n  connectionTimeoutMillis: 5_000,\n});\n\n// Always release, even on error\nconst client = await pool.connect();\ntry {\n  await client.query('BEGIN');\n  await client.query('...');\n  await client.query('COMMIT');\n} catch (e) {\n  await client.query('ROLLBACK');\n  throw e;\n} finally {\n  client.release();\n}\n```\n\nNever open a connection per request — the handshake and TLS negotiation dominate query time.\n\nSizing: `pool.max × number_of_instances` must stay under the database's connection limit. Under cluster or Kubernetes replicas this multiplies fast, which is what PgBouncer exists to solve.",
    explanation: "The pool-size multiplication is the production trap: `max: 20` looks modest until 30 pods each open 20 connections and exhaust Postgres's default limit of 100. That arithmetic is worth doing out loud in an interview.",
    createdAt: "2026-08-26",
  },
  {
    id: "node-fc-023",
    type: "flashcard",
    topic: "nodejs",
    difficulty: "advanced",
    tags: ["authentication", "jwt", "sessions", "gfg"],
    front: "How do you implement authentication and sessions in Node?",
    back: "**Two models:**\n\n| | Server sessions | JWT |\n|---|---|---|\n| State | Server-side (Redis) | In the token |\n| Revocation | Immediate — delete the record | **Hard** — token is valid until expiry |\n| Scaling | Needs a shared store | Stateless |\n| Size | Small cookie | Larger token on every request |\n\n```js\n// Session cookie hardening — all four matter\ncookie: { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 864e5 }\n```\n\n**JWT rules:** short-lived access tokens (~15 min) plus a revocable refresh token, verify the signature **and** `exp`/`iss`/`aud`, pin the algorithm (never trust the `alg` header — the `alg: none` attack), and store tokens in an httpOnly cookie rather than localStorage (XSS-readable).\n\nPasswords: **bcrypt/argon2**, never a raw hash. `passport` provides strategies for OAuth and friends.",
    explanation: "The revocation gap is the decisive trade-off. 'We use JWTs, so we can't log anyone out until their token expires' is a real limitation teams discover after a security incident — the refresh-token pattern exists precisely to bound it.",
    createdAt: "2026-08-26",
  },
  {
    id: "node-fc-024",
    type: "flashcard",
    topic: "nodejs",
    difficulty: "intermediate",
    tags: ["testing", "test-pyramid", "gfg"],
    front: "What is the test pyramid, and how does it apply to a Node service?",
    back: "```\n        /\\      E2E — few, slow, brittle, high confidence\n       /  \\\n      /----\\    Integration — routes + real DB (testcontainers)\n     /      \\\n    /--------\\  Unit — many, fast, isolated\n```\n\nFor a Node API in practice:\n- **Unit** — pure functions, validators, mappers, business rules. Milliseconds, no I/O.\n- **Integration** — the layer that actually earns its keep: hit real routes with `supertest` against a real database in a container. Catches SQL errors, migration drift, and serialization bugs that mocks hide.\n- **E2E** — a handful of critical user journeys.\n\nThe common failure mode is a huge unit-test suite full of mocks that all pass while the service is broken, because every mock encodes an assumption nobody verified.",
    explanation: "The 'test pyramid' question is from the source list, but the valuable answer is the mock-drift critique. Integration tests with a containerised database have become cheap enough that the classic advice to minimise them is outdated.",
    createdAt: "2026-08-26",
  },
  {
    id: "node-fc-025",
    type: "flashcard",
    topic: "nodejs",
    difficulty: "advanced",
    tags: ["security", "gfg"],
    front: "What are the most important security practices for a Node application?",
    back: "- **Validate all input** with a schema (Zod, Joi) at the boundary — never trust `req.body`.\n- **Parameterised queries** always; string-concatenated SQL is injection.\n- **`helmet`** for security headers (CSP, HSTS, X-Frame-Options).\n- **Rate limiting** on auth endpoints especially.\n- **Secrets** from a secret manager, never in code or a committed `.env`.\n- **`npm audit`** in CI, lockfile committed, and `npm ci --ignore-scripts` to blunt install-script attacks.\n- **Never `eval`, `new Function`, or `child_process.exec` with user input** — use `execFile` with an argument array.\n- **Body size limits** (`express.json({ limit: '100kb' })`) to prevent memory exhaustion.\n- **Prototype pollution** — beware deep-merge utilities and `JSON.parse` into object literals.\n- **Run as a non-root user** in the container.\n\nNode 20+ also offers an experimental **permission model** (`--permission --allow-fs-read=...`).",
    explanation: "Prototype pollution is the Node-specific one worth naming — a `__proto__` key in a JSON body flowing through a naive deep merge can alter `Object.prototype` process-wide. It's caused several high-profile CVEs in popular packages.",
    createdAt: "2026-08-26",
  },
  {
    id: "node-fc-026",
    type: "flashcard",
    topic: "nodejs",
    difficulty: "advanced",
    tags: ["profiling", "perf-hooks", "event-loop"],
    front: "How do you profile and diagnose performance problems in Node?",
    back: "**CPU**\n```bash\nnode --cpu-prof app.js          # writes a .cpuprofile for Chrome DevTools\nnode --inspect app.js           # live profiling\nnpx clinic flame -- node app.js # flame graph\n```\n\n**Event loop lag** — the metric that actually matters for a Node service:\n```js\nconst { monitorEventLoopDelay } = require('node:perf_hooks');\nconst h = monitorEventLoopDelay({ resolution: 20 });\nh.enable();\nsetInterval(() => console.log('p99 lag', h.percentile(99)), 5000);\n```\n\nRising lag means something is blocking the loop — a synchronous call, a huge `JSON.parse`, or a regex backtracking.\n\n**Also:** `perf_hooks` marks/measures for custom timings, `diagnostics_channel` for zero-overhead instrumentation hooks, `--heap-prof` for allocation profiling, and `clinic doctor` for a first diagnosis.",
    explanation: "Event loop lag is the Node-specific health metric to name. High p99 latency with low CPU usually means loop blocking rather than slow downstream calls — and that distinction points you at completely different fixes.",
    createdAt: "2026-08-26",
  },
  {
    id: "node-fc-027",
    type: "flashcard",
    topic: "nodejs",
    difficulty: "intermediate",
    tags: ["crypto", "security", "gfg"],
    front: "What are the `crypto` module basics you should know?",
    back: "```js\nconst crypto = require('node:crypto');\n\ncrypto.randomUUID();                          // v4 UUID\ncrypto.randomBytes(32).toString('hex');       // CSPRNG — never Math.random()\ncrypto.createHash('sha256').update(data).digest('hex');\ncrypto.createHmac('sha256', secret).update(payload).digest('hex');\n\n// Constant-time comparison — prevents timing attacks\ncrypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));\n```\n\nRules:\n- **Never `Math.random()`** for anything security-related — it's predictable.\n- **Never a plain hash for passwords** — use `bcrypt`, `argon2`, or `crypto.scrypt`. Fast hashes are the *problem*, since they make brute force cheap.\n- **`timingSafeEqual`** for comparing secrets and signatures; `===` leaks length and content through timing.\n- Crypto operations run on the **libuv thread pool**, so heavy use can starve file I/O.",
    explanation: "The password-hashing distinction is the one that must be right: SHA-256 is designed to be fast, which is exactly wrong for passwords. bcrypt/argon2 are deliberately slow and memory-hard.",
    createdAt: "2026-08-26",
  },
  {
    id: "node-fc-028",
    type: "flashcard",
    topic: "nodejs",
    difficulty: "beginner",
    tags: ["http", "express", "fastify", "gfg"],
    front: "How do you build a simple HTTP server, and why use a framework?",
    back: "```js\nimport { createServer } from 'node:http';\n\nconst server = createServer((req, res) => {\n  if (req.url === '/health' && req.method === 'GET') {\n    res.writeHead(200, { 'Content-Type': 'application/json' });\n    return res.end(JSON.stringify({ ok: true }));\n  }\n  res.writeHead(404).end();\n});\nserver.listen(3000);\n```\n\nWhat a framework adds that you'd otherwise write yourself: routing with params, body parsing, middleware composition, error handling, content negotiation, and cookie/session handling.\n\nOptions: **Express** (ubiquitous, simplest), **Fastify** (much faster, schema-based validation and serialization built in), **Hono** (tiny, runs on Node/Bun/Workers/Deno), **NestJS** (opinionated, DI, decorators — good for large teams).\n\nFastify's schema-driven JSON serialization is a genuine measurable win, not just marketing.",
    explanation: "Being able to write the raw `http` server matters — it shows you understand what the framework abstracts. And knowing that `res.end` must be called or the request hangs is the same lesson as forgetting `next()` in middleware.",
    createdAt: "2026-08-26",
  },
  {
    id: "node-fc-029",
    type: "flashcard",
    topic: "nodejs",
    difficulty: "intermediate",
    tags: ["child-process", "security", "gfg"],
    front: "What are `child_process` methods and how do they differ?",
    back: "```js\nconst { spawn, exec, execFile, fork } = require('node:child_process');\n\nspawn('ls', ['-la']);                        // streams output, no shell, no buffer limit\nexec('ls -la', (err, stdout) => {});         // runs in a SHELL, buffers output\nexecFile('/usr/bin/ls', ['-la'], cb);        // no shell — safer\nfork('./worker.js');                         // a new Node process + IPC channel\n```\n\n| Method | Shell | Output | Use for |\n|---|---|---|---|\n| `spawn` | No | Streamed | Long-running processes, large output |\n| `exec` | **Yes** | Buffered (`maxBuffer`, default 1 MB) | Quick shell commands with small output |\n| `execFile` | No | Buffered | Running a specific binary safely |\n| `fork` | No | IPC via `send`/`message` | A separate Node process you talk to |\n\n**Security:** `exec` with interpolated user input is command injection. Use `execFile`/`spawn` with an argument array so the shell never parses the input.",
    explanation: "Two failure modes to name: command injection through `exec`, and `exec` silently truncating (and erroring) once output exceeds `maxBuffer`. Both push you toward `spawn`/`execFile` as the default.",
    createdAt: "2026-08-26",
  },
  {
    id: "node-fc-030",
    type: "flashcard",
    topic: "nodejs",
    difficulty: "beginner",
    tags: ["npm", "package-json", "gfg"],
    front: "What is npm, and what do `package.json` and the lockfile do?",
    back: "**`package.json`** — the manifest: name, version, entry points (`main`, `exports`), `scripts`, and dependencies.\n\n```jsonc\n{\n  \"dependencies\": {},      // needed at runtime\n  \"devDependencies\": {},   // build/test only — not installed with --omit=dev\n  \"peerDependencies\": {},  // the host app must provide these\n  \"engines\": { \"node\": \">=20\" }\n}\n```\n\n**Ranges:** `^1.2.3` allows minor+patch; `~1.2.3` allows patch only; `1.2.3` is exact.\n\n**`package-lock.json`** pins the **exact** resolved version of every transitive dependency. Commit it. `npm ci` installs strictly from it — deterministic and much faster than `npm install`, which may update the lockfile.\n\nUse `npm ci` in CI and Docker builds, always.",
    explanation: "The `npm install` vs `npm ci` distinction is the practical one: `npm install` in CI can silently resolve a different transitive version than a developer had, which is exactly the class of 'works on my machine' bug lockfiles exist to prevent.",
    createdAt: "2026-08-26",
  },
  // ── Multiple choice ───────────────────────────────────────────
  {
    id: "node-mc-001",
    type: "multiple-choice",
    topic: "nodejs",
    difficulty: "advanced",
    tags: ["event-loop", "timers"],
    prompt: "Inside an I/O callback, which fires first: `setImmediate` or `setTimeout(fn, 0)`?",
    options: [
      { id: "a", text: "The order is non-deterministic in all contexts" },
      { id: "b", text: "They fire simultaneously in the same tick" },
      { id: "c", text: "setImmediate — the check phase directly follows poll, so it is deterministic here" },
      { id: "d", text: "setTimeout — timers is the first phase of the loop" },
    ],
    correctOptionId: "c",
    timeLimitSeconds: 55,
    explanation: "In the main module the order is genuinely non-deterministic, because it depends on how long startup took relative to the 1 ms timer floor. Inside an I/O callback you're already in the poll phase, and check comes immediately after — so `setImmediate` always wins. That's why it's the right choice for yielding after I/O.",
    createdAt: "2026-08-26",
  },
  {
    id: "node-mc-002",
    type: "multiple-choice",
    topic: "nodejs",
    difficulty: "intermediate",
    tags: ["streams", "pipeline"],
    prompt: "Why should you use `pipeline()` instead of `.pipe()`?",
    options: [
      { id: "a", text: "pipe() is deprecated in modern Node" },
      { id: "b", text: "pipeline() is significantly faster" },
      { id: "c", text: "pipe() does not support Transform streams" },
      { id: "d", text: "pipe() does not forward errors or destroy the source on downstream failure, leaking file descriptors" },
    ],
    correctOptionId: "d",
    timeLimitSeconds: 50,
    explanation: "`.pipe()` returns the destination for convenient chaining but has no error propagation — if the writable fails, the readable keeps going and is never destroyed. `pipeline` (especially from `node:stream/promises`) handles errors and cleanup for every stream in the chain.",
    createdAt: "2026-08-26",
  },
  {
    id: "node-mc-003",
    type: "multiple-choice",
    topic: "nodejs",
    difficulty: "intermediate",
    tags: ["event-loop", "performance", "blocking"],
    prompt: "Your Express API becomes unresponsive under load while CPU sits at 100%. Most likely cause?",
    options: [
      { id: "a", text: "A synchronous CPU-bound operation is blocking the single event loop thread" },
      { id: "b", text: "The connection pool is exhausted" },
      { id: "c", text: "Too many concurrent HTTP connections" },
      { id: "d", text: "Garbage collection is running too frequently" },
    ],
    correctOptionId: "a",
    timeLimitSeconds: 50,
    explanation: "Node runs your JavaScript on one thread, so any synchronous work — a big `JSON.parse`, a sync crypto call, a backtracking regex — stalls every other request for its full duration. Confirm it by measuring event loop lag, then fix it by moving the work to `worker_threads` or making it async.",
    createdAt: "2026-08-26",
  },
  {
    id: "node-mc-004",
    type: "multiple-choice",
    topic: "nodejs",
    difficulty: "intermediate",
    tags: ["eventemitter", "memory-leak"],
    prompt: "You get `MaxListenersExceededWarning: 11 error listeners added`. What is the correct response?",
    options: [
      { id: "a", text: "Call emitter.setMaxListeners(100) to raise the limit" },
      { id: "b", text: "Ignore it; 11 listeners is not a problem" },
      { id: "c", text: "Switch from EventEmitter to Promises" },
      { id: "d", text: "Find the code adding a listener per operation without removing it — the warning indicates a leak" },
    ],
    correctOptionId: "d",
    timeLimitSeconds: 50,
    explanation: "The threshold is a leak detector, not a capacity limit. It fires because listeners accumulate — typically one added per request or per retry and never removed. Raising the limit hides the growth until the process runs out of memory; use `once()` or explicitly `removeListener`.",
    createdAt: "2026-08-26",
  },
  {
    id: "node-mc-005",
    type: "multiple-choice",
    topic: "nodejs",
    difficulty: "advanced",
    tags: ["cluster", "state", "scaling"],
    prompt: "Your in-memory rate limiter stops working correctly after enabling `cluster`. Why?",
    options: [
      { id: "a", text: "Each worker is a separate process with its own memory, so each keeps an independent counter" },
      { id: "b", text: "cluster disables in-process state for safety" },
      { id: "c", text: "The primary process intercepts and resets the counters" },
      { id: "d", text: "Workers share memory, so the counters overwrite each other" },
    ],
    correctOptionId: "a",
    timeLimitSeconds: 55,
    explanation: "Cluster workers are separate processes created via fork — they share the listening socket, not memory. With 4 workers your 100-req/min limit becomes effectively 400. Any shared state (sessions, caches, counters) must move to Redis or an equivalent shared store.",
    createdAt: "2026-08-26",
  },
  {
    id: "node-mc-006",
    type: "multiple-choice",
    topic: "nodejs",
    difficulty: "advanced",
    tags: ["child-process", "security", "injection"],
    prompt: "Which is the safest way to run an external command with a user-supplied filename?",
    options: [
      { id: "a", text: "spawn(`convert ${userFile}`, { shell: true })" },
      { id: "b", text: "execFile('/usr/bin/convert', [userFile, out]) — no shell, arguments passed as an array" },
      { id: "c", text: "exec(`convert ${userFile} ${out}`)" },
      { id: "d", text: "exec(`convert \"${userFile}\" \"${out}\"`) with quotes around the input" },
    ],
    correctOptionId: "b",
    timeLimitSeconds: 55,
    explanation: "Any option that invokes a shell lets `; rm -rf /` in the filename execute. Quoting is not a defence — a `\"` in the input escapes it. Passing arguments as an array with no shell means the value is delivered to the program verbatim and never parsed as syntax.",
    createdAt: "2026-08-26",
  },
  {
    id: "node-mc-007",
    type: "multiple-choice",
    topic: "nodejs",
    difficulty: "intermediate",
    tags: ["express", "error-handling", "async"],
    prompt: "What happens to an error thrown inside an async route handler in Express 4?",
    options: [
      { id: "a", text: "The process crashes immediately" },
      { id: "b", text: "The client receives a 500 response" },
      { id: "c", text: "It becomes an unhandled rejection; the error middleware never runs and the request hangs" },
      { id: "d", text: "Express catches it automatically and passes it to the error middleware" },
    ],
    correctOptionId: "c",
    timeLimitSeconds: 55,
    explanation: "Express 4 predates async functions and only catches synchronous throws, so a rejected promise escapes entirely — the client waits until timeout. Wrap handlers, call `next(err)` explicitly, or upgrade to Express 5, which handles rejections natively.",
    createdAt: "2026-08-26",
  },
  {
    id: "node-mc-008",
    type: "multiple-choice",
    topic: "nodejs",
    difficulty: "beginner",
    tags: ["modules", "security"],
    prompt: "Why prefer `import fs from 'node:fs'` over `import fs from 'fs'`?",
    options: [
      { id: "a", text: "It enables the promise-based API automatically" },
      { id: "b", text: "It is required for ESM; the bare specifier only works in CommonJS" },
      { id: "c", text: "It gives access to experimental filesystem APIs" },
      { id: "d", text: "It cannot be shadowed by an npm package named fs, and resolves faster" },
    ],
    correctOptionId: "d",
    timeLimitSeconds: 45,
    explanation: "A bare specifier is resolved through `node_modules` first, so a malicious or accidental package named `fs` can shadow the builtin — a genuine supply-chain vector. The `node:` prefix is unspoofable and skips the filesystem lookup. Both bare and prefixed forms work in ESM and CJS.",
    createdAt: "2026-08-26",
  },
  {
    id: "node-mc-009",
    type: "multiple-choice",
    topic: "nodejs",
    difficulty: "advanced",
    tags: ["databases", "connection-pool", "scaling"],
    prompt: "A pool with `max: 20` runs on 30 Kubernetes replicas against Postgres with `max_connections = 100`. What happens?",
    options: [
      { id: "a", text: "Nothing — pools only open connections lazily, so the limit is never reached" },
      { id: "b", text: "Connections are exhausted — 30 × 20 = 600 potential connections against a limit of 100" },
      { id: "c", text: "Kubernetes automatically shares the pool across replicas" },
      { id: "d", text: "Postgres queues the excess connections transparently" },
    ],
    correctOptionId: "b",
    timeLimitSeconds: 55,
    explanation: "Pools do open lazily, but under load each replica will fill its pool and the total far exceeds the server limit, producing connection errors. The arithmetic `pool.max × replicas < max_connections` must hold — or you put PgBouncer in front, which is exactly why it exists.",
    createdAt: "2026-08-26",
  },
  {
    id: "node-mc-010",
    type: "multiple-choice",
    topic: "nodejs",
    difficulty: "advanced",
    tags: ["jwt", "security", "xss"],
    prompt: "What is the strongest argument against storing JWTs in `localStorage`?",
    options: [
      { id: "a", text: "Tokens in localStorage cannot be given an expiry" },
      { id: "b", text: "Any XSS vulnerability can read them; an httpOnly cookie cannot be read by JavaScript" },
      { id: "c", text: "localStorage has a 5MB size limit that tokens can exceed" },
      { id: "d", text: "localStorage is not sent automatically, requiring extra code" },
    ],
    correctOptionId: "b",
    timeLimitSeconds: 55,
    explanation: "httpOnly cookies are invisible to JavaScript, so an injected script cannot exfiltrate the token. That moves the risk from 'any XSS is total account takeover' to 'XSS can act as the user while the page is open'. Cookies do bring CSRF into scope, which SameSite plus a CSRF token addresses.",
    createdAt: "2026-08-26",
  },
];
