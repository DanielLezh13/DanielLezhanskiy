const INSTAGRAM_PATH = /^\/(p|reel|tv)\/([A-Za-z0-9_-]+)\/?$/;
const BROKEN_EMBED_MARKERS = [
  "EmbedBrokenMedia",
  "The link to this photo or video may be broken",
  "the post may have been removed",
];

export async function GET(request: Request) {
  const source = new URL(request.url).searchParams.get("url");
  const permalink = source ? getInstagramPermalink(source) : null;

  if (!permalink) {
    return Response.json(
      { embeddable: false },
      { status: 400, headers: cacheHeaders(300) },
    );
  }

  try {
    const response = await fetch(`${permalink}embed/captioned/`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; PhilosophyFeed/1.0; +https://localhost)",
      },
      signal: AbortSignal.timeout(8000),
    });
    const html = await response.text();
    const embeddable =
      response.ok &&
      !BROKEN_EMBED_MARKERS.some((marker) => html.includes(marker));

    return Response.json({ embeddable }, { headers: cacheHeaders(60 * 60) });
  } catch {
    return Response.json(
      { embeddable: false },
      { headers: cacheHeaders(5 * 60) },
    );
  }
}

function getInstagramPermalink(rawUrl: string) {
  try {
    const url = new URL(rawUrl);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    const match = url.pathname.match(INSTAGRAM_PATH);

    if (host !== "instagram.com" || !match) return null;
    return `https://www.instagram.com/${match[1]}/${match[2]}/`;
  } catch {
    return null;
  }
}

function cacheHeaders(maxAge: number) {
  return {
    "Cache-Control": `public, max-age=${maxAge}, stale-while-revalidate=86400`,
  };
}
