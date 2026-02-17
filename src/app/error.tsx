"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error caught by error boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-red-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-red-950/20 dark:to-slate-950">
      <Card className="max-w-md w-full border-destructive/20">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl">Terjadi Kesalahan</CardTitle>
            <CardDescription className="text-base">
              Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi atau hubungi administrator jika masalah berlanjut.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error.digest && (
            <div className="p-3 rounded-lg bg-muted text-xs font-mono text-muted-foreground break-all">
              <span className="font-semibold">Error ID:</span> {error.digest}
            </div>
          )}
          {process.env.NODE_ENV === "development" && (
            <details className="p-3 rounded-lg bg-muted text-xs">
              <summary className="cursor-pointer font-semibold mb-2 text-destructive">
                Detail Error (Development Only)
              </summary>
              <pre className="whitespace-pre-wrap break-all text-muted-foreground">
                {error.message}
              </pre>
            </details>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button
            onClick={() => reset()}
            className="w-full"
            size="lg"
          >
            <RefreshCcw className="mr-2 h-5 w-5" />
            Coba Lagi
          </Button>
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full" size="lg">
              <Home className="mr-2 h-5 w-5" />
              Kembali ke Beranda
            </Button>
          </Link>
          <div className="pt-2 border-t w-full text-center text-sm text-muted-foreground">
            <p>Pengadilan Negeri Nanga Bulik</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
