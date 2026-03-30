import type { Question } from '@/types/content';

export const databasesQuestions: Question[] = [
  // ── Flashcards ──────────────────────────────────────────────
  {
    id: 'db-fc-001',
    type: 'flashcard',
    topic: 'databases',
    difficulty: 'beginner',
    tags: ['sql', 'basics'],
    front: 'What is the difference between `WHERE` and `HAVING` in SQL?',
    back: '`WHERE` filters rows **before** grouping (`GROUP BY`). `HAVING` filters groups **after** aggregation.\n\n```sql\nSELECT department, COUNT(*)\nFROM employees\nWHERE salary > 50000      -- row-level filter\nGROUP BY department\nHAVING COUNT(*) > 5;      -- group-level filter\n```',
    explanation: 'WHERE cannot reference aggregate functions; HAVING can. Use WHERE for row filtering to reduce the dataset early and improve performance.',
    createdAt: '2024-01-15',
  },
  {
    id: 'db-fc-002',
    type: 'flashcard',
    topic: 'databases',
    difficulty: 'beginner',
    tags: ['sql', 'joins'],
    front: 'What are the main types of SQL JOINs?',
    back: '- **INNER JOIN** — only matching rows from both tables\n- **LEFT JOIN** — all rows from left table + matching right rows (NULLs if no match)\n- **RIGHT JOIN** — all rows from right table + matching left rows\n- **FULL OUTER JOIN** — all rows from both tables, NULLs where no match\n- **CROSS JOIN** — Cartesian product of both tables',
    explanation: 'In practice INNER and LEFT JOIN cover ~95% of use cases. CROSS JOIN is rarely used except for generating combinations.',
    createdAt: '2024-01-15',
  },
  {
    id: 'db-fc-003',
    type: 'flashcard',
    topic: 'databases',
    difficulty: 'intermediate',
    tags: ['indexing', 'performance'],
    front: 'What is a B-Tree index and why is it the default in most RDBMS?',
    back: 'A **B-Tree** (balanced tree) index keeps data sorted in a self-balancing tree structure where each node can have multiple children.\n\n**Why default:**\n- O(log n) lookups, inserts, and deletes\n- Efficient for range queries (`BETWEEN`, `<`, `>`)\n- Supports equality and prefix matching\n- Keeps data sorted → great for `ORDER BY`',
    explanation: 'B-Tree indexes are general-purpose. Hash indexes are faster for exact equality but cannot do range scans. GIN/GiST indexes are specialized for full-text search and geometric data.',
    createdAt: '2024-01-15',
  },
  {
    id: 'db-fc-004',
    type: 'flashcard',
    topic: 'databases',
    difficulty: 'intermediate',
    tags: ['indexing', 'performance'],
    front: 'What is a covering index and why does it improve performance?',
    back: 'A **covering index** includes all columns needed by a query so the database can satisfy the query entirely from the index without reading the table (no "table lookup" / "heap fetch").\n\n```sql\n-- Query\nSELECT name, email FROM users WHERE status = \'active\';\n\n-- Covering index\nCREATE INDEX idx_cover ON users(status) INCLUDE (name, email);\n```\n\nThis is called an **index-only scan** and avoids random I/O to the heap.',
    explanation: 'Covering indexes trade extra storage and slower writes for significantly faster reads. Use them for hot read paths.',
    createdAt: '2024-01-15',
  },
  {
    id: 'db-fc-005',
    type: 'flashcard',
    topic: 'databases',
    difficulty: 'intermediate',
    tags: ['replication', 'scaling'],
    front: 'What is master/slave (primary/replica) replication?',
    back: '**Primary** handles all writes. **Replicas** receive a copy of the write-ahead log (WAL) and serve read queries.\n\n**Benefits:**\n- Read scaling — distribute reads across replicas\n- High availability — promote a replica if primary fails\n- Geographic distribution — replicas closer to users\n\n**Trade-off:** Replication lag means replicas may serve stale data (eventual consistency).',
    explanation: 'Modern terminology prefers primary/replica over master/slave. Synchronous replication eliminates staleness but increases write latency.',
    createdAt: '2024-01-15',
  },
  {
    id: 'db-fc-006',
    type: 'flashcard',
    topic: 'databases',
    difficulty: 'advanced',
    tags: ['partitioning', 'scaling'],
    front: 'What is the difference between horizontal partitioning (sharding) and vertical partitioning?',
    back: '**Horizontal partitioning (sharding):** Split rows across multiple tables/databases by a shard key (e.g., user_id % N).\n\n**Vertical partitioning:** Split columns into separate tables — keep frequently accessed columns together, move large/rarely-used columns elsewhere.\n\n| | Horizontal | Vertical |\n|---|---|---|\n| Splits | Rows | Columns |\n| Use case | Scale writes | Reduce row size |\n| Complexity | High (cross-shard queries) | Medium |',
    explanation: 'Sharding is a last resort for write scaling. Vertical partitioning is simpler and often done first to reduce I/O by keeping hot columns in a narrow table.',
    createdAt: '2024-01-15',
  },
  {
    id: 'db-fc-007',
    type: 'flashcard',
    topic: 'databases',
    difficulty: 'intermediate',
    tags: ['transactions', 'acid'],
    front: 'What are the ACID properties?',
    back: '- **Atomicity** — Transaction is all-or-nothing. If any part fails, the entire transaction rolls back.\n- **Consistency** — Transaction moves the database from one valid state to another, respecting all constraints.\n- **Isolation** — Concurrent transactions don\'t interfere with each other (as if run serially).\n- **Durability** — Once committed, data survives crashes (written to disk/WAL).',
    explanation: 'Isolation levels (READ UNCOMMITTED → SERIALIZABLE) let you trade isolation for performance. Most apps use READ COMMITTED or REPEATABLE READ.',
    createdAt: '2024-01-15',
  },
  {
    id: 'db-fc-008',
    type: 'flashcard',
    topic: 'databases',
    difficulty: 'advanced',
    tags: ['performance', 'scaling'],
    front: 'How do you handle thousands of queries per second hitting a database?',
    back: '**Layered approach:**\n1. **Connection pooling** — PgBouncer, ProxySQL to reuse connections\n2. **Read replicas** — offload reads from primary\n3. **Caching layer** — Redis/Memcached for hot data\n4. **Query optimization** — proper indexes, EXPLAIN ANALYZE\n5. **Partitioning** — split large tables by range/hash\n6. **Sharding** — distribute writes across multiple primaries\n7. **Materialized views** — pre-compute expensive aggregations\n8. **Rate limiting & queuing** — protect DB from traffic spikes',
    explanation: 'Start from the top. Connection pooling alone can 10x throughput. Sharding is the nuclear option — try everything else first.',
    createdAt: '2024-01-15',
  },
  {
    id: 'db-fc-009',
    type: 'flashcard',
    topic: 'databases',
    difficulty: 'beginner',
    tags: ['sql', 'normalization'],
    front: 'What is database normalization and what are the first three normal forms?',
    back: 'Normalization reduces data redundancy by organizing tables.\n\n- **1NF** — Each column holds atomic (indivisible) values. No repeating groups.\n- **2NF** — 1NF + every non-key column depends on the **entire** primary key (no partial dependencies).\n- **3NF** — 2NF + no non-key column depends on another non-key column (no transitive dependencies).\n\nDenormalization (adding redundancy) is sometimes done intentionally for read performance.',
    explanation: 'Most production schemas are in 3NF. Beyond that (BCNF, 4NF, 5NF) is rarely needed in practice.',
    createdAt: '2024-01-15',
  },
  {
    id: 'db-fc-010',
    type: 'flashcard',
    topic: 'databases',
    difficulty: 'intermediate',
    tags: ['performance', 'query-optimization'],
    front: 'What does `EXPLAIN ANALYZE` do and what should you look for?',
    back: '`EXPLAIN ANALYZE` runs the query and shows the actual execution plan with real timings.\n\n**Key things to look for:**\n- **Seq Scan** on large tables → missing index\n- **Nested Loop** with large outer set → consider hash/merge join\n- **Sort** with high cost → add index for ORDER BY\n- **Rows** estimate vs actual → stale statistics (`ANALYZE`)\n- **Buffers** → shared hit (cache) vs read (disk I/O)',
    explanation: 'EXPLAIN without ANALYZE shows estimates only. Always use ANALYZE on a non-production replica if the query is slow, since it actually executes.',
    createdAt: '2024-01-15',
  },
  {
    id: 'db-fc-011',
    type: 'flashcard',
    topic: 'databases',
    difficulty: 'advanced',
    tags: ['scaling', 'consistency'],
    front: 'What is the CAP theorem?',
    back: 'In a distributed system, you can only guarantee **two out of three**:\n\n- **Consistency** — every read gets the most recent write\n- **Availability** — every request gets a response\n- **Partition tolerance** — system works despite network failures\n\nSince network partitions are inevitable, the real choice is **CP** (consistent but may reject requests) vs **AP** (available but may return stale data).\n\n- CP: PostgreSQL, MongoDB (default), etcd\n- AP: Cassandra, DynamoDB, CouchDB',
    explanation: 'CAP is a simplification. In practice, systems offer tunable consistency (e.g., DynamoDB strong vs eventual reads).',
    createdAt: '2024-01-15',
  },
  {
    id: 'db-fc-012',
    type: 'flashcard',
    topic: 'databases',
    difficulty: 'intermediate',
    tags: ['indexing', 'performance'],
    front: 'What is a composite index and does column order matter?',
    back: 'A **composite index** covers multiple columns. Column order is critical due to the **leftmost prefix rule**.\n\n```sql\nCREATE INDEX idx ON orders(status, created_at, customer_id);\n```\n\nThis index supports:\n- `WHERE status = ?` ✅\n- `WHERE status = ? AND created_at > ?` ✅\n- `WHERE status = ? AND created_at > ? AND customer_id = ?` ✅\n- `WHERE created_at > ?` ❌ (skips leftmost column)\n- `WHERE customer_id = ?` ❌\n\n**Rule of thumb:** put equality columns first, then range columns.',
    explanation: 'Think of a composite index like a phone book sorted by last name, then first name. You can look up by last name, or last+first, but not first name alone.',
    createdAt: '2024-01-15',
  },

  // ── Multiple Choice ─────────────────────────────────────────
  {
    id: 'db-mc-001',
    type: 'multiple-choice',
    topic: 'databases',
    difficulty: 'beginner',
    tags: ['sql', 'basics'],
    prompt: 'Which SQL clause is used to filter results AFTER a GROUP BY aggregation?',
    options: [
      { id: 'a', text: 'WHERE' },
      { id: 'b', text: 'HAVING' },
      { id: 'c', text: 'FILTER' },
      { id: 'd', text: 'LIMIT' },
    ],
    correctOptionId: 'b',
    timeLimitSeconds: 20,
    explanation: 'HAVING filters groups after aggregation. WHERE filters rows before grouping and cannot use aggregate functions.',
    createdAt: '2024-01-15',
  },
  {
    id: 'db-mc-002',
    type: 'multiple-choice',
    topic: 'databases',
    difficulty: 'intermediate',
    tags: ['indexing', 'performance'],
    prompt: 'You have an index on `orders(status, created_at)`. Which query can NOT use this index efficiently?',
    options: [
      { id: 'a', text: 'SELECT * FROM orders WHERE status = \'pending\'' },
      { id: 'b', text: 'SELECT * FROM orders WHERE status = \'pending\' AND created_at > \'2024-01-01\'' },
      { id: 'c', text: 'SELECT * FROM orders WHERE created_at > \'2024-01-01\'' },
      { id: 'd', text: 'SELECT * FROM orders WHERE status = \'pending\' ORDER BY created_at' },
    ],
    correctOptionId: 'c',
    timeLimitSeconds: 30,
    explanation: 'Due to the leftmost prefix rule, the index on (status, created_at) cannot be used efficiently when the query only filters on created_at, skipping the first column.',
    createdAt: '2024-01-15',
  },
  {
    id: 'db-mc-003',
    type: 'multiple-choice',
    topic: 'databases',
    difficulty: 'intermediate',
    tags: ['transactions', 'isolation'],
    prompt: 'Which transaction isolation level prevents dirty reads but allows non-repeatable reads?',
    options: [
      { id: 'a', text: 'READ UNCOMMITTED' },
      { id: 'b', text: 'READ COMMITTED' },
      { id: 'c', text: 'REPEATABLE READ' },
      { id: 'd', text: 'SERIALIZABLE' },
    ],
    correctOptionId: 'b',
    timeLimitSeconds: 25,
    explanation: 'READ COMMITTED prevents dirty reads (you only see committed data) but another transaction can commit changes between your reads, causing non-repeatable reads.',
    createdAt: '2024-01-15',
  },
  {
    id: 'db-mc-004',
    type: 'multiple-choice',
    topic: 'databases',
    difficulty: 'advanced',
    tags: ['partitioning', 'scaling'],
    prompt: 'What is the main disadvantage of horizontal sharding?',
    options: [
      { id: 'a', text: 'It increases storage cost per shard' },
      { id: 'b', text: 'Cross-shard queries and joins become expensive or impossible' },
      { id: 'c', text: 'It requires all tables to have the same shard key' },
      { id: 'd', text: 'It eliminates the ability to use indexes' },
    ],
    correctOptionId: 'b',
    timeLimitSeconds: 25,
    explanation: 'Sharding distributes data across databases. Queries that span multiple shards require scatter-gather, which is slow. Joins across shards are typically not supported natively.',
    createdAt: '2024-01-15',
  },
  {
    id: 'db-mc-005',
    type: 'multiple-choice',
    topic: 'databases',
    difficulty: 'beginner',
    tags: ['sql', 'basics'],
    prompt: 'What does a `LEFT JOIN` return when there is no matching row in the right table?',
    options: [
      { id: 'a', text: 'The row is excluded from the result' },
      { id: 'b', text: 'An error is thrown' },
      { id: 'c', text: 'The right table columns are filled with NULL' },
      { id: 'd', text: 'The right table columns are filled with default values' },
    ],
    correctOptionId: 'c',
    timeLimitSeconds: 20,
    explanation: 'LEFT JOIN keeps all rows from the left table. When no match exists in the right table, all right-side columns return NULL.',
    createdAt: '2024-01-15',
  },
  {
    id: 'db-mc-006',
    type: 'multiple-choice',
    topic: 'databases',
    difficulty: 'intermediate',
    tags: ['replication', 'scaling'],
    prompt: 'What is the primary risk of asynchronous replication?',
    options: [
      { id: 'a', text: 'Write throughput is reduced on the primary' },
      { id: 'b', text: 'Replicas may serve stale data due to replication lag' },
      { id: 'c', text: 'The primary cannot accept new connections' },
      { id: 'd', text: 'Indexes are not replicated' },
    ],
    correctOptionId: 'b',
    timeLimitSeconds: 25,
    explanation: 'In async replication, the primary confirms writes before replicas receive them. During lag, replicas return stale data. Synchronous replication fixes this at the cost of write latency.',
    createdAt: '2024-01-15',
  },
  {
    id: 'db-mc-007',
    type: 'multiple-choice',
    topic: 'databases',
    difficulty: 'advanced',
    tags: ['performance', 'scaling'],
    prompt: 'Which technique should you try FIRST to handle 10,000 queries/sec on a single PostgreSQL instance?',
    options: [
      { id: 'a', text: 'Shard the database across 4 nodes' },
      { id: 'b', text: 'Add connection pooling (e.g., PgBouncer)' },
      { id: 'c', text: 'Switch to a NoSQL database' },
      { id: 'd', text: 'Enable synchronous replication' },
    ],
    correctOptionId: 'b',
    timeLimitSeconds: 25,
    explanation: 'Connection pooling is the lowest-effort, highest-impact optimization. Without it, each connection uses ~10MB RAM and a full backend process. PgBouncer can multiplex thousands of client connections onto a handful of server connections.',
    createdAt: '2024-01-15',
  },
  {
    id: 'db-mc-008',
    type: 'multiple-choice',
    topic: 'databases',
    difficulty: 'intermediate',
    tags: ['sql', 'performance'],
    prompt: 'Why is `SELECT *` generally discouraged in production queries?',
    options: [
      { id: 'a', text: 'It causes syntax errors in some databases' },
      { id: 'b', text: 'It fetches unnecessary columns, wasting I/O and preventing covering index usage' },
      { id: 'c', text: 'It locks the entire table' },
      { id: 'd', text: 'It bypasses query caching' },
    ],
    correctOptionId: 'b',
    timeLimitSeconds: 20,
    explanation: 'SELECT * reads all columns from disk even if you only need a few. It also prevents the optimizer from using index-only scans (covering indexes) since all columns must be fetched.',
    createdAt: '2024-01-15',
  },
  {
    id: 'db-mc-009',
    type: 'multiple-choice',
    topic: 'databases',
    difficulty: 'advanced',
    tags: ['partitioning'],
    prompt: 'In range-based table partitioning, what is a common partition key for time-series data?',
    options: [
      { id: 'a', text: 'The primary key (auto-increment ID)' },
      { id: 'b', text: 'A hash of the row content' },
      { id: 'c', text: 'The timestamp / date column' },
      { id: 'd', text: 'The foreign key to the parent table' },
    ],
    correctOptionId: 'c',
    timeLimitSeconds: 20,
    explanation: 'Time-series data naturally partitions by date ranges (daily, monthly). This enables partition pruning for time-bounded queries and makes it easy to drop old data by detaching old partitions.',
    createdAt: '2024-01-15',
  },
  {
    id: 'db-mc-010',
    type: 'multiple-choice',
    topic: 'databases',
    difficulty: 'beginner',
    tags: ['sql', 'basics'],
    prompt: 'What is the purpose of a PRIMARY KEY constraint?',
    options: [
      { id: 'a', text: 'It creates an index on the column but allows duplicates' },
      { id: 'b', text: 'It uniquely identifies each row and implicitly creates a unique index' },
      { id: 'c', text: 'It enforces that the column cannot be updated' },
      { id: 'd', text: 'It links the column to another table' },
    ],
    correctOptionId: 'b',
    timeLimitSeconds: 20,
    explanation: 'A PRIMARY KEY enforces uniqueness and NOT NULL on the column(s). In most databases, it also becomes the clustered index that determines the physical row order on disk.',
    createdAt: '2024-01-15',
  },

  // ── Coding Challenges ───────────────────────────────────────
  {
    id: 'db-code-001',
    type: 'coding-challenge',
    topic: 'databases',
    difficulty: 'intermediate',
    tags: ['sql', 'query-optimization'],
    mode: 'fix',
    prompt: 'This SQL query is slow on a table with 10 million rows. Rewrite it to be efficient. The table has an index on `(status, created_at)`.',
    starterCode: `-- Slow query: full table scan
SELECT id, customer_name, total
FROM orders
WHERE YEAR(created_at) = 2024
  AND status = 'completed'
ORDER BY created_at DESC
LIMIT 20;`,
    solutionCode: `-- Fixed: uses the index on (status, created_at)
-- 1. Put equality column (status) first to match index
-- 2. Replace YEAR() with a range to avoid breaking the index
SELECT id, customer_name, total
FROM orders
WHERE status = 'completed'
  AND created_at >= '2024-01-01'
  AND created_at < '2025-01-01'
ORDER BY created_at DESC
LIMIT 20;`,
    language: 'javascript',
    hints: [
      'Wrapping a column in a function like YEAR() prevents the database from using an index on that column.',
      'Think about the leftmost prefix rule for the composite index (status, created_at).',
      'Use a range condition instead of a function to preserve index usage.',
    ],
    explanation: 'YEAR(created_at) applies a function to every row, forcing a full scan. Rewriting as a range condition (>= and <) allows the B-Tree index to be used. Matching the index column order (status first) enables a full index range scan.',
    createdAt: '2024-01-15',
  },
  {
    id: 'db-code-002',
    type: 'coding-challenge',
    topic: 'databases',
    difficulty: 'advanced',
    tags: ['sql', 'partitioning'],
    mode: 'complete',
    prompt: 'Complete the SQL to create a range-partitioned table for storing events by month, with partitions for January through March 2024.',
    starterCode: `-- Create a partitioned events table
CREATE TABLE events (
    id BIGSERIAL,
    event_type VARCHAR(50) NOT NULL,
    payload JSONB,
    created_at TIMESTAMPTZ NOT NULL
) PARTITION BY RANGE (created_at);

-- TODO: Create partitions for Jan, Feb, Mar 2024
`,
    solutionCode: `-- Create a partitioned events table
CREATE TABLE events (
    id BIGSERIAL,
    event_type VARCHAR(50) NOT NULL,
    payload JSONB,
    created_at TIMESTAMPTZ NOT NULL
) PARTITION BY RANGE (created_at);

-- Partitions for Jan, Feb, Mar 2024
CREATE TABLE events_2024_01 PARTITION OF events
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE events_2024_02 PARTITION OF events
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

CREATE TABLE events_2024_03 PARTITION OF events
    FOR VALUES FROM ('2024-03-01') TO ('2024-04-01');`,
    language: 'javascript',
    hints: [
      'Use CREATE TABLE ... PARTITION OF ... FOR VALUES FROM ... TO ...',
      'The TO boundary is exclusive — so February starts at 2024-02-01 and goes TO 2024-03-01.',
      'Each partition is a regular table that can have its own indexes.',
    ],
    explanation: 'Range partitioning by month is the most common strategy for time-series data. The FROM value is inclusive and TO is exclusive. Each partition can be independently indexed, vacuumed, or detached for archival.',
    createdAt: '2024-01-15',
  },
  {
    id: 'db-code-003',
    type: 'coding-challenge',
    topic: 'databases',
    difficulty: 'intermediate',
    tags: ['sql', 'window-functions'],
    mode: 'complete',
    prompt: 'Complete the query using a window function to rank employees by salary within each department, showing only the top 3 per department.',
    starterCode: `-- Get top 3 highest-paid employees per department
SELECT department, name, salary, rank_num
FROM (
    SELECT
        department,
        name,
        salary,
        -- TODO: Add window function to rank by salary within department
    FROM employees
) ranked
-- TODO: Filter to top 3
;`,
    solutionCode: `-- Get top 3 highest-paid employees per department
SELECT department, name, salary, rank_num
FROM (
    SELECT
        department,
        name,
        salary,
        ROW_NUMBER() OVER (
            PARTITION BY department
            ORDER BY salary DESC
        ) AS rank_num
    FROM employees
) ranked
WHERE rank_num <= 3;`,
    language: 'javascript',
    hints: [
      'Use ROW_NUMBER(), RANK(), or DENSE_RANK() as the window function.',
      'PARTITION BY divides rows into groups (like GROUP BY but without collapsing).',
      'ORDER BY inside OVER() determines the ranking order.',
    ],
    explanation: 'Window functions compute values across a set of rows related to the current row without collapsing them. ROW_NUMBER() gives unique sequential numbers; RANK() would give ties the same number and skip the next.',
    createdAt: '2024-01-15',
  },
  {
    id: 'db-code-004',
    type: 'coding-challenge',
    topic: 'databases',
    difficulty: 'advanced',
    tags: ['connection-pooling', 'nodejs'],
    mode: 'read',
    prompt: 'Read this Node.js database connection pool configuration. What problems exist and how would you fix them?',
    starterCode: `const { Pool } = require('pg');

// Connection pool for a high-traffic API (5000 req/s)
const pool = new Pool({
  host: 'primary.db.internal',
  database: 'myapp',
  max: 500,              // max connections in pool
  idleTimeoutMillis: 0,  // never close idle connections
  connectionTimeoutMillis: 30000,
  query_timeout: 60000,
});

// API handler
app.get('/users/:id', async (req, res) => {
  const client = await pool.connect();
  const result = await client.query(
    'SELECT * FROM users WHERE id = ' + req.params.id
  );
  res.json(result.rows[0]);
});`,
    solutionCode: `const { Pool } = require('pg');

// Fixed pool configuration
const pool = new Pool({
  host: 'primary.db.internal',
  database: 'myapp',
  max: 20,                       // PostgreSQL handles ~100 connections well; 20 per app instance is plenty
  idleTimeoutMillis: 30000,      // Release idle connections after 30s
  connectionTimeoutMillis: 5000, // Fail fast if pool is exhausted
  query_timeout: 10000,          // 10s query timeout to prevent long-running queries
});

// Fixed API handler
app.get('/users/:id', async (req, res) => {
  // Use pool.query() for single queries (auto-releases connection)
  const result = await pool.query(
    'SELECT id, name, email FROM users WHERE id = $1',  // parameterized query (prevents SQL injection)
    [req.params.id]
  );
  res.json(result.rows[0]);
});`,
    language: 'javascript',
    hints: [
      'PostgreSQL default max_connections is 100. What happens with max: 500?',
      'Look at the query string construction — is it safe?',
      'The client is acquired with pool.connect() but never released.',
    ],
    explanation: 'Problems: (1) max:500 exceeds PostgreSQL limits — use 20-50 per app instance with PgBouncer in front. (2) idleTimeoutMillis:0 wastes connections. (3) SQL injection via string concatenation — use parameterized queries. (4) client.release() is never called, causing connection pool exhaustion. Use pool.query() for single queries instead.',
    createdAt: '2024-01-15',
  },
];
