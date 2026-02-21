'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, Phone, Mail, MapPin, ChevronDown, ChevronRight, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TTSToggle } from '@/components/ui/tts-toggle';
import { TTSText } from '@/components/ui/tts-text';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
  SheetHeader,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MenuItem {
  id: string;
  label: string;
  url: string;
  order: number;
  parentId: string | null;
  children?: MenuItem[];
}

interface ContactSettings {
  phone: string;
  hours: string;
}

interface Language {
  code: string;
  name: string;
  flag: string;
}

// Supported languages (Indonesian + ASEAN countries + common foreign languages)
const languages: Language[] = [
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'th', name: 'ภาษาไทย (Thai)', flag: '🇹🇭' },
  { code: 'vi', name: 'Tiếng Việt (Vietnamese)', flag: '🇻🇳' },
  { code: 'tl', name: 'Filipino', flag: '🇵🇭' },
  { code: 'my', name: 'မြန်မာ (Burmese)', flag: '🇲🇲' },
  { code: 'zh-CN', name: '中文 (Chinese)', flag: '🇨🇳' },
  { code: 'ja', name: '日本語 (Japanese)', flag: '🇯🇵' },
  { code: 'ko', name: '한국어 (Korean)', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية (Arabic)', flag: '🇸🇦' },
];

// Skeleton Components
function TopBarSkeleton() {
  return (
    <>
      {/* Left skeleton */}
      <div className="flex items-center gap-1.5">
        <div className="h-3.5 w-3.5 bg-white/30 rounded animate-pulse" />
        <div className="h-3 w-32 bg-white/30 rounded animate-pulse" />
      </div>
      {/* Center skeleton */}
      <div className="text-center flex-1 md:flex-none">
        <div className="h-3 w-48 bg-white/30 rounded animate-pulse mx-auto" />
      </div>
      {/* Right skeleton */}
      <div className="hidden md:flex items-center">
        <div className="h-3.5 w-3.5 bg-white/30 rounded animate-pulse mr-2" />
        <div className="h-3 w-40 bg-white/30 rounded animate-pulse" />
      </div>
    </>
  );
}

function MenuSkeleton() {
  return (
    <div className="flex items-center gap-1">
      {[...Array(7)].map((_, i) => (
        <div
          key={i}
          className="h-4 w-20 bg-gray-200 rounded animate-pulse mx-2"
        />
      ))}
    </div>
  );
}

function MobileMenuSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(7)].map((_, i) => (
        <div
          key={i}
          className="h-5 w-32 bg-gray-200 rounded animate-pulse"
        />
      ))}
    </div>
  );
}

