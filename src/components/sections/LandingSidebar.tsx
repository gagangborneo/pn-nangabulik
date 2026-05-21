'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Facebook,
  Globe,
  Image as ImageIcon,
  Instagram,
  Link2,
  ListChecks,
  Search,
  TrendingUp,
  User,
  Users,
  Youtube,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { defaultPartners, type Partner } from '@/data/partners';

interface Language {
  code: string;
  name: string;
}

interface VisitorStats {
  today: number;
  thisMonth: number;
  total: number;
  onlineUsers: number;
}

interface Survey {
  id: string;
  year: number;
  category: string;
  quarter: number;
  percentage: number | null;
  reportUrl: string | null;
}

interface SurveyLink {
  id: string;
  title: string;
  url: string;
}

interface PortraitSlide {
  id: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
}

interface OperationalHours {
  weekdayLabel: string;
  weekdayHours: string;
  weekdayBreakLabel: string;
  weekdayBreakHours: string;
  fridayLabel: string;
  fridayHours: string;
  fridayBreakLabel: string;
  fridayBreakHours: string;
  weekendLabel: string;
  weekendHours: string;
}

interface Pejabat {
  id: string;
  name: string;
  title: string;
  imageUrl: string | null;
  order: number;
  isActive: boolean;
}

const languages: Language[] = [
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'en', name: 'English' },
  { code: 'ms', name: 'Bahasa Melayu' },
  { code: 'th', name: 'Thai' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'tl', name: 'Filipino' },
  { code: 'my', name: 'Burmese' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
];

const socialLinks = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=100076065040996',
    icon: Facebook,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/pn_nangabulik/',
    icon: Instagram,
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/channel/UCEviJswA-z7MZ1lze_ZXHsw',
    icon: Youtube,
  },
];

const defaultOperationalHours: OperationalHours = {
  weekdayLabel: 'Hari Senin s/d Kamis',
  weekdayHours: '08.30 - 16.00',
  weekdayBreakLabel: 'Istirahat',
  weekdayBreakHours: '12.00 - 13.00',
  fridayLabel: 'Hari Jumat',
  fridayHours: '07.30 - 15.30',
  fridayBreakLabel: 'Istirahat',
  fridayBreakHours: '11.30 - 13.00',
  weekendLabel: 'Hari Sabtu/Minggu/Besar',
  weekendHours: 'Libur',
};

