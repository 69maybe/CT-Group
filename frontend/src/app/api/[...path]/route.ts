import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function backendOrigin(): string {
  return (
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://127.0.0.1:5000'
  ).replace(/\/$/, '');
}

async function proxy(req: NextRequest, pathSegments: string[]) {
  const path = pathSegments.length ? pathSegments.join('/') : '';
  const url = new URL(req.url);
  const target = `${backendOrigin()}/api/${path}${url.search}`;

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
    return NextResponse.json(
      {
        success: false,
        message:
          'Backend unreachable. Start the API (e.g. mvn spring-boot:run -Pdev on port 5000). Check BACKEND_URL / NEXT_PUBLIC_API_URL.',
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
