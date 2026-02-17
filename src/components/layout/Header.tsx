'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, Phone, Mail, MapPin, ChevronDown, ChevronRight } from 'lucide-react';
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

interface MenuItem {
  id: string;
  label: string;
  url: string;
  order: number;
  parentId: string | null;
  children?: MenuItem[];
}

// Menu Skeleton Component
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedMobileMenus, setExpandedMobileMenus] = useState<Set<string>>(new Set());
  const [expandedDesktopMenus, setExpandedDesktopMenus] = useState<Set<string>>(new Set());
  const desktopMenuRef = useRef<HTMLDivElement>(null);

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

    fetchMenus();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Toggle desktop menu expansion
  const toggleDesktopMenu = (id: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setExpandedDesktopMenus((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Close all desktop menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (desktopMenuRef.current && !desktopMenuRef.current.contains(event.target as Node)) {
        setExpandedDesktopMenus(new Set());
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    const isExpanded = expandedDesktopMenus.has(item.id);

    return (
      <div key={item.id} className="relative">
        {hasChildren ? (
          <button
            onClick={(e) => toggleDesktopMenu(item.id, e)}
            className="text-sm font-medium text-gray-600 hover:text-red-800 transition-colors px-3 py-2 inline-flex items-center cursor-pointer"
          >
            <TTSText as="span" hoverEffect={false}>
              {item.label}
            </TTSText>
            <ChevronDown className={`ml-1 h-3 w-3 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        ) : (
          <Link
            href={item.url}
            className="text-sm font-medium text-gray-600 hover:text-red-800 transition-colors px-3 py-2 inline-flex items-center"
          >
            <TTSText as="span" hoverEffect={false}>
              {item.label}
            </TTSText>
          </Link>
        )}

        {hasChildren && isExpanded && (
          <div className="absolute top-full left-0 min-w-[220px] bg-white border border-gray-100 rounded-lg shadow-lg z-[9999] mt-1">
            <div className="py-2">
              {item.children!.map((child) => renderDesktopSubMenuItem(child, 1))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render desktop submenu item recursively (level 1+ - dropdown)
  const renderDesktopSubMenuItem = (item: MenuItem, level: number) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedDesktopMenus.has(item.id);

    return (
      <div key={item.id} className="relative">
        {hasChildren ? (
          <button
            onClick={(e) => toggleDesktopMenu(item.id, e)}
            className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-800 transition-colors whitespace-nowrap text-left"
          >
            <TTSText as="span" hoverEffect={false}>{item.label}</TTSText>
            <ChevronRight className={`ml-2 h-3 w-3 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </button>
        ) : (
          <Link
            href={item.url}
            className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-800 transition-colors whitespace-nowrap"
          >
            <TTSText as="span" hoverEffect={false}>{item.label}</TTSText>
          </Link>
        )}

        {hasChildren && isExpanded && (
          <div className="absolute left-full top-0 min-w-[220px] bg-white border border-gray-100 rounded-lg shadow-lg z-[9999] -ml-1">
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
            {/* Left: Email & Phone */}
            <div className="hidden md:flex items-center gap-3 md:gap-4">
              <a
                href="mailto:info@pn-nangabulik.go.id"
                className="flex items-center gap-1.5 hover:text-red-200 transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                <TTSText as="span" hoverEffect={false}>info@pn-nangabulik.go.id</TTSText>
              </a>
              <a
                href="tel:+6285252555"
                className="flex items-center gap-1.5 hover:text-red-200 transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                <TTSText as="span" hoverEffect={false}>+62 8525 2555</TTSText>
              </a>
            </div>

            {/* Center: Operating Hours */}
            <div className="text-center flex-1 md:flex-none">
              <TTSText as="span" className="text-red-200" hoverEffect={false}>
                Senin - Jumat: 08:00 - 16:00 WIB
              </TTSText>
            </div>

            {/* Right: Address */}
            <div className="hidden md:flex items-center gap-3 md:gap-4">
              <a
                href="#kontak"
                className="flex items-center gap-1.5 hover:text-red-200 transition-colors"
              >
                <MapPin className="h-3.5 w-3.5" />
                <TTSText as="span" hoverEffect={false}>Jalan Pendidikan No. 123, Nanga Bulik</TTSText>
              </a>
            </div>
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
                  <a
                    href="mailto:info@pn-nangabulik.go.id"
                    className="flex items-center gap-2 hover:text-red-200"
                  >
                    <Mail className="h-4 w-4" />
                    <TTSText as="span" hoverEffect={false}>info@pn-nangabulik.go.id</TTSText>
                  </a>
                  <a
                    href="tel:+6285252555"
                    className="flex items-center gap-2 hover:text-red-200"
                  >
                    <Phone className="h-4 w-4" />
                    <TTSText as="span" hoverEffect={false}>+62 8525 2555</TTSText>
                  </a>
                  <div className="flex items-center gap-2 text-red-200">
                    <MapPin className="h-4 w-4" />
                    <TTSText as="span" hoverEffect={false}>Jl. Pendidikan No. 123, Nanga Bulik</TTSText>
                  </div>
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
          <nav ref={desktopMenuRef} className="flex items-center">
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
