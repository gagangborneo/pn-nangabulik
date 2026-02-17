'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Loader2, Plus, Pencil, Trash2, Eye, EyeOff, HelpCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface FormData {
  question: string;
  answer: string;
  isActive: boolean;
}

const defaultFormData: FormData = {
  question: '',
  answer: '',
  isActive: true,
};

export default function FAQManagement() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState<FormData>(defaultFormData);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await fetch('/api/faq');
      const data = await response.json();
      const allFaqs = data.faqs || [];
      setFaqs(allFaqs.sort((a: FAQ, b: FAQ) => a.order - b.order));
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast.error('Gagal memuat data FAQ');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item?: FAQ) => {
    if (item) {
      setEditingFaq(item);
      setFormData({
        question: item.question,
        answer: item.answer,
        isActive: item.isActive,
      });
    } else {
      setEditingFaq(null);
      setFormData(defaultFormData);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingFaq(null);
    setFormData(defaultFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.question.trim() || !formData.answer.trim()) {
      toast.error('Pertanyaan dan jawaban harus diisi');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...formData,
        order: editingFaq ? editingFaq.order : faqs.length,
      };

      const response = await fetch('/api/faq', {
        method: editingFaq ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingFaq ? { id: editingFaq.id, ...payload } : payload),
      });

      if (response.ok) {
        toast.success(editingFaq ? 'FAQ berhasil diperbarui' : 'FAQ berhasil ditambahkan');
        handleCloseDialog();
        fetchFaqs();
      } else {
        toast.error('Gagal menyimpan FAQ');
      }
    } catch (error) {
      console.error('Error saving FAQ:', error);
      toast.error('Terjadi kesalahan saat menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus FAQ ini?')) return;

    try {
      const response = await fetch(`/api/faq?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('FAQ berhasil dihapus');
        fetchFaqs();
      } else {
        toast.error('Gagal menghapus FAQ');
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      toast.error('Terjadi kesalahan saat menghapus');
    }
  };

  const handleToggleActive = async (item: FAQ) => {
    try {
      const response = await fetch('/api/faq', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, isActive: !item.isActive }),
      });

      if (response.ok) {
        toast.success(`FAQ ${!item.isActive ? 'diaktifkan' : 'dinonaktifkan'}`);
        fetchFaqs();
      }
    } catch (error) {
      console.error('Error toggling active:', error);
      toast.error('Gagal mengubah status');
    }
  };

  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    const newFaqs = [...faqs];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newFaqs.length) return;

    // Swap
    [newFaqs[index], newFaqs[targetIndex]] = [newFaqs[targetIndex], newFaqs[index]];
    
    // Update order values
    newFaqs[index].order = index;
    newFaqs[targetIndex].order = targetIndex;

    setFaqs(newFaqs);

    // Save to server
    try {
      await Promise.all([
        fetch('/api/faq', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: newFaqs[index].id, order: index }),
        }),
        fetch('/api/faq', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: newFaqs[targetIndex].id, order: targetIndex }),
        }),
      ]);
      toast.success('Urutan berhasil diubah');
    } catch (error) {
      console.error('Error reordering:', error);
      toast.error('Gagal mengubah urutan');
      fetchFaqs(); // Reload if failed
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
          <h2 className="text-2xl font-bold text-gray-900">Manajemen FAQ</h2>
          <p className="text-gray-500 mt-1">Kelola pertanyaan yang sering diajukan</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-[#8B0000] hover:bg-[#6b0000]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah FAQ
        </Button>
      </div>

      <div className="grid gap-4">
        {faqs.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Belum ada FAQ yang ditambahkan</p>
              <Button
                onClick={() => handleOpenDialog()}
                className="mt-4 bg-[#8B0000] hover:bg-[#6b0000]"
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah FAQ Pertama
              </Button>
            </CardContent>
          </Card>
        ) : (
          faqs.map((item, index) => (
            <Card key={item.id} className={!item.isActive ? 'opacity-60' : ''}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#8B0000]/10 flex items-center justify-center">
                      <HelpCircle className="h-6 w-6 text-[#8B0000]" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {item.question}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{item.answer}</p>
                        <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                          <span>Order: {item.order}</span>
                          <span>•</span>
                          <span className={item.isActive ? 'text-green-600' : 'text-gray-400'}>
                            {item.isActive ? '✓ Aktif' : '✗ Nonaktif'}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-shrink-0">
                        {/* Reorder buttons */}
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleReorder(index, 'up')}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleReorder(index, 'down')}
                            disabled={index === faqs.length - 1}
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Toggle active */}
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleToggleActive(item)}
                          title={item.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                        >
                          {item.isActive ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </Button>

                        {/* Edit */}
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleOpenDialog(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        {/* Delete */}
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Dialog for Add/Edit */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingFaq ? 'Edit FAQ' : 'Tambah FAQ Baru'}
            </DialogTitle>
            <DialogDescription>
              {editingFaq
                ? 'Perbarui informasi FAQ yang sudah ada'
                : 'Tambahkan pertanyaan yang sering diajukan beserta jawabannya'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              {/* Question */}
              <div className="space-y-2">
                <Label htmlFor="question">
                  Pertanyaan <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="question"
                  placeholder="Contoh: Bagaimana cara mendaftar perkara?"
                  value={formData.question}
                  onChange={(e) =>
                    setFormData({ ...formData, question: e.target.value })
                  }
                  required
                />
              </div>

              {/* Answer */}
              <div className="space-y-2">
                <Label htmlFor="answer">
                  Jawaban <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="answer"
                  placeholder="Masukkan jawaban lengkap untuk pertanyaan ini..."
                  value={formData.answer}
                  onChange={(e) =>
                    setFormData({ ...formData, answer: e.target.value })
                  }
                  rows={6}
                  required
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  Tampilkan di website
                </Label>
              </div>
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
                  'Simpan'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
