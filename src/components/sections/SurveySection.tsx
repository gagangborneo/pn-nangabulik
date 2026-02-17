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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-3 animate-pulse"></div>
            <div className="h-1 w-20 bg-gray-200 rounded mx-auto animate-pulse"></div>
          </div>
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-gray-100 rounded-xl"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            Survey Persepsi Anti Korupsi & Kepuasan Masyarakat
          </h2>
          <div className="w-20 h-1 bg-[#8B0000] mx-auto"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Survey Links (1/3) */}
          <div className="lg:w-1/3">
            <div className="bg-gradient-to-br from-[#8B0000] to-[#6b0000] rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Link Survey
              </h3>
              <div className="space-y-3">
                {links.length === 0 ? (
                  <p className="text-red-200 text-sm">Belum ada link survey tersedia</p>
                ) : (
                  links.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg px-4 py-3 transition-colors group"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="flex-1">{link.title}</span>
                      <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))
                )}
              </div>
            </div>

            {/* Year Selector */}
            {years.length > 0 && (
              <div className="mt-4 bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-gray-600 mb-3">Pilih Tahun:</h4>
                <div className="flex flex-wrap gap-2">
                  {years.map((year) => (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedYear === year
                          ? 'bg-[#8B0000] text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
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
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Belum Ada Data Survey
                </h3>
                <p className="text-gray-500 text-sm">
                  Data survey akan ditampilkan setelah diisi oleh admin
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {categoryOrder.map((category) => (
                  <div key={category} className="bg-gray-50 rounded-xl overflow-hidden">
                    {/* Category Header */}
                    <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-800">
                        {categoryLabels[category]} {selectedYear}
                      </h3>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Indikator
                            </th>
                            {['Triwulan 1', 'Triwulan 2', 'Triwulan 3', 'Triwulan 4'].map((tw) => (
                              <th
                                key={tw}
                                className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
                              >
                                {tw}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-100">
                            <td className="px-4 py-4 text-sm font-medium text-gray-700">
                              Persentase
                            </td>
                            {[1, 2, 3, 4].map((quarter) => {
                              const data = getSurveyData(category, quarter);
                              return (
                                <td key={quarter} className="px-4 py-4 text-center">
                                  {data?.percentage ? (
                                    <span className="inline-flex items-center gap-1">
                                      <span className="text-lg font-bold text-[#8B0000]">
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
                          <tr>
                            <td className="px-4 py-4 text-sm font-medium text-gray-700">
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
                                      className="inline-flex items-center gap-1 text-[#8B0000] hover:text-[#6b0000] text-sm font-medium"
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