export default function LandingSidebar() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [links, setLinks] = useState<SurveyLink[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [surveyLoading, setSurveyLoading] = useState(true);
  const [partners, setPartners] = useState<Partner[]>(defaultPartners);
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [pojokSlides, setPojokSlides] = useState<PortraitSlide[]>([]);
  const [pojokLoading, setPojokLoading] = useState(true);
  const [pojokIndex, setPojokIndex] = useState(0);
  const [pejabat, setPejabat] = useState<Pejabat[]>([]);
  const [pejabatLoading, setPejabatLoading] = useState(true);
  const [pejabatIndex, setPejabatIndex] = useState(0);
  const [operationalHours, setOperationalHours] = useState<OperationalHours>(
    defaultOperationalHours
  );
  const [publicServiceImages, setPublicServiceImages] = useState<string[]>([]);
  const [workHoursImages, setWorkHoursImages] = useState<string[]>([]);
  const [hoursLoading, setHoursLoading] = useState(true);

  const parseImageList = (raw: string | undefined) => {
    if (!raw) return [] as string[];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (item): item is string => typeof item === 'string' && item.trim().length > 0
        );
      }
    } catch (error) {
      console.error('Error parsing sidebar widget images:', error);
    }
    return [] as string[];
  };

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await fetch('/api/survey');
        const data = await response.json();
        setSurveys(data.surveys || []);
        setLinks(data.links || []);
        setYears(data.years || []);
        if (data.years && data.years.length > 0) {
          setSelectedYear(data.years[0]);
        }
      } catch (error) {
        console.error('Error fetching survey:', error);
        setSurveys([]);
        setLinks([]);
        setYears([]);
      } finally {
        setSurveyLoading(false);
      }
    };

    fetchSurvey();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/statistics');
        if (!response.ok) throw new Error('Failed to fetch statistics');
        const data = await response.json();
        setStats({
          today: data.global.today,
          thisMonth: data.global.thisMonth,
          total: data.global.total,
          onlineUsers: data.global.onlineUsers,
        });
      } catch (error) {
        console.error('Error fetching statistics:', error);
        setStats(null);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch('/api/partners');
        const data = await response.json();
        if (data.partners && data.partners.length > 0) {
          setPartners(data.partners);
        }
      } catch (error) {
        console.error('Error fetching partners:', error);
      }
    };

    fetchPartners();
  }, []);

  useEffect(() => {
    const fetchWorkHours = async () => {
      try {
        const response = await fetch('/api/settings');
        const data = await response.json();
        if (data.settings) {
          const settingsMap = data.settings as Record<string, string>;
          const raw = settingsMap['operational_hours'];
          setPublicServiceImages(parseImageList(settingsMap['sidebar_public_service_images']));
          setWorkHoursImages(parseImageList(settingsMap['sidebar_work_hours_images']));
          if (raw) {
            try {
              const parsed = JSON.parse(raw) as Partial<OperationalHours>;
              setOperationalHours({ ...defaultOperationalHours, ...parsed });
            } catch (error) {
              console.error('Error parsing operational hours:', error);
              setOperationalHours(defaultOperationalHours);
            }
          } else {
            setOperationalHours(defaultOperationalHours);
          }
        }
      } catch (error) {
        console.error('Error fetching work hours:', error);
        setPublicServiceImages([]);
        setWorkHoursImages([]);
      } finally {
        setHoursLoading(false);
      }
    };

    fetchWorkHours();
  }, []);

  useEffect(() => {
    const fetchPojokInfo = async () => {
      try {
        const response = await fetch('/api/pojok-info-slides');
        const data = await response.json();
        const activeSlides = (data.slides || []).filter((slide: PortraitSlide) => slide.isActive);
        setPojokSlides(activeSlides);
      } catch (error) {
        console.error('Error fetching pojok info slides:', error);
        setPojokSlides([]);
      } finally {
        setPojokLoading(false);
      }
    };

    fetchPojokInfo();
  }, []);

  useEffect(() => {
    if (pojokIndex >= pojokSlides.length) {
      setPojokIndex(0);
    }
  }, [pojokIndex, pojokSlides.length]);

  useEffect(() => {
    const fetchPejabat = async () => {
      try {
        const response = await fetch('/api/pejabat');
        const data = await response.json();
        const activePejabat = (data.pejabat || [])
          .filter((person: Pejabat) => person.isActive)
          .sort((a: Pejabat, b: Pejabat) => a.order - b.order);
        setPejabat(activePejabat);
      } catch (error) {
        console.error('Error fetching pejabat:', error);
        setPejabat([]);
      } finally {
        setPejabatLoading(false);
      }
    };

    fetchPejabat();
  }, []);

  useEffect(() => {
    if (pejabatIndex >= pejabat.length) {
      setPejabatIndex(0);
    }
  }, [pejabatIndex, pejabat.length]);

  const categoryLabels: Record<string, string> = {
    SPAK: 'Survey Persepsi Anti Korupsi',
    SKM: 'Survey Kepuasan Masyarakat',
    ZI_ANTI_KORUPSI: 'Survey ZI Persepsi Anti Korupsi',
    ZI_KUALITAS_PELAYANAN: 'Survey ZI Persepsi Kualitas Pelayanan',
  };

  const categoryOrder = ['SPAK', 'SKM', 'ZI_ANTI_KORUPSI', 'ZI_KUALITAS_PELAYANAN'];

  const surveyLinks = useMemo(() => links.slice(0, 3), [links]);

  const partnerLinks = useMemo(() => {
    return partners.filter((partner) => partner.websiteUrl);
  }, [partners]);

  const formatNumber = (num: number) => new Intl.NumberFormat('id-ID').format(num);

  const goToPreviousPojok = () => {
    if (pojokSlides.length === 0) return;
    setPojokIndex((prev) => (prev === 0 ? pojokSlides.length - 1 : prev - 1));
  };

  const goToNextPojok = () => {
    if (pojokSlides.length === 0) return;
    setPojokIndex((prev) => (prev === pojokSlides.length - 1 ? 0 : prev + 1));
  };

  const goToPreviousPejabat = () => {
    if (pejabat.length === 0) return;
    setPejabatIndex((prev) => (prev === 0 ? pejabat.length - 1 : prev - 1));
  };

  const goToNextPejabat = () => {
    if (pejabat.length === 0) return;
    setPejabatIndex((prev) => (prev === pejabat.length - 1 ? 0 : prev + 1));
  };

  const changeLanguage = (lang: Language) => {
    setCurrentLanguage(lang);

    const googleTranslateElement = document.querySelector('.goog-te-combo') as
      | HTMLSelectElement
      | null;

    if (googleTranslateElement) {
      googleTranslateElement.value = lang.code;
      googleTranslateElement.dispatchEvent(new Event('change'));
    } else {
      const currentUrl = window.location.href;
      const translateUrl = `https://translate.google.com/translate?sl=id&tl=${lang.code}&u=${encodeURIComponent(currentUrl)}`;
      window.location.href = translateUrl;
    }
  };

  return (
    <aside className="space-y-6">
      <Card className="shadow-md hover:shadow-lg transition-shadow overflow-hidden">
        <CardHeader className="bg-linear-to-r from-red-900 to-red-800 text-white p-0">
          <CardTitle className="flex items-center gap-2 text-base px-6 py-3">
            <Globe className="h-4 w-4" />
            Alih Bahasa
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="w-full flex items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:border-red-200 hover:bg-red-50 transition-colors"
              >
                <span className="truncate">{currentLanguage.name}</span>
                <Globe className="h-4 w-4 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 max-h-72 overflow-y-auto p-0">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => changeLanguage(lang)}
                  className={`cursor-pointer ${
                    currentLanguage.code === lang.code ? 'bg-red-50' : ''
                  }`}
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-shadow overflow-hidden">
        <CardHeader className="bg-linear-to-r from-red-900 to-red-800 text-white p-0">
          <CardTitle className="flex items-center gap-2 text-base px-6 py-3">
            <Search className="h-4 w-4" />
            Pencarian
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <form action="/berita" method="GET" className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                name="search"
                placeholder="Cari berita atau informasi"
                className="pl-9"
                aria-label="Cari berita atau informasi"
              />
            </div>
            <Button type="submit" className="w-full bg-red-900 hover:bg-red-800">
              Cari Berita
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-shadow overflow-hidden">
        <CardHeader className="bg-linear-to-r from-red-900 to-red-800 text-white p-0">
          <CardTitle className="flex items-center gap-2 text-base px-6 py-3">
            <Clock className="h-4 w-4" />
            Jam Kerja Pengadilan & PTSP
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {hoursLoading ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-4 bg-gray-100 rounded"></div>
              <div className="h-4 bg-gray-100 rounded"></div>
            </div>
          ) : workHoursImages.length > 0 ? (
            <div className="space-y-3">
              {workHoursImages.map((url, index) => (
                <div
                  key={`${url}-${index}`}
                  className="overflow-hidden rounded-lg border border-gray-100 bg-gray-50"
                >
                  <img
                    src={url}
                    alt="Jam Kerja Pengadilan & PTSP"
                    className="w-full h-auto object-contain bg-white"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://via.placeholder.com/640x360?text=Image+Error';
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2 text-sm text-gray-600">
              <p className="text-xs text-gray-500">
                Berlaku untuk Pengadilan & PTSP
              </p>
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <span className="font-semibold text-gray-700">
                    {operationalHours.weekdayLabel}
                  </span>
                  <span className="text-right">{operationalHours.weekdayHours}</span>
                </div>
                <div className="flex items-start justify-between gap-3 text-gray-500">
                  <span className="font-semibold">{operationalHours.weekdayBreakLabel}</span>
                  <span className="text-right">{operationalHours.weekdayBreakHours}</span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <span className="font-semibold text-gray-700">
                    {operationalHours.fridayLabel}
                  </span>
                  <span className="text-right">{operationalHours.fridayHours}</span>
                </div>
                <div className="flex items-start justify-between gap-3 text-gray-500">
                  <span className="font-semibold">{operationalHours.fridayBreakLabel}</span>
                  <span className="text-right">{operationalHours.fridayBreakHours}</span>
                </div>
                <div className="flex items-start justify-between gap-3 text-green-700">
                  <span className="font-semibold">
                    {operationalHours.weekendLabel}
                  </span>
                  <span className="text-right">{operationalHours.weekendHours}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-shadow overflow-hidden">
        <CardHeader className="bg-linear-to-r from-red-900 to-red-800 text-white p-0">
          <CardTitle className="flex items-center gap-2 text-base px-6 py-3">
            <ListChecks className="h-4 w-4" />
            Indeks Pelayanan Publik
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          {hoursLoading ? (
            <div className="space-y-2 animate-pulse">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-9 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          ) : publicServiceImages.length > 0 ? (
            <div className="space-y-3">
              {publicServiceImages.map((url, index) => (
                <div
                  key={`${url}-${index}`}
                  className="overflow-hidden rounded-lg border border-gray-100 bg-gray-50"
                >
                  <img
                    src={url}
                    alt="Indeks Pelayanan Publik"
                    className="w-full h-auto object-contain bg-white"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://via.placeholder.com/640x360?text=Image+Error';
                    }}
                  />
                </div>
              ))}
            </div>
          ) : surveyLoading ? (
            <div className="space-y-2 animate-pulse">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-9 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          ) : (
            <>
              {surveyLinks.length > 0 && (
                <div className="space-y-2">
                  {surveyLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-900 transition-colors"
                    >
                      <span className="truncate">{link.title}</span>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </a>
                  ))}
                </div>
              )}

              {years.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-2">Pilih Tahun</p>
                  <div className="flex flex-wrap gap-2">
                    {years.map((year) => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => setSelectedYear(year)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                          selectedYear === year
                            ? 'bg-red-900 text-white border-red-900'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-red-200'
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {categoryOrder.map((category) => {
                  const filtered = surveys.filter(
                    (survey) =>
                      survey.year === selectedYear &&
                      survey.category === category &&
                      survey.percentage !== null
                  );

                  const latest = filtered.sort((a, b) => b.quarter - a.quarter)[0];

                  return (
                    <div
                      key={category}
                      className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
                    >
                      <p className="text-xs font-semibold text-gray-700 line-clamp-2">
                        {categoryLabels[category]}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-semibold text-red-900">
                          {latest?.percentage !== null && latest?.percentage !== undefined
                            ? `${latest.percentage.toFixed(1)}%`
                            : '-'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {latest ? `Triwulan ${latest.quarter}` : 'Belum ada data'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-shadow overflow-hidden">
        <CardHeader className="bg-linear-to-r from-red-900 to-red-800 text-white p-0">
          <CardTitle className="flex items-center gap-2 text-base px-6 py-3">
            <Link2 className="h-4 w-4" />
            Tautan Website
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-2">
            {partnerLinks.map((partner) => (
              <a
                key={partner.id}
                href={partner.websiteUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-900 transition-colors"
              >
                <span className="truncate">{partner.name}</span>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-shadow overflow-hidden">
        <CardHeader className="bg-linear-to-r from-red-900 to-red-800 text-white p-0">
          <CardTitle className="flex items-center gap-2 text-base px-6 py-3">
            <User className="h-4 w-4" />
            Profil Pejabat
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {pejabatLoading ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-20 bg-gray-100 rounded-lg"></div>
            </div>
          ) : pejabat.length === 0 ? (
            <p className="text-sm text-gray-500">Belum ada data pejabat.</p>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-white flex items-center justify-center">
                    {pejabat[pejabatIndex]?.imageUrl ? (
                      <img
                        src={pejabat[pejabatIndex]?.imageUrl as string}
                        alt={pejabat[pejabatIndex]?.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-semibold text-red-900">
                        {pejabat[pejabatIndex]?.name?.charAt(0) || 'P'}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 line-clamp-2">
                      {pejabat[pejabatIndex]?.name}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {pejabat[pejabatIndex]?.title}
                    </p>
                  </div>
                </div>
              </div>

              {pejabat.length > 1 && (
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <button
                    type="button"
                    onClick={goToPreviousPejabat}
                    className="p-1.5 rounded-full border border-gray-200 hover:bg-red-900 hover:text-white transition-all"
                    aria-label="Sebelumnya"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <span>
                    {pejabatIndex + 1} / {pejabat.length}
                  </span>
                  <button
                    type="button"
                    onClick={goToNextPejabat}
                    className="p-1.5 rounded-full border border-gray-200 hover:bg-red-900 hover:text-white transition-all"
                    aria-label="Berikutnya"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-shadow overflow-hidden">
        <CardHeader className="bg-linear-to-r from-red-900 to-red-800 text-white p-0">
          <CardTitle className="flex items-center gap-2 text-base px-6 py-3">
            <Users className="h-4 w-4" />
            Media Sosial
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-2">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-900 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-gray-500" />
                    {link.label}
                  </span>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </a>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-shadow overflow-hidden">
        <CardHeader className="bg-linear-to-r from-red-900 to-red-800 text-white p-0">
          <CardTitle className="flex items-center gap-2 text-base px-6 py-3">
            <BarChart3 className="h-4 w-4" />
            Statistik Situs
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-xs text-gray-500 mb-3">
            Statistik dihitung dari kunjungan, bukan login pengguna.
          </p>
          {statsLoading ? (
            <div className="grid grid-cols-2 gap-3 animate-pulse">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-16 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          ) : !stats ? (
            <p className="text-sm text-gray-500">Statistik belum tersedia.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Users className="h-3.5 w-3.5" />
                  Online (Pengunjung Aktif)
                </div>
                <div className="text-lg font-semibold text-gray-800">
                  {formatNumber(stats.onlineUsers)}
                </div>
              </div>
              <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Hari Ini (Kunjungan)
                </div>
                <div className="text-lg font-semibold text-gray-800">
                  {formatNumber(stats.today)}
                </div>
              </div>
              <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Bulan Ini
                </div>
                <div className="text-lg font-semibold text-gray-800">
                  {formatNumber(stats.thisMonth)}
                </div>
              </div>
              <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <BarChart3 className="h-3.5 w-3.5" />
                  Total
                </div>
                <div className="text-lg font-semibold text-gray-800">
                  {formatNumber(stats.total)}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-shadow overflow-hidden">
        <CardHeader className="bg-linear-to-r from-red-900 to-red-800 text-white p-0">
          <CardTitle className="flex items-center gap-2 text-base px-6 py-3">
            <ImageIcon className="h-4 w-4" />
            Pojok Info
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {pojokLoading ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-48 bg-gray-100 rounded-lg"></div>
            </div>
          ) : pojokSlides.length === 0 ? (
            <div className="aspect-3/4 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 bg-gray-50">
              <ImageIcon className="h-8 w-8 mb-2" />
              <p className="text-sm">Belum ada gambar pojok info</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative aspect-3/4 rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={pojokSlides[pojokIndex]?.imageUrl}
                  alt="Pojok Info"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x800?text=Image+Error';
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={goToPreviousPojok}
                  className="p-2 rounded-full border border-gray-200 hover:bg-red-900 hover:text-white transition-all"
                  aria-label="Sebelumnya"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-2">
                  {pojokSlides.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setPojokIndex(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === pojokIndex
                          ? 'bg-red-900 w-8'
                          : 'bg-gray-300 w-2 hover:bg-gray-400'
                      }`}
                      aria-label={`Slide ${index + 1}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={goToNextPojok}
                  className="p-2 rounded-full border border-gray-200 hover:bg-red-900 hover:text-white transition-all"
                  aria-label="Berikutnya"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="text-center text-xs text-gray-500">
                {pojokIndex + 1} / {pojokSlides.length}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </aside>
  );
}
