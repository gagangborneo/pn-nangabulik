import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

function getRealIP(request: NextRequest): string {
  const cfConnectingIp = request.headers.get("cf-connecting-ip")
  if (cfConnectingIp) return cfConnectingIp

  const xForwardedFor = request.headers.get("x-forwarded-for")
  if (xForwardedFor) {
    const ips = xForwardedFor.split(",")
    return ips[0].trim()
  }

  const xRealIp = request.headers.get("x-real-ip")
  if (xRealIp) return xRealIp

  return "unknown"
}

function formatIndonesianDate(date: Date): string {
  const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Ags",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ]

  const dayName = days[date.getDay()]
  const monthName = months[date.getMonth()]
  const year = date.getFullYear()

  return `${dayName} - ${monthName} - ${year}`
}

export async function GET(request: NextRequest) {
  try {
    // Get current IP
    const currentIp = getRealIP(request)

    // Current date formatted
    const now = new Date()
    const currentDateFormatted = formatIndonesianDate(now)

    // Define date ranges
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // This week (starting Monday)
    const thisWeekStart = new Date(today)
    const day = thisWeekStart.getDay()
    const diff = day === 0 ? -6 : 1 - day // adjust when day is sunday
    thisWeekStart.setDate(thisWeekStart.getDate() + diff)

    // Last week
    const lastWeekStart = new Date(thisWeekStart)
    lastWeekStart.setDate(lastWeekStart.getDate() - 7)
    const lastWeekEnd = new Date(thisWeekStart)

    // This month
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1)

    // Last month
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 1)

    // Online users (active in last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)

    // Execute all queries in parallel
    const [
      todayCount,
      yesterdayCount,
      thisWeekCount,
      lastWeekCount,
      thisMonthCount,
      lastMonthCount,
      totalCount,
      onlineUsers,
      perPageStats,
    ] = await Promise.all([
      // Today
      db.visitor.count({
        where: {
          visitedDate: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
      // Yesterday
      db.visitor.count({
        where: {
          visitedDate: {
            gte: yesterday,
            lt: today,
          },
        },
      }),
      // This Week
      db.visitor.count({
        where: {
          visitedDate: {
            gte: thisWeekStart,
          },
        },
      }),
      // Last Week
      db.visitor.count({
        where: {
          visitedDate: {
            gte: lastWeekStart,
            lt: lastWeekEnd,
          },
        },
      }),
      // This Month
      db.visitor.count({
        where: {
          visitedDate: {
            gte: thisMonthStart,
            lt: nextMonthStart,
          },
        },
      }),
      // Last Month
      db.visitor.count({
        where: {
          visitedDate: {
            gte: lastMonthStart,
            lt: lastMonthEnd,
          },
        },
      }),
      // Total
      db.visitor.count(),
      // Online Users (last 5 minutes) - get unique IPs
      db.visitor.findMany({
        where: {
          createdAt: {
            gte: fiveMinutesAgo,
          },
        },
        distinct: ["ipAddress"],
        select: {
          ipAddress: true,
        },
      }),
      // Per Page Stats
      db.$queryRaw`
        SELECT 
          path,
          COUNT(*) as total,
          SUM(CASE WHEN DATE(visitedDate) = CURDATE() THEN 1 ELSE 0 END) as today,
          COUNT(DISTINCT CASE WHEN DATE(visitedDate) = CURDATE() THEN ipAddress END) as uniqueToday
        FROM Visitor
        GROUP BY path
        ORDER BY total DESC
        LIMIT 20
      `,
    ])

    // Format per page stats
    const perPageFormatted = (perPageStats as any[]).map((stat) => ({
      path: stat.path,
      today: Number(stat.today),
      total: Number(stat.total),
      uniqueToday: Number(stat.uniqueToday),
    }))

    // Return statistics
    return NextResponse.json({
      global: {
        today: todayCount,
        yesterday: yesterdayCount,
        thisWeek: thisWeekCount,
        lastWeek: lastWeekCount,
        thisMonth: thisMonthCount,
        lastMonth: lastMonthCount,
        total: totalCount,
        onlineUsers: onlineUsers.length,
      },
      perPage: perPageFormatted,
      currentIp,
      currentDateFormatted,
    })
  } catch (error) {
    console.error("Statistics error:", error)
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    )
  }
}
