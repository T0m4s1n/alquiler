"use client"

import { useState } from "react"
import { Car } from "lucide-react"

type VehicleAvatarProps = {
  marca: string
  modelo: string
  tipo: string
  size?: "sm" | "md" | "lg"
}

export default function VehicleAvatar({ marca, modelo, tipo, size = "md" }: VehicleAvatarProps) {
  const [isHovered, setIsHovered] = useState(false)

  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-10 w-10",
    lg: "h-16 w-16 text-xl",
  }

  // Determinar el color de fondo según el tipo de vehículo
  const getBgColor = () => {
    switch (tipo) {
      case "SEDAN":
        return "bg-blue-600"
      case "SUV":
        return "bg-green-600"
      case "HATCHBACK":
        return "bg-purple-600"
      case "PICKUP":
        return "bg-orange-600"
      case "DEPORTIVO":
        return "bg-red-600"
      case "MINIVAN":
        return "bg-yellow-600"
      default:
        return "bg-[#333]"
    }
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full ${getBgColor()} text-white flex items-center justify-center overflow-hidden relative transition-all duration-300 ${isHovered ? "shadow-lg" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`transition-transform duration-300 ${isHovered ? "scale-110" : ""}`}>
        <Car size={size === "lg" ? 28 : 18} />
      </div>
      <div
        className={`absolute inset-0 bg-white opacity-0 transition-opacity duration-300 ${isHovered ? "opacity-10" : ""}`}
      ></div>
    </div>
  )
}
