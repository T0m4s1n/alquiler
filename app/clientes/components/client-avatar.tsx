"use client"

type ClientAvatarProps = {
  nombre: string
  apellido: string
  size?: "sm" | "md" | "lg"
}

export default function ClientAvatar({ nombre, apellido, size = "md" }: ClientAvatarProps) {
  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-10 w-10",
    lg: "h-16 w-16 text-xl",
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-[#333] text-white flex items-center justify-center`}>
      {nombre.charAt(0)}
      {apellido.charAt(0)}
    </div>
  )
}
