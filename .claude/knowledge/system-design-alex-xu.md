# System Design Interview — An Insider's Guide (Alex Xu, Vol. 1)

Distilled chapter notes. Source PDF is **not** committed (licensed book). This file is the
shared reference behind the extended `system-design` question bank.

---

## Ch.1 — Scale from Zero to Millions of Users

The scaling ladder, in the order the book walks it:

1. **Single server** — web app, DB, cache all on one box. DNS → IP → HTTP.
2. **Separate the database** — web tier and data tier scale independently.
3. **Relational vs non-relational** — pick NoSQL when you need super-low latency,
   unstructured/non-relational data, only serialize/deserialize, or store a massive amount
   of data.
4. **Vertical vs horizontal scaling** — vertical (scale up) is simple but has a hard
   ceiling, no failover, no redundancy. Horizontal (scale out) is the answer at scale.
5. **Load balancer** — public VIP in front of a private-IP server pool; removes the web
   tier as a single point of failure.
6. **Database replication** — primary handles writes, replicas handle reads. Benefits:
   better performance, reliability, high availability. Failure modes: one replica down →
   route reads elsewhere; primary down → promote a replica.
7. **Cache** — read-through cache between web tier and DB. Considerations: use for
   read-heavy/infrequently-modified data, always set an expiration policy, consistency
   between store and cache, avoid a single cache server (SPOF), eviction policy (LRU, LFU,
   FIFO).
8. **CDN** — geographically dispersed static-content servers. Consider cost, TTL, CDN
   fallback, file invalidation.
9. **Stateless web tier** — move session state out to a shared store; enables autoscaling.
10. **Data centers** — geoDNS routes users to the nearest DC. Challenges: traffic
    redirection, data synchronization, test & deployment.
11. **Message queue** — decouples producers from consumers, enables independent scaling.
12. **Logging, metrics, automation** — host-level, aggregated, and business metrics; CI/CD.
13. **Database scaling** — vertical, then **sharding**. Sharding problems: resharding data,
    celebrity/hotspot key problem, join & denormalization.

## Ch.2 — Back-of-the-Envelope Estimation

Prerequisites: power of two, latency numbers, availability numbers.

**Power of two** — 2^10 = 1 thousand (KB), 2^20 = 1 million (MB), 2^30 = 1 billion (GB),
2^40 = 1 trillion (TB), 2^50 = 1 quadrillion (PB).

**Latency numbers (Jeff Dean)** — L1 ~0.5 ns, branch mispredict 5 ns, L2 7 ns, mutex
lock/unlock 100 ns, main memory reference 100 ns, compress 1K with Zippy 10 µs, send 2K over
1 Gbps 20 µs, read 1 MB sequentially from memory 250 µs, round trip within same DC 500 µs,
disk seek 10 ms, read 1 MB from network 10 ms, read 1 MB from disk 30 ms, send packet
CA→Netherlands→CA 150 ms.
Conclusions: memory is fast, disk is slow, avoid disk seeks, compression is cheap, compress
before sending over the network, cross-region traffic is expensive.

**Availability numbers** — 99% ≈ 3.65 days/yr downtime, 99.9% ≈ 8.77 h, 99.99% ≈ 52.6 min,
99.999% ≈ 5.26 min, 99.9999% ≈ 31.56 s. Cloud SLAs sit at 99.9%+.

**Worked example — Twitter QPS/storage.** 300M MAU, 50% daily → 150M DAU, 2 tweets/user/day
→ QPS = 150M × 2 / 24 / 3600 ≈ **3,500**; peak ≈ 2× ≈ **7,000**. Tweet = 64 B id + 140 B text
+ 1 MB media, 10% have media → 150M × 2 × 10% × 1 MB = **30 TB/day**; 5 years ≈ **55 PB**.

**Tips** — round and approximate, write down assumptions, label units, and practice the
common ones: QPS, peak QPS, storage, cache, number of servers.

## Ch.3 — A Framework for System Design Interviews

**4-step process:**
1. **Understand the problem and establish design scope** (~3–10 min). Don't be "Jimmy" — do
   not answer fast. Ask: what features exactly, how many users, expected scale in 3/6/12
   months, existing tech stack. Write assumptions down.
