'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Loader2, Plus, Pencil, Trash2, Eye, EyeOff, Youtube } from 'lucide-react';
import { toast } from 'sonner';
import { getYoutubeThumbnailUrl } from '@/lib/youtube';

interface YoutubeVideo {
  id: string;
  url: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface FormData {
  url: string;
  isActive: boolean;
}

const defaultFormData: FormData = {
  url: '',
  isActive: true,
};

export default function YoutubeVideosManagement() {
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<YoutubeVideo | null>(null);
  const [formData, setFormData] = useState<FormData>(defaultFormData);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/youtube-videos');
      const data = await response.json();
      setVideos(data.videos || []);
    } catch (error) {
      console.error('Error fetching youtube videos:', error);
      toast.error('Gagal memuat data video YouTube');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (video?: YoutubeVideo) => {
    if (video) {
      setEditingVideo(video);
      setFormData({
        url: video.url,
        isActive: video.isActive,
      });
    } else {
      setEditingVideo(null);
      setFormData(defaultFormData);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingVideo(null);
    setFormData(defaultFormData);
  };

  const handleSave = async () => {
    if (!formData.url.trim()) {
      toast.error('URL YouTube harus diisi');
      return;
    }

    setSaving(true);

    try {
      const method = editingVideo ? 'PUT' : 'POST';
      const body = editingVideo
        ? { id: editingVideo.id, ...formData }
        : { ...formData, order: videos.length };

      const response = await fetch('/api/youtube-videos', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
      });

      if (response.ok) {
        toast.success(editingVideo ? 'Video berhasil diperbarui' : 'Video berhasil ditambahkan');
        fetchVideos();
        handleCloseDialog();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Gagal menyimpan video');
      }
    } catch (error) {
      console.error('Error saving youtube video:', error);
      toast.error('Terjadi kesalahan saat menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus video ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/youtube-videos?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        toast.success('Video berhasil dihapus');
        fetchVideos();
      } else {
        toast.error('Gagal menghapus video');
      }
    } catch (error) {
      console.error('Error deleting youtube video:', error);
      toast.error('Terjadi kesalahan saat menghapus');
    }
  };

  const handleToggleActive = async (video: YoutubeVideo) => {
    try {
      const response = await fetch('/api/youtube-videos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: video.id, isActive: !video.isActive }),
        credentials: 'include',
      });

      if (response.ok) {
        toast.success('Status berhasil diperbarui');
        fetchVideos();
      } else {
        toast.error('Gagal memperbarui status');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Terjadi kesalahan');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#8B0000]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Video YouTube</h3>
          <p className="text-sm text-gray-500 mt-1">Kelola daftar video YouTube untuk landing page</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-[#8B0000] hover:bg-[#700000] text-white w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Video
        </Button>
      </div>

      <div className="grid gap-4">
        {videos.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Belum ada video. Tambahkan video baru untuk memulai.</p>
            </CardContent>
          </Card>
        ) : (
          videos.map((video) => {
            const thumbnail = getYoutubeThumbnailUrl(video.url);
            return (
              <Card key={video.id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row gap-4 p-6">
                  <div className="w-full sm:w-40 aspect-video rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt="Thumbnail YouTube"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://via.placeholder.com/320x180?text=Image+Error';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Youtube className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <p className="font-semibold text-gray-800">Video #{video.order + 1}</p>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{video.url}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Status: {video.isActive ? 'Aktif' : 'Nonaktif'}</span>
                      <span className="text-gray-300">•</span>
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#8B0000] hover:underline"
                      >
                        Buka Video
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleActive(video)}
                      className="h-8 w-8"
                      aria-label={video.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                    >
                      {video.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(video)}
                      className="h-8 w-8"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(video.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                      aria-label="Hapus"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-130">
          <DialogHeader>
            <DialogTitle>{editingVideo ? 'Edit Video YouTube' : 'Tambah Video YouTube'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="youtubeUrl">URL YouTube</Label>
              <Input
                id="youtubeUrl"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <p className="text-xs text-gray-500">
                Mendukung URL watch, share, embed, atau shorts.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="isActive">Status</Label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Batal
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#8B0000] hover:bg-[#700000] text-white"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
