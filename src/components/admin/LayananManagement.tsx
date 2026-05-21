'use client';

import { useState, useEffect, type ElementType } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  BarChart3,
  BookOpen,
  Calendar,
  ClipboardList,
  Clock,
  Eye,
  EyeOff,
  FileText,
  FolderOpen,
  FolderSync,
  Gavel,
  Globe,
  HelpCircle,
  Home,
  Image as ImageIcon,
  Link2,
  Loader2,
  Mail,
  MessageCircle,
  Pencil,
  Phone,
  Plus,
  Search,
  Settings,
  Trash2,
  TrendingUp,
  User,
  Users,
  Youtube,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';

interface Layanan {
  id: string;
  title: string;
  description: string;
  icon: string;
  url: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface FormData {
  title: string;
  description: string;
  icon: string;
  url: string;
  isActive: boolean;
}

const iconOptions: { value: string; label: string; Icon: ElementType }[] = [
  { value: 'FileText', label: 'File Text', Icon: FileText },
  { value: 'Calendar', label: 'Calendar', Icon: Calendar },
  { value: 'BookOpen', label: 'Book Open', Icon: BookOpen },
  { value: 'ClipboardList', label: 'Clipboard List', Icon: ClipboardList },
  { value: 'AlertCircle', label: 'Alert Circle', Icon: AlertCircle },
  { value: 'Gavel', label: 'Gavel', Icon: Gavel },
  { value: 'FolderSync', label: 'Folder Sync', Icon: FolderSync },
  { value: 'Globe', label: 'Globe', Icon: Globe },
  { value: 'Users', label: 'Users', Icon: Users },
  { value: 'User', label: 'User', Icon: User },
  { value: 'BarChart3', label: 'Bar Chart', Icon: BarChart3 },
  { value: 'FolderOpen', label: 'Folder Open', Icon: FolderOpen },
  { value: 'Settings', label: 'Settings', Icon: Settings },
  { value: 'Home', label: 'Home', Icon: Home },
  { value: 'Mail', label: 'Mail', Icon: Mail },
  { value: 'Phone', label: 'Phone', Icon: Phone },
  { value: 'MessageCircle', label: 'Message Circle', Icon: MessageCircle },
  { value: 'Clock', label: 'Clock', Icon: Clock },
  { value: 'Search', label: 'Search', Icon: Search },
  { value: 'TrendingUp', label: 'Trending Up', Icon: TrendingUp },
  { value: 'Link2', label: 'Link', Icon: Link2 },
  { value: 'Image', label: 'Image', Icon: ImageIcon },
  { value: 'HelpCircle', label: 'Help Circle', Icon: HelpCircle },
  { value: 'Youtube', label: 'YouTube', Icon: Youtube },
  { value: 'Zap', label: 'Zap', Icon: Zap },
];

const iconMap = iconOptions.reduce<Record<string, ElementType>>((acc, option) => {
  acc[option.value] = option.Icon;
  return acc;
}, {});

const defaultFormData: FormData = {
  title: '',
  description: '',
  icon: 'FileText',
  url: '',
  isActive: true,
};

export default function LayananManagement() {
  const [layanan, setLayanan] = useState<Layanan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLayanan, setEditingLayanan] = useState<Layanan | null>(null);
  const [formData, setFormData] = useState<FormData>(defaultFormData);

  useEffect(() => {
    fetchLayanan();
  }, []);

