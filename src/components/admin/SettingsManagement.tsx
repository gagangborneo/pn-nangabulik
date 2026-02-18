'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SettingsManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [settings, setSettings] = useState({
    wordpress_url: '',
    site_name: '',
    site_description: '',
    logo_url: '',
    favicon_url: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      
      if (data.settings) {
        setSettings({
          wordpress_url: data.settings.wordpress_url || 'https://web.pn-nangabulik.go.id/wp-json/wp/v2',
          site_name: data.settings.site_name || '',
          site_description: data.settings.site_description || '',
          logo_url: data.settings.logo_url || '',
          favicon_url: data.settings.favicon_url || '',
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const settingsArray = Object.entries(settings).map(([key, value]) => ({
        key,
        value: value.toString(),
      }));

      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsArray),
      });

      if (!response.ok) throw new Error('Failed to save settings');

      setMessage({ type: 'success', text: 'Pengaturan berhasil disimpan!' });
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Gagal menyimpan pengaturan.' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <Alert className={`${message.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* WordPress Integration */}
        <Card>
          <CardHeader>
            <CardTitle>Integrasi WordPress</CardTitle>
            <CardDescription>
              Konfigurasi koneksi ke WordPress untuk mengambil konten berita
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wordpress_url">WordPress API URL</Label>
              <Input
                id="wordpress_url"
                type="url"
                value={settings.wordpress_url}
                onChange={(e) => handleChange('wordpress_url', e.target.value)}
                placeholder="https://contoh.com/wp-json/wp/v2"
                required
              />
              <p className="text-sm text-gray-500">
                URL API WordPress (harus diakhiri dengan /wp-json/wp/v2)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Site Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Website</CardTitle>
            <CardDescription>
              Pengaturan dasar informasi website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site_name">Nama Website</Label>
              <Input
                id="site_name"
                value={settings.site_name}
                onChange={(e) => handleChange('site_name', e.target.value)}
                placeholder="Pengadilan Negeri Nanga Bulik"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site_description">Deskripsi Website</Label>
              <Input
                id="site_description"
                value={settings.site_description}
                onChange={(e) => handleChange('site_description', e.target.value)}
                placeholder="Website resmi Pengadilan Negeri Nanga Bulik"
              />
            </div>
          </CardContent>
        </Card>

        {/* Branding */}
        <Card>
          <CardHeader>
            <CardTitle>Branding</CardTitle>
            <CardDescription>
              Konfigurasi logo dan favicon website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo_url">URL Logo</Label>
              <Input
                id="logo_url"
                type="url"
                value={settings.logo_url}
                onChange={(e) => handleChange('logo_url', e.target.value)}
                placeholder="https://contoh.com/logo.png"
              />
              <p className="text-sm text-gray-500">
                URL logo yang akan ditampilkan di header website
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="favicon_url">URL Favicon</Label>
              <Input
                id="favicon_url"
                type="url"
                value={settings.favicon_url}
                onChange={(e) => handleChange('favicon_url', e.target.value)}
                placeholder="https://contoh.com/favicon.ico"
              />
              <p className="text-sm text-gray-500">
                URL favicon yang akan ditampilkan di browser tab (format: .ico, .png, .svg)
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="bg-red-900 hover:bg-red-800">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Simpan Pengaturan
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
