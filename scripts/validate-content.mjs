/**
 * Content integrity check for the question bank.
 *
 * Run with:  node scripts/validate-content.mjs
 * Catches the failure modes TypeScript cannot: duplicate IDs (which silently
 * merge progress between two different questions), multiple-choice answers that
 * point at a non-existent option, and topics with no content.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DATA_DIR = new URL('../src/data', import.meta.url).pathname;
const files = readdirSync(DATA_DIR).filter((f) => f.endsWith('.ts') && f !== 'index.ts');

const errors = [];
const warnings = [];
const seenIds = new Map();
const byTopic = new Map();
let total = 0;

for (const file of files) {
  const src = readFileSync(join(DATA_DIR, file), 'utf8');

  // Question ids are the `id:` fields at 4-space indentation (option ids are deeper).
  const ids = [...src.matchAll(/^ {4}id: ['"]([^'"]+)['"]/gm)].map((m) => m[1]);
  const topics = [...src.matchAll(/^ {4}topic: ['"]([^'"]+)['"]/gm)].map((m) => m[1]);

  for (const id of ids) {
    if (seenIds.has(id)) {
      errors.push(`Duplicate question id "${id}" in ${file} and ${seenIds.get(id)}`);
    }
    seenIds.set(id, file);
  }

  for (const t of topics) byTopic.set(t, (byTopic.get(t) ?? 0) + 1);
  total += ids.length;

  if (ids.length !== topics.length) {
    errors.push(`${file}: ${ids.length} ids but ${topics.length} topic fields`);
  }

  // Every correctOptionId must name an option that exists in the same question.
  const blocks = src.split(/^ {2}\{$/m);
  for (const block of blocks) {
    const correct = block.match(/correctOptionId: ['"]([^'"]+)['"]/);
    if (!correct) continue;
    const optionIds = [...block.matchAll(/\{ id: ['"]([^'"]+)['"], text:/g)].map((m) => m[1]);
    const qid = block.match(/id: ['"]([^'"]+)['"]/)?.[1] ?? '?';
    if (!optionIds.includes(correct[1])) {
      errors.push(`${file}: question "${qid}" answer "${correct[1]}" is not among [${optionIds}]`);
    }
    if (optionIds.length < 2) {
      errors.push(`${file}: question "${qid}" has ${optionIds.length} option(s)`);
    }
  }
}

// Every topic in the union must have content.
const topicUnion = readFileSync(new URL('../src/types/content.ts', import.meta.url).pathname, 'utf8');
const declared = [...topicUnion.matchAll(/^ {2}\| '([^']+)'/gm)].map((m) => m[1]);
for (const t of declared) {
  if (!byTopic.has(t)) errors.push(`Topic "${t}" is declared but has no questions`);
  else if (byTopic.get(t) < 10) warnings.push(`Topic "${t}" has only ${byTopic.get(t)} questions`);
}

// Answer-position distribution — a strong skew means the quiz is guessable.
const allSrc = files.map((f) => readFileSync(join(DATA_DIR, f), 'utf8')).join('\n');
const answers = [...allSrc.matchAll(/correctOptionId: ['"]([a-d])['"]/g)].map((m) => m[1]);
const dist = answers.reduce((acc, a) => ({ ...acc, [a]: (acc[a] ?? 0) + 1 }), {});
const maxShare = Math.max(...Object.values(dist)) / answers.length;
if (maxShare > 0.45) {
  warnings.push(`Answer positions are skewed: ${JSON.stringify(dist)} (max share ${(maxShare * 100).toFixed(0)}%)`);
}

console.log(`\nChecked ${files.length} files, ${total} questions across ${byTopic.size} topics.`);
console.log(`Answer distribution: ${JSON.stringify(dist)}\n`);

for (const w of warnings) console.warn(`  warn  ${w}`);
for (const e of errors) console.error(`  ERROR ${e}`);

if (errors.length) {
  console.error(`\n✗ ${errors.length} error(s)\n`);
  process.exit(1);
}
console.log(`✓ Content valid${warnings.length ? ` (${warnings.length} warning(s))` : ''}\n`);
