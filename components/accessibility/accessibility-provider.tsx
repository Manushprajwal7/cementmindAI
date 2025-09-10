"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AccessibilitySettings {
  highContrast: boolean
  reducedMotion: boolean
  fontSize: "small" | "medium" | "large"
  colorBlindMode: "none" | "protanopia" | "deuteranopia" | "tritanopia"
}

interface AccessibilityContextType {
  settings: AccessibilitySettings
  updateSettings: (settings: Partial<AccessibilitySettings>) => void
  announceToScreenReader: (message: string) => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    reducedMotion: false,
    fontSize: "medium",
    colorBlindMode: "none",
  })

  const [announcements, setAnnouncements] = useState<string[]>([])

  useEffect(() => {
    // Apply accessibility settings to document
    const root = document.documentElement

    if (settings.highContrast) {
      root.classList.add("high-contrast")
    } else {
      root.classList.remove("high-contrast")
    }

    if (settings.reducedMotion) {
      root.classList.add("reduced-motion")
    } else {
      root.classList.remove("reduced-motion")
    }

    root.classList.remove("font-small", "font-medium", "font-large")
    root.classList.add(`font-${settings.fontSize}`)

    root.classList.remove("colorblind-protanopia", "colorblind-deuteranopia", "colorblind-tritanopia")
    if (settings.colorBlindMode !== "none") {
      root.classList.add(`colorblind-${settings.colorBlindMode}`)
    }
  }, [settings])

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  const announceToScreenReader = (message: string) => {
    setAnnouncements((prev) => [...prev, message])
    setTimeout(() => {
      setAnnouncements((prev) => prev.slice(1))
    }, 1000)
  }

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings, announceToScreenReader }}>
      {children}

      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcements.map((announcement, index) => (
          <div key={index}>{announcement}</div>
        ))}
      </div>
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider")
  }
  return context
}
