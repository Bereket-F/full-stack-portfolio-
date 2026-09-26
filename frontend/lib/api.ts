const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

interface FetchOptions extends RequestInit {
  revalidate?: number | false;
}

/**
 * Generic fetch wrapper. Always sends credentials so the browser attaches the
 * admin's HTTP-only auth cookie when this is called from client components.
 */
export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { revalidate, ...init } = options;

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
    ...(revalidate !== undefined ? { next: { revalidate: revalidate || undefined } } : {}),
    cache: revalidate === false ? 'no-store' : init.cache,
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json().catch(() => undefined) : undefined;

  if (!res.ok) {
    throw new ApiError(res.status, body?.error ?? res.statusText, body?.details);
  }

  return body as T;
}

export function apiGet<T>(path: string, revalidate: number | false = 60) {
  return apiFetch<T>(path, { method: 'GET', revalidate });
}

export function apiPost<T>(path: string, data?: unknown) {
  return apiFetch<T>(path, {
    method: 'POST',
    body: data !== undefined ? JSON.stringify(data) : undefined,
    revalidate: false,
  });
}

export function apiPut<T>(path: string, data?: unknown) {
  return apiFetch<T>(path, {
    method: 'PUT',
    body: data !== undefined ? JSON.stringify(data) : undefined,
    revalidate: false,
  });
}

export function apiPatch<T>(path: string, data?: unknown) {
  return apiFetch<T>(path, {
    method: 'PATCH',
    body: data !== undefined ? JSON.stringify(data) : undefined,
    revalidate: false,
  });
}

export function apiDelete(path: string) {
  return apiFetch<void>(path, { method: 'DELETE', revalidate: false });
}
