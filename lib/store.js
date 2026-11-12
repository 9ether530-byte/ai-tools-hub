import fs from 'node:fs';
import path from 'node:path';

const FILE = path.join(process.cwd(), 'data', 'submissions.json');

export function readSubmissions() {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch {
    return { newsletter: [], contact: [] };
  }
}

export function appendSubmission(kind, entry) {
  const all = readSubmissions();
  if (!Array.isArray(all[kind])) all[kind] = [];
  all[kind].push({ ...entry, receivedAt: new Date().toISOString() });
  try {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(all, null, 2));
    return { count: all[kind].length, stored: true };
  } catch {
    // Vercel serverless filesystem is read-only: accept the submission
    // without crashing, but report that it was not persisted.
    return { count: all[kind].length, stored: false };
  }
}
