/**
 * Chuẩn hóa URL backend cho proxy / SSR.
 * Railway UI chỉ hiện hostname — nếu env thiếu scheme, fetch() sẽ lỗi.
 */
export function normalizeBackendOrigin(raw: string): string {
  const t = raw.trim().replace(/\/$/, '');
  if (!t) return 'http://127.0.0.1:5000';
  if (/^https?:\/\//i.test(t)) return t;
  if (t.startsWith('127.0.0.1') || t.startsWith('localhost')) {
    return `http://${t}`;
  }
  return `https://${t}`;
}

export function defaultLocalBackend(): string {
  return 'http://127.0.0.1:5000';
}

export function usingDefaultLocalBackend(origin: string): boolean {
  return (
    origin === 'http://127.0.0.1:5000' ||
    origin === 'http://localhost:5000' ||
    origin.startsWith('http://127.0.0.1:') ||
    origin.startsWith('http://localhost:')
  );
}
