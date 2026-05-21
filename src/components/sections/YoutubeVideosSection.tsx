'use client';

import { useEffect, useState } from 'react';
import { Youtube, ExternalLink } from 'lucide-react';
import { getYoutubeEmbedUrl } from '@/lib/youtube';

interface YoutubeVideo {
  id: string;
  url: string;
  order: number;
  isActive: boolean;
}

export default function YoutubeVideosSection() {
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/youtube-videos');
        const data = await response.json();
        const activeVideos = (data.videos || []).filter((video: YoutubeVideo) => video.isActive);
        setVideos(activeVideos);
      } catch (error) {
        console.error('Error fetching youtube videos:', error);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (!loading && videos.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-linear-to-b from-white via-red-50/40 to-white relative overflow-hidden">
      <div className="absolute -top-20 right-10 h-40 w-40 rounded-full bg-red-100/60 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-red-200/40 blur-2xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Youtube className="h-8 w-8 text-red-900" />
            {/* <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Video YouTube</h2> */}
          </div>
          <p className="text-sm text-gray-600">Dokumentasi kegiatan dan informasi layanan terbaru.</p>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="rounded-2xl bg-white shadow-sm border border-gray-200 p-4">
                <div className="aspect-video rounded-xl bg-gray-100 animate-pulse"></div>
                <div className="mt-4 h-4 bg-gray-100 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {videos.map((video, index) => {
              const embedUrl = getYoutubeEmbedUrl(video.url);
              return (
                <div
                  key={video.id}
                  className="rounded-2xl bg-white/90 backdrop-blur-sm border border-gray-200 shadow-md overflow-hidden"
                >
                  <div className="aspect-video bg-gray-100">
                    {embedUrl ? (
                      <iframe
                        src={embedUrl}
                        title={`Video YouTube ${index + 1}`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                      ></iframe>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                        URL YouTube tidak valid
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-gray-800">
                        {/* Video #{index + 1} */}
                    </div>
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-red-900 hover:text-red-700"
                    >
                      Buka di YouTube
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
