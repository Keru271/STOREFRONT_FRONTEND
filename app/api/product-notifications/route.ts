import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const storeId =
      req.headers.get('x-store-id') ||
      req.headers.get('store-id') ||
      body.storeId ||
      process.env.NEXT_PUBLIC_STORE_ID ||
      '';

    const backendUrl =
      process.env.NEXT_PUBLIC_STOREFRONT_API_URL ||
      process.env.NEXT_PUBLIC_CMS_API_URL ||
      'http://localhost:5001';

    const cleanBackendUrl = backendUrl.replace(/\/+$/, '');

    // Forward to backend endpoints (both storefront-backend and cms-backend compatible)
    const targetUrls = [
      `${cleanBackendUrl}/api/storefront/product-notifications`,
      `${cleanBackendUrl}/api/product-notifications`,
      `${cleanBackendUrl}/product-notifications`,
    ];

    let lastError: any = null;
    let lastStatus = 502;
    let lastMsg = 'Failed to submit product restock notification';

    for (const url of targetUrls) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(storeId ? { 'x-store-id': storeId } : {}),
          },
          body: JSON.stringify(body),
        });

        if (res.ok) {
          const data = await res.json();
          return NextResponse.json(data, { status: res.status });
        } else if (res.status !== 404) {
          // If it reached a backend and received validation error or existing subscription
          try {
            const data = await res.json();
            return NextResponse.json(data, { status: res.status });
          } catch {
            return NextResponse.json({ message: `HTTP ${res.status}` }, { status: res.status });
          }
        }
      } catch (err: any) {
        lastError = err;
      }
    }

    return NextResponse.json(
      { message: lastError?.message || lastMsg },
      { status: lastStatus }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
