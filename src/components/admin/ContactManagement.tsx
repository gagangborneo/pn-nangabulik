'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ContactSettings {
  address: string;
  phone: string;
  email: string;
  hours: string;
  whatsapp_number: string;
  operationalHours: OperationalHours;
}

interface OperationalHours {
  weekdayLabel: string;
  weekdayHours: string;
  weekdayBreakLabel: string;
  weekdayBreakHours: string;
  fridayLabel: string;
  fridayHours: string;
  fridayBreakLabel: string;
  fridayBreakHours: string;
  weekendLabel: string;
  weekendHours: string;
}

const defaultOperationalHours: OperationalHours = {
  weekdayLabel: 'Hari Senin s/d Kamis',
  weekdayHours: '08.30 - 16.00',
  weekdayBreakLabel: 'Istirahat',
  weekdayBreakHours: '12.00 - 13.00',
  fridayLabel: 'Hari Jumat',
  fridayHours: '07.30 - 15.30',
  fridayBreakLabel: 'Istirahat',
  fridayBreakHours: '11.30 - 13.00',
  weekendLabel: 'Hari Sabtu/Minggu/Besar',
  weekendHours: 'Libur',
};

const defaultSettings: ContactSettings = {
  address: 'Jl. Diponegoro No. 1, Nanga Bulik, Kabupaten Lamandau, Kalimantan Tengah',
  phone: '(0513) 123456',
  email: 'info@pn-nangabulik.go.id',
  hours: 'Senin - Jumat: 08:00 - 16:00 WIB',
  whatsapp_number: '6282350442244',
  operationalHours: defaultOperationalHours,
};