export default function Header() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactLoading, setContactLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedMobileMenus, setExpandedMobileMenus] = useState<Set<string>>(new Set());
  const [contactSettings, setContactSettings] = useState<ContactSettings>({
    phone: '+62 852 525 2555',
    hours: 'Senin - Jumat: 08:00 - 16:00 WIB',
  });
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]); // Default to Indonesian

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch('/api/menus');
        const data = await response.json();
        setMenuItems(data.menus || []);
      } catch (error) {
        console.error('Error fetching menus:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchContactSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        const data = await response.json();
        if (data.settings) {
          const settingsMap = data.settings as Record<string, string>;
          setContactSettings({
            phone: settingsMap['phone'] || '+62 852 525 2555',
            hours: settingsMap['hours'] || 'Senin - Jumat: 08:00 - 16:00 WIB',
          });
        }
      } catch (error) {
        console.error('Error fetching contact settings:', error);
      } finally {
        setContactLoading(false);
      }
    };

    fetchMenus();
    fetchContactSettings();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to change language using Google Translate
  const changeLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    
    // Google Translate implementation
    const googleTranslateElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    
    if (googleTranslateElement) {
      googleTranslateElement.value = lang.code;
      googleTranslateElement.dispatchEvent(new Event('change'));
    } else {
      // If Google Translate widget not initialized, redirect to Google Translate
      const currentUrl = window.location.href;
      const translateUrl = `https://translate.google.com/translate?sl=id&tl=${lang.code}&u=${encodeURIComponent(currentUrl)}`;
      window.location.href = translateUrl;
    }
  };

  // Toggle mobile menu expansion
  const toggleMobileMenu = (id: string) => {
    setExpandedMobileMenus((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };



  // Render mobile menu item recursively
  const renderMobileMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMobileMenus.has(item.id);
    const paddingLeft = 8 + (level * 16); // Base padding 8px + 16px per level

    return (
      <div key={item.id}>
        <div
          className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 rounded-md transition-colors"
          style={{ paddingLeft: `${paddingLeft}px`, paddingRight: '12px' }}
        >
          {hasChildren ? (
            <>
              <button
                onClick={() => toggleMobileMenu(item.id)}
                className="flex items-center gap-2 flex-1 text-left min-w-0"
              >
                <TTSText 
                  as="span" 
                  className={`truncate ${level === 0 ? 'font-medium text-gray-800 text-[15px]' : 'text-gray-600 text-[14px]'}`}
                  hoverEffect={false}
                >
                  {item.label}
                </TTSText>
              </button>
              <button
                onClick={() => toggleMobileMenu(item.id)}
                className="p-1 flex-shrink-0 ml-2"
              >
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                />
              </button>
            </>
          ) : (
            <SheetClose asChild>
              <Link
                href={item.url}
                className={`flex-1 min-w-0 truncate ${level === 0 ? 'font-medium text-gray-800 text-[15px]' : 'text-gray-600 text-[14px]'}`}
              >
                <TTSText as="span" hoverEffect={false}>
                  {item.label}
                </TTSText>
              </Link>
            </SheetClose>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => renderMobileMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Render desktop menu item (level 0 - horizontal)
  const renderDesktopMenuItem = (item: MenuItem) => {
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id} className="relative group">
        <Link
          href={item.url}
          className="text-sm font-medium text-gray-600 hover:text-red-800 transition-colors px-3 py-2 inline-flex items-center"
        >
          <TTSText as="span" hoverEffect={false}>
            {item.label}
          </TTSText>
          {hasChildren && (
            <ChevronDown className="ml-1 h-3 w-3 text-gray-400 group-hover:text-red-800 transition-colors" />
          )}
        </Link>

        {hasChildren && (
          <div className="absolute top-full left-0 min-w-[220px] bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-all duration-200 z-[9999] mt-1">
            <div className="py-2">
              {item.children!.map((child) => renderDesktopSubMenuItem(child, 1))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render nested submenu items recursively
  const renderDesktopSubMenuItem = (item: MenuItem, level: number = 1) => {
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id} className="relative group/submenu space-y-1">
        {hasChildren ? (
          <Link
            href={item.url}
            className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-800 transition-colors whitespace-nowrap text-left group-hover/submenu:bg-red-50 group-hover/submenu:text-red-800"
          >
            <TTSText as="span" hoverEffect={false}>{item.label}</TTSText>
            <ChevronRight className="h-3 w-3 text-gray-400 group-hover/submenu:text-red-800 transition-colors" />
          </Link>
        ) : (
          <Link
            href={item.url}
            className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-800 transition-colors whitespace-nowrap"
          >
            <TTSText as="span" hoverEffect={false}>{item.label}</TTSText>
          </Link>
        )}

        {hasChildren && (
          <div className="absolute left-full top-0 min-w-[220px] bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 invisible pointer-events-none group-hover/submenu:opacity-100 group-hover/submenu:visible group-hover/submenu:pointer-events-auto transition-all duration-200 z-[9999] -ml-1" style={{ top: '50%', transform: 'translateY(-50%)' }}>
            <div className="py-2">
              {item.children!.map((child) => renderDesktopSubMenuItem(child, level + 1))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <header className={`bg-white transition-shadow z-50 ${isScrolled ? 'shadow-lg' : ''}`}>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-red-900 to-red-800 text-white py-2">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 md:gap-4 text-xs md:text-sm">
            {contactLoading ? (
              <TopBarSkeleton />
            ) : (
              <>
                {/* Left: Phone Number */}
                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${contactSettings.phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-1.5 hover:text-red-200 transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <TTSText as="span" hoverEffect={false}>{contactSettings.phone}</TTSText>
                  </a>
                </div>

                {/* Center: Operating Hours */}
                <div className="text-center flex-1 md:flex-none">
                  <TTSText as="span" className="text-red-200" hoverEffect={false}>
                    {contactSettings.hours}
                  </TTSText>
                </div>

                {/* Right: Language Selector */}
                <div className="hidden md:flex items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-1.5 hover:text-red-200 transition-colors px-2 py-1 rounded">
                        <Globe className="h-3.5 w-3.5" />
                        <span className="hidden lg:inline">{currentLanguage.flag} {currentLanguage.name}</span>
                        <span className="lg:hidden">{currentLanguage.flag}</span>
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 max-h-96 overflow-y-auto">
                      {languages.map((lang) => (
                        <DropdownMenuItem
                          key={lang.code}
                          onClick={() => changeLanguage(lang)}
                          className={`cursor-pointer ${currentLanguage.code === lang.code ? 'bg-red-50' : ''}`}
                        >
                          <span className="mr-2">{lang.flag}</span>
                          <span>{lang.name}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img
              src="https://web.pn-nangabulik.go.id/wp-content/uploads/2020/01/cropped-logopnnangabuliktanpalatar-1.png"
              alt="Pengadilan Negeri Nanga Bulik"
              className="w-12 h-12 object-contain"
            />
            <div>
              <TTSText 
                as="p" 
                className="text-xs md:text-sm text-gray-500 leading-tight"
                hoverEffect={false}
              >
                MAHKAMAH AGUNG REPUBLIK INDONESIA
              </TTSText>
              <TTSText 
                as="h1" 
                className="text-base md:text-lg font-bold text-gray-900 leading-tight"
                hoverEffect={false}
              >
                Pengadilan Negeri Nanga Bulik
              </TTSText>
            </div>
          </Link>

          {/* WhatsApp Contact Button */}
          <div className="hidden md:flex items-center gap-3">
            <TTSToggle variant="outline" size="icon" />
            <a
              href="https://wa.me/6282350442244"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-900 text-white hover:bg-red-800 transition-colors px-6 py-2.5 rounded-lg font-medium"
            >
              <Phone className="h-4 w-4" />
              <span>Hubungi Kami</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
              <SheetHeader className="sr-only">
                <SheetTitle>Menu Navigasi</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-8">
                {/* Logo in mobile menu */}
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src="https://web.pn-nangabulik.go.id/wp-content/uploads/2020/01/cropped-logopnnangabuliktanpalatar-1.png"
                    alt="Pengadilan Negeri Nanga Bulik"
                    className="w-10 h-10 object-contain"
                  />
                  <div>
                    <TTSText as="div" className="text-xs text-gray-500" hoverEffect={false}>
                      MAHKAMAH AGUNG RI
                    </TTSText>
                    <TTSText as="div" className="font-bold text-gray-800 text-sm" hoverEffect={false}>
                      Pengadilan Negeri Nanga Bulik
                    </TTSText>
                  </div>
                </div>

                {/* Mobile Contact Info */}
                <div className="bg-red-900 text-white rounded-lg p-3 space-y-2 text-sm">
                  {contactLoading ? (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-white/30 rounded animate-pulse" />
                        <div className="h-3 w-32 bg-white/30 rounded animate-pulse" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-white/30 rounded animate-pulse" />
                        <div className="h-3 w-40 bg-white/30 rounded animate-pulse" />
                      </div>
                    </>
                  ) : (
                    <>
                      <a
                        href={`tel:${contactSettings.phone.replace(/\s/g, '')}`}
                        className="flex items-center gap-2 hover:text-red-200"
                      >
                        <Phone className="h-4 w-4" />
                        <TTSText as="span" hoverEffect={false}>{contactSettings.phone}</TTSText>
                      </a>
                      <div className="flex items-center gap-2 text-red-200">
                        <Globe className="h-4 w-4" />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-1.5 hover:text-white transition-colors text-left">
                              <span>{currentLanguage.flag} {currentLanguage.name}</span>
                              <ChevronDown className="h-3 w-3" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-48 max-h-96 overflow-y-auto">
                            {languages.map((lang) => (
                              <DropdownMenuItem
                                key={lang.code}
                                onClick={() => changeLanguage(lang)}
                                className={`cursor-pointer ${currentLanguage.code === lang.code ? 'bg-red-50' : ''}`}
                              >
                                <span className="mr-2">{lang.flag}</span>
                                <span>{lang.name}</span>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </>
                  )}
                </div>

                {/* Mobile Menu Items */}
                <nav className="space-y-1 -mx-6 px-6">
                  {loading ? (
                    <MobileMenuSkeleton />
                  ) : menuItems.length === 0 ? (
                    <div className="text-gray-500 text-sm py-4 text-center">
                      Tidak ada menu tersedia
                    </div>
                  ) : (
                    menuItems.map((item) => renderMobileMenuItem(item))
                  )}
                </nav>

                {/* WhatsApp Button in Mobile */}
                <div className="flex gap-2 mt-4">
                  <TTSToggle variant="outline" size="default" showLabel />
                  <a
                    href="https://wa.me/6282350442244"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-red-900 text-white hover:bg-red-800 transition-colors px-6 py-2.5 rounded-lg font-medium"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Hubungi Kami</span>
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Navigation */}
        <div className="relative flex justify-center border-t border-gray-100 hidden md:flex">
          <nav className="flex items-center">
            {loading ? (
              <MenuSkeleton />
            ) : menuItems.length === 0 ? (
              <div className="text-gray-500 text-sm py-4">
                Tidak ada menu tersedia
              </div>
            ) : (
              menuItems.map((item) => renderDesktopMenuItem(item))
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
