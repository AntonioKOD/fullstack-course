#!/usr/bin/env node
/**
 * Zips each starter in ../../starters/ into website/static/downloads/
 * Run from website/: node scripts/build-downloads.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const archiver = await import('archiver');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');
const STARTERS_DIR = path.join(REPO_ROOT, 'starters');
const OUT_DIR = path.join(REPO_ROOT, 'website', 'static', 'downloads');

const STARTERS = ['project-01-frontend', 'project-02-api', 'project-02-frontend'];

if (!fs.existsSync(STARTERS_DIR)) {
  console.error('Starters dir not found:', STARTERS_DIR);
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const name of STARTERS) {
  const src = path.join(STARTERS_DIR, name);
  if (!fs.existsSync(src)) {
    console.warn('Skip (not found):', name);
    continue;
  }
  const outFile = path.join(OUT_DIR, `${name}.zip`);
  const output = fs.createWriteStream(outFile);
  const archive = archiver.default('zip', { zlib: { level: 9 } });

  await new Promise((resolve, reject) => {
    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);
    archive.directory(src, name);
    archive.finalize();
  });
  console.log('Created', outFile);
}

console.log('Done. Zips are in website/static/downloads/');