2. **Propose high-level design and get buy-in** (~10–15 min). Draw boxes: clients, API
   gateway, servers, data stores, cache, CDN, message queue. Do back-of-the-envelope on the
   blueprint. Collaborate — treat the interviewer as a teammate.
3. **Design deep dive** (~10–25 min). Interviewer steers; go deep where they point
   (usually the bottleneck or the interesting trade-off). Don't get lost in unnecessary
   details.
4. **Wrap up** (~3–5 min). Identify bottlenecks, propose improvements, recap the design,
   discuss error cases (server failure, network loss), operational issues (metrics, rollout),
   next scale-up step, and further refinements.

**Red flags:** over-engineering, design purity over trade-offs, narrow-mindedness,
stubbornness, jumping to a solution.

**Dos:** ask for clarification, understand the requirements, communicate, suggest multiple
approaches, bounce ideas off the interviewer.
**Don'ts:** be unprepared, jump into a solution without clarifying, go into too much detail on
one component, think in silence, think you're done too early.

## Ch.4 — Design a Rate Limiter

Where it lives: client-side (unreliable), server-side, or **middleware / API gateway**.

**Algorithms:**
| Algorithm | How it works | Pros | Cons |
|---|---|---|---|
| **Token bucket** | Bucket of capacity N, refilled at a fixed rate; each request takes a token | Simple, memory efficient, allows bursts | Two params (size, refill rate) are hard to tune |
| **Leaking bucket** | FIFO queue drained at a fixed rate; full queue → drop | Memory efficient with a fixed queue, stable outflow rate | Burst fills the queue with old requests; two params to tune |
| **Fixed window counter** | Counter per fixed time window | Memory efficient, easy to understand, fits "reset at window end" quotas | Burst at window edges can let through 2× the quota |
| **Sliding window log** | Keep a sorted set of request timestamps; count those in the window | Very accurate rate limiting | Stores timestamps even for rejected requests — memory heavy |
| **Sliding window counter** | Blend previous and current window counters by overlap | Smooths bursts, memory efficient | Approximate — only works well for a not-too-spiky arrival rate |

**Architecture:** counters in **Redis** (`INCR`, `EXPIRE`) rather than a database — in-memory
and supports TTL. Rules in config files on disk, loaded into cache by workers.
**Rate-limited responses:** HTTP **429 Too Many Requests**; headers
`X-Ratelimit-Remaining`, `X-Ratelimit-Limit`, `X-Ratelimit-Retry-After`.
**Distributed issues:** *race condition* (read-then-write on counters — fix with Lua scripts
or sorted sets, not locks, which are slow) and *synchronization* (use a centralized Redis,
not sticky sessions).
**Also:** hard vs soft rate limiting, limiting at different layers (Iptables at L3),
client-side best practices (cache, respect `Retry-After`, back off).

## Ch.5 — Design Consistent Hashing

**Problem with `serverIndex = hash(key) % N`:** when a server is added or removed, almost
every key remaps → a storm of cache misses.

**Consistent hashing:** map both servers and keys onto a hash ring (e.g. SHA-1 space).
A key belongs to the first server found going clockwise. Adding/removing a server only
remaps `k/n` keys on average.

**Two problems with the basic ring, both solved by virtual nodes:**
1. Partitions (the hash space between adjacent servers) are not uniform.
2. Key distribution is non-uniform.

**Virtual nodes:** each physical server gets many virtual nodes on the ring. More virtual
nodes → smaller standard deviation of load, but more space for metadata. It is a trade-off.

Real-world users: Amazon Dynamo, Apache Cassandra partitioning, Akamai CDN, Discord,
Maglev network load balancer.

## Ch.6 — Design a Key-Value Store

**CAP theorem** — Consistency, Availability, Partition tolerance: pick two. Since network
partitions are unavoidable in distributed systems, the real choice is **CP** (e.g. banking)
vs **AP** (e.g. Dynamo, Cassandra).

**Core components:**
- **Data partition** — consistent hashing with virtual nodes.
- **Data replication** — replicate to the next `N` *unique* servers clockwise on the ring;
  spread replicas across data centers.
- **Consistency** — quorum: `N` replicas, `W` write quorum, `R` read quorum.
  `W + R > N` guarantees strong consistency. `R=1, W=N` → fast reads. `W=1, R=N` → fast
  writes. Common: `N=3, W=R=2`.
