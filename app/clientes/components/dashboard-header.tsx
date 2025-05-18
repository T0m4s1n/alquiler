"use client"

import { UserCircle, Award, Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"

type DashboardHeaderProps = {
  showTopClients: boolean
  toggleTopClients: () => void
  openCreateModal: () => void
}

export default function DashboardHeader({ showTopClients, toggleTopClients, openCreateModal }: DashboardHeaderProps) {
  return (
    <header className="bg-[#333] text-white py-6 px-8 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <UserCircle size={40} />
          <h1 className="text-3xl font-light uppercase tracking-wide">Gestión de Clientes</h1>
        </div>

        <div className="flex space-x-4">
          <Link href="/" className="px-4 py-2 bg-transparent border border-white text-white hover:bg-white hover:text-[#333] rounded-full transition-all duration-300 text-sm font-medium flex items-center space-x-2">
            <ArrowLeft size={16} />
            <span>Volver</span>
          </Link>
          
          <button
            onClick={toggleTopClients}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
              showTopClients
                ? "bg-white text-[#333] hover:bg-gray-200"
                : "bg-transparent border border-white text-white hover:bg-white hover:text-[#333]"
            }`}
          >
            <Award size={16} />
            <span>Top Clientes</span>
          </button>

          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-white hover:bg-gray-200 text-[#333] rounded-full transition-all duration-300 uppercase tracking-wider text-sm font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Nuevo Cliente</span>
          </button>
        </div>
      </div>
    </header>
  )
}