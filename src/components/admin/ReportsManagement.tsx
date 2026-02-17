'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  FolderOpen,
  FileText,
  Eye,
  ChevronRight,
  ArrowLeft,
  BarChart3,
  Users
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReportCategory {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  icon: string;
  order: number;
  isActive: boolean;
  _count?: {
    links: number;
    views: number;
  };
}

interface ReportLink {
  id: string;
  categoryId: string;
  title: string;
  url: string;
  description: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  category?: {
    id: string;
    title: string;
    slug: string;
  };
  _count?: {
    views: number;
  };
}

const iconOptions = [
  { value: 'FileText', label: 'Dokumen' },
  { value: 'TrendingUp', label: 'Grafik Naik' },
  { value: 'Calendar', label: 'Kalender' },
  { value: 'Users', label: 'Pengguna' },
  { value: 'BookOpen', label: 'Buku' },
  { value: 'BarChart3', label: 'Bar Chart' },
  { value: 'PieChart', label: 'Pie Chart' },
  { value: 'FolderOpen', label: 'Folder' },
];

export default function ReportsManagement() {
  const [categories, setCategories] = useState<ReportCategory[]>([]);
  const [links, setLinks] = useState<ReportLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('categories');
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory | null>(null);

  // Category dialog
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ReportCategory | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    title: '',
    slug: '',
    description: '',
    icon: 'FileText',
  });

  // Link dialog
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<ReportLink | null>(null);
  const [linkForm, setLinkForm] = useState({
    title: '',
    url: '',
    description: '',
    categoryId: '',
  });

  const { toast } = useToast();

  // Fetch data
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/reports/categories?admin=true');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchLinks = async (categoryId?: string) => {
    try {
      const url = categoryId
        ? `/api/reports/links?categoryId=${categoryId}&admin=true`
        : '/api/reports/links?admin=true';
      const response = await fetch(url);
      const data = await response.json();
      setLinks(data.links || []);
    } catch (error) {
      console.error('Error fetching links:', error);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchCategories();
      await fetchLinks();
      setLoading(false);
    };
    init();
  }, []);

  // Category handlers
  const handleOpenCategoryDialog = (category?: ReportCategory) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        title: category.title,
        slug: category.slug,
        description: category.description || '',
        icon: category.icon,
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({ title: '', slug: '', description: '', icon: 'FileText' });
    }
    setCategoryDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!categoryForm.title || !categoryForm.slug) {
      toast({ title: 'Error', description: 'Title dan slug harus diisi', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const url = '/api/reports/categories';
      const method = editingCategory ? 'PUT' : 'POST';
      const body = editingCategory
        ? { ...categoryForm, id: editingCategory.id }
        : { ...categoryForm, order: categories.length };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (response.ok) {
        toast({ title: 'Berhasil', description: editingCategory ? 'Kategori diperbarui' : 'Kategori ditambahkan' });
        fetchCategories();
        setCategoryDialogOpen(false);
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Terjadi kesalahan', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Yakin ingin menghapus kategori ini? Semua link di dalamnya juga akan dihapus.')) return;

    try {
      const response = await fetch(`/api/reports/categories?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast({ title: 'Berhasil', description: 'Kategori dihapus' });
        fetchCategories();
        fetchLinks();
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal menghapus', variant: 'destructive' });
    }
  };

  const handleToggleCategoryActive = async (category: ReportCategory) => {
    try {
      await fetch('/api/reports/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: category.id, isActive: !category.isActive }),
      });
      fetchCategories();
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal mengubah status', variant: 'destructive' });
    }
  };

  // Link handlers
  const handleOpenLinkDialog = (link?: ReportLink, categoryId?: string) => {
    if (link) {
      setEditingLink(link);
      setLinkForm({
        title: link.title,
        url: link.url,
        description: link.description || '',
        categoryId: link.categoryId,
      });
    } else {
      setEditingLink(null);
      setLinkForm({
        title: '',
        url: '',
        description: '',
        categoryId: categoryId || selectedCategory?.id || '',
      });
    }
    setLinkDialogOpen(true);
  };

  const handleSaveLink = async () => {
    if (!linkForm.title || !linkForm.url || !linkForm.categoryId) {
      toast({ title: 'Error', description: 'Semua field harus diisi', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const url = '/api/reports/links';
      const method = editingLink ? 'PUT' : 'POST';
      const body = editingLink
        ? { ...linkForm, id: editingLink.id }
        : { ...linkForm, order: links.filter(l => l.categoryId === linkForm.categoryId).length };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (response.ok) {
        toast({ title: 'Berhasil', description: editingLink ? 'Link diperbarui' : 'Link ditambahkan' });
        fetchLinks(selectedCategory?.id);
        setLinkDialogOpen(false);
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Terjadi kesalahan', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!confirm('Yakin ingin menghapus link ini?')) return;

    try {
      const response = await fetch(`/api/reports/links?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast({ title: 'Berhasil', description: 'Link dihapus' });
        fetchLinks(selectedCategory?.id);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal menghapus', variant: 'destructive' });
    }
  };

  const handleToggleLinkActive = async (link: ReportLink) => {
    try {
      await fetch('/api/reports/links', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: link.id, isActive: !link.isActive }),
      });
      fetchLinks(selectedCategory?.id);
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal mengubah status', variant: 'destructive' });
    }
  };

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // View category links
  const handleViewCategoryLinks = (category: ReportCategory) => {
    setSelectedCategory(category);
    fetchLinks(category.id);
    setActiveTab('links');
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
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <FolderOpen className="h-8 w-8 text-teal-600" />
              <div>
                <p className="text-2xl font-bold">{categories.length}</p>
                <p className="text-sm text-gray-500">Kategori</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{links.length}</p>
                <p className="text-sm text-gray-500">Total Link</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Eye className="h-8 w-8 text-amber-600" />
              <div>
                <p className="text-2xl font-bold">
                  {categories.reduce((sum, c) => sum + (c._count?.views || 0), 0)}
                </p>
                <p className="text-sm text-gray-500">Total Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{categories.filter(c => c.isActive).length}</p>
                <p className="text-sm text-gray-500">Kategori Aktif</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="categories">Kategori</TabsTrigger>
            <TabsTrigger value="links">Link Dokumen</TabsTrigger>
          </TabsList>
          {activeTab === 'categories' ? (
            <Button className="bg-[#8B0000] hover:bg-[#6b0000]" onClick={() => handleOpenCategoryDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Kategori
            </Button>
          ) : (
            <Button className="bg-[#8B0000] hover:bg-[#6b0000]" onClick={() => handleOpenLinkDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Link
            </Button>
          )}
        </div>

        <TabsContent value="categories">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {categories.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Belum ada kategori. Klik &quot;Tambah Kategori&quot; untuk menambahkan.
                  </div>
                ) : (
                  categories.map((category) => (
                    <div
                      key={category.id}
                      className={`flex items-center justify-between p-4 hover:bg-gray-50 ${
                        !category.isActive ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-teal-50 rounded-lg">
                          <FileText className="h-5 w-5 text-teal-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">{category.title}</h3>
                          <p className="text-sm text-gray-500">
                            /{category.slug} • {category._count?.links || 0} link • {category._count?.views || 0} views
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewCategoryLinks(category)}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Switch
                          checked={category.isActive}
                          onCheckedChange={() => handleToggleCategoryActive(category)}
                        />
                        <Button variant="ghost" size="sm" onClick={() => handleOpenCategoryDialog(category)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links">
          {selectedCategory && (
            <div className="mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedCategory(null);
                  fetchLinks();
                  setActiveTab('categories');
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Kategori
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                Menampilkan link untuk: <strong>{selectedCategory.title}</strong>
              </p>
            </div>
          )}
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {links.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Belum ada link. Klik &quot;Tambah Link&quot; untuk menambahkan.
                  </div>
                ) : (
                  links.map((link) => (
                    <div
                      key={link.id}
                      className={`flex items-center justify-between p-4 hover:bg-gray-50 ${
                        !link.isActive ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-red-50 rounded-lg">
                          <FileText className="h-5 w-5 text-red-800" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">{link.title}</h3>
                          <p className="text-sm text-gray-500 truncate max-w-md">
                            {link.url} • {link._count?.views || 0} klik
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={link.isActive}
                          onCheckedChange={() => handleToggleLinkActive(link)}
                        />
                        <Button variant="ghost" size="sm" onClick={() => handleOpenLinkDialog(link)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                          onClick={() => handleDeleteLink(link.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Category Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}</DialogTitle>
            <DialogDescription>
              {editingCategory ? 'Ubah detail kategori' : 'Tambahkan kategori baru untuk data laporan'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={categoryForm.title}
                onChange={(e) => {
                  setCategoryForm({
                    ...categoryForm,
                    title: e.target.value,
                    slug: editingCategory ? categoryForm.slug : generateSlug(e.target.value),
                  });
                }}
                placeholder="Contoh: DIPA"
              />
            </div>

            <div className="space-y-2">
              <Label>Slug *</Label>
              <Input
                value={categoryForm.slug}
                onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                placeholder="Contoh: dipa"
              />
              <p className="text-xs text-gray-400">URL akan menjadi /data-laporan/{categoryForm.slug}</p>
            </div>

            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Input
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                placeholder="Deskripsi singkat kategori"
              />
            </div>

            <div className="space-y-2">
              <Label>Icon</Label>
              <Select
                value={categoryForm.icon}
                onValueChange={(value) => setCategoryForm({ ...categoryForm, icon: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((icon) => (
                    <SelectItem key={icon.value} value={icon.value}>
                      {icon.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>
              Batal
            </Button>
            <Button
              className="bg-[#8B0000] hover:bg-[#6b0000]"
              onClick={handleSaveCategory}
              disabled={saving}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingLink ? 'Edit Link' : 'Tambah Link'}</DialogTitle>
            <DialogDescription>
              {editingLink ? 'Ubah detail link' : 'Tambahkan link dokumen baru'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Kategori *</Label>
              <Select
                value={linkForm.categoryId}
                onValueChange={(value) => setLinkForm({ ...linkForm, categoryId: value })}
                disabled={!!selectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Judul *</Label>
              <Input
                value={linkForm.title}
                onChange={(e) => setLinkForm({ ...linkForm, title: e.target.value })}
                placeholder="Contoh: DIPA Tahun 2025"
              />
            </div>

            <div className="space-y-2">
              <Label>URL *</Label>
              <Input
                value={linkForm.url}
                onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                placeholder="Contoh: https://example.com/dipa-2025.pdf"
              />
            </div>

            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Input
                value={linkForm.description}
                onChange={(e) => setLinkForm({ ...linkForm, description: e.target.value })}
                placeholder="Deskripsi singkat (opsional)"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
              Batal
            </Button>
            <Button
              className="bg-[#8B0000] hover:bg-[#6b0000]"
              onClick={handleSaveLink}
              disabled={saving}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
