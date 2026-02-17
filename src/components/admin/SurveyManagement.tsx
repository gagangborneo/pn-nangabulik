'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  BarChart3,
  ExternalLink,
  ChevronRight,
  Save,
} from 'lucide-react';
import { toast } from 'sonner';

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
  order: number;
}

const categoryLabels: Record<string, string> = {
  SPAK: 'Survey Persepsi Anti Korupsi (SPAK)',
  SKM: 'Survey Kepuasan Masyarakat (SKM)',
  ZI_ANTI_KORUPSI: 'Survey ZI Persepsi Anti Korupsi',
  ZI_KUALITAS_PELAYANAN: 'Survey ZI Persepsi Kualitas Pelayanan',
};

const categoryOrder = ['SPAK', 'SKM', 'ZI_ANTI_KORUPSI', 'ZI_KUALITAS_PELAYANAN'];

export default function SurveyManagement() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [links, setLinks] = useState<SurveyLink[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Year management
  const [newYearDialog, setNewYearDialog] = useState(false);
  const [newYear, setNewYear] = useState('');

  // Selected year for editing
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Link management
  const [linkDialog, setLinkDialog] = useState(false);
  const [editingLink, setEditingLink] = useState<SurveyLink | null>(null);
  const [linkForm, setLinkForm] = useState({ title: '', url: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/survey');
      const data = await response.json();
      setSurveys(data.surveys || []);
      setLinks(data.links || []);
      setYears(data.years || []);
      if (data.years && data.years.length > 0 && !selectedYear) {
        setSelectedYear(data.years[0]);
      }
    } catch (error) {
      console.error('Error fetching surveys:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddYear = async () => {
    if (!newYear || isNaN(parseInt(newYear))) {
      toast.error('Masukkan tahun yang valid');
      return;
    }

    const yearNum = parseInt(newYear);
    if (years.includes(yearNum)) {
      toast.error('Tahun sudah ada');
      return;
    }

    setYears([yearNum, ...years].sort((a, b) => b - a));
    setSelectedYear(yearNum);
    setNewYear('');
    setNewYearDialog(false);
    toast.success(`Tahun ${yearNum} ditambahkan`);
  };

  const handleDeleteYear = async (year: number) => {
    if (!confirm(`Hapus semua data survey tahun ${year}?`)) return;

    try {
      await fetch(`/api/survey?year=${year}`, { method: 'DELETE' });
      setYears(years.filter((y) => y !== year));
      setSurveys(surveys.filter((s) => s.year !== year));
      if (selectedYear === year) {
        setSelectedYear(years.find((y) => y !== year) || null);
      }
      toast.success(`Tahun ${year} dihapus`);
    } catch (error) {
      toast.error('Gagal menghapus tahun');
    }
  };

  const handleSaveSurvey = async (
    year: number,
    category: string,
    quarter: number,
    percentage: string,
    reportUrl: string
  ) => {
    setSaving(true);
    try {
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year,
          category,
          quarter,
          percentage: percentage || null,
          reportUrl: reportUrl || null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update local state
        setSurveys((prev) => {
          const existing = prev.findIndex(
            (s) => s.year === year && s.category === category && s.quarter === quarter
          );
          if (existing >= 0) {
            const updated = [...prev];
            updated[existing] = data.survey;
            return updated;
          }
          return [...prev, data.survey];
        });
        toast.success('Data berhasil disimpan');
      }
    } catch (error) {
      toast.error('Gagal menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenLinkDialog = (link?: SurveyLink) => {
    if (link) {
      setEditingLink(link);
      setLinkForm({ title: link.title, url: link.url });
    } else {
      setEditingLink(null);
      setLinkForm({ title: '', url: '' });
    }
    setLinkDialog(true);
  };

  const handleSaveLink = async () => {
    if (!linkForm.title || !linkForm.url) {
      toast.error('Judul dan URL harus diisi');
      return;
    }

    try {
      if (editingLink) {
        const response = await fetch('/api/survey/links', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingLink.id,
            title: linkForm.title,
            url: linkForm.url,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          setLinks(links.map((l) => (l.id === editingLink.id ? data.link : l)));
          toast.success('Link berhasil diupdate');
        }
      } else {
        const response = await fetch('/api/survey/links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: linkForm.title,
            url: linkForm.url,
            order: links.length,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          setLinks([...links, data.link]);
          toast.success('Link berhasil ditambahkan');
        }
      }
      setLinkDialog(false);
    } catch (error) {
      toast.error('Gagal menyimpan link');
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!confirm('Hapus link ini?')) return;

    try {
      await fetch(`/api/survey/links?id=${id}`, { method: 'DELETE' });
      setLinks(links.filter((l) => l.id !== id));
      toast.success('Link dihapus');
    } catch (error) {
      toast.error('Gagal menghapus link');
    }
  };

  const getSurveyData = (category: string, quarter: number) => {
    return surveys.find(
      (s) => s.year === selectedYear && s.category === category && s.quarter === quarter
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#8B0000]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Manajemen Survey</h3>
          <p className="text-sm text-gray-500">Kelola data survey dan link</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleOpenLinkDialog()}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Tambah Link
          </Button>
          <Button className="bg-[#8B0000] hover:bg-[#6b0000]" onClick={() => setNewYearDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Tahun
          </Button>
        </div>
      </div>

      {/* Survey Links Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Link Survey</CardTitle>
          <CardDescription>Link yang ditampilkan di halaman survey</CardDescription>
        </CardHeader>
        <CardContent>
          {links.length === 0 ? (
            <p className="text-gray-500 text-sm py-4 text-center">Belum ada link survey</p>
          ) : (
            <div className="space-y-2">
              {links.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-800">{link.title}</p>
                    <p className="text-sm text-gray-500 truncate max-w-md">{link.url}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenLinkDialog(link)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600"
                      onClick={() => handleDeleteLink(link.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Years List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Data Survey per Tahun</CardTitle>
          <CardDescription>Pilih tahun untuk mengelola data survey</CardDescription>
        </CardHeader>
        <CardContent>
          {years.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Belum ada data tahun</p>
              <Button onClick={() => setNewYearDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Tahun
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {years.map((year) => (
                <div
                  key={year}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedYear === year
                      ? 'border-[#8B0000] bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedYear(year)}
                >
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-[#8B0000]" />
                    <span className="font-semibold text-gray-800">Tahun {year}</span>
                    <span className="text-sm text-gray-500">
                      ({surveys.filter((s) => s.year === year).length} data)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedYear === year && (
                      <ChevronRight className="h-5 w-5 text-[#8B0000]" />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteYear(year);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Survey Data Editor */}
      {selectedYear && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Data Survey Tahun {selectedYear}</CardTitle>
            <CardDescription>Isi persentase dan link laporan untuk setiap triwulan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {categoryOrder.map((category) => (
                <SurveyCategoryEditor
                  key={`${selectedYear}-${category}`}
                  year={selectedYear}
                  category={category}
                  categoryLabel={categoryLabels[category]}
                  data={[1, 2, 3, 4].map((q) => getSurveyData(category, q))}
                  onSave={handleSaveSurvey}
                  saving={saving}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Year Dialog */}
      <Dialog open={newYearDialog} onOpenChange={setNewYearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Tahun Baru</DialogTitle>
            <DialogDescription>Masukkan tahun untuk data survey baru</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="year">Tahun</Label>
            <Input
              id="year"
              type="number"
              placeholder="2024"
              value={newYear}
              onChange={(e) => setNewYear(e.target.value)}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewYearDialog(false)}>
              Batal
            </Button>
            <Button className="bg-[#8B0000] hover:bg-[#6b0000]" onClick={handleAddYear}>
              Tambah
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link Dialog */}
      <Dialog open={linkDialog} onOpenChange={setLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingLink ? 'Edit Link' : 'Tambah Link Baru'}</DialogTitle>
            <DialogDescription>Link survey yang akan ditampilkan di halaman publik</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="linkTitle">Judul Link</Label>
              <Input
                id="linkTitle"
                placeholder="Survey Kepuasan Masyarakat 2024"
                value={linkForm.title}
                onChange={(e) => setLinkForm({ ...linkForm, title: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="linkUrl">URL</Label>
              <Input
                id="linkUrl"
                placeholder="https://forms.google.com/..."
                value={linkForm.url}
                onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkDialog(false)}>
              Batal
            </Button>
            <Button className="bg-[#8B0000] hover:bg-[#6b0000]" onClick={handleSaveLink}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Survey Category Editor Component
function SurveyCategoryEditor({
  year,
  category,
  categoryLabel,
  data,
  onSave,
  saving,
}: {
  year: number;
  category: string;
  categoryLabel: string;
  data: (Survey | undefined)[];
  onSave: (year: number, category: string, quarter: number, percentage: string, reportUrl: string) => void;
  saving: boolean;
}) {
  // Initialize state from data (component remounts when key changes)
  const [percentages, setPercentages] = useState<string[]>(() =>
    data.map((d) => (d?.percentage ? d.percentage.toString() : ''))
  );
  const [urls, setUrls] = useState<string[]>(() =>
    data.map((d) => d?.reportUrl || '')
  );

  const handleSave = (quarter: number) => {
    onSave(year, category, quarter, percentages[quarter - 1], urls[quarter - 1]);
  };

  return (
    <div className="bg-gray-50 rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-4 py-3 border-b border-gray-200">
        <h4 className="font-semibold text-gray-800">{categoryLabel}</h4>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((quarter) => (
            <div key={quarter} className="space-y-2">
              <Label className="text-xs font-semibold text-gray-600">Triwulan {quarter}</Label>
              <Input
                type="number"
                step="0.1"
                placeholder="%"
                value={percentages[quarter - 1]}
                onChange={(e) => {
                  const newPercentages = [...percentages];
                  newPercentages[quarter - 1] = e.target.value;
                  setPercentages(newPercentages);
                }}
                className="h-9"
              />
              <Input
                type="url"
                placeholder="Link laporan"
                value={urls[quarter - 1]}
                onChange={(e) => {
                  const newUrls = [...urls];
                  newUrls[quarter - 1] = e.target.value;
                  setUrls(newUrls);
                }}
                className="h-9"
              />
              <Button
                size="sm"
                className="w-full bg-[#8B0000] hover:bg-[#6b0000]"
                onClick={() => handleSave(quarter)}
                disabled={saving}
              >
                <Save className="h-3 w-3 mr-1" />
                Simpan
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
