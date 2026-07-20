import { NextRequest, NextResponse } from "next/server";

// The frontend no longer runs its own Better Auth instance. All /api/auth/*
// requests are proxied straight through to the Express backend (which mounts
// the Better Auth handler at /api/auth). This keeps auth on the same origin as
// the rest of the app, so the session cookie is shared by protected endpoints.
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function proxy(request: NextRequest): Promise<NextResponse> {
  const target = `${BACKEND_URL}${request.nextUrl.pathname}${request.nextUrl.search}`;

  const headers = new Headers(request.headers);
  headers.delete("host");

  const init: RequestInit = {
    method: request.method,
    headers,
    // Signal to the backend that the original origin is the frontend.
    cache: "no-store",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    const body = await request.arrayBuffer();
    init.body = body;
  }

  const upstream = await fetch(target, init);

  const responseHeaders = new Headers(upstream.headers);
  // Ensure cookies set by the backend are exposed to the browser on this origin.
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("content-length");

  const resBody = upstream.body;
  return new NextResponse(resBody, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;