- **Consistency models** — strong, weak, eventual (Dynamo/Cassandra choose eventual).
- **Inconsistency resolution: versioning + vector clocks** `[server, counter]` pairs;
  detect conflicts and hand resolution to the client. Downside: client complexity and
  unbounded vector-clock growth (use a threshold).
- **Failure detection** — decentralized **gossip protocol** with heartbeat counters, not
  all-to-all multicasting.
- **Temporary failures** — **sloppy quorum** and **hinted handoff**.
- **Permanent failures** — anti-entropy with **Merkle trees** to minimize transferred data.
- **Data center outage** — replicate across data centers.

**Write path:** write to commit log → memory cache (memtable) → flush to **SSTable** on disk.
**Read path:** memory cache → **bloom filter** to pick the SSTable → SSTable → return.

## Ch.7 — Design a Unique ID Generator in Distributed Systems

Options: multi-master replication (`auto_increment` by k), UUID (128-bit, no coordination,
but non-numeric and not sortable by time), ticket server (SPOF), and **Twitter Snowflake**.

**Snowflake, 64 bits:**
| Section | Bits | Meaning |
|---|---|---|
| Sign bit | 1 | Always 0, reserved |
| Timestamp | 41 | Milliseconds since a custom epoch |
| Datacenter ID | 5 | 32 data centers |
| Machine ID | 5 | 32 machines per DC |
| Sequence | 12 | Incremented per ms per machine, reset each ms → 4096 IDs/ms/machine |

41 bits of milliseconds ≈ **69 years**. IDs are sortable by time. Datacenter and machine IDs
are fixed at startup; changing them at runtime is risky.
Additional talking points: clock synchronization (NTP), section-length tuning, high
availability.

## Ch.8 — Design a URL Shortener

**API:** `POST /api/v1/data/shorten {longUrl}` → shortUrl; `GET /api/v1/shortUrl` →
**301** (permanent — browser caches, less server load) or **302** (temporary — every click
hits your server, which you want for analytics).

**Hash function options:**
- Hash + collision resolution — hash the long URL (CRC32, MD5, SHA-1), take the first `n`
  characters, resolve collisions by appending a predefined string and rehashing (needs a DB
  lookup per attempt; a bloom filter makes this cheap).
- **Base-62 conversion** — convert a unique ID to base 62 (`0-9a-zA-Z`). Length grows with
  the ID; IDs are predictable/guessable. Requires a unique ID generator.

**Length maths:** 62^7 ≈ 3.5 trillion, enough for 365 billion URLs.
**Storage:** a relational table `(id, shortURL, longURL)`.
**Deep dive:** rate limiter (by IP), web-tier scaling (stateless), database scaling
(sharding/replication), analytics, availability/consistency/reliability.

## Ch.9 — Design a Web Crawler

**Purpose:** search-engine indexing, web archiving, web mining, monitoring.
**Characteristics:** scalability, robustness (bad HTML, unresponsive servers, crashes,
malicious links), politeness, extensibility.

**Components:** Seed URLs → **URL Frontier** → HTML Downloader → DNS Resolver → Content
Parser → **Content Seen?** → Content Storage → Link Extractor → URL Filter → **URL Seen?**
→ back to URL Frontier.

**Traversal:** BFS with a FIFO queue, but naive BFS is impolite (floods one host) and has no
priority. The **URL Frontier** solves both:
- **Politeness** — a mapping table from hostname to a FIFO queue, one worker thread per
  queue, with a delay between downloads to the same host.
- **Priority** — a prioritizer assigns priority; front queues (priority) feed back queues
  (politeness).
- **Freshness** — recrawl based on update history and prioritize important pages.
- Frontier storage is a **hybrid**: majority on disk, buffers in memory.

**HTML Downloader:** respect `robots.txt` (cached), distributed crawl, DNS cache (DNS
resolution is a bottleneck — it's synchronous), locality (geographically close servers),
short timeouts.
**Robustness:** consistent hashing, save crawl state, exception handling, data validation.
**Traps:** redundant content (compare hashes/checksums), spider traps (URL length limits,
manual exclusion), data noise (ads, spam, code snippets).

## Ch.10 — Design a Notification System

**Types:** mobile push (iOS APNs, Android FCM), SMS (Twilio, Nexmo), email (SendGrid,
Mailchimp).
**Contact info gathering flow:** collect device tokens / phone numbers / emails at signup;
`user` and `device` tables (a user can have multiple devices).

**Flow:** services 1..N → notification servers → cache + DB → **message queues** (one per
channel, acting as buffers) → workers → third-party services → devices.

**Notification servers:** provide APIs, do basic validation, query the DB/cache to build
notification payloads, and rate-limit.

**Reliability:** never lose data — persist notifications in a **notification log** database
with retry. **Exactly-once is not guaranteed** — APNs/FCM are at-least-once, so dedupe with
an event ID check.
**Additional:** notification templates, settings (per-channel opt-out), rate limiting,
retry, security (`appKey`/`appSecret` for authenticated APIs), event tracking (open rate,
click rate, engagement) via analytics.

## Ch.11 — Design a News Feed System

**Two flows:**
1. **Feed publishing** — user posts → post service persists → **fanout service** pushes the
   post ID into friends' news-feed caches → notification service.
2. **Feed building** — fetch post IDs from the news-feed cache → hydrate users and posts
   from caches → return the fully hydrated feed.

**Fanout models:**
- **Fanout on write (push)** — precompute the feed at post time. Real-time, fast reads.
  Bad for users with many friends (hotkey problem) and wastes work on inactive users.
- **Fanout on read (pull)** — build the feed at read time. Efficient for inactive users and
  no hotkey problem, but reads are slow.
- **Hybrid** — push for the majority, pull for celebrities.

**Cache tiers:** news feed (post IDs), content (posts, hot content separated), social graph,
action (liked/replied/etc.), counters.
**Also:** keep the web tier stateless, push data to clients, use a pull model with long
polling / WebSocket for real-time, database replication and sharding.

## Ch.12 — Design a Chat System

**Requirements shape it:** 1-on-1 and group chat (max 100 people), online presence,
multiple devices, push notifications, 50M DAU.

**Transport:** clients poll → long polling → **WebSocket** (bidirectional, persistent,
works through firewalls on 80/443). Use WebSocket for send and receive; everything else
(auth, profile, service discovery) can be plain HTTP.

**Three service families:** stateless (auth, group management, user profile, service
discovery), **stateful** (chat service — a client keeps a persistent connection to one chat
server), and third-party integration (push notification).

**Storage:** generic user data in a relational DB; **chat history in a key-value store**
because the data is enormous, most of it is never read again, only recent messages are
accessed, and horizontal scaling is easy (Facebook uses HBase, Discord uses Cassandra).
**Message table:** 1-on-1 keyed by `message_id`; group chat keyed by
`(channel_id, message_id)` — `channel_id` is the partition key.
**message_id** must be unique and **sortable by time** — use a global 64-bit sequence
generator (Snowflake) or a local per-channel sequence.

**Flows:** message sending (chat server → ID generator → message sync queue → KV store →
push to the recipient's connection or push notification if offline); message sync across
devices via a `cur_max_message_id` per device.
**Presence:** heartbeat every `x` seconds to the presence servers; missing heartbeats beyond
a threshold → offline. Fanout of presence via a publish-subscribe model, one channel per
friend pair (works because group sizes are small).

## Ch.13 — Design a Search Autocomplete System

**Requirements:** fast (< 100 ms), relevant, sorted by popularity, scalable, highly available.
**Estimation:** 10M DAU, 10 searches/day, 20 bytes per query, 4 requests per search word →
~24,000 QPS, peak ~48,000.

**Two services:**
- **Data gathering service** — analytics logs → aggregators → weekly workers → the trie DB.
- **Query service** — read from the trie cache (Redis) with a DB fallback.

**Trie:** each node stores the top `k` most-queried strings for its prefix (caching top
queries at each node), so a query is O(1)-ish instead of traversing the whole subtree.
Without the optimization: find the prefix `O(p)`, traverse the subtree `O(c)`, sort `O(c log c)`.
Second optimization: **limit the max prefix length** — nobody types a 100-character prefix,
so the prefix traversal is O(1).

**Trie storage:** the trie is too big for one server — **shard by prefix** with a shard map
manager that accounts for the uneven distribution of first letters (many more `s` words than
`x` words).
**Scaling & extras:** browser caching of suggestions (with a max-age), AJAX requests that
don't refresh the page, real-time updates via Kafka + streaming (Hadoop/Storm) for trending
queries, filtering out unsafe/unwanted suggestions, and per-language / per-country tries.

## Ch.14 — Design YouTube

**Estimation:** 5M DAU, 5 videos/day, 10% upload, 300 MB average → ~150 TB/day storage;
CDN cost dominates ($0.02/GB → ~$150k/day).

**High level:** client, **CDN** (videos are streamed from the CDN), and API servers
(everything else).
**Video uploading flow:** load balancer → API servers → metadata DB (sharded) + metadata
cache → **original storage (BLOB)** → **transcoding servers** → transcoded storage →
CDN + completion queue → completion handler → metadata DB/cache.
Parallel flow: update metadata after the file upload.
**Video streaming flow:** streaming protocols — MPEG-DASH, Apple HLS, Microsoft Smooth
Streaming, Adobe HDS. Videos are streamed directly from CDN edge servers.

**Video transcoding** matters because raw video is huge, many devices/bandwidths need
different formats, and adaptive bitrate needs multiple renditions.
**Encoding formats:** container (`.avi`, `.mp4`, `.mov`) + codecs (H.264, VP9, HEVC).
**DAG model** (Facebook's Streaming Video Engine): video → inspection / video encoding /
thumbnail / watermark, composed as stages of tasks.
**Architecture:** preprocessor (DAG generation, splitting into GOPs, caching) → DAG scheduler
→ resource manager (task queue, worker queue, running queue, task scheduler) → task workers
→ temporary storage → encoded video.

**Optimizations:** speed (parallelize uploads by splitting into GOPs, place upload centers
close to users, parallelism everywhere), safety (pre-signed upload URLs, DRM —
FairPlay/Widevine/PlayReady, watermarking), cost (serve only popular videos from CDN, don't
pre-encode cold content, build your own CDN for popular content, regional popularity).
**Error handling:** recoverable errors → retry a few times; non-recoverable → stop and
return the right error code.

## Ch.15 — Design Google Drive

**Requirements:** upload/download, file sync across devices, notifications, file revisions,
sharing, 10M DAU, 10 GB free space per user, 2 uploads/day at 500 KB.

**Start simple:** a single web server + a local file system + a database, files in
directories named by a hashed user ID. Then move file storage to **Amazon S3** with
cross-region replication, and add a load balancer, multiple API servers, a metadata
database (sharded), and a block server.

**Block servers** are the key idea: split a file into **blocks** (Dropbox uses 4 MB max),
**delta sync** (only changed blocks are uploaded), and **compress** each block with an
algorithm chosen per file type (gzip/bzip2 for text, different for images/video).

**Strong consistency** is required — metadata cache and DB must agree. Invalidate the cache
on write and use a relational DB with ACID properties.
**Metadata schema:** `user`, `device` (with `push_id`), `namespace`, `file`, `file_version`,
`block`.
**Upload flow:** add file metadata (pending) → upload to cloud storage → callback →
metadata status to "uploaded" → notify other clients.
**Download flow:** notification service tells the client a file changed → fetch metadata →
download blocks → reconstruct the file.
**Notification service:** long polling (chosen — the traffic is not bidirectional and not
frequent) vs WebSocket.
**Save space:** de-duplicate blocks by hash, adopt an intelligent backup strategy (limit the
number of versions, keep valuable versions), move infrequently-used data to cold storage
(S3 Glacier).
**Failure handling:** LB failure, block server failure, cloud storage failure, API server
failure, metadata cache/DB failure, notification service failure, offline backup queue
failure.
**Trade-off discussed:** uploading files directly to cloud storage is faster for the client,
but splitting/compressing/encrypting on the client makes it harder to get right across
platforms and is easier to exploit.

## Ch.16 — The Learning Continues

Real-world architectures worth studying: Facebook TAO, Facebook Timeline, Facebook Chat,
Facebook Photo Storage (Haystack), Google Bigtable, Google File System, Google Dremel,
Google Photon, Kafka, Cassandra, Dynamo, Zanzibar, Memcache at Facebook, Netflix Chaos
Engineering, Uber's Big Data Platform.

**Company engineering blogs to follow:** Google, Facebook, Netflix, Uber, Airbnb, LinkedIn,
Twitter, Amazon, Dropbox, Pinterest, Slack, Stripe, Yelp, Cloudflare, Shopify, Zoom.
