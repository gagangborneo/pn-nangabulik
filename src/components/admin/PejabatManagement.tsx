'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Loader2, Plus, Pencil, Trash2, Eye, EyeOff, User, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';

interface Pejabat {
  id: string;
  name: string;
  title: string;
  imageUrl: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface FormData {
  name: string;
  title: string;
  imageUrl: string;
  isActive: boolean;
}

const defaultFormData: FormData = {
  name: '',
  title: '',
  imageUrl: '',
  isActive: true,
};

export default function PejabatManagement() {
  const [pejabat, setPejabat] = useState<Pejabat[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPejabat, setEditingPejabat] = useState<Pejabat | null>(null);
  const [formData, setFormData] = useState<FormData>(defaultFormData);

  useEffect(() => {
    fetchPejabat();
  }, []);

  const fetchPejabat = async () => {
    try {
      const response = await fetch('/api/pejabat');
      const data = await response.json();
      // Sort by order to show all, including inactive
      const allPejabat = data.pejabat || [];
      // Fetch all including inactive for management
      const allResponse = await fetch('/api/pejabat');
      setPejabat(allPejabat.sort((a: Pejabat, b: Pejabat) => a.order - b.order));
    } catch (error) {
      console.error('Error fetching pejabat:', error);
      toast.error('Gagal memuat data pejabat');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item?: Pejabat) => {
    if (item) {
      setEditingPejabat(item);
      setFormData({
        name: item.name,
        title: item.title,
        imageUrl: item.imageUrl || '',
        isActive: item.isActive,
      });
    } else {
      setEditingPejabat(null);
      setFormData(defaultFormData);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPejabat(null);
    setFormData(defaultFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        imageUrl: formData.imageUrl || null,
        order: editingPejabat ? editingPejabat.order : pejabat.length,
      };

      const response = await fetch('/api/pejabat', {
        method: editingPejabat ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPejabat ? { id: editingPejabat.id, ...payload } : payload),
      });

      if (response.ok) {
        toast.success(editingPejabat ? 'Data pejabat berhasil diperbarui' : 'Pejabat berhasil ditambahkan');
        handleCloseDialog();
        fetchPejabat();
      } else {
        toast.error('Gagal menyimpan data pejabat');
      }
    } catch (error) {
      console.error('Error saving pejabat:', error);
      toast.error('Terjadi kesalahan saat menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pejabat ini?')) return;

    try {
      const response = await fetch(`/api/pejabat?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Pejabat berhasil dihapus');
        fetchPejabat();
      } else {
        toast.error('Gagal menghapus pejabat');
      }
    } catch (error) {
      console.error('Error deleting pejabat:', error);
      toast.error('Terjadi kesalahan saat menghapus');
    }
  };

  const handleToggleActive = async (item: Pejabat) => {
    try {
      const response = await fetch('/api/pejabat', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, isActive: !item.isActive }),
      });

      if (response.ok) {
        toast.success(`Pejabat ${!item.isActive ? 'diaktifkan' : 'dinonaktifkan'}`);
        fetchPejabat();
      }
    } catch (error) {
      console.error('Error toggling active:', error);
      toast.error('Gagal mengubah status');
    }
  };

  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    const newPejabat = [...pejabat];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newPejabat.length) return;

    // Swap
    [newPejabat[index], newPejabat[targetIndex]] = [newPejabat[targetIndex], newPejabat[index]];
    
    // Update order values
    newPejabat[index].order = index;
    newPejabat[targetIndex].order = targetIndex;

    setPejabat(newPejabat);

    // Save to server
    try {
      await Promise.all([
        fetch('/api/pejabat', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: newPejabat[index].id, order: index }),
        }),
        fetch('/api/pejabat', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: newPejabat[targetIndex].id, order: targetIndex }),
        }),
      ]);
      toast.success('Urutan berhasil diubah');
    } catch (error) {
      console.error('Error reordering:', error);
      toast.error('Gagal mengubah urutan');
      fetchPejabat(); // Reload if failed
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
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Profil Pejabat</h2>
          <p className="text-gray-500 mt-1">Kelola data pejabat Pengadilan Negeri Nanga Bulik</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-[#8B0000] hover:bg-[#6b0000]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Pejabat
        </Button>
      </div>

      <div className="grid gap-4">
        {pejabat.map((item, index) => (
          <Card key={item.id} className={!item.isActive ? 'opacity-60' : ''}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                {/* Photo */}
                <div className="relative w-24 h-24 flex-shrink-0 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#8B0000]/10">
                      <User className="h-10 w-10 text-[#8B0000]/50" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{item.title}</p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                        <span>Order: {item.order}</span>
                        <span>•</span>
                        <span>{item.isActive ? 'Aktif' : 'Nonaktif'}</span>
                      </div>
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
                          disabled={index === pejabat.length - 1}
                          className="h-7 w-7 p-0"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Toggle Active */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleActive(item)}
                        className="h-8 w-8 p-0"
                      >
                        {item.isActive ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>

                      {/* Edit */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenDialog(item)}
                        className="h-8 w-8 p-0"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      {/* Delete */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(item.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {pejabat.length === 0 && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-gray-500">
                <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Belum ada data pejabat</p>
                <p className="text-sm mt-1">Klik tombol "Tambah Pejabat" untuk menambah data</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog Form */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingPejabat ? 'Edit Pejabat' : 'Tambah Pejabat'}
            </DialogTitle>
            <DialogDescription>
              Isi form di bawah untuk {editingPejabat ? 'mengubah' : 'menambah'} data pejabat
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Dr. John Doe, S.H., M.H."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Jabatan *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ketua Pengadilan Negeri Nanga Bulik"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL Foto</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/photo.jpg"
              />
              {formData.imageUrl && (
                <div className="mt-2 flex justify-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-500">
                Kosongkan jika tidak memiliki foto. Akan ditampilkan icon default.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">Tampilkan di website</Label>
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
