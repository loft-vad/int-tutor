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
];
