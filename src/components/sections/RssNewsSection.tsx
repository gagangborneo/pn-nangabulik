import * as cheerio from 'cheerio';
import { ExternalLink, Rss } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FeedItem {
  title: string;
  link: string;
  date?: string;
}

interface FeedSource {
  id: string;
  title: string;
  url: string;
  mode: 'html' | 'rss';
  pathPrefix?: string;
  displayUrl?: string;
}

type SafeFetchInit = RequestInit & { next?: { revalidate?: number } };
type FetchError = { message?: string; code?: string; cause?: { code?: string } };

const FETCH_TIMEOUT_MS = 8000;
const FETCH_RETRY_COUNT = 2;
const FETCH_RETRY_DELAY_MS = 400;

const feedSources: FeedSource[] = [
  {
    id: 'mahkamahagung-berita',
    title: 'MA RI - Berita',
    url: 'https://rss.pt-bengkulu.go.id/?mari',
    displayUrl: 'https://mahkamahagung.go.id/id/berita',
    mode: 'rss',
  },
  {
    id: 'mahkamahagung-pengumuman',
    title: 'MA RI - Pengumuman',
    url: 'https://rss.pt-bengkulu.go.id/?maripengumuman',
    displayUrl: 'https://mahkamahagung.go.id/id/pengumuman',
    mode: 'rss',
  },
  {
    id: 'badilum-kegiatan',
    title: 'Badilum - Berita Kegiatan',
    url: 'https://rss.pt-bengkulu.go.id/?badilum',
    displayUrl: 'https://badilum.mahkamahagung.go.id/berita/berita-kegiatan.html',
    pathPrefix: '/berita/berita-kegiatan/',
    mode: 'rss',
  },
  {
    id: 'badilum-pengumuman',
    title: 'Badilum - Pengumuman',
    url: 'https://rss.pt-bengkulu.go.id/?badilumpengumuman',
    displayUrl: 'https://badilum.mahkamahagung.go.id/berita/pengumuman-surat-dinas.html',
    pathPrefix: '/berita/pengumuman-surat-dinas/',
    mode: 'rss',
  },
  {
    id: 'pt-palangkaraya',
    title: 'PT Palangkaraya - Berita Terkini',
    url: 'https://pt-palangkaraya.go.id/berita/berita-terkini',
    pathPrefix: '/berita/berita-terkini/',
    mode: 'html',
  },
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getErrorCode = (error: unknown) => {
  if (!error || typeof error !== 'object') return undefined;
  const err = error as FetchError;
  return err.code || err.cause?.code;
};

const isRetryableFetchError = (error: unknown) => {
  const code = getErrorCode(error);
  if (code && ['ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED', 'EAI_AGAIN'].includes(code)) {
    return true;
  }
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return message.includes('fetch failed') || message.includes('aborted') || message.includes('timeout');
  }
  return false;
};

const safeFetch = async (url: string, init: SafeFetchInit) => {
  let lastError: unknown;

  for (let attempt = 0; attempt <= FETCH_RETRY_COUNT; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const response = await fetch(url, { ...init, signal: controller.signal });
      clearTimeout(timeout);
      return response;
    } catch (error) {
      clearTimeout(timeout);
      lastError = error;
      if (!isRetryableFetchError(error) || attempt === FETCH_RETRY_COUNT) {
        break;
      }
      await sleep(FETCH_RETRY_DELAY_MS * (attempt + 1));
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    console.warn('Rss fetch failed:', url, lastError);
  }
  return null;
};

const normalizeText = (value: string) => value.replace(/\s+/g, ' ').trim();

