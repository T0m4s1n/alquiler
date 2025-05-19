"use client"

import { UserCircle } from "lucide-react"

type EmptyStateProps = {
  searchTerm: string
  onClearSearch: () => void
}

export default function EmptyState({ searchTerm, onClearSearch }: EmptyStateProps) {
  return (
    <div className="text-center py-10">
      <UserCircle size={48} className="mx-auto text-gray-400 mb-4" />
      <p className="text-lg text-gray-500">No se encontraron clientes</p>
      {searchTerm && (
        <button onClick={onClearSearch} className="mt-4 px-4 py-2 bg-[#333] text-white rounded-full">
          Limpiar búsqueda
        </button>
      )}
    </div>
  )
}