export default function ContactManagement() {
  const [settings, setSettings] = useState<ContactSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        const data = await response.json();

        if (data.settings) {
          // settings is already an object, not an array
          const settingsMap = data.settings as Record<string, string>;
          let operationalHours = defaultOperationalHours;
          if (settingsMap['operational_hours']) {
            try {
              const parsed = JSON.parse(settingsMap['operational_hours']) as Partial<OperationalHours>;
              operationalHours = { ...defaultOperationalHours, ...parsed };
            } catch (error) {
              console.error('Error parsing operational hours:', error);
            }
          }

          setSettings({
            address: settingsMap['address'] || defaultSettings.address,
            phone: settingsMap['phone'] || defaultSettings.phone,
            email: settingsMap['email'] || defaultSettings.email,
            hours: settingsMap['hours'] || defaultSettings.hours,
            whatsapp_number: settingsMap['whatsapp_number'] || defaultSettings.whatsapp_number,
            operationalHours,
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([
          { key: 'address', value: settings.address },
          { key: 'phone', value: settings.phone },
          { key: 'email', value: settings.email },
          { key: 'hours', value: settings.hours },
          { key: 'whatsapp_number', value: settings.whatsapp_number },
          { key: 'operational_hours', value: JSON.stringify(settings.operationalHours) },
        ]),
      });

      if (response.ok) {
        toast.success('Pengaturan kontak berhasil disimpan');
      } else {
        toast.error('Gagal menyimpan pengaturan');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Terjadi kesalahan saat menyimpan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#8B0000]" />
      </div>
    );
  }

  const updateOperationalHours = (key: keyof OperationalHours, value: string) => {
    setSettings((prev) => ({
      ...prev,
      operationalHours: {
        ...prev.operationalHours,
        [key]: value,
      },
    }));
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Informasi Kontak
          </CardTitle>
          <CardDescription>
            Pengaturan informasi kontak yang ditampilkan di website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              Alamat
            </Label>
            <Input
              id="address"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              placeholder="Alamat lengkap"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              Nomor Telepon
            </Label>
            <Input
              id="phone"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              placeholder="Nomor telepon"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              placeholder="Alamat email"
            />
          </div>

          {/* Hours */}
          <div className="space-y-2">
            <Label htmlFor="hours" className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              Jam Operasional (Ringkas)
            </Label>
            <Input
              id="hours"
              value={settings.hours}
              onChange={(e) => setSettings({ ...settings, hours: e.target.value })}
              placeholder="Jam operasional"
            />
          </div>

          {/* Operational Hours */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              Jam Kerja Pengadilan & PTSP
            </Label>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="weekdayLabel">Label Senin - Kamis</Label>
                <Input
                  id="weekdayLabel"
                  value={settings.operationalHours.weekdayLabel}
                  onChange={(e) => updateOperationalHours('weekdayLabel', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="weekdayHours">Jam Senin - Kamis</Label>
                <Input
                  id="weekdayHours"
                  value={settings.operationalHours.weekdayHours}
                  onChange={(e) => updateOperationalHours('weekdayHours', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="weekdayBreakLabel">Label Istirahat (Senin - Kamis)</Label>
                <Input
                  id="weekdayBreakLabel"
                  value={settings.operationalHours.weekdayBreakLabel}
                  onChange={(e) => updateOperationalHours('weekdayBreakLabel', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="weekdayBreakHours">Jam Istirahat (Senin - Kamis)</Label>
                <Input
                  id="weekdayBreakHours"
                  value={settings.operationalHours.weekdayBreakHours}
                  onChange={(e) => updateOperationalHours('weekdayBreakHours', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="fridayLabel">Label Jumat</Label>
                <Input
                  id="fridayLabel"
                  value={settings.operationalHours.fridayLabel}
                  onChange={(e) => updateOperationalHours('fridayLabel', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="fridayHours">Jam Jumat</Label>
                <Input
                  id="fridayHours"
                  value={settings.operationalHours.fridayHours}
                  onChange={(e) => updateOperationalHours('fridayHours', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="fridayBreakLabel">Label Istirahat (Jumat)</Label>
                <Input
                  id="fridayBreakLabel"
                  value={settings.operationalHours.fridayBreakLabel}
                  onChange={(e) => updateOperationalHours('fridayBreakLabel', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="fridayBreakHours">Jam Istirahat (Jumat)</Label>
                <Input
                  id="fridayBreakHours"
                  value={settings.operationalHours.fridayBreakHours}
                  onChange={(e) => updateOperationalHours('fridayBreakHours', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="weekendLabel">Label Sabtu/Minggu/Besar</Label>
                <Input
                  id="weekendLabel"
                  value={settings.operationalHours.weekendLabel}
                  onChange={(e) => updateOperationalHours('weekendLabel', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="weekendHours">Jam Sabtu/Minggu/Besar</Label>
                <Input
                  id="weekendHours"
                  value={settings.operationalHours.weekendHours}
                  onChange={(e) => updateOperationalHours('weekendHours', e.target.value)}
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Data ini ditampilkan pada widget Jam Kerja Pengadilan & PTSP di sidebar.
            </p>
          </div>

          {/* WhatsApp Number */}
          <div className="space-y-2">
            <Label htmlFor="whatsapp_number" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-gray-500" />
              Nomor WhatsApp (untuk Floating Button)
            </Label>
            <Input
              id="whatsapp_number"
              value={settings.whatsapp_number}
              onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
              placeholder="Nomor WhatsApp (format: 62xxxxxxxxxx)"
            />
            <p className="text-xs text-gray-500">
              Format: gunakan kode negara (62 untuk Indonesia) tanpa tanda + atau spasi
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-[#8B0000] mt-1 shrink-0" />
              <span className="text-sm text-gray-600">{settings.address}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-[#8B0000] shrink-0" />
              <span className="text-sm text-gray-600">{settings.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-[#8B0000] shrink-0" />
              <span className="text-sm text-gray-600">{settings.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-[#8B0000] shrink-0" />
              <span className="text-sm text-gray-600">{settings.hours}</span>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-3">
              <p className="text-xs font-semibold text-gray-500 mb-2">
                Jam Kerja Pengadilan & PTSP
              </p>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-start justify-between gap-3">
                  <span className="font-semibold">
                    {settings.operationalHours.weekdayLabel}
                  </span>
                  <span>{settings.operationalHours.weekdayHours}</span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <span className="font-semibold">
                    {settings.operationalHours.weekdayBreakLabel}
                  </span>
                  <span>{settings.operationalHours.weekdayBreakHours}</span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <span className="font-semibold">
                    {settings.operationalHours.fridayLabel}
                  </span>
                  <span>{settings.operationalHours.fridayHours}</span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <span className="font-semibold">
                    {settings.operationalHours.fridayBreakLabel}
                  </span>
                  <span>{settings.operationalHours.fridayBreakHours}</span>
                </div>
                <div className="flex items-start justify-between gap-3 text-green-700">
                  <span className="font-semibold">
                    {settings.operationalHours.weekendLabel}
                  </span>
                  <span>{settings.operationalHours.weekendHours}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MessageCircle className="h-4 w-4 text-[#8B0000] shrink-0" />
              <span className="text-sm text-gray-600">https://wa.me/{settings.whatsapp_number}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button
        className="bg-[#8B0000] hover:bg-[#6b0000]"
        onClick={handleSave}
        disabled={saving}
      >
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
  );
}
