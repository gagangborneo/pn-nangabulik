'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, Save, Trash2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

const PUBLIC_SERVICE_KEY = 'sidebar_public_service_images';
const WORK_HOURS_KEY = 'sidebar_work_hours_images';

type WidgetField = 'publicServiceImages' | 'workHoursImages';

interface SidebarWidgetSettings {
  publicServiceImages: string[];
  workHoursImages: string[];
}

const defaultSettings: SidebarWidgetSettings = {
  publicServiceImages: [],
  workHoursImages: [],
};

const normalizeImageList = (items: string[]) =>
  items.map((item) => item.trim()).filter((item) => item.length > 0);

const parseImageList = (raw: string | undefined) => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
    }
  } catch (error) {
    console.error('Error parsing sidebar widget images:', error);
  }
  return [];
};

export default function SidebarWidgetManagement() {
  const [settings, setSettings] = useState<SidebarWidgetSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        const data = await response.json();

        if (data.settings) {
          const settingsMap = data.settings as Record<string, string>;
          setSettings({
            publicServiceImages: parseImageList(settingsMap[PUBLIC_SERVICE_KEY]),
            workHoursImages: parseImageList(settingsMap[WORK_HOURS_KEY]),
          });
        }
      } catch (error) {
        console.error('Error fetching sidebar widget settings:', error);
        toast.error('Gagal memuat pengaturan widget sidebar');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const updateImage = (field: WidgetField, index: number, value: string) => {
    setSettings((prev) => {
      const updated = [...prev[field]];
      updated[index] = value;
      return { ...prev, [field]: updated };
    });
  };

  const addImage = (field: WidgetField) => {
    setSettings((prev) => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeImage = (field: WidgetField, index: number) => {
    setSettings((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleSave = async () => {
    setSaving(true);

    const normalized = {
      publicServiceImages: normalizeImageList(settings.publicServiceImages),
      workHoursImages: normalizeImageList(settings.workHoursImages),
    };

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([
          { key: PUBLIC_SERVICE_KEY, value: JSON.stringify(normalized.publicServiceImages) },
          { key: WORK_HOURS_KEY, value: JSON.stringify(normalized.workHoursImages) },
        ]),
      });

      if (!response.ok) {
        throw new Error('Failed to save sidebar widget settings');
      }

      setSettings(normalized);
      toast.success('Pengaturan widget sidebar berhasil disimpan');
    } catch (error) {
      console.error('Error saving sidebar widget settings:', error);
      toast.error('Gagal menyimpan pengaturan widget sidebar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#8B0000]" />
      </div>
    );
  }

  const renderImageSection = (
    title: string,
    description: string,
    field: WidgetField,
    images: string[]
  ) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {images.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
            Belum ada gambar. Tambahkan gambar untuk ditampilkan di widget.
          </div>
        ) : (
          <div className="space-y-4">
            {images.map((url, index) => {
              const inputId = `${field}-${index}`;
              return (
                <div
                  key={`${field}-${index}`}
                  className="flex flex-col gap-3 rounded-lg border border-gray-100 bg-white p-3 sm:flex-row"
                >
                  <div className="h-20 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 sm:w-28">
                    {url ? (
                      <img
                        src={url}
                        alt={`${title} ${index + 1}`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://via.placeholder.com/320x200?text=Image+Error';
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">
                        <ImageIcon className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={inputId}>Gambar {index + 1}</Label>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <Input
                        id={inputId}
                        value={url}
                        onChange={(e) => updateImage(field, index, e.target.value)}
                        placeholder="https://..."
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => removeImage(field, index)}
                        aria-label="Hapus gambar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Button type="button" variant="outline" onClick={() => addImage(field)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Gambar
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      {renderImageSection(
        'Indeks Pelayanan Publik',
        'Unggah lebih dari satu gambar. Urutan gambar mengikuti daftar dan ditampilkan ke bawah.',
        'publicServiceImages',
        settings.publicServiceImages
      )}

      {renderImageSection(
        'Jam Kerja Pengadilan & PTSP',
        'Unggah lebih dari satu gambar. Urutan gambar mengikuti daftar dan ditampilkan ke bawah.',
        'workHoursImages',
        settings.workHoursImages
      )}

      <Button className="bg-[#8B0000] hover:bg-[#6b0000]" onClick={handleSave} disabled={saving}>
        {saving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Menyimpan...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Simpan Pengaturan
          </>
        )}
      </Button>
    </div>
  );
}
