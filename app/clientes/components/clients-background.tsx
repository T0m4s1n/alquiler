"use client"

import React from "react"
import {
  User,
  Users,
  UserCircle,
  Mail,
  Phone,
  FileText,
  Home,
  Calendar,
  CreditCard,
  Briefcase,
  UserCheck,
  UserPlus,
  UserX,
  Heart,
  Star,
} from "lucide-react"

interface ClientsBackgroundProps {
  iconCount?: number
  zIndex?: number
  className?: string
}

export default function ClientsBackground({ iconCount = 650, zIndex = -1, className = "" }: ClientsBackgroundProps) {
  const icons = React.useMemo(
    () => [
      User,
      Users,
      UserCircle,
      Mail,
      Phone,
      FileText,
      Home,
      Calendar,
      CreditCard,
      Briefcase,
      UserCheck,
      UserPlus,
      UserX,
      Heart,
      Star,
    ],
    [],
  )

  const generateIcons = React.useCallback(() => {
    const iconElements = []

    for (let i = 0; i < iconCount; i++) {
      const IconComponent = icons[Math.floor(Math.random() * icons.length)]
      const size = Math.floor(Math.random() * 16) + 12
      // Aumentamos la opacidad para que sea más visible
      const opacity = Math.random() * 0.12 + 0.05
      const rotation = Math.random() * 360
      const top = `${Math.random() * 100}%`
      const left = `${Math.random() * 100}%`

      iconElements.push(
        <section
          key={i}
          className="absolute"
          style={{
            top,
            left,
            transform: `rotate(${rotation}deg)`,
            opacity,
          }}
        >
          <IconComponent size={size} className="text-[#333]" />
        </section>,
      )
    }

    return iconElements
  }, [icons, iconCount])

  const [iconsToRender] = React.useState(() => generateIcons())

  return (
    <section
      className={`fixed inset-0 w-full h-full overflow-hidden pointer-events-none ${className}`}
      style={{
        zIndex,
      }}
      aria-hidden="true"
    >
      {iconsToRender}
    </section>
  )
}
