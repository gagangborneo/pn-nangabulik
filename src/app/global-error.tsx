"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error caught:", error);
  }, [error]);

  return (
    <html lang="id">
      <body className="antialiased">
        <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-red-50 via-orange-50 to-red-50">
          <div className="max-w-md w-full bg-white rounded-xl border-2 border-red-200 shadow-lg overflow-hidden">
            <div className="p-6 text-center space-y-4">
              <div className="mx-auto w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  Kesalahan Sistem
                </h1>
                <p className="text-gray-600">
                  Terjadi kesalahan kritis pada sistem. Silakan muat ulang halaman atau hubungi administrator.
                </p>
              </div>
              {error.digest && (
                <div className="p-3 rounded-lg bg-gray-100 text-xs font-mono text-gray-600 break-all">
                  <span className="font-semibold">Error ID:</span> {error.digest}
                </div>
              )}
              {process.env.NODE_ENV === "development" && (
                <details className="p-3 rounded-lg bg-gray-100 text-xs text-left">
                  <summary className="cursor-pointer font-semibold mb-2 text-red-600">
                    Detail Error (Development Only)
                  </summary>
                  <pre className="whitespace-pre-wrap break-all text-gray-600 mt-2">
                    {error.message}
                    {error.stack && `\n\n${error.stack}`}
                  </pre>
                </details>
              )}
            </div>
            <div className="p-6 pt-0 space-y-3">
              <button
                onClick={() => reset()}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors bg-red-600 text-white hover:bg-red-700 h-11 px-8"
              >
                <RefreshCcw className="w-5 h-5" />
                Muat Ulang Halaman
              </button>
              <button
                onClick={() => window.location.href = "/"}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors border border-gray-300 bg-white hover:bg-gray-50 h-11 px-8"
              >
                Kembali ke Beranda
              </button>
              <div className="pt-2 border-t text-center text-sm text-gray-500">
                <p>Pengadilan Negeri Nanga Bulik</p>
                <p className="text-xs mt-1">Melayani Dengan Integritas dan Profesionalisme</p>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