const datePatterns = [
  /\b\d{1,2}\s+(Jan(?:uari)?|Feb(?:ruari)?|Mar(?:et)?|Apr(?:il)?|Mei|May|Jun(?:i)?|Jul(?:i)?|Agu(?:stus)?|Aug(?:ust)?|Sep(?:tember)?|Okt(?:ober)?|Oct(?:ober)?|Nov(?:ember)?|Des(?:ember)?|Dec(?:ember)?)\s+\d{4}\b/i,
  /\b\d{1,2}-[A-Za-z]{3}-\d{4}\b/,
  /\b\d{4}-\d{2}-\d{2}\b/,
];

const monthMap: Record<string, string> = {
  januari: 'January',
  februari: 'February',
  maret: 'March',
  april: 'April',
  mei: 'May',
  juni: 'June',
  juli: 'July',
  agustus: 'August',
  agu: 'August',
  september: 'September',
  oktober: 'October',
  okt: 'October',
  november: 'November',
  desember: 'December',
  des: 'December',
};

const extractDateString = (text: string) => {
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  return '';
};

const normalizeDateForParse = (value: string) => {
  let normalized = value.replace(/,/g, ' ');
  normalized = normalized.replace(/(\d{1,2})-([A-Za-z]{3})-(\d{4})/, '$1 $2 $3');
  const monthRegex = new RegExp(`\\b(${Object.keys(monthMap).join('|')})\\b`, 'gi');
  normalized = normalized.replace(monthRegex, (match) => monthMap[match.toLowerCase()] || match);
  return normalized;
};

const formatItemDate = (value?: string) => {
  if (!value) return '';
  const trimmed = normalizeText(value);
  if (!trimmed) return '';
  const datePart = extractDateString(trimmed) || trimmed.split(' - ')[0];
  const normalized = normalizeDateForParse(datePart);
  const parsedPrimary = new Date(normalized);
  if (!Number.isNaN(parsedPrimary.getTime())) {
    return parsedPrimary.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
  const parsedFallback = new Date(normalizeDateForParse(trimmed));
  if (!Number.isNaN(parsedFallback.getTime())) {
    return parsedFallback.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
  return datePart;
};

const extractDateFromContext = (
  $: cheerio.Root,
  $link: cheerio.Cheerio<cheerio.Element>
) => {
  const container = $link.closest(
    '.list, article, .item, .news-item, .blog-item, .entry, li, .content'
  );
  const candidates: string[] = [];
  container.find('time, .date, .tanggal, .time, .meta, .content p, p, span').each((_, el) => {
    const text = normalizeText($(el).text());
    if (text) {
      candidates.push(text);
    }
  });
  for (const candidate of candidates) {
    const extracted = extractDateString(candidate);
    if (extracted) return extracted;
  }
  const containerText = normalizeText(container.text());
  return extractDateString(containerText);
};

const getLinkTitle = ($el: cheerio.Cheerio<cheerio.Element>) => {
  const text = normalizeText($el.text());
  if (text) return text;
  const titleAttr = normalizeText($el.attr('title') || '');
  if (titleAttr) return titleAttr;
  const ariaLabel = normalizeText($el.attr('aria-label') || '');
  if (ariaLabel) return ariaLabel;
  const imgAlt = normalizeText($el.find('img[alt]').first().attr('alt') || '');
  return imgAlt;
};

const getLastSlug = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean);
  return segments[segments.length - 1] || '';
};

const formatSlugTitle = (slug: string) => {
  const cleaned = decodeURIComponent(slug)
    .replace(/^\d+[-_]+/, '')
    .replace(/\.(html?|php)$/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const withoutLeadingNumbers = cleaned.replace(/^\d+\s+/, '');
  if (!withoutLeadingNumbers) return '';
  return withoutLeadingNumbers
    .split(' ')
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1).toLowerCase() : ''))
    .join(' ');
};

