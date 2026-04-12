import { NextRequest, NextResponse } from 'next/server';
import {
  defaultLocalBackend,
  normalizeBackendOrigin,
  usingDefaultLocalBackend,
} from '@/lib/backendOrigin';

export const dynamic = 'force-dynamic';

function backendOrigin(): string {
  const raw =
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.INTERNAL_API_URL ||
    '';
  return normalizeBackendOrigin(raw || defaultLocalBackend());
}

async function proxy(req: NextRequest, pathSegments: string[]) {
  const origin = backendOrigin();
  const path = pathSegments.length ? pathSegments.join('/') : '';
  const url = new URL(req.url);
  const target = `${origin}/api/${path}${url.search}`;

  const headers = new Headers();
  const ct = req.headers.get('content-type');
  if (ct) headers.set('Content-Type', ct);
  const auth = req.headers.get('authorization');
  if (auth) headers.set('Authorization', auth);

  let body: string | undefined;
  if (!['GET', 'HEAD'].includes(req.method)) {
    body = await req.text();
  }

  try {
    const res = await fetch(target, {
      method: req.method,
      headers,
      body,
      cache: 'no-store',
    });

    const out = new Headers();
    const resCt = res.headers.get('content-type');
    if (resCt) out.set('Content-Type', resCt);

    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      statusText: res.statusText,
      headers: out,
    });
  } catch (err) {
    console.error('[api proxy]', target, err);
    const railwayHint = usingDefaultLocalBackend(origin)
      ? ' Railway: trên service Frontend đặt BACKEND_URL = https://<domain-backend>.up.railway.app (có https://, không / cuối). Trên service Backend: cổng Public Networking phải trùng cổng app (Spring dùng biến PORT; mặc định yaml 5000 — nếu Railway hiện Port 8080 thì thêm PORT=8080 hoặc đổi public port về 5000).'
      : ' Kiểm tra backend đã chạy; trên Railway Networking, port public phải trùng port process (Spring dùng biến PORT).';
    return NextResponse.json(
      {
        success: false,
        message: `Không kết nối được API (${origin}).${railwayHint} Local: chạy backend cổng 5000 (vd. mvn spring-boot:run -Pdev).`,
        configuredBackend: origin,
        data: null,
      },
      { status: 502 }
    );
  }
}

type Ctx = { params: { path: string[] } };

export async function GET(req: NextRequest, ctx: Ctx) {
  return proxy(req, ctx.params.path ?? []);
}

export async function POST(req: NextRequest, ctx: Ctx) {
  return proxy(req, ctx.params.path ?? []);
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  return proxy(req, ctx.params.path ?? []);
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  return proxy(req, ctx.params.path ?? []);
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  return proxy(req, ctx.params.path ?? []);
}

export async function HEAD(req: NextRequest, ctx: Ctx) {
  return proxy(req, ctx.params.path ?? []);
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
