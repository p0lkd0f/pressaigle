import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return NextResponse.json({ error: 'Missing image URL' }, { status: 400 });
  }

  try {
    // Decode the URL
    const decodedUrl = decodeURIComponent(imageUrl);

    // Validate URL
    if (!decodedUrl.startsWith('http://') && !decodedUrl.startsWith('https://')) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    // Fetch the image from the external source (server-side, no CORS)
    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': decodedUrl,
        'Accept': 'image/*,*/*;q=0.8',
      },
      // Don't cache the fetch to ensure we get fresh images
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch image' }, { status: response.status });
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Return the image with cache headers that include the URL hash for uniqueness
    // This ensures each unique URL gets its own cached version
    const urlHash = Buffer.from(decodedUrl).toString('base64').substring(0, 16);
    
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        // Cache based on the actual image URL, not the proxy URL
        'Cache-Control': `public, max-age=86400, s-maxage=86400`,
        'ETag': `"${urlHash}"`,
        'Access-Control-Allow-Origin': '*',
        'Vary': 'Accept',
      },
    });
  } catch (error: any) {
    console.error('Image proxy error:', error.message, 'URL:', imageUrl);
    return NextResponse.json(
      { error: 'Failed to proxy image' },
      { status: 500 }
    );
  }
}