const extractMahkamahagungItems = (
  $: cheerio.Root,
  baseUrl: URL,
  pathPrefix: string
): FeedItem[] => {
  const items: FeedItem[] = [];
  const seen = new Set<string>();
  const normalizedPrefix = pathPrefix.replace(/\/$/, '');

  $('#grid .list .content h1 a, #grid .list .content h2 a, #grid .list .content h3 a').each(
    (_, element) => {
      if (items.length >= 5) return false;
      const anchor = $(element);
      const href = anchor.attr('href');
      if (!href) return;
      const title = getLinkTitle(anchor);
      if (!title) return;

      let link: URL;
      try {
        link = new URL(href, baseUrl);
      } catch (error) {
        return;
      }

      if (link.origin !== baseUrl.origin) return;
      if (!link.pathname.startsWith(normalizedPrefix)) return;

      const normalizedLink = link.toString();
      if (seen.has(normalizedLink)) return;
      seen.add(normalizedLink);

      const rawDateText = normalizeText(
        $(element).closest('.list').find('.content > p').first().text()
      );
      const rawDate = extractDateString(rawDateText) || rawDateText;
      items.push({
        title,
        link: normalizedLink,
        date: rawDate || undefined,
      });
    }
  );

  if (items.length > 0) {
    return items;
  }

  $('div.list').each((_, element) => {
    if (items.length >= 5) return false;
    const anchor = $(element).find('h1 a, h2 a, h3 a').first();
    if (!anchor.length) return;
    const href = anchor.attr('href');
    if (!href) return;
    const title = getLinkTitle(anchor);
    if (!title) return;

    let link: URL;
    try {
      link = new URL(href, baseUrl);
    } catch (error) {
      return;
    }

    if (link.origin !== baseUrl.origin) return;
    if (!link.pathname.startsWith(normalizedPrefix)) return;
    const normalizedLink = link.toString();
    if (seen.has(normalizedLink)) return;
    seen.add(normalizedLink);

    const rawDateText = normalizeText($(element).find('.content > p').first().text());
    const rawDate = extractDateString(rawDateText) || rawDateText;
    items.push({
      title,
      link: normalizedLink,
      date: rawDate || undefined,
    });
  });

  return items;
};

const extractRssItems = (xml: string): FeedItem[] => {
  const $ = cheerio.load(xml, { xmlMode: true });
  const items: FeedItem[] = [];

  $('item').each((_, element) => {
    if (items.length >= 5) return false;
    const title = normalizeText($(element).find('title').first().text());
    const link = normalizeText($(element).find('link').first().text());
    const date = normalizeText(
      $(element).find('pubDate').first().text() ||
        $(element).find('dc\\:date').first().text() ||
        $(element).find('date').first().text()
    );
    if (!title || !link) return;
    items.push({ title, link, date: date || undefined });
  });

  if (items.length > 0) {
    return items;
  }

  $('entry').each((_, element) => {
    if (items.length >= 5) return false;
    const title = normalizeText($(element).find('title').first().text());
    const link = normalizeText($(element).find('link').attr('href') || '');
    const date = normalizeText(
      $(element).find('updated').first().text() ||
        $(element).find('published').first().text() ||
        $(element).find('dc\\:date').first().text()
    );
    if (!title || !link) return;
    items.push({ title, link, date: date || undefined });
  });

  return items;
};

