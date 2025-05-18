"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex justify-between items-center mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center px-4 py-2 rounded-md ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        <ChevronLeft size={18} className="mr-1" />
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
                  className={`w-10 h-10 rounded-full ${
                    currentPage === page ? "bg-[#333] text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {page}
                </button>,
              ]
            }
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-10 h-10 rounded-full ${
                  currentPage === page ? "bg-[#333] text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
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
        className={`flex items-center px-4 py-2 rounded-md ${
          currentPage === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        Siguiente
        <ChevronRight size={18} className="ml-1" />
      </button>
    </div>
  )
}
