"use client"

import { useState } from "react"

type ClientAvatarProps = {
  nombre: string
  apellido: string
  size?: "sm" | "md" | "lg"
}

export default function ClientAvatar({ nombre, apellido, size = "md" }: ClientAvatarProps) {
  const [isHovered, setIsHovered] = useState(false)

  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-10 w-10",
    lg: "h-16 w-16 text-xl",
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-[#333] text-white flex items-center justify-center overflow-hidden relative transition-all duration-300 ${isHovered ? "shadow-lg" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`transition-transform duration-300 ${isHovered ? "scale-110" : ""}`}>
        {nombre.charAt(0)}
        {apellido.charAt(0)}
      </div>
      <div
        className={`absolute inset-0 bg-white opacity-0 transition-opacity duration-300 ${isHovered ? "opacity-10" : ""}`}
      ></div>
    </div>
  )
}
