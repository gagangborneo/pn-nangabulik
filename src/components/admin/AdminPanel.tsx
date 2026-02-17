'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface MenuItem {
  id: string;
  label: string;
  url: string;
  order: number;
  parentId: string | null;
  openInNewTab: boolean;
  isActive: boolean;
  children?: MenuItem[];
}

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('menus');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    label: '',
    url: '',
    parentId: '',
    openInNewTab: false,
    isActive: true,
  });

  // Load menus when panel opens
  useEffect(() => {
    if (!isOpen) return;

    const loadMenus = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/menus');
        const data = await response.json();
        setMenuItems(data.menuItems || []);
      } catch (error) {
        console.error('Error fetching menus:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMenus();
  }, [isOpen]);

  const handleOpenDialog = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        label: item.label,
        url: item.url,
        parentId: item.parentId || '',
        openInNewTab: item.openInNewTab,
        isActive: item.isActive,
      });
    } else {
      setEditingItem(null);
      setFormData({
        label: '',
        url: '',
        parentId: '',
        openInNewTab: false,
        isActive: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.label || !formData.url) {
      toast.error('Label dan URL harus diisi');
      return;
    }

    try {
      const method = editingItem ? 'PUT' : 'POST';
      const body = editingItem
        ? { ...formData, id: editingItem.id, order: editingItem.order }
        : { ...formData, order: menuItems.length };

      const response = await fetch('/api/menus', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        toast.success(editingItem ? 'Menu berhasil diperbarui' : 'Menu berhasil ditambahkan');
        // Refresh menus
        const refreshResponse = await fetch('/api/menus');
        const refreshData = await refreshResponse.json();
        setMenuItems(refreshData.menuItems || []);
        setIsDialogOpen(false);
      } else {
        toast.error('Gagal menyimpan menu');
      }
    } catch {
      toast.error('Terjadi kesalahan');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus menu ini?')) return;

    try {
      const response = await fetch(`/api/menus?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Menu berhasil dihapus');
        // Refresh menus
        const refreshResponse = await fetch('/api/menus');
        const refreshData = await refreshResponse.json();
        setMenuItems(refreshData.menuItems || []);
      } else {
        toast.error('Gagal menghapus menu');
      }
    } catch {
      toast.error('Terjadi kesalahan');
    }
  };

  const moveItem = async (item: MenuItem, direction: 'up' | 'down') => {
    const items = menuItems.filter(m => m.parentId === item.parentId);
    const currentIndex = items.findIndex(m => m.id === item.id);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= items.length) return;

    const swapItem = items[newIndex];

    try {
      await fetch('/api/menus', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, order: swapItem.order }),
      });
      await fetch('/api/menus', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: swapItem.id, order: item.order }),
      });
      // Refresh menus
      const refreshResponse = await fetch('/api/menus');
      const refreshData = await refreshResponse.json();
      setMenuItems(refreshData.menuItems || []);
    } catch {
      toast.error('Gagal mengubah urutan');
    }
  };

  const renderMenuItem = (item: MenuItem) => (
    <div key={item.id} className="border rounded-lg p-3 bg-white">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-medium">{item.label}</span>
          <span className="text-sm text-gray-500 ml-2">({item.url})</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => moveItem(item, 'up')}
            className="h-8 w-8"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => moveItem(item, 'down')}
            className="h-8 w-8"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleOpenDialog(item)}
            className="h-8 w-8"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(item.id)}
            className="h-8 w-8 text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {item.children && item.children.length > 0 && (
        <div className="ml-6 mt-2 space-y-2">
          {item.children.map((child) => renderMenuItem(child))}
        </div>
      )}
    </div>
  );

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Dashboard Admin</SheetTitle>
          </SheetHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="w-full">
              <TabsTrigger value="menus" className="flex-1">Menu</TabsTrigger>
              <TabsTrigger value="settings" className="flex-1">Pengaturan</TabsTrigger>
            </TabsList>

            <TabsContent value="menus" className="mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Daftar Menu</h3>
                <Button size="sm" onClick={() => handleOpenDialog()}>
                  <Plus className="h-4 w-4 mr-1" />
                  Tambah Menu
                </Button>
              </div>

              {isLoading ? (
                <div className="text-center py-8 text-gray-500">Memuat...</div>
              ) : (
                <>
                  <div className="space-y-2">
                    {menuItems.map((item) => renderMenuItem(item))}
                  </div>

                  {menuItems.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Belum ada menu. Klik "Tambah Menu" untuk menambahkan.
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="settings" className="mt-4">
              <div className="space-y-4">
                <h3 className="font-semibold">Pengaturan Website</h3>
                <p className="text-sm text-gray-500">
                  Halaman pengaturan akan segera tersedia.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Menu' : 'Tambah Menu Baru'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="Contoh: Beranda"
              />
            </div>

            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="Contoh: / atau #tentang"
              />
            </div>

            <div>
              <Label htmlFor="parent">Menu Induk (opsional)</Label>
              <select
                id="parent"
                value={formData.parentId}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                className="w-full border rounded-md p-2"
              >
                <option value="">-- Tidak Ada --</option>
                {menuItems.filter((m) => !m.parentId).map((m) => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="newTab"
                checked={formData.openInNewTab}
                onCheckedChange={(checked) => setFormData({ ...formData, openInNewTab: checked })}
              />
              <Label htmlFor="newTab">Buka di tab baru</Label>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="active"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="active">Aktif</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
