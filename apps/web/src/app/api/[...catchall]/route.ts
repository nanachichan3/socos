import { NextRequest, NextResponse } from 'next/server';

const API_BASE = (process.env.API_INTERNAL_URL || 'http://localhost:3001').replace(/\/$/, '');
const HEADER_FILTER = ['host', 'connection', 'content-length', 'content-type'];

async function proxyRequest(
  request: NextRequest,
  params: Promise<{ catchall: string[] }>
) {
  const { catchall } = await params;
  const path = catchall.join('/');
  // NestJS uses setGlobalPrefix('api'), so include the prefix in the path
  const apiPath = `api/${path}`;
  const url = new URL(request.url);
  const query = url.search;
  const headers: Record<string, string> = {};
  request.headers.forEach((v, k) => {
    if (!HEADER_FILTER.includes(k.toLowerCase())) headers[k] = v;
  });

  try {
    const res = await fetch(`${API_BASE}/${apiPath}${query}`, {
      headers,
      credentials: 'include',
    });
    const data = await res.text();
    return new NextResponse(data, {
      status: res.status,
      headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' },
    });
  } catch {
    return NextResponse.json({ error: 'API unavailable' }, { status: 502 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ catchall: string[] }> }
) {
  return proxyRequest(request, params);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ catchall: string[] }> }
) {
  const { catchall } = await params;
  const path = catchall.join('/');
  const apiPath = `api/${path}`;
  const headers: Record<string, string> = {};
  request.headers.forEach((v, k) => {
    if (!HEADER_FILTER.includes(k.toLowerCase())) headers[k] = v;
  });
  try {
    const body = await request.text();
    const res = await fetch(`${API_BASE}/${apiPath}`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': headers['content-type'] || 'application/json' },
      body,
      credentials: 'include',
    });
    const data = await res.text();
    return new NextResponse(data, {
      status: res.status,
      headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' },
    });
  } catch {
    return NextResponse.json({ error: 'API unavailable' }, { status: 502 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ catchall: string[] }> }
) {
  const { catchall } = await params;
  const path = catchall.join('/');
  const apiPath = `api/${path}`;
  const headers: Record<string, string> = {};
  request.headers.forEach((v, k) => {
    if (!HEADER_FILTER.includes(k.toLowerCase())) headers[k] = v;
  });
  try {
    const body = await request.text();
    const res = await fetch(`${API_BASE}/${apiPath}`, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': headers['content-type'] || 'application/json' },
      body,
      credentials: 'include',
    });
    const data = await res.text();
    return new NextResponse(data, {
      status: res.status,
      headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' },
    });
  } catch {
    return NextResponse.json({ error: 'API unavailable' }, { status: 502 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ catchall: string[] }> }
) {
  const { catchall } = await params;
  const path = catchall.join('/');
  const apiPath = `api/${path}`;
  const headers: Record<string, string> = {};
  request.headers.forEach((v, k) => {
    if (!HEADER_FILTER.includes(k.toLowerCase())) headers[k] = v;
  });
  try {
    const res = await fetch(`${API_BASE}/${apiPath}`, {
      method: 'DELETE',
      headers,
      credentials: 'include',
    });
    const data = await res.text();
    return new NextResponse(data, {
      status: res.status,
      headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' },
    });
  } catch {
    return NextResponse.json({ error: 'API unavailable' }, { status: 502 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ catchall: string[] }> }
) {
  const { catchall } = await params;
  const path = catchall.join('/');
  const apiPath = `api/${path}`;
  const headers: Record<string, string> = {};
  request.headers.forEach((v, k) => {
    if (!HEADER_FILTER.includes(k.toLowerCase())) headers[k] = v;
  });
  try {
    const body = await request.text();
    const res = await fetch(`${API_BASE}/${apiPath}`, {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': headers['content-type'] || 'application/json' },
      body,
      credentials: 'include',
    });
    const data = await res.text();
    return new NextResponse(data, {
      status: res.status,
      headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' },
    });
  } catch {
    return NextResponse.json({ error: 'API unavailable' }, { status: 502 });
  }
}