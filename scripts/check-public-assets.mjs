import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';
import { projects } from '../src/data/portfolio.ts';

const root = resolve('public');
const problems = [];
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.name.startsWith('.') && entry.name !== '.well-known') {
      problems.push(`Non-public metadata or hidden file: ${relative(root, path)}`);
    }
    if (entry.isSymbolicLink()) problems.push(`Public symlink must be removed: ${relative(root, path)}`);
    else if (entry.isDirectory()) await walk(path);
    else if (/\.(?:pem|key|p12|pfx|sqlite|db|log|map)$/i.test(entry.name)) {
      problems.push(`Private data or source-map file in public: ${relative(root, path)}`);
    }
  }
}
async function checkLocalAsset(url) {
  if (!url.startsWith('/')) return;
  const path = resolve(root, `.${decodeURIComponent(url.split(/[?#]/)[0])}`);
  if (!path.startsWith(root + sep)) throw new Error(`Asset escapes public directory: ${url}`);
  if (!(await stat(path)).isFile()) throw new Error(`Asset is not a file: ${url}`);
}
await walk(root);
for (const url of ['/workshop/scene.webp', ...projects.flatMap(project => project.screenshot ? [project.screenshot.src] : [])]) {
  try { await checkLocalAsset(url); } catch { problems.push(`Missing or invalid local asset: ${url}`); }
}
const scene = await readFile(resolve(root, 'workshop/scene.webp'));
if (scene.toString('ascii', 0, 4) !== 'RIFF' || scene.toString('ascii', 8, 12) !== 'WEBP') problems.push('Workshop artwork is not a valid WebP container.');
try {
  const resume = await readFile(resolve(root, 'resume.pdf'));
  if (!resume.subarray(0, 5).equals(Buffer.from('%PDF-'))) problems.push('public/resume.pdf must contain a real PDF.');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
  console.log('Resume PDF not supplied: the Resume app will show its unavailable state.');
}
if (problems.length) throw new Error(problems.join('\n'));
console.log('Public asset checks passed.');
