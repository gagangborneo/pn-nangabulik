"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, Eye, Globe, TrendingUp, Users } from "lucide-react"

interface GlobalStats {
  today: number
  yesterday: number
  thisWeek: number
  lastWeek: number
  thisMonth: number
  lastMonth: number
  total: number
  onlineUsers: number
}

interface PageStat {
  path: string
  total: number
}

interface Statistics {
  global: GlobalStats
  perPage: PageStat[]
  currentIp: string
  currentDateFormatted: string
}

export default function VisitorDashboard() {
  const [stats, setStats] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  async function fetchStats() {
    try {
      const response = await fetch("/api/statistics")
      if (!response.ok) throw new Error("Failed to fetch statistics")
      const data = await response.json()
      setStats(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  function calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
  }

  function formatNumber(num: number): string {
    return new Intl.NumberFormat("id-ID").format(num)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (!stats) return null

  const todayVsYesterday = calculatePercentageChange(stats.global.today, stats.global.yesterday)
  const thisWeekVsLastWeek = calculatePercentageChange(stats.global.thisWeek, stats.global.lastWeek)
  const thisMonthVsLastMonth = calculatePercentageChange(stats.global.thisMonth, stats.global.lastMonth)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Traffic Monitoring</h1>
        <p className="text-muted-foreground">
          {stats.currentDateFormatted} • IP Anda: {stats.currentIp}
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Today */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengunjung Hari Ini</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.global.today)}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {todayVsYesterday > 0 ? (
                <>
                  <ArrowUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-green-600">+{todayVsYesterday.toFixed(1)}%</span>
                </>
              ) : todayVsYesterday < 0 ? (
                <>
                  <ArrowDown className="h-3 w-3 text-red-600 mr-1" />
                  <span className="text-red-600">{todayVsYesterday.toFixed(1)}%</span>
                </>
              ) : (
                <span>Sama dengan kemarin</span>
              )}
              <span className="ml-1">vs kemarin</span>
            </div>
          </CardContent>
        </Card>

        {/* This Week */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Minggu Ini</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.global.thisWeek)}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {thisWeekVsLastWeek > 0 ? (
                <>
                  <ArrowUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-green-600">+{thisWeekVsLastWeek.toFixed(1)}%</span>
                </>
              ) : thisWeekVsLastWeek < 0 ? (
                <>
                  <ArrowDown className="h-3 w-3 text-red-600 mr-1" />
                  <span className="text-red-600">{thisWeekVsLastWeek.toFixed(1)}%</span>
                </>
              ) : (
                <span>Sama dengan minggu lalu</span>
              )}
              <span className="ml-1">vs minggu lalu</span>
            </div>
          </CardContent>
        </Card>

        {/* This Month */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bulan Ini</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.global.thisMonth)}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {thisMonthVsLastMonth > 0 ? (
                <>
                  <ArrowUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-green-600">+{thisMonthVsLastMonth.toFixed(1)}%</span>
                </>
              ) : thisMonthVsLastMonth < 0 ? (
                <>
                  <ArrowDown className="h-3 w-3 text-red-600 mr-1" />
                  <span className="text-red-600">{thisMonthVsLastMonth.toFixed(1)}%</span>
                </>
              ) : (
                <span>Sama dengan bulan lalu</span>
              )}
              <span className="ml-1">vs bulan lalu</span>
            </div>
          </CardContent>
        </Card>

        {/* Online Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengguna Online</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.global.onlineUsers)}</div>
            <p className="text-xs text-muted-foreground mt-1">Aktif dalam 5 menit terakhir</p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Kemarin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.global.yesterday)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Minggu Lalu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.global.lastWeek)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Bulan Lalu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.global.lastMonth)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Total Visitors */}
      <Card className="bg-primary text-primary-foreground">
        <CardHeader>
          <CardTitle>Total Pengunjung</CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Sejak sistem mulai tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{formatNumber(stats.global.total)}</div>
        </CardContent>
      </Card>

      {/* Per Page Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Statistik Per Halaman</CardTitle>
          <CardDescription>
            Top 20 halaman yang paling banyak dikunjungi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Halaman</th>
                  <th className="text-right py-3 px-4 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {stats.perPage.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-muted-foreground">
                      Belum ada data pengunjung
                    </td>
                  </tr>
                ) : (
                  stats.perPage.map((page, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-sm">
                            {index + 1}.
                          </span>
                          <span className="font-mono text-sm">{page.path}</span>
                        </div>
                      </td>
                      <td className="text-right py-3 px-4 font-bold">
                        {formatNumber(page.total)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
