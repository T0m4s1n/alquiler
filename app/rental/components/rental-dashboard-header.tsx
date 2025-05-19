"use client"

import { Calendar, Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"

type DashboardHeaderProps = {
  showCalendar: boolean
  toggleCalendar: () => void
  openCreateModal: () => void
}

export default function RentalDashboardHeader({ showCalendar, toggleCalendar, openCreateModal }: DashboardHeaderProps) {
  return (
    <header className="bg-[#333] text-white py-6 px-8 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* Botón de volver */}
          <Link
            href="/"
            className="mr-2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center"
            title="Volver al inicio"
          >
            <ArrowLeft size={20} className="text-white transition-transform duration-300 hover:-translate-x-1" />
          </Link>

          <div className="flex items-center space-x-4 group">
            <div className="relative overflow-hidden">
              <Calendar
                size={40}
                className="transition-transform duration-500 transform group-hover:rotate-12 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-white rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </div>
            <h1 className="text-3xl font-light uppercase tracking-wide relative">
              Gestión de Alquileres
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-500 group-hover:w-full"></span>
            </h1>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={toggleCalendar}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center space-x-2 overflow-hidden relative ${
              showCalendar
                ? "bg-white text-[#333] hover:bg-gray-200"
                : "bg-transparent border border-white text-white hover:bg-white hover:text-[#333]"
            }`}
          >
            <Calendar size={16} className="transition-transform duration-300 transform hover:scale-110" />
            <span>Vista Calendario</span>
            <span className="absolute bottom-0 left-0 w-full h-0 bg-gray-200 transition-all duration-300 group-hover:h-full -z-10"></span>
          </button>

          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-white hover:bg-gray-200 text-[#333] rounded-full transition-all duration-300 uppercase tracking-wider text-sm font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 active:shadow-lg flex items-center space-x-2 overflow-hidden relative"
          >
            <Plus size={16} className="transition-transform duration-300 transform hover:rotate-90" />
            <span>Nuevo Alquiler</span>
            <span className="absolute inset-0 bg-gray-300 opacity-0 hover:opacity-10 transition-opacity duration-300"></span>
          </button>
        </div>
      </div>
    </header>
  )
}
