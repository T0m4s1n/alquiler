"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  isSearchActive: boolean // Nueva prop para saber si hay búsqueda activa
}

export default function Pagination({ currentPage, totalPages, onPageChange, isSearchActive }: PaginationProps) {
  const [hoveredPage, setHoveredPage] = useState<number | null>(null)

  // Si hay una búsqueda activa, no mostramos la paginación
  if (isSearchActive) {
    return null;
  }

  return (
    <div className="flex justify-between items-center mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center px-4 py-2 rounded-md transition-all duration-300 ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300 transform hover:-translate-x-1 hover:shadow-md active:translate-x-0 active:shadow-none"
        }`}
      >
        <ChevronLeft size={18} className="mr-1 transition-transform duration-300 group-hover:-translate-x-1" />
        Anterior
      </button>

      <div className="hidden md:flex space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((page) => {
            if (totalPages <= 5) return true
            return page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)
          })
          .map((page, index, array) => {
            // Add ellipsis
            if (index > 0 && page - array[index - 1] > 1) {
              return [
                <span key={`ellipsis-${page}`} className="px-3 py-2">
                  ...
                </span>,
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  onMouseEnter={() => setHoveredPage(page)}
                  onMouseLeave={() => setHoveredPage(null)}
                  className={`w-10 h-10 rounded-full transition-all duration-300 ${
                    currentPage === page
                      ? "bg-[#333] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 transform hover:scale-110 hover:shadow-md active:scale-100 active:shadow-none"
                  } ${hoveredPage === page ? "animate-pulse" : ""}`}
                >
                  {page}
                </button>,
              ]
            }
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                onMouseEnter={() => setHoveredPage(page)}
                onMouseLeave={() => setHoveredPage(null)}
                className={`w-10 h-10 rounded-full transition-all duration-300 ${
                  currentPage === page
                    ? "bg-[#333] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 transform hover:scale-110 hover:shadow-md active:scale-100 active:shadow-none"
                } ${hoveredPage === page ? "animate-pulse" : ""}`}
              >
                {page}
              </button>
            )
          })}
      </div>

      <div className="md:hidden">
        <span>
          Página {currentPage} de {totalPages}
        </span>
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center px-4 py-2 rounded-md transition-all duration-300 ${
          currentPage === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300 transform hover:translate-x-1 hover:shadow-md active:translate-x-0 active:shadow-none"
        }`}
      >
        Siguiente
        <ChevronRight size={18} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
      </button>
    </div>
  )
}