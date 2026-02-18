"use client"

import { useEffect, useState } from "react"
import { Eye, TrendingUp, Users } from "lucide-react"

interface VisitorStats {
  today: number
  thisMonth: number
  total: number
  onlineUsers: number
}

export default function VisitorCounterSection() {
  const [stats, setStats] = useState<VisitorStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const response = await fetch("/api/statistics")
      if (!response.ok) throw new Error("Failed to fetch statistics")
      const data = await response.json()
      setStats({
        today: data.global.today,
        thisMonth: data.global.thisMonth,
        total: data.global.total,
        onlineUsers: data.global.onlineUsers,
      })
    } catch (err) {
      console.error("Failed to fetch visitor stats:", err)
    } finally {
      setLoading(false)
    }
  }

  function formatNumber(num: number): string {
    return new Intl.NumberFormat("id-ID").format(num)
  }

  if (loading) {
    return (
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="animate-pulse h-24 w-full max-w-4xl bg-muted rounded-lg"></div>
          </div>
        </div>
      </section>
    )
  }

  if (!stats) return null

  return (
    <section className="py-12 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Statistik Pengunjung</h2>
            <p className="text-muted-foreground">
              Terima kasih atas kunjungan Anda
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {/* Online Users */}
            <div className="bg-card rounded-lg shadow-sm p-6 text-center border border-border hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-1 bg-gradient-to-br from-green-600 to-green-400 bg-clip-text text-transparent">
                {formatNumber(stats.onlineUsers)}
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">Online Sekarang</p>
            </div>

            {/* Today */}
            <div className="bg-card rounded-lg shadow-sm p-6 text-center border border-border hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-1 bg-gradient-to-br from-blue-600 to-blue-400 bg-clip-text text-transparent">
                {formatNumber(stats.today)}
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">Hari Ini</p>
            </div>

            {/* This Month */}
            <div className="bg-card rounded-lg shadow-sm p-6 text-center border border-border hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-1 bg-gradient-to-br from-purple-600 to-purple-400 bg-clip-text text-transparent">
                {formatNumber(stats.thisMonth)}
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">Bulan Ini</p>
            </div>

            {/* Total */}
            <div className="bg-card rounded-lg shadow-sm p-6 text-center border border-border hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                  <Eye className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-1 bg-gradient-to-br from-orange-600 to-orange-400 bg-clip-text text-transparent">
                {formatNumber(stats.total)}
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">Total Kunjungan</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
