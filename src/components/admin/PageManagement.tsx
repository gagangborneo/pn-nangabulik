'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Pencil, Trash2, Plus, CheckCircle2, XCircle, Search, ChevronLeft, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react';

interface Page {
  id: string;
  url: string;
  title: string;
  seoTitle: string | null;
  seoDescription: string | null;
  wordpressSlug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PageFormData {
  url: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  wordpressSlug: string;
  isActive: boolean;
}

export default function PageManagement() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [deletingPageId, setDeletingPageId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PageFormData>({
    url: '',
    title: '',
    seoTitle: '',
    seoDescription: '',
    wordpressSlug: '',
    isActive: true,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [urlError, setUrlError] = useState('');
  const [checkingUrl, setCheckingUrl] = useState(false);
  
  // Search, Filter, and Pagination states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Sorting state
  const [sortColumn, setSortColumn] = useState<'url' | null>('url');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/pages');
      if (response.ok) {
        const data = await response.json();
        setPages(data);
        setCurrentPage(1); // Reset to first page when data changes
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
      setError('Gagal mengambil data halaman');
    } finally {
      setLoading(false);
    }
  };

  // Filter and paginate data
  const filteredPages = useMemo(() => {
    let result = pages;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((page) =>
        page.title.toLowerCase().includes(searchLower) ||
        page.url.toLowerCase().includes(searchLower) ||
        page.wordpressSlug.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (statusFilter === 'active') {
      result = result.filter((page) => page.isActive);
    } else if (statusFilter === 'inactive') {
      result = result.filter((page) => !page.isActive);
    }

    // Apply sorting
    if (sortColumn === 'url') {
      result.sort((a, b) => {
        const aValue = a.url.toLowerCase();
        const bValue = b.url.toLowerCase();
        
        if (sortOrder === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      });
    }

    return result;
  }, [pages, searchTerm, statusFilter, sortColumn, sortOrder]);

  const handleSortUrl = () => {
    if (sortColumn === 'url') {
      // Toggle sort order if already sorting by url
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set to sort by url with asc order
      setSortColumn('url');
      setSortOrder('asc');
    }
    setCurrentPage(1); // Reset pagination on sort
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredPages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPages = filteredPages.slice(startIndex, endIndex);

  // Reset to first page if current page is out of range
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const checkUrlAvailability = async (url: string) => {
    if (!url || url === editingPage?.url) {
      setUrlError('');
      return;
    }

    if (!url.startsWith('/')) {
      setUrlError('URL harus dimulai dengan /');
      return;
    }

    try {
      setCheckingUrl(true);
      const response = await fetch(`/api/pages?url=${encodeURIComponent(url)}&checkOnly=true`);
      if (response.ok) {
        const data = await response.json();
        if (data.exists) {
          setUrlError('URL sudah digunakan');
        } else {
          setUrlError('');
        }
      }
    } catch (error) {
      console.error('Error checking URL:', error);
    } finally {
      setCheckingUrl(false);
    }
  };

  const handleUrlChange = (url: string) => {
    setFormData({ ...formData, url });
    // Debounce check URL
    const timer = setTimeout(() => {
      checkUrlAvailability(url);
    }, 500);
    return () => clearTimeout(timer);
  };

  const openDialog = (page?: Page) => {
    if (page) {
      setEditingPage(page);
      setFormData({
        url: page.url,
        title: page.title,
        seoTitle: page.seoTitle || '',
        seoDescription: page.seoDescription || '',
        wordpressSlug: page.wordpressSlug,
        isActive: page.isActive,
      });
    } else {
      setEditingPage(null);
      setFormData({
        url: '',
        title: '',
        seoTitle: '',
        seoDescription: '',
        wordpressSlug: '',
        isActive: true,
      });
    }
    setUrlError('');
    setError('');
    setSuccess('');
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingPage(null);
    setUrlError('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (urlError) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      const url = editingPage
        ? `/api/pages/${editingPage.id}`
        : '/api/pages';
      
      const method = editingPage ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(
          editingPage
            ? 'Halaman berhasil diperbarui'
            : 'Halaman berhasil ditambahkan'
        );
        fetchPages();
        setTimeout(() => {
          closeDialog();
        }, 1500);
      } else {
        setError(data.error || 'Terjadi kesalahan');
      }
    } catch (error) {
      console.error('Error saving page:', error);
      setError('Terjadi kesalahan saat menyimpan halaman');
    }
  };

  const handleDelete = async () => {
    if (!deletingPageId) return;

    try {
      const response = await fetch(`/api/pages/${deletingPageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Halaman berhasil dihapus');
        fetchPages();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Gagal menghapus halaman');
      }
    } catch (error) {
      console.error('Error deleting page:', error);
      setError('Terjadi kesalahan saat menghapus halaman');
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingPageId(null);
    }
  };

  const openDeleteDialog = (id: string) => {
    setDeletingPageId(id);
    setIsDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Manajemen Halaman</h2>
          <p className="text-gray-500 mt-1">
            Kelola halaman website dengan dynamic route
          </p>
        </div>
        <Button onClick={() => openDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Halaman
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Search and Filter Section */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari berdasarkan judul, URL, atau WordPress slug..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset pagination on search
              }}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as 'all' | 'active' | 'inactive');
                setCurrentPage(1); // Reset pagination on filter
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          Menampilkan {filteredPages.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, filteredPages.length)} dari {filteredPages.length} halaman
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer select-none hover:bg-gray-100 transition-colors"
                onClick={handleSortUrl}
              >
                <div className="flex items-center gap-2">
                  URL
                  {sortColumn === 'url' && (
                    sortOrder === 'asc' ? (
                      <ArrowUp className="h-4 w-4 text-blue-600" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-blue-600" />
                    )
                  )}
                </div>
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>WordPress Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                  {filteredPages.length === 0 && searchTerm
                    ? 'Tidak ada hasil pencarian'
                    : 'Belum ada halaman'}
                </TableCell>
              </TableRow>
            ) : (
              paginatedPages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-mono text-sm">
                    {page.url}
                  </TableCell>
                  <TableCell>{page.title}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {page.wordpressSlug}
                  </TableCell>
                  <TableCell>
                    {page.isActive ? (
                      <span className="inline-flex items-center text-green-600">
                        <CheckCircle2 className="mr-1 h-4 w-4" />
                        Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-gray-400">
                        <XCircle className="mr-1 h-4 w-4" />
                        Nonaktif
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDialog(page)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(page.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {filteredPages.length > itemsPerPage && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Halaman {currentPage} dari {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Selanjutnya
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingPage ? 'Edit Halaman' : 'Tambah Halaman'}
              </DialogTitle>
              <DialogDescription>
                Halaman akan dirender dari konten WordPress berdasarkan slug
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50 text-green-800">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="url">
                  URL <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="/tentang/hakim/a"
                  required
                />
                {checkingUrl && (
                  <p className="text-sm text-gray-500">Memeriksa ketersediaan URL...</p>
                )}
                {urlError && (
                  <p className="text-sm text-red-500">{urlError}</p>
                )}
                {!urlError && !checkingUrl && formData.url && formData.url !== editingPage?.url && (
                  <p className="text-sm text-green-600">✓ URL tersedia</p>
                )}
                <p className="text-sm text-gray-500">
                  Contoh: /tentang/hakim, /layanan/informasi, dll
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Profil Hakim"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wordpressSlug">
                  WordPress Slug <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="wordpressSlug"
                  value={formData.wordpressSlug}
                  onChange={(e) =>
                    setFormData({ ...formData, wordpressSlug: e.target.value })
                  }
                  placeholder="profil-hakim"
                  required
                />
                <p className="text-sm text-gray-500">
                  Slug post di WordPress yang akan dirender
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={formData.seoTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, seoTitle: e.target.value })
                  }
                  placeholder="Profil Hakim - PN Nangabulik"
                />
                <p className="text-sm text-gray-500">
                  Opsional, jika kosong akan menggunakan title
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  value={formData.seoDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, seoDescription: e.target.value })
                  }
                  placeholder="Deskripsi halaman untuk SEO"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
                <Label htmlFor="isActive">Aktifkan halaman</Label>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
              >
                Batal
              </Button>
              <Button type="submit" disabled={!!urlError || checkingUrl}>
                {editingPage ? 'Simpan Perubahan' : 'Tambah Halaman'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Halaman</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus halaman ini? Tindakan ini tidak
              dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
