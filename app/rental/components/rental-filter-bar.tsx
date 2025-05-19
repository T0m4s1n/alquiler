"use client"

import type React from "react"

import { useState } from "react"
import { Filter, X, Search, Calendar } from "lucide-react"
import type { FilterOption, RentalStatus } from "../types/rental"

export type FilterType = string;

type RentalFilterBarProps = {
  onFilter: (filterType: FilterType, filterValue: string) => void
  onClearFilter: () => void
  isFiltering: boolean
}

const filterOptions: FilterOption[] = [
  { value: "all", label: "Todos" },
  { value: "cliente", label: "Cliente" },
  { value: "vehiculo", label: "Vehículo" },
  { value: "estado", label: "Estado" },
  { value: "fecha", label: "Fecha" },
]

const statusOptions: { value: RentalStatus; label: string }[] = [
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "ACTIVO", label: "Activo" },
  { value: "COMPLETADO", label: "Completado" },
  { value: "CANCELADO", label: "Cancelado" },
]

export default function RentalFilterBar({ onFilter, onClearFilter, isFiltering }: RentalFilterBarProps) {
  const [filterType, setFilterType] = useState<FilterType>("all")
  const [filterValue, setFilterValue] = useState("")
  const [dateFilterType, setDateFilterType] = useState<"inicio" | "fin">("inicio")
  const [isFocused, setIsFocused] = useState(false)

  const handleFilterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilterType = e.target.value as FilterType
    setFilterType(newFilterType)
    setFilterValue("")
  }

  const handleFilterValueChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilterValue(e.target.value)
  }

  const handleDateFilterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDateFilterType(e.target.value as "inicio" | "fin")
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onFilter(filterType, filterValue)
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 mb-4 transition-all duration-300 hover:shadow-lg">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row md:items-end gap-4">
        <div className={`flex-1 transition-all duration-300 ${isFocused ? "transform -translate-y-1" : ""}`}>
          <label htmlFor="filterType" className="block text-sm font-medium text-gray-700 mb-1">
            Filtrar por
          </label>
          <select
            id="filterType"
            value={filterType}
            onChange={handleFilterTypeChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#333] transition-all duration-300 hover:border-gray-400 bg-white/90 text-gray-800"
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {filterType === "estado" && (
          <div className={`flex-1 transition-all duration-300 ${isFocused ? "transform -translate-y-1" : ""}`}>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              id="statusFilter"
              value={filterValue}
              onChange={handleFilterValueChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#333] transition-all duration-300 hover:border-gray-400 bg-white/90 text-gray-800"
            >
              <option value="">Seleccione un estado</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {filterType === "fecha" && (
          <>
            <div className={`flex-1 transition-all duration-300 ${isFocused ? "transform -translate-y-1" : ""}`}>
              <label htmlFor="dateFilterType" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de fecha
              </label>
              <select
                id="dateFilterType"
                value={dateFilterType}
                onChange={handleDateFilterTypeChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#333] transition-all duration-300 hover:border-gray-400 bg-white/90"
              >
                <option value="inicio">Fecha de inicio</option>
                <option value="fin">Fecha de fin</option>
              </select>
            </div>

            <div className={`flex-1 transition-all duration-300 ${isFocused ? "transform -translate-y-1" : ""}`}>
              <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={18} className={`text-gray-400 transition-colors ${isFocused ? "text-[#333]" : ""}`} />
                </div>
                <input
                  id="dateFilter"
                  type="date"
                  value={filterValue}
                  onChange={handleFilterValueChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#333] transition-all duration-300 hover:border-gray-400 bg-white/90"
                />
              </div>
            </div>
          </>
        )}

        {(filterType === "cliente" || filterType === "vehiculo") && (
          <div className={`flex-1 transition-all duration-300 ${isFocused ? "transform -translate-y-1" : ""}`}>
            <label htmlFor="filterValue" className="block text-sm font-medium text-gray-700 mb-1">
              {filterType === "cliente" ? "Cliente" : "Vehículo"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className={`text-gray-400 transition-colors ${isFocused ? "text-[#333]" : ""}`} />
              </div>
              <input
                id="filterValue"
                type="text"
                value={filterValue}
                onChange={handleFilterValueChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={`Ingrese ${
                  filterType === "cliente" ? "nombre o ID del cliente" : "detalles o ID del vehículo"
                }`}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#333] transition-all duration-300 hover:border-gray-400 bg-white/90"
              />
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <button
            type="submit"
            className="px-4 py-3 bg-[#333] text-white rounded-md hover:bg-gray-700 transition-all duration-300 flex items-center transform hover:-translate-y-1 hover:shadow-md active:translate-y-0 active:shadow-none"
            disabled={filterType === "all" || (filterType !== "all" && !filterValue.trim())}
          >
            <Filter size={16} className="mr-2 transition-transform duration-300 hover:rotate-12" />
            Aplicar Filtro
          </button>

          {isFiltering && (
            <button
              type="button"
              onClick={onClearFilter}
              className="px-4 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all duration-300 flex items-center transform hover:-translate-y-1 hover:shadow-md active:translate-y-0 active:shadow-none"
            >
              <X size={16} className="mr-2 transition-transform duration-300 hover:rotate-90" />
              Limpiar
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