async function fetchFeedItems(source: FeedSource): Promise<FeedItem[]> {
  try {
    const response = await safeFetch(source.url, {
      next: { revalidate: 1800 },
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/rss+xml,application/xml;q=0.9',
      },
    });
    if (!response) return [];
    if (!response.ok) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Rss fetch non-200:', source.url, response.status);
      }
      return [];
    }
    const raw = await response.text();
    if (source.mode === 'rss') {
      return extractRssItems(raw).slice(0, 5);
    }

    const html = raw;
    const $ = cheerio.load(html);
    const baseUrl = new URL(source.url);
    const items: FeedItem[] = [];
    const seen = new Set<string>();

    if (source.id.startsWith('mahkamahagung') && source.pathPrefix) {
      const extracted = extractMahkamahagungItems($, baseUrl, source.pathPrefix);
      if (extracted.length > 0) {
        return extracted;
      }
    }

    $('a[href]').each((_, element) => {
      const $link = $(element);
      const href = $link.attr('href');
      if (!href || href.startsWith('#')) return;
      let link: URL;
      try {
        link = new URL(href, baseUrl);
      } catch (error) {
        return;
      }

      if (link.origin !== baseUrl.origin) return;
      if (!source.pathPrefix) return;
      if (!link.pathname.startsWith(source.pathPrefix)) return;
      if (link.pathname === source.pathPrefix.replace(/\/$/, '')) return;

      const rawTitle = source.id === 'pt-palangkaraya'
        ? formatSlugTitle(getLastSlug(link.pathname))
        : getLinkTitle($link);
      if (!rawTitle || (source.id !== 'pt-palangkaraya' && rawTitle.length < 8)) return;

      const normalizedLink = link.toString();
      if (seen.has(normalizedLink)) return;
      seen.add(normalizedLink);

      const rawDate = extractDateFromContext($, $link);
      items.push({
        title: rawTitle,
        link: normalizedLink,
        date: rawDate || undefined,
      });
    });

    if (items.length === 0) {
      const headingLinks = $('h2 a, h3 a, h4 a');
      headingLinks.each((_, element) => {
        if (items.length >= 5) return false;
        const $link = $(element);
        const href = $link.attr('href');
        if (!href || href.startsWith('#')) return;
        let link: URL;
        try {
          link = new URL(href, baseUrl);
        } catch (error) {
          return;
        }
        if (link.origin !== baseUrl.origin) return;
        if (!source.pathPrefix) return;
        if (!link.pathname.startsWith(source.pathPrefix)) return;
        const rawTitle = source.id === 'pt-palangkaraya'
          ? formatSlugTitle(getLastSlug(link.pathname))
          : getLinkTitle($link);
        if (!rawTitle || (source.id !== 'pt-palangkaraya' && rawTitle.length < 8)) return;
        const normalizedLink = link.toString();
        if (seen.has(normalizedLink)) return;
        seen.add(normalizedLink);
        const rawDate = extractDateFromContext($, $link);
        items.push({
          title: rawTitle,
          link: normalizedLink,
          date: rawDate || undefined,
        });
      });
    }

    return items.slice(0, 5);
  } catch (error) {
    console.error('Error fetching news feed:', source.url, error);
    return [];
  }
}

export default async function RssNewsSection() {
  const feeds = await Promise.all(
    feedSources.map(async (source) => ({
      ...source,
      items: await fetchFeedItems(source),
    }))
  );

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Berita Instansi Terkini
          </h2>
          <div className="w-20 h-1 bg-red-900 mx-auto mt-3"></div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {feeds.map((feed) => (
            <Card key={feed.id} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="inline-flex items-center gap-2 text-lg text-gray-800 bg-red-50/70 px-3 py-1.5 rounded-md">
                  <Rss className="h-5 w-5 text-red-900" />
                  {feed.title}
                </CardTitle>
                <a
                  href={feed.displayUrl || feed.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-500 hover:text-red-900 transition-colors"
                >
                  {feed.displayUrl || feed.url}
                </a>
              </CardHeader>
              <CardContent className="pt-0">
                {feed.items.length === 0 ? (
                  <p className="text-sm text-gray-500">Berita belum tersedia.</p>
                ) : (
                  <ul className="space-y-3">
                    {feed.items.map((item, index) => (
                      <li key={`${feed.id}-${index}`}>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start justify-between gap-3 rounded-lg border border-gray-100 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-900 transition-colors"
                        >
                          <span className="flex-1">
                            <span className="block">{item.title}</span>
                            {item.date && (
                              <span className="block text-xs text-gray-500 mt-1">
                                {formatItemDate(item.date)}
                              </span>
                            )}
                          </span>
                          <ExternalLink className="h-4 w-4 text-gray-400" />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
