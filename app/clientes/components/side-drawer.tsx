"use client"

import type React from "react"
import { X } from "lucide-react"
import { useEffect } from "react"

type SideDrawerProps = {
  show: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
}

export default function SideDrawer({ show, title, onClose, children }: SideDrawerProps) {
  // Altura estimada del header
  const headerHeight = "28px" // Ajusta este valor según la altura real de tu header

  // Prevenir scroll del body cuando el drawer está abierto
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [show])

  return (
    <>
      {/* Overlay completamente transparente que solo captura clics */}
      {show && (
        <div
          className="fixed inset-0 z-40"
          onClick={onClose}
          aria-hidden="true"
          style={{ backdropFilter: "blur(0px)" }}
        ></div>
      )}

      {/* Drawer lateral con animaciones mejoradas - ahora debajo del header */}
      <div
        className={`fixed left-0 bottom-0 w-full md:w-[450px] lg:w-[550px] bg-white shadow-2xl z-50 transform transition-all duration-700 ease-in-out rounded-tr-2xl ${
          show ? "translate-x-0" : "-translate-x-full"
        } overflow-hidden`}
        style={{
          top: `calc(${headerHeight} + 60px)`, // Aumentar a 60px de espacio después del header
          boxShadow: show ? "0 0 50px rgba(0, 0, 0, 0.2)" : "none",
          height: `calc(100vh - ${headerHeight} - 80px)`, // Altura fija en lugar de maxHeight
        }}
      >
        {/* Header del drawer con animación */}
        <div className="bg-[#333] text-white px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-medium relative overflow-hidden group">
            {title}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-700 transition-all duration-300 transform hover:rotate-90 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido del drawer con animación de entrada */}
        <div
          className={`p-4 transition-opacity duration-500 ease-out ${show ? "opacity-100 delay-200" : "opacity-0"} overflow-auto`}
          style={{ height: "calc(100% - 57px)" }} // 57px es la altura del header del drawer
        >
          {children}
        </div>
      </div>
    </>
  )
}
