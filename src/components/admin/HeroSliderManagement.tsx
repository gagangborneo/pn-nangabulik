'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Loader2, Plus, Pencil, Trash2, Eye, EyeOff, Image as ImageIcon, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  tag: string | null;
  imageUrl: string;
  overlayColor: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface FormData {
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  imageUrl: string;
  overlayColor: string;
  buttonText: string;
  buttonUrl: string;
  isActive: boolean;
}

const defaultFormData: FormData = {
  title: '',
  subtitle: '',
  description: '',
  tag: '',
  imageUrl: '',
  overlayColor: 'rgba(139, 0, 0, 0.75)',
  buttonText: '',
  buttonUrl: '',
  isActive: true,
};

export default function HeroSliderManagement() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [formData, setFormData] = useState<FormData>(defaultFormData);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/hero-slides');
      const data = await response.json();
      setSlides(data.slides || []);
    } catch (error) {
      console.error('Error fetching slides:', error);
      toast.error('Gagal memuat data hero slides');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (slide?: HeroSlide) => {
    if (slide) {
      setEditingSlide(slide);
      setFormData({
        title: slide.title,
        subtitle: slide.subtitle || '',
        description: slide.description || '',
        tag: slide.tag || '',
        imageUrl: slide.imageUrl,
        overlayColor: slide.overlayColor || 'rgba(139, 0, 0, 0.75)',
        buttonText: slide.buttonText || '',
        buttonUrl: slide.buttonUrl || '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        order: editingSlide ? editingSlide.order : slides.length,
      };

      const response = await fetch('/api/hero-slides', {
        method: editingSlide ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingSlide ? { id: editingSlide.id, ...payload } : payload),
      });

      if (response.ok) {
        toast.success(editingSlide ? 'Hero slide berhasil diperbarui' : 'Hero slide berhasil dibuat');
        handleCloseDialog();
        fetchSlides();
      } else {
        toast.error('Gagal menyimpan hero slide');
      }
    } catch (error) {
      console.error('Error saving slide:', error);
      toast.error('Terjadi kesalahan saat menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus slide ini?')) return;

    try {
      const response = await fetch(`/api/hero-slides?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Hero slide berhasil dihapus');
        fetchSlides();
      } else {
        toast.error('Gagal menghapus hero slide');
      }
    } catch (error) {
      console.error('Error deleting slide:', error);
      toast.error('Terjadi kesalahan saat menghapus');
    }
  };

  const handleToggleActive = async (slide: HeroSlide) => {
    try {
      const response = await fetch('/api/hero-slides', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: slide.id, isActive: !slide.isActive }),
      });

      if (response.ok) {
        toast.success(`Slide ${!slide.isActive ? 'diaktifkan' : 'dinonaktifkan'}`);
        fetchSlides();
      }
    } catch (error) {
      console.error('Error toggling active:', error);
      toast.error('Gagal mengubah status');
    }
  };

  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    const newSlides = [...slides];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newSlides.length) return;

    // Swap orders
    [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];
    
    // Update order values
    newSlides[index].order = index;
    newSlides[targetIndex].order = targetIndex;

    setSlides(newSlides);

    // Save to server
    try {
      await Promise.all([
        fetch('/api/hero-slides', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: newSlides[index].id, order: index }),
        }),
        fetch('/api/hero-slides', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: newSlides[targetIndex].id, order: targetIndex }),
        }),
      ]);
      toast.success('Urutan berhasil diubah');
    } catch (error) {
      console.error('Error reordering:', error);
      toast.error('Gagal mengubah urutan');
      fetchSlides(); // Reload if failed
    }
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Hero Slider</h2>
          <p className="text-gray-500 mt-1">Kelola slider hero carousel di halaman beranda</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-[#8B0000] hover:bg-[#6b0000]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Slide
        </Button>
      </div>

      <div className="grid gap-4">
        {slides.map((slide, index) => (
          <Card key={slide.id} className={!slide.isActive ? 'opacity-60' : ''}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                {/* Preview Image */}
                <div className="relative w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  {slide.imageUrl ? (
                    <img
                      src={slide.imageUrl}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  {slide.tag && (
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
                      {slide.tag}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {slide.title}
                      </h3>
                      {slide.subtitle && (
                        <p className="text-sm text-gray-600 truncate">{slide.subtitle}</p>
                      )}
                      {slide.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {slide.description}
                        </p>
                      )}
                      {slide.buttonText && (
                        <div className="mt-2 text-xs text-gray-500">
                          Button: <span className="font-medium">{slide.buttonText}</span>
                          {slide.buttonUrl && ` → ${slide.buttonUrl}`}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {/* Reorder */}
                      <div className="flex flex-col gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReorder(index, 'up')}
                          disabled={index === 0}
                          className="h-7 w-7 p-0"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReorder(index, 'down')}
                          disabled={index === slides.length - 1}
                          className="h-7 w-7 p-0"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Toggle Active */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleActive(slide)}
                        className="h-8 w-8 p-0"
                      >
                        {slide.isActive ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>

                      {/* Edit */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenDialog(slide)}
                        className="h-8 w-8 p-0"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      {/* Delete */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(slide.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                    <span>Order: {slide.order}</span>
                    <span>•</span>
                    <span>{slide.isActive ? 'Aktif' : 'Nonaktif'}</span>
                    {slide.overlayColor && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          Overlay:
                          <span
                            className="inline-block w-4 h-4 rounded border"
                            style={{ backgroundColor: slide.overlayColor }}
                          />
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {slides.length === 0 && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-gray-500">
                <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Belum ada hero slide</p>
                <p className="text-sm mt-1">Klik tombol "Tambah Slide" untuk membuat slide baru</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog Form */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSlide ? 'Edit Hero Slide' : 'Tambah Hero Slide'}
            </DialogTitle>
            <DialogDescription>
              Isi form di bawah untuk {editingSlide ? 'mengubah' : 'menambah'} hero slide
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Pengadilan Negeri Nanga Bulik"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subjudul</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Melayani Dengan Integritas dan Profesionalisme"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Deskripsi lengkap hero slide..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tag">Tag/Badge</Label>
                <Input
                  id="tag"
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  placeholder="Resmi & Terpercaya"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="overlayColor">Overlay Color</Label>
                <Input
                  id="overlayColor"
                  value={formData.overlayColor}
                  onChange={(e) => setFormData({ ...formData, overlayColor: e.target.value })}
                  placeholder="rgba(139, 0, 0, 0.75)"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL Gambar *</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
                required
              />
              {formData.imageUrl && (
                <div className="mt-2 rounded-lg overflow-hidden border">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '';
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buttonText">Teks Button</Label>
                <Input
                  id="buttonText"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  placeholder="Daftarkan Perkara"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buttonUrl">URL Button</Label>
                <Input
                  id="buttonUrl"
                  value={formData.buttonUrl}
                  onChange={(e) => setFormData({ ...formData, buttonUrl: e.target.value })}
                  placeholder="https://ecourt.mahkamahagung.go.id/"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">Aktifkan slide</Label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                disabled={saving}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-[#8B0000] hover:bg-[#6b0000]"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>Simpan</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
