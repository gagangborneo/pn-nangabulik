'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Plus, Pencil, Trash2, ChevronRight, Menu } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MenuItem {
  id: string;
  label: string;
  url: string;
  order: number;
  isActive: boolean;
  openInNewTab: boolean;
  parentId: string | null;
  children?: MenuItem[];
}

export default function MenuManagement() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    label: '',
    url: '',
    openInNewTab: false,
    parentId: '',
  });
  const { toast } = useToast();

  // Get all menus flattened for parent selection
  const flattenMenus = (items: MenuItem[], level = 0): { id: string; label: string; level: number }[] => {
    const result: { id: string; label: string; level: number }[] = [];
    for (const item of items) {
      result.push({ id: item.id, label: item.label, level });
      if (item.children && item.children.length > 0) {
        result.push(...flattenMenus(item.children, level + 1));
      }
    }
    return result;
  };

  const allMenusFlat = flattenMenus(menus);

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/menus?admin=true');
      const data = await response.json();
      if (response.ok) {
        setMenus(data.menus || []);
      } else {
        console.error('Error from API:', data.error);
        toast({
          title: 'Error',
          description: data.error || 'Gagal mengambil data menu',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching menus:', error);
      toast({
        title: 'Error',
        description: 'Gagal mengambil data menu',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedMenus((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleOpenDialog = (menu?: MenuItem, parentId?: string) => {
    if (menu) {
      setEditingMenu(menu);
      setFormData({
        label: menu.label,
        url: menu.url,
        openInNewTab: menu.openInNewTab,
        parentId: menu.parentId || '',
      });
    } else {
      setEditingMenu(null);
      setFormData({
        label: '',
        url: '',
        openInNewTab: false,
        parentId: parentId || '',
      });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.label) {
      toast({
        title: 'Validasi Error',
        description: 'Label harus diisi',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      if (editingMenu) {
        // Update
        const response = await fetch('/api/menus', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingMenu.id,
            label: formData.label,
            url: formData.url || '#',
            order: editingMenu.order,
            isActive: editingMenu.isActive,
            openInNewTab: formData.openInNewTab,
            parentId: formData.parentId || null,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          toast({
            title: 'Berhasil',
            description: 'Menu berhasil diperbarui',
          });
          fetchMenus();
          setDialogOpen(false);
        } else {
          toast({
            title: 'Error',
            description: data.error || 'Gagal memperbarui menu',
            variant: 'destructive',
          });
        }
      } else {
        // Create - get max order for parent
        const siblings = formData.parentId
          ? findMenuById(menus, formData.parentId)?.children || []
          : menus;
        const maxOrder = siblings.length > 0 ? Math.max(...siblings.map(m => m.order)) : -1;

        const response = await fetch('/api/menus', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            label: formData.label,
            url: formData.url || '#',
            openInNewTab: formData.openInNewTab,
            order: maxOrder + 1,
            parentId: formData.parentId || null,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          toast({
            title: 'Berhasil',
            description: 'Menu berhasil ditambahkan',
          });
          fetchMenus();
          setDialogOpen(false);
        } else {
          toast({
            title: 'Error',
            description: data.error || 'Gagal menambahkan menu',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      console.error('Error saving menu:', error);
      toast({
        title: 'Error',
        description: 'Terjadi kesalahan saat menyimpan menu',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const findMenuById = (items: MenuItem[], id: string): MenuItem | null => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findMenuById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus menu ini? Semua submenu juga akan dihapus.')) return;

    try {
      const response = await fetch(`/api/menus?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (response.ok) {
        toast({
          title: 'Berhasil',
          description: 'Menu berhasil dihapus',
        });
        fetchMenus();
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Gagal menghapus menu',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting menu:', error);
      toast({
        title: 'Error',
        description: 'Gagal menghapus menu',
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (menu: MenuItem) => {
    try {
      const response = await fetch('/api/menus', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: menu.id,
          isActive: !menu.isActive,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast({
          title: 'Berhasil',
          description: `Menu berhasil ${!menu.isActive ? 'diaktifkan' : 'dinonaktifkan'}`,
        });
        fetchMenus();
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Gagal mengubah status menu',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error toggling menu:', error);
      toast({
        title: 'Error',
        description: 'Gagal mengubah status menu',
        variant: 'destructive',
      });
    }
  };

  // Render menu item recursively
  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.has(item.id);

    return (
      <div key={item.id} className="select-none">
        <div
          className={`flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 group ${
            !item.isActive ? 'opacity-50' : ''
          }`}
          style={{ paddingLeft: `${level * 24 + 12}px` }}
        >
          {/* Expand/Collapse Button */}
          {hasChildren ? (
            <button
              onClick={() => toggleExpand(item.id)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <ChevronRight
                className={`h-4 w-4 text-gray-400 transition-transform ${
                  isExpanded ? 'rotate-90' : ''
                }`}
              />
            </button>
          ) : (
            <div className="w-6" />
          )}

          {/* Menu Icon */}
          <Menu className="h-4 w-4 text-gray-400 flex-shrink-0" />

          {/* Label */}
          <span className="flex-1 font-medium text-gray-800 truncate">
            {item.label}
          </span>

          {/* URL Preview */}
          <span className="text-xs text-gray-400 max-w-[150px] truncate hidden sm:block">
            {item.url === '#' ? '(parent)' : item.url.replace('https://pn-nangabulik.go.id', '...')}
          </span>

          {/* Status Badge */}
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              item.isActive
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {item.isActive ? 'Aktif' : 'Nonaktif'}
          </span>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => handleOpenDialog(item)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => handleDelete(item.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Toggle Active Switch */}
          <Switch
            checked={item.isActive}
            onCheckedChange={() => handleToggleActive(item)}
            className="scale-75"
          />
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div>
            {item.children!.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}

        {/* Add Child Button */}
        {isExpanded && (
          <button
            onClick={() => handleOpenDialog(undefined, item.id)}
            className="flex items-center gap-2 py-2 px-3 text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-50 w-full"
            style={{ paddingLeft: `${(level + 1) * 24 + 12}px` }}
          >
            <Plus className="h-4 w-4" />
            Tambah Submenu
          </button>
        )}
      </div>
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
          <h3 className="text-lg font-semibold text-gray-800">Daftar Menu</h3>
          <p className="text-sm text-gray-500">
            Kelola menu navigasi website ({allMenusFlat.length} menu)
          </p>
        </div>
        <Button
          className="bg-[#8B0000] hover:bg-[#6b0000]"
          onClick={() => handleOpenDialog()}
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Menu
        </Button>
      </div>

      {/* Menu Tree */}
      <Card>
        <CardContent className="p-2">
          {menus.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Belum ada menu. Klik &quot;Tambah Menu&quot; untuk menambahkan.
            </div>
          ) : (
            <div className="space-y-1">
              {menus.map((menu) => renderMenuItem(menu))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog Add/Edit */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingMenu ? 'Edit Menu' : 'Tambah Menu Baru'}
            </DialogTitle>
            <DialogDescription>
              {editingMenu
                ? 'Ubah detail menu navigasi'
                : 'Tambahkan menu baru ke navigasi website'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="label">Label Menu *</Label>
              <Input
                id="label"
                placeholder="Contoh: Beranda"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                placeholder="Contoh: / atau https://example.com (kosongkan untuk parent)"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
              <p className="text-xs text-gray-400">
                Kosongkan atau gunakan # jika menu memiliki submenu
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent">Parent Menu</Label>
              <Select
                value={formData.parentId}
                onValueChange={(value) => setFormData({ ...formData, parentId: value === 'none' ? '' : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tidak ada (menu utama)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Tidak ada (menu utama)</SelectItem>
                  {allMenusFlat
                    .filter((m) => m.id !== editingMenu?.id) // Can't be parent of itself
                    .map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {'  '.repeat(m.level)}
                        {m.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="newTab"
                checked={formData.openInNewTab}
                onCheckedChange={(checked) => setFormData({ ...formData, openInNewTab: checked })}
              />
              <Label htmlFor="newTab" className="font-normal">
                Buka di tab baru
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Batal
            </Button>
            <Button
              className="bg-[#8B0000] hover:bg-[#6b0000]"
              onClick={handleSave}
              disabled={saving || !formData.label}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
