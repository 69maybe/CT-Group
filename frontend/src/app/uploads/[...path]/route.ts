import { NextRequest, NextResponse } from 'next/server';
import { defaultLocalBackend, normalizeBackendOrigin } from '@/lib/backendOrigin';

export const dynamic = 'force-dynamic';

function backendOrigin(): string {
  const raw =
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.INTERNAL_API_URL ||
    '';
  return normalizeBackendOrigin(raw || defaultLocalBackend());
}

type Params = { params: { path: string[] } };

export async function GET(_req: NextRequest, { params }: Params) {
  const path = (params.path || []).join('/');
  const target = `${backendOrigin()}/uploads/${path}`;

  try {
    const res = await fetch(target, { cache: 'no-store' });
    const headers = new Headers();
    const contentType = res.headers.get('content-type');
    if (contentType) headers.set('Content-Type', contentType);
    const cacheControl = res.headers.get('cache-control');
    if (cacheControl) headers.set('Cache-Control', cacheControl);

    const body = await res.arrayBuffer();
    return new NextResponse(body, {
      status: res.status,
      statusText: res.statusText,
      headers,
    });
  } catch {
    return new NextResponse('Upload file not available', { status: 502 });
  }
}
