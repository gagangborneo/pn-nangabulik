import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// Bot detection patterns
const BOT_PATTERNS = [
  "bot",
  "crawl",
  "spider",
  "preview",
  "headless",
  "curl",
  "wget",
  "python-requests",
  "axios",
  "postman",
]

function isBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase()
  return BOT_PATTERNS.some((pattern) => ua.includes(pattern))
}

function getRealIP(request: NextRequest): string {
  // Priority 1: Cloudflare
  const cfConnectingIp = request.headers.get("cf-connecting-ip")
  if (cfConnectingIp) return cfConnectingIp

  // Priority 2: X-Forwarded-For
  const xForwardedFor = request.headers.get("x-forwarded-for")
  if (xForwardedFor) {
    const ips = xForwardedFor.split(",")
    return ips[0].trim()
  }

  // Priority 3: X-Real-IP
  const xRealIp = request.headers.get("x-real-ip")
  if (xRealIp) return xRealIp

  // Fallback
  return "unknown"
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { path } = body

    if (!path) {
      return NextResponse.json(
        { error: "Path is required" },
        { status: 400 }
      )
    }

    // Get user agent and check for bots
    const userAgent = request.headers.get("user-agent") || "unknown"
    if (isBot(userAgent)) {
      return NextResponse.json(
        { success: true, message: "Bot detected, not tracked" },
        { status: 200 }
      )
    }

    // Get real IP address
    const ipAddress = getRealIP(request)

    // Get current date (for grouping by day)
    const visitedDate = new Date()
    visitedDate.setHours(0, 0, 0, 0)

    // Insert visitor record (will be ignored if duplicate exists for today)
    try {
      await db.visitor.create({
        data: {
          ipAddress,
          userAgent,
          path,
          visitedDate,
        },
      })
    } catch (error: any) {
      // If it's a unique constraint error, it means this IP already visited this page today
      // This is expected behavior, so we return success
      if (error.code === "P2002") {
        return NextResponse.json(
          { success: true, message: "Already tracked today" },
          { status: 200 }
        )
      }
      throw error
    }

    return NextResponse.json(
      { success: true, message: "Visitor tracked" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Visitor tracking error:", error)
    return NextResponse.json(
      { error: "Failed to track visitor" },
      { status: 500 }
    )
  }
}