  const fetchLayanan = async () => {
    try {
      const response = await fetch('/api/layanan');
      const data = await response.json();
      const allLayanan = data.layanan || [];
      setLayanan(allLayanan.sort((a: Layanan, b: Layanan) => a.order - b.order));
    } catch (error) {
      console.error('Error fetching layanan:', error);
      toast.error('Gagal memuat data layanan');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item?: Layanan) => {
    if (item) {
      setEditingLayanan(item);
      setFormData({
        title: item.title,
        description: item.description,
        icon: item.icon,
        url: item.url || '',
        isActive: item.isActive,
      });
    } else {
      setEditingLayanan(null);
      setFormData(defaultFormData);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingLayanan(null);
    setFormData(defaultFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim() || !formData.icon.trim()) {
      toast.error('Judul, deskripsi, dan icon harus diisi');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...formData,
        order: editingLayanan ? editingLayanan.order : layanan.length,
      };

      const response = await fetch('/api/layanan', {
        method: editingLayanan ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingLayanan ? { id: editingLayanan.id, ...payload } : payload),
      });

      if (response.ok) {
        toast.success(editingLayanan ? 'Layanan berhasil diperbarui' : 'Layanan berhasil ditambahkan');
        handleCloseDialog();
        fetchLayanan();
      } else {
        toast.error('Gagal menyimpan layanan');
      }
    } catch (error) {
      console.error('Error saving layanan:', error);
      toast.error('Terjadi kesalahan saat menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus layanan ini?')) return;

    try {
      const response = await fetch(`/api/layanan?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Layanan berhasil dihapus');
        fetchLayanan();
      } else {
        toast.error('Gagal menghapus layanan');
      }
    } catch (error) {
      console.error('Error deleting layanan:', error);
      toast.error('Terjadi kesalahan saat menghapus');
    }
  };

  const handleToggleActive = async (item: Layanan) => {
    try {
      const response = await fetch('/api/layanan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, isActive: !item.isActive }),
      });

      if (response.ok) {
        toast.success(`Layanan ${!item.isActive ? 'diaktifkan' : 'dinonaktifkan'}`);
        fetchLayanan();
      }
    } catch (error) {
      console.error('Error toggling active:', error);
      toast.error('Gagal mengubah status');
    }
  };

  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    const newLayanan = [...layanan];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newLayanan.length) return;

    // Swap
    [newLayanan[index], newLayanan[targetIndex]] = [newLayanan[targetIndex], newLayanan[index]];

    // Update order values
    newLayanan[index].order = index;
    newLayanan[targetIndex].order = targetIndex;

    setLayanan(newLayanan);

    // Save to server
    try {
      await Promise.all([
        fetch('/api/layanan', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: newLayanan[index].id, order: index }),
        }),
        fetch('/api/layanan', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: newLayanan[targetIndex].id, order: targetIndex }),
        }),
      ]);
      toast.success('Urutan berhasil diubah');
    } catch (error) {
      console.error('Error reordering:', error);
      toast.error('Gagal mengubah urutan');
      fetchLayanan(); // Reload if failed
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
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Layanan</h2>
          <p className="text-gray-500 mt-1">Kelola layanan publik pengadilan</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-[#8B0000] hover:bg-[#6b0000]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Layanan
        </Button>
      </div>

      <div className="grid gap-4">
        {layanan.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Zap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Belum ada layanan yang ditambahkan</p>
              <Button
                onClick={() => handleOpenDialog()}
                className="mt-4 bg-[#8B0000] hover:bg-[#6b0000]"
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Layanan Pertama
              </Button>
            </CardContent>
          </Card>
        ) : (
          layanan.map((item, index) => {
            const IconComponent = iconMap[item.icon] || Zap;
            const iconLabel =
              iconOptions.find((option) => option.value === item.icon)?.label || item.icon;

            return (
              <Card key={item.id} className={!item.isActive ? 'opacity-60' : ''}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className="shrink-0">
                      <div className="w-12 h-12 rounded-full bg-[#8B0000]/10 flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-[#8B0000]" />
                      </div>
                    </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <span className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                            <IconComponent className="h-3.5 w-3.5 text-gray-600" />
                            <span>{iconLabel}</span>
                          </span>
                          {item.url && (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 underline truncate max-w-xs"
                            >
                              {item.url}
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex shrink-0 gap-2">
                        {/* Visibility Toggle */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleActive(item)}
                          title={item.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                        >
                          {item.isActive ? (
                            <Eye className="h-4 w-4 text-gray-600" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>

                        {/* Edit Button */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenDialog(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        {/* Delete Button */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

                        {/* Reorder Buttons */}
                        <div className="flex border-l pl-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleReorder(index, 'up')}
                            disabled={index === 0}
                            className="px-2"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleReorder(index, 'down')}
                            disabled={index === layanan.length - 1}
                            className="px-2"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingLayanan ? 'Edit Layanan' : 'Tambah Layanan Baru'}</DialogTitle>
            <DialogDescription>
              {editingLayanan ? 'Perbarui informasi layanan' : 'Tambahkan layanan publik pengadilan baru'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Judul Layanan</Label>
              <Input
                id="title"
                placeholder="Contoh: SIPP, E-Court"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                placeholder="Deskripsi singkat tentang layanan"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Icon */}
            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Select
                value={formData.icon}
                onValueChange={(value) => setFormData({ ...formData, icon: value })}
              >
                <SelectTrigger id="icon" className="w-full">
                  {(() => {
                    const selected = iconOptions.find((option) => option.value === formData.icon);
                    if (!selected) {
                      return <SelectValue placeholder="Pilih icon" />;
                    }
                    const SelectedIcon = selected.Icon;
                    return (
                      <span className="flex items-center gap-2">
                        <SelectedIcon className="h-4 w-4 text-gray-600" />
                        {selected.label}
                      </span>
                    );
                  })()}
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((option) => {
                    const OptionIcon = option.Icon;
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <span className="flex items-center gap-2">
                          <OptionIcon className="h-4 w-4 text-gray-600" />
                          {option.label}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* URL */}
            <div className="space-y-2">
              <Label htmlFor="url">URL Layanan (Opsional)</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <Label htmlFor="active" className="text-sm">
                Aktif
              </Label>
              <Switch
                id="active"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-[#8B0000] hover:bg-[#6b0000]"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    {editingLayanan ? 'Perbarui' : 'Tambah'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
