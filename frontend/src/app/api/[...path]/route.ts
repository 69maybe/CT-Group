import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function backendOrigin(): string {
  const raw =
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.INTERNAL_API_URL ||
    '';
  const trimmed = raw.trim().replace(/\/$/, '');
  return trimmed || 'http://127.0.0.1:5000';
}

function usingDefaultLocalBackend(origin: string): boolean {
  return (
    origin === 'http://127.0.0.1:5000' ||
    origin === 'http://localhost:5000' ||
    origin.startsWith('http://127.0.0.1:') ||
    origin.startsWith('http://localhost:')
  );
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
      ? ' Railway / Docker: trên service Frontend đặt BACKEND_URL và NEXT_PUBLIC_API_URL = URL public của Spring Boot (https://…, không / cuối).'
      : ' Kiểm tra backend đã chạy, HTTPS, firewall; BACKEND_URL / NEXT_PUBLIC_API_URL đúng chưa.';
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
