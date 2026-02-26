'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Loader2, Plus, Pencil, Trash2, Eye, EyeOff, Building2, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';

interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface FormData {
  name: string;
  logoUrl: string;
  websiteUrl: string;
  isActive: boolean;
}

const defaultFormData: FormData = {
  name: '',
  logoUrl: '',
  websiteUrl: '',
  isActive: true,
};

export default function PartnersManagement() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [formData, setFormData] = useState<FormData>(defaultFormData);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      // Fetch all including inactive for management
      const response = await fetch('/api/partners?all=true');
      const data = await response.json();
      const allPartners = data.partners || [];
      setPartners(allPartners.sort((a: Partner, b: Partner) => a.order - b.order));
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast.error('Gagal memuat data mitra');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item?: Partner) => {
    if (item) {
      setEditingPartner(item);
      setFormData({
        name: item.name,
        logoUrl: item.logoUrl || '',
        websiteUrl: item.websiteUrl || '',
        isActive: item.isActive,
      });
    } else {
      setEditingPartner(null);
      setFormData(defaultFormData);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPartner(null);
    setFormData(defaultFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        websiteUrl: formData.websiteUrl || null,
        order: editingPartner ? editingPartner.order : partners.length,
      };

      const response = await fetch('/api/partners', {
        method: editingPartner ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPartner ? { id: editingPartner.id, ...payload } : payload),
      });

      if (response.ok) {
        toast.success(editingPartner ? 'Data mitra berhasil diperbarui' : 'Mitra berhasil ditambahkan');
        handleCloseDialog();
        fetchPartners();
      } else {
        toast.error('Gagal menyimpan data mitra');
      }
    } catch (error) {
      console.error('Error saving partner:', error);
      toast.error('Terjadi kesalahan saat menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus mitra ini?')) return;

    try {
      const response = await fetch(`/api/partners?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Mitra berhasil dihapus');
        fetchPartners();
      } else {
        toast.error('Gagal menghapus mitra');
      }
    } catch (error) {
      console.error('Error deleting partner:', error);
      toast.error('Terjadi kesalahan saat menghapus');
    }
  };

  const handleToggleActive = async (item: Partner) => {
    try {
      const response = await fetch('/api/partners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: item.id, 
          name: item.name,
          logoUrl: item.logoUrl,
          websiteUrl: item.websiteUrl,
          order: item.order,
          isActive: !item.isActive 
        }),
      });

      if (response.ok) {
        toast.success(`Mitra ${!item.isActive ? 'diaktifkan' : 'dinonaktifkan'}`);
        fetchPartners();
      }
    } catch (error) {
      console.error('Error toggling active:', error);
      toast.error('Gagal mengubah status');
    }
  };

  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    const newPartners = [...partners];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newPartners.length) return;

    // Swap
    [newPartners[index], newPartners[targetIndex]] = [newPartners[targetIndex], newPartners[index]];
    
    // Update order values
    newPartners[index].order = index;
    newPartners[targetIndex].order = targetIndex;

    setPartners(newPartners);

    // Save to server
    try {
      await Promise.all([
        fetch('/api/partners', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            id: newPartners[index].id, 
            name: newPartners[index].name,
            logoUrl: newPartners[index].logoUrl,
            websiteUrl: newPartners[index].websiteUrl,
            order: index,
            isActive: newPartners[index].isActive,
          }),
        }),
        fetch('/api/partners', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            id: newPartners[targetIndex].id, 
            name: newPartners[targetIndex].name,
            logoUrl: newPartners[targetIndex].logoUrl,
            websiteUrl: newPartners[targetIndex].websiteUrl,
            order: targetIndex,
            isActive: newPartners[targetIndex].isActive,
          }),
        }),
      ]);
      toast.success('Urutan berhasil diubah');
    } catch (error) {
      console.error('Error reordering:', error);
      toast.error('Gagal mengubah urutan');
      fetchPartners(); // Reload if failed
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
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Lembaga & Institusi Terkait</h2>
          <p className="text-gray-500 mt-1">Kelola data mitra dan lembaga terkait di halaman utama</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-[#8B0000] hover:bg-[#6b0000]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Mitra
        </Button>
      </div>

      <div className="grid gap-4">
        {partners.map((item, index) => (
          <Card key={item.id} className={!item.isActive ? 'opacity-60' : ''}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                {/* Logo */}
                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200 p-2">
                  {item.logoUrl ? (
                    <img
                      src={item.logoUrl}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#8B0000]/10">
                      <Building2 className="h-10 w-10 text-[#8B0000]/50" />
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
                      {item.websiteUrl && (
                        <a
                          href={item.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700 mt-1 truncate"
                        >
                          {item.websiteUrl}
                        </a>
                      )}
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
                          disabled={index === partners.length - 1}
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

        {partners.length === 0 && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-gray-500">
                <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Belum ada data mitra</p>
                <p className="text-sm mt-1">Klik tombol "Tambah Mitra" untuk menambah data</p>
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
              {editingPartner ? 'Edit Mitra' : 'Tambah Mitra'}
            </DialogTitle>
            <DialogDescription>
              Isi form di bawah untuk {editingPartner ? 'mengubah' : 'menambah'} data lembaga/institusi terkait
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lembaga/Institusi *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Mahkamah Agung RI"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logoUrl">URL Logo *</Label>
              <Input
                id="logoUrl"
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                placeholder="https://example.com/logo.png"
                required
              />
              {formData.logoUrl && (
                <div className="mt-2 flex justify-center">
                  <div className="relative w-32 h-32 rounded-lg border-2 border-gray-200 overflow-hidden bg-gray-100 p-2">
                    <img
                      src={formData.logoUrl}
                      alt="Preview"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="websiteUrl">URL Website</Label>
              <Input
                id="websiteUrl"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                placeholder="https://example.com"
                type="url"
              />
              <p className="text-xs text-gray-500">
                Opsional. Ketika diklik, pengguna akan diarahkan ke website ini
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
