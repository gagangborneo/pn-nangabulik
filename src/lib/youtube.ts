const YOUTUBE_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

export function getYoutubeId(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (YOUTUBE_ID_PATTERN.test(trimmed)) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace('www.', '');

    if (host === 'youtu.be') {
      const id = parsed.pathname.split('/').filter(Boolean)[0];
      return id && YOUTUBE_ID_PATTERN.test(id) ? id : null;
    }

    if (host.endsWith('youtube.com') || host === 'youtube-nocookie.com') {
      const videoParam = parsed.searchParams.get('v');
      if (videoParam && YOUTUBE_ID_PATTERN.test(videoParam)) {
        return videoParam;
      }

      const segments = parsed.pathname.split('/').filter(Boolean);
      const embeddedIndex = segments.findIndex((segment) => segment === 'embed');
      if (embeddedIndex >= 0 && segments[embeddedIndex + 1]) {
        const id = segments[embeddedIndex + 1];
        return YOUTUBE_ID_PATTERN.test(id) ? id : null;
      }

      const shortsIndex = segments.findIndex((segment) => segment === 'shorts');
      if (shortsIndex >= 0 && segments[shortsIndex + 1]) {
        const id = segments[shortsIndex + 1];
        return YOUTUBE_ID_PATTERN.test(id) ? id : null;
      }

      const liveIndex = segments.findIndex((segment) => segment === 'live');
      if (liveIndex >= 0 && segments[liveIndex + 1]) {
        const id = segments[liveIndex + 1];
        return YOUTUBE_ID_PATTERN.test(id) ? id : null;
      }
    }
  } catch (error) {
    return null;
  }

  return null;
}

export function getYoutubeEmbedUrl(value: string) {
  const id = getYoutubeId(value);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

export function getYoutubeThumbnailUrl(value: string) {
  const id = getYoutubeId(value);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}
