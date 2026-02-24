'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Loader2, Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface MaklumatSlide {
  id: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface FormData {
  imageUrl: string;
  isActive: boolean;
}

const defaultFormData: FormData = {
  imageUrl: '',
  isActive: true,
};

export default function MaklumatSlidesManagement() {
  const [slides, setSlides] = useState<MaklumatSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<MaklumatSlide | null>(null);
  const [formData, setFormData] = useState<FormData>(defaultFormData);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/maklumat-slides');
      const data = await response.json();
      setSlides(data.slides || []);
    } catch (error) {
      console.error('Error fetching maklumat slides:', error);
      toast.error('Gagal memuat data maklumat');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (slide?: MaklumatSlide) => {
    if (slide) {
      setEditingSlide(slide);
      setFormData({
        imageUrl: slide.imageUrl,
        isActive: slide.isActive,
      });
    } else {
      setEditingSlide(null);
      setFormData(defaultFormData);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingSlide(null);
    setFormData(defaultFormData);
  };

  const handleSave = async () => {
    if (!formData.imageUrl.trim()) {
      toast.error('URL gambar harus diisi');
      return;
    }

    setSaving(true);

    try {
      const url = '/api/maklumat-slides';
      const method = editingSlide ? 'PUT' : 'POST';
      const body = editingSlide
        ? { id: editingSlide.id, ...formData }
        : { ...formData, order: slides.length };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
      });

      if (response.ok) {
        toast.success(editingSlide ? 'Slide berhasil diperbarui' : 'Slide berhasil ditambahkan');
        fetchSlides();
        handleCloseDialog();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Gagal menyimpan slide');
      }
    } catch (error) {
      console.error('Error saving slide:', error);
      toast.error('Terjadi kesalahan saat menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus slide ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/maklumat-slides?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        toast.success('Slide berhasil dihapus');
        fetchSlides();
      } else {
        toast.error('Gagal menghapus slide');
      }
    } catch (error) {
      console.error('Error deleting slide:', error);
      toast.error('Terjadi kesalahan saat menghapus');
    }
  };

  const handleToggleActive = async (slide: MaklumatSlide) => {
    try {
      const response = await fetch('/api/maklumat-slides', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: slide.id,
          isActive: !slide.isActive,
        }),
        credentials: 'include',
      });

      if (response.ok) {
        toast.success('Status berhasil diperbarui');
        fetchSlides();
      } else {
        toast.error('Gagal memperbarui status');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Terjadi kesalahan');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#8B0000]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Maklumat</h3>
          <p className="text-sm text-gray-500 mt-1">Kelola slider maklumat (gambar portrait)</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-[#8B0000] hover:bg-[#700000] text-white w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Slide
        </Button>
      </div>

      <div className="grid gap-4">
        {slides.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Belum ada slide maklumat. Tambahkan slide baru untuk memulai.</p>
            </CardContent>
          </Card>
        ) : (
          slides.map((slide) => (
            <Card key={slide.id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row gap-4 p-6">
                <div className="w-full sm:w-24 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={slide.imageUrl}
                    alt="Maklumat"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/120x160?text=Image+Error';
                    }}
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <p className="font-semibold text-gray-800">Slide #{slide.order + 1}</p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{slide.imageUrl}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Order: {slide.order}</span>
                    <span className="text-gray-300">•</span>
                    <span>Status: {slide.isActive ? 'Aktif' : 'Nonaktif'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleActive(slide)}
                    className="h-8 w-8"
                    aria-label={slide.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                  >
                    {slide.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenDialog(slide)}
                    className="h-8 w-8"
                    aria-label="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(slide.id)}
                    className="h-8 w-8 text-red-500 hover:text-red-700"
                    aria-label="Hapus"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>{editingSlide ? 'Edit Slide Maklumat' : 'Tambah Slide Maklumat'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL Gambar (Portrait)</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label className="text-sm">Status Aktif</Label>
                <p className="text-xs text-gray-500">Tampilkan di slider maklumat</p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog} disabled={saving}>
              Batal
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#8B0000] hover:bg-[#700000] text-white"
            >
              {saving ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
