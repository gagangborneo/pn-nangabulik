"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function VisitorTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Track page visit
    const trackVisit = async () => {
      try {
        await fetch("/api/visitor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: pathname,
          }),
        })
      } catch (error) {
        // Silently fail - don't disrupt user experience
        console.debug("Visitor tracking failed:", error)
      }
    }

    // Small delay to avoid blocking initial page load
    const timer = setTimeout(trackVisit, 500)

    return () => clearTimeout(timer)
  }, [pathname])

  // This component doesn't render anything
  return null
}
