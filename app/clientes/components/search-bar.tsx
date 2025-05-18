"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"

type SearchBarProps = {
  searchTerm: string
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  totalItems: number
  currentPage: number
  itemsPerPage: number
}

export default function SearchBar({
  searchTerm,
  onSearchChange,
  totalItems,
  currentPage,
  itemsPerPage,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 mb-8 transition-all duration-300 hover:shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className={`relative flex-1 transition-all duration-300 ${isFocused ? "transform -translate-y-1" : ""}`}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search
              size={20}
              className={`transition-colors duration-300 ${isFocused ? "text-[#333]" : "text-[#333]"}`}
            />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre, documento o email..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#333] transition-all duration-300 hover:border-gray-400 bg-white/90 text-gray-800"
            value={searchTerm}
            onChange={onSearchChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>

        <div>
          <p className="text-gray-800">
            Mostrando {totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} -{" "}
            {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} clientes
          </p>
        </div>
      </div>
    </div>
  )
}
