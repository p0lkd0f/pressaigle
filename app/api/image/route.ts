import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const imageUrl = searchParams.get('url');
  const id = searchParams.get('id');

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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': new URL(decodedUrl).origin,
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      // Don't cache the fetch to ensure we get fresh images
      cache: 'no-store',
      // Add redirect handling
      redirect: 'follow',
    });

    if (!response.ok) {
      console.error(`Image fetch failed: ${response.status} ${response.statusText} for ${decodedUrl.substring(0, 80)}`);
      return NextResponse.json({ error: 'Failed to fetch image' }, { status: response.status });
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Create a unique ETag based on the actual image URL
    // Use both URL and id parameter to ensure uniqueness
    const urlHash = Buffer.from(decodedUrl + (id || '')).toString('base64').substring(0, 24).replace(/[^a-zA-Z0-9]/g, '');
    
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        // Cache with unique ETag per URL - but allow revalidation
        'Cache-Control': `public, max-age=3600, s-maxage=3600, must-revalidate`,
        'ETag': `"img-${urlHash}"`,
        'Access-Control-Allow-Origin': '*',
        'Vary': 'Accept, Origin',
        // Add X-Image-URL header for debugging
        'X-Image-URL': decodedUrl.substring(0, 100),
      },
    });
  } catch (error: any) {
    console.error('Image proxy error:', error.message, 'URL:', imageUrl?.substring(0, 100));
    return NextResponse.json(
      { error: 'Failed to proxy image', details: error.message },
      { status: 500 }
    );
  }
}

