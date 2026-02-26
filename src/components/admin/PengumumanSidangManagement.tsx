'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Loader2, Plus, Pencil, Trash2, Eye, EyeOff, MoveUp, MoveDown } from 'lucide-react';
import { toast } from 'sonner';

interface PengumumanSidang {
  id: string;
  title: string;
  url: string;
  description: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface FormData {
  title: string;
  url: string;
  description: string;
  isActive: boolean;
}

const defaultFormData: FormData = {
  title: '',
  url: '',
  description: '',
  isActive: true,
};

export default function PengumumanSidangManagement() {
  const [items, setItems] = useState<PengumumanSidang[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PengumumanSidang | null>(null);
  const [formData, setFormData] = useState<FormData>(defaultFormData);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/pengumuman-sidang?limit=1000');
      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      console.error('Error fetching pengumuman sidang:', error);
      toast.error('Gagal memuat data pengumuman sidang');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item?: PengumumanSidang) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        url: item.url,
        description: item.description || '',
        isActive: item.isActive,
      });
    } else {
      setEditingItem(null);
      setFormData(defaultFormData);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingItem(null);
    setFormData(defaultFormData);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Judul harus diisi');
      return;
    }

    if (!formData.url.trim()) {
      toast.error('URL harus diisi');
      return;
    }

    setSaving(true);

    try {
      const url = '/api/pengumuman-sidang';
      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(editingItem && { id: editingItem.id }),
          ...formData,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save');
      }

      toast.success(editingItem ? 'Data berhasil diperbarui' : 'Data berhasil dibuat');
      handleCloseDialog();
      await fetchItems();
    } catch (error: any) {
      console.error('Error saving:', error);
      toast.error(error.message || 'Gagal menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus item ini?')) return;

    try {
      const response = await fetch(`/api/pengumuman-sidang?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete');
      }

      toast.success('Data berhasil dihapus');
      await fetchItems();
    } catch (error: any) {
      console.error('Error deleting:', error);
      toast.error('Gagal menghapus data');
    }
  };

  const handleToggleActive = async (item: PengumumanSidang) => {
    try {
      const response = await fetch('/api/pengumuman-sidang', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          isActive: !item.isActive,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update');
      }

      await fetchItems();
    } catch (error: any) {
      console.error('Error toggling active:', error);
      toast.error('Gagal mengubah status');
    }
  };

  const handleReorder = async (draggedId: string, targetId: string) => {
    const draggedItem = items.find((i) => i.id === draggedId);
    const targetItem = items.find((i) => i.id === targetId);

    if (!draggedItem || !targetItem) return;

    const newItems = items.filter((i) => i.id !== draggedId);
    const targetIndex = newItems.findIndex((i) => i.id === targetId);
    newItems.splice(targetIndex, 0, draggedItem);

    setItems(newItems);

    try {
      const updates = newItems.map((item, index) => ({
        id: item.id,
        order: index,
      }));

      await Promise.all(
        updates.map((update) =>
          fetch('/api/pengumuman-sidang', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(update),
          })
        )
      );

      toast.success('Urutan berhasil diperbarui');
      await fetchItems();
    } catch (error: any) {
      console.error('Error reordering:', error);
      toast.error('Gagal mengubah urutan');
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;

    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];

    setItems(newItems);

    try {
      const updates = newItems.map((item, idx) => ({
        id: item.id,
        order: idx,
      }));

      await Promise.all(
        updates.map((update) =>
          fetch('/api/pengumuman-sidang', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(update),
          })
        )
      );

      toast.success('Item berhasil dipindahkan ke atas');
      await fetchItems();
    } catch (error: any) {
      console.error('Error moving up:', error);
      toast.error('Gagal memindahkan item');
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === items.length - 1) return;

    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];

    setItems(newItems);

    try {
      const updates = newItems.map((item, idx) => ({
        id: item.id,
        order: idx,
      }));

      await Promise.all(
        updates.map((update) =>
          fetch('/api/pengumuman-sidang', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(update),
          })
        )
      );

      toast.success('Item berhasil dipindahkan ke bawah');
      await fetchItems();
    } catch (error: any) {
      console.error('Error moving down:', error);
      toast.error('Gagal memindahkan item');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Pengumuman & Pemanggilan Sidang</h2>
        <Button onClick={() => handleOpenDialog()} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Tambah
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {items.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Belum ada data</p>
          ) : (
            <div className="space-y-2">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition"
                  draggable
                  onDragStart={(e) => e.dataTransfer?.setData('text/plain', item.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const draggedId = e.dataTransfer?.getData('text/plain');
                    if (draggedId) handleReorder(draggedId, item.id);
                  }}
                >
                  <span className="text-gray-400 text-sm min-w-[20px]">{index + 1}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-600 truncate">{item.url}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    title="Pindahkan ke atas"
                  >
                    <MoveUp className="h-4 w-4 text-gray-600 disabled:opacity-40" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === items.length - 1}
                    title="Pindahkan ke bawah"
                  >
                    <MoveDown className="h-4 w-4 text-gray-600 disabled:opacity-40" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleToggleActive(item)}
                  >
                    {item.isActive ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleOpenDialog(item)}
                  >
                    <Pencil className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Pengumuman Sidang' : 'Tambah Pengumuman Sidang'}
            </DialogTitle>
            <DialogDescription>
              Isi formulir di bawah untuk {editingItem ? 'memperbarui' : 'membuat'} pengumuman sidang
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                Judul
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Masukkan judul pengumuman"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="url" className="text-sm font-medium text-gray-700">
                URL / Link
              </Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com/pengumuman.pdf"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Deskripsi (Opsional)
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Masukkan deskripsi pengumuman"
                rows={3}
                className="mt-1"
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
                Aktif
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Batal
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingItem ? 'Perbarui' : 'Buat'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
