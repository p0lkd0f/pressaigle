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

    // Create a unique ETag based on the actual image URL
    // This ensures each unique URL gets its own cached version
    const urlHash = Buffer.from(decodedUrl).toString('base64').substring(0, 20).replace(/[^a-zA-Z0-9]/g, '');
    
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        // Cache with unique ETag per URL
        'Cache-Control': `public, max-age=86400, s-maxage=86400`,
        'ETag': `"img-${urlHash}"`,
        'Access-Control-Allow-Origin': '*',
        'Vary': 'Accept, Origin',
      },
    });
  } catch (error: any) {
    console.error('Image proxy error:', error.message, 'URL:', imageUrl?.substring(0, 100));
    return NextResponse.json(
      { error: 'Failed to proxy image' },
      { status: 500 }
    );
  }
}

