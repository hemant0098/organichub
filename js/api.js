// ===== API helpers =====
const BACKEND_BASE = 'http://localhost:5000'; // e.g., https://organichub-backend.onrender.com

async function apiGet(path) {
  const res = await fetch(`${BACKEND_BASE}${path}`, { credentials: 'omit' });
  if (!res.ok) throw new Error('API GET failed: ' + res.status);
  return await res.json();
}

async function apiPost(path, body) {
  const res = await fetch(`${BACKEND_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error('API POST failed: ' + res.status + ' ' + t);
  }
  return await res.json();
}

window.OrgAPI = { apiGet, apiPost, BACKEND_BASE };
