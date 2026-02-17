'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, FileText, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

const categoryLabels: Record<string, string> = {
  SPAK: 'Survey Persepsi Anti Korupsi (SPAK)',
  SKM: 'Survey Kepuasan Masyarakat (SKM)',
  ZI_ANTI_KORUPSI: 'Survey ZI Persepsi Anti Korupsi',
  ZI_KUALITAS_PELAYANAN: 'Survey ZI Persepsi Kualitas Pelayanan',
};

const categoryOrder = ['SPAK', 'SKM', 'ZI_ANTI_KORUPSI', 'ZI_KUALITAS_PELAYANAN'];

export default function SurveySection() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [links, setLinks] = useState<SurveyLink[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurveys = async () => {
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
        console.error('Error fetching surveys:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  const getSurveyData = (category: string, quarter: number) => {
    return surveys.find(
      (s) => s.year === selectedYear && s.category === category && s.quarter === quarter
    );
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-[#8B0000] via-[#6b0000] to-[#4a0000]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 w-64 bg-white/20 rounded mx-auto mb-3 animate-pulse"></div>
            <div className="h-1 w-20 bg-white/30 rounded mx-auto animate-pulse"></div>
          </div>
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-white/10 rounded-xl"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-[#8B0000] via-[#6b0000] to-[#4a0000] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 drop-shadow-lg">
            Survey Persepsi Anti Korupsi & Kepuasan Masyarakat
          </h2>
          <div className="w-20 h-1 bg-yellow-400 mx-auto shadow-lg"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Survey Links (1/3) */}
          <div className="lg:w-1/3">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-white/20">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#8B0000]">
                <BarChart3 className="h-5 w-5" />
                Link Survey
              </h3>
              <div className="space-y-3">
                {links.length === 0 ? (
                  <p className="text-gray-500 text-sm">Belum ada link survey tersedia</p>
                ) : (
                  links.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-gradient-to-r from-[#8B0000] to-[#6b0000] hover:from-[#a00000] hover:to-[#7b0000] text-white rounded-lg px-4 py-3 transition-all duration-300 group shadow-md hover:shadow-lg"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="flex-1 font-medium">{link.title}</span>
                      <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))
                )}
              </div>
            </div>

            {/* Year Selector */}
            {years.length > 0 && (
              <div className="mt-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-2xl border border-white/20">
                <h4 className="text-sm font-semibold text-[#8B0000] mb-3">Pilih Tahun:</h4>
                <div className="flex flex-wrap gap-2">
                  {years.map((year) => (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-sm ${
                        selectedYear === year
                          ? 'bg-gradient-to-r from-[#8B0000] to-[#6b0000] text-white shadow-lg scale-105'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-[#8B0000]/30'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Survey Tables (2/3) */}
          <div className="lg:w-2/3">
            {years.length === 0 ? (
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 text-center shadow-2xl border border-white/20">
                <BarChart3 className="h-12 w-12 text-[#8B0000]/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Belum Ada Data Survey
                </h3>
                <p className="text-gray-600 text-sm">
                  Data survey akan ditampilkan setelah diisi oleh admin
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {categoryOrder.map((category) => (
                  <div key={category} className="bg-white/95 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl border border-white/20 hover:shadow-3xl transition-shadow duration-300">
                    {/* Category Header */}
                    <div className="bg-gradient-to-r from-[#8B0000] to-[#6b0000] px-6 py-4">
                      <h3 className="text-lg font-bold text-white drop-shadow-md">
                        {categoryLabels[category]} {selectedYear}
                      </h3>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Indikator
                            </th>
                            {['Triwulan 1', 'Triwulan 2', 'Triwulan 3', 'Triwulan 4'].map((tw) => (
                              <th
                                key={tw}
                                className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                              >
                                {tw}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white">
                          <tr className="border-b border-gray-200 hover:bg-gray-50/50 transition-colors">
                            <td className="px-4 py-4 text-sm font-semibold text-gray-800">
                              Persentase
                            </td>
                            {[1, 2, 3, 4].map((quarter) => {
                              const data = getSurveyData(category, quarter);
                              return (
                                <td key={quarter} className="px-4 py-4 text-center">
                                  {data?.percentage ? (
                                    <span className="inline-flex items-center gap-1">
                                      <span className="text-lg font-bold text-[#8B0000] bg-red-50 px-3 py-1 rounded-lg">
                                        {data.percentage.toFixed(1)}%
                                      </span>
                                    </span>
                                  ) : (
                                    <span className="text-gray-400 text-sm">-</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                          <tr className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-4 py-4 text-sm font-semibold text-gray-800">
                              Laporan
                            </td>
                            {[1, 2, 3, 4].map((quarter) => {
                              const data = getSurveyData(category, quarter);
                              return (
                                <td key={quarter} className="px-4 py-4 text-center">
                                  {data?.reportUrl ? (
                                    <a
                                      href={data.reportUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-[#8B0000] hover:text-white bg-red-50 hover:bg-[#8B0000] px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md"
                                    >
                                      <FileText className="h-4 w-4" />
                                      Lihat
                                    </a>
                                  ) : (
                                    <span className="text-gray-400 text-sm">-</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
