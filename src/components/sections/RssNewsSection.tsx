import * as cheerio from 'cheerio';
import { ExternalLink, Rss } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FeedItem {
  title: string;
  link: string;
}

interface FeedSource {
  id: string;
  title: string;
  url: string;
  pathPrefix: string;
}

const feedSources: FeedSource[] = [
  {
    id: 'mahkamahagung-berita',
    title: 'MA RI - Berita',
    url: 'https://mahkamahagung.go.id/id/berita',
    pathPrefix: '/id/berita/',
  },
  {
    id: 'mahkamahagung-pengumuman',
    title: 'MA RI - Pengumuman',
    url: 'https://mahkamahagung.go.id/id/pengumuman',
    pathPrefix: '/id/pengumuman/',
  },
  {
    id: 'badilum-kegiatan',
    title: 'Badilum - Berita Kegiatan',
    url: 'https://badilum.mahkamahagung.go.id/berita/berita-kegiatan.html',
    pathPrefix: '/berita/berita-kegiatan/',
  },
  {
    id: 'badilum-pengumuman',
    title: 'Badilum - Pengumuman',
    url: 'https://badilum.mahkamahagung.go.id/berita/pengumuman-surat-dinas.html',
    pathPrefix: '/berita/pengumuman-surat-dinas/',
  },
  {
    id: 'pt-palangkaraya',
    title: 'PT Palangkaraya - Berita Terkini',
    url: 'https://pt-palangkaraya.go.id/berita/berita-terkini',
    pathPrefix: '/berita/berita-terkini/',
  },
];

const normalizeText = (value: string) => value.replace(/\s+/g, ' ').trim();

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

async function fetchFeedItems(source: FeedSource): Promise<FeedItem[]> {
  try {
    const response = await fetch(source.url, {
      next: { revalidate: 1800 },
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
    });
    if (!response.ok) return [];
    const html = await response.text();
    const $ = cheerio.load(html);
    const baseUrl = new URL(source.url);
    const items: FeedItem[] = [];
    const seen = new Set<string>();

    $('a[href]').each((_, element) => {
      const $link = $(element);
      const href = $link.attr('href');
      if (!href || href.startsWith('#')) return;
      const rawTitle = getLinkTitle($link);
      if (!rawTitle || rawTitle.length < 8) return;

      let link: URL;
      try {
        link = new URL(href, baseUrl);
      } catch (error) {
        return;
      }

      if (link.origin !== baseUrl.origin) return;
      if (!link.pathname.startsWith(source.pathPrefix)) return;
      if (link.pathname === source.pathPrefix.replace(/\/$/, '')) return;

      const normalizedLink = link.toString();
      if (seen.has(normalizedLink)) return;
      seen.add(normalizedLink);

      items.push({
        title: rawTitle,
        link: normalizedLink,
      });
    });

    if (items.length === 0) {
      const headingLinks = $('h2 a, h3 a, h4 a');
      headingLinks.each((_, element) => {
        if (items.length >= 5) return false;
        const $link = $(element);
        const href = $link.attr('href');
        if (!href || href.startsWith('#')) return;
        const rawTitle = getLinkTitle($link);
        if (!rawTitle || rawTitle.length < 8) return;
        let link: URL;
        try {
          link = new URL(href, baseUrl);
        } catch (error) {
          return;
        }
        if (link.origin !== baseUrl.origin) return;
        if (!link.pathname.startsWith(source.pathPrefix)) return;
        const normalizedLink = link.toString();
        if (seen.has(normalizedLink)) return;
        seen.add(normalizedLink);
        items.push({
          title: rawTitle,
          link: normalizedLink,
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
    <section className="py-16 bg-gray-50">
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
                <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
                  <Rss className="h-5 w-5 text-red-900" />
                  {feed.title}
                </CardTitle>
                <a
                  href={feed.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-500 hover:text-red-900 transition-colors"
                >
                  {feed.url}
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
                          <span className="flex-1">{item.title}</span>
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
