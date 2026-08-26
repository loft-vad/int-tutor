# Node.js Interview Question Bank

Source: https://www.geeksforgeeks.org/node-js/node-interview-questions-and-answers/
(fetched 2026-08-26). Every question below is covered in `src/data/nodejs.ts`.
Answers in the app are written from scratch and modernised (Node 20/22 LTS).

## Question list

### Basics

### Node.js Fundamentals & Architecture

- 1. How does Node.js work?
- 2. Can you access DOM in Node?
- 3. What is V8 engine in Node.js?
- 4. Explain the engine Google uses for NodeJS
- 5. What do you mean by event loop in Node.js?
- 6. Why is Node.js single-threaded?
- 7. If Node.js is single-threaded, then how does it handle concurrency?
- 8. What is control flow in Node.js?
- 9. What is the order in which control flow statements get executed?
### Why Node.js: Strengths, Weaknesses & Comparisons

- 10. Why is Node.js preferred over other backend technologies like Java and PHP?
- 11. What are the pros and cons of NodeJS?
- 12. What are the main disadvantages of Node.js?
- 13. What is the difference between Node.js and Angular?
- 14. Explain the difference between Node.js and server-side scripting languages like Python
### Synchronous vs Asynchronous & Callbacks

- 15. What is the difference between Synchronous and Asynchronous functions?
- 16. How many types of API functions are there in Node.js?
- 17. Explain asynchronous and non-blocking APIs in NodeJS.
- 18.What is a callback function in NodeJS?
- 19. What is callback hell?
- 20. What are promises in Node.js?
- 21. What are the three methods to avoid callback hell?
### The Module System

- 22. What are the module in Node.js?
- 23. What is the purpose of the 'require' keyword in Node.js?
- 24. How to import a module in Node.js?
- 25. Which command used to import external libraries?
### NPM & Package Management

- 26. What is NPM?
- 27. What is package.json in Node.js?
- 28. How do you install, update, and delete a dependency?
- 29. How do you manage packages in your Node.js project?
### Building Your First Server

- 30. How to create the simple HTTP server in Node.js?
- 31. How do we create simple ExpressJS application in NodeJS?
- 32. What are the most commonly used libraries in Node.js?
### Environment Setup & Dev Tools

- 33. How to handle environment variables in Node.js?
- 34. What is the purpose of NODE_ENV?
- 35. What is REPL in Node.js?
- 36. Name the tool used for writing consistent code
### Intermediate

### Event-Driven Programming & EventEmitter

- 37. What is event-driven programming in Node.js?
- 38. What is an Event Emitter in Node.js?
### Timers & Event Loop Internals

- 39. Explain the use of the timers module in Node.js.
- 40. Difference between setImmediate() and process.nextTick() methods
- 41. What is the difference between setImmediate() and setTimeout()?
### HTTP, REST & Middleware

- 42. What are the different types of HTTP requests?
- 43. What is REST API?
- 44. What is the use of url module in NodeJS?
- 45. Explain the concept of middleware in NodeJS.
- 46. What is a .body-parser in Node.js?
- 47. What is CORS in Node.js?
### Buffers, Streams & Crypto

- 48. What is a buffer in Node.js?
- 49. What are streams in Node.js?
- 50. Explain the crypto module in Node.js.
### Child Processes

- 51. What are child processes in NodeJS?
- 52. What is a fork in Node.js?
- 53. What is the difference between spawn() and fork() method?
### Working with Databases

- 54. How to handle database connection in NodeJS?
- 55. How to Connect Node.js to a MongoDB Database?
- 56. Explain the Node.js Redis module.
### Testing & Security

- 57. What is a test pyramid in Node.js?
- 58. How to validate data in NodeJS?
- 59. Explain the use of the passport module in Node.js
- 60. Explain the tls module in Node.js.
### Advanced

### Sessions, Auth & File Uploads

- 61. How to manage sessions in Node.js?
- 62. How can we implement authentication and authorization in Node.js?
- 63. Explain the packages used for file uploading in Node.js.the
- 64. What is a cluster in Node.js?
- 65. Explain some of the cluster methods in Node.js
### Core Networking & Utility

- 66. What is web socket?
- 67. Explain the util module in Node.js
- 68. What is the role of net module in NodeJS?
- 69. Explain DNS module in Node.js
### Node.js Internals & Global Objects

- 70. What is piping in Node.js?
- 71. What are global objects in NodeJS?
- 72. How to read command line arguments in Node.js?
- 73. What is reactor pattern in NodeJS?
- 74. What is tracing in NodeJS?

## Modernisation added on top of the source list

Tagged `modern-node` in `src/data/nodejs.ts`:

- ESM in Node: `type: "module"`, `exports`/`imports` maps, conditional exports, dual packages
- `node:` protocol imports, built-in `fetch`/`Headers`/`FormData` (undici)
- `worker_threads` vs `cluster` vs `child_process` — when each is right
- `AbortController` / `AbortSignal` across fs, http, streams, timers
- `AsyncLocalStorage` and async context propagation for request-scoped state
- Web Streams vs Node streams, `stream/promises`, `pipeline`, backpressure
- `node:test` built-in test runner, `--watch`, `--env-file`
- Diagnostics: `perf_hooks`, `diagnostics_channel`, `--cpu-prof`, `--heap-prof`, clinic.js
- Permission model (`--permission`), SEA (single executable applications)
- Graceful shutdown, `process.exitCode`, unhandled rejection semantics
- Event loop phases in detail: timers → pending callbacks → poll → check → close, with
  `process.nextTick` and the microtask queue draining between each phase
