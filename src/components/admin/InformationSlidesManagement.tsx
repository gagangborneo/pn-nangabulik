'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Loader2, Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface InformationSlide {
  id: string;
  title: string;
  imageUrl: string;
  description: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface FormData {
  title: string;
  imageUrl: string;
  description: string;
  isActive: boolean;
}

const defaultFormData: FormData = {
  title: '',
  imageUrl: '',
  description: '',
  isActive: true,
};

export default function InformationSlidesManagement() {
  const [slides, setSlides] = useState<InformationSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<InformationSlide | null>(null);
  const [formData, setFormData] = useState<FormData>(defaultFormData);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/information-slides');
      const data = await response.json();
      setSlides(data.slides || []);
    } catch (error) {
      console.error('Error fetching slides:', error);
      toast.error('Gagal memuat data information slides');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (slide?: InformationSlide) => {
    if (slide) {
      setEditingSlide(slide);
      setFormData({
        title: slide.title,
        imageUrl: slide.imageUrl,
        description: slide.description || '',
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
    if (!formData.title.trim()) {
      toast.error('Judul harus diisi');
      return;
    }

    if (!formData.imageUrl.trim()) {
      toast.error('URL gambar harus diisi');
      return;
    }

    setSaving(true);

    try {
      const url = '/api/information-slides';
      const method = editingSlide ? 'PUT' : 'POST';
      const body = editingSlide
        ? { id: editingSlide.id, ...formData }
        : formData;

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
      const response = await fetch(`/api/information-slides?id=${id}`, {
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

  const handleToggleActive = async (slide: InformationSlide) => {
    try {
      const response = await fetch('/api/information-slides', {
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Information Slides</h3>
          <p className="text-sm text-gray-500 mt-1">Kelola slide informasi yang ditampilkan di halaman utama</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-[#8B0000] hover:bg-[#700000] text-white w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Slide
        </Button>
      </div>

      {/* Slides List */}
      <div className="grid gap-4">
        {slides.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Belum ada information slide. Tambahkan slide baru untuk memulai.</p>
            </CardContent>
          </Card>
        ) : (
          slides.map((slide) => (
            <Card key={slide.id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row gap-4 p-6">
                {/* Thumbnail */}
                <div className="w-full sm:w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=Image+Error';
                    }}
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-800">{slide.title}</h4>
                      {slide.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{slide.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Order: {slide.order}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={() => handleToggleActive(slide)}
                  >
                    {slide.isActive ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={() => handleOpenDialog(slide)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full sm:w-auto text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(slide.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingSlide ? 'Edit Slide' : 'Tambah Slide Baru'}
            </DialogTitle>
            <DialogDescription>
              {editingSlide
                ? 'Perbarui informasi slide'
                : 'Tambahkan slide informasi baru ke galeri'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <Label htmlFor="title">Judul *</Label>
              <Input
                id="title"
                placeholder="Masukkan judul slide"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-2"
              />
            </div>

            {/* Image URL */}
            <div>
              <Label htmlFor="imageUrl">URL Gambar *</Label>
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="mt-2"
              />
              {formData.imageUrl && (
                <div className="mt-2 rounded-lg overflow-hidden max-h-48 bg-gray-100">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-auto object-cover max-h-48"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=Image+Error';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                placeholder="Masukkan deskripsi slide"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-2 resize-none"
                rows={3}
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between py-2 bg-gray-50 px-4 rounded-lg">
              <Label>Aktifkan Slide</Label>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              disabled={saving}
            >
              Batal
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#8B0000] hover:bg-[#700000] text-white"
            >
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingSlide ? 'Perbarui' : 'Tambah'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
