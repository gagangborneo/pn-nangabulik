import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Home, Search, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <FileQuestion className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-2">
            <div className="text-6xl font-bold text-primary">404</div>
            <CardTitle className="text-2xl">Halaman Tidak Ditemukan</CardTitle>
            <CardDescription className="text-base">
              Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3">
            <Link href="/" className="w-full">
              <Button className="w-full" size="lg">
                <Home className="mr-2 h-5 w-5" />
                Kembali ke Beranda
              </Button>
            </Link>
            <Link href="/berita" className="w-full">
              <Button variant="outline" className="w-full" size="lg">
                <Search className="mr-2 h-5 w-5" />
                Jelajahi Berita
              </Button>
            </Link>
          </div>
          <div className="pt-4 border-t text-center text-sm text-muted-foreground">
            <p>Pengadilan Negeri Nanga Bulik</p>
            <p className="text-xs mt-1">Melayani Dengan Integritas dan Profesionalisme</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
