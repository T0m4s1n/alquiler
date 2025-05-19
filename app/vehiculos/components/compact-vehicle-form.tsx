"use client"

import type React from "react"

import type { FormData, FormErrors, VehicleType } from "../types/vehicle"
import {
  Plus,
  Check,
  Car,
  FileText,
  Calendar,
  Tag,
  DollarSign,
  AlertCircle,
  X,
  Paintbrush,
  FileTextIcon as FileText2,
} from "lucide-react"
import { useState } from "react"
import ErrorHistory, { type ErrorRecord } from "./error-history"

type VehicleFormProps = {
  formData: FormData
  formErrors: FormErrors
  loading: boolean
  modalMode: "create" | "edit"
  apiError: string | null
  errorHistory: ErrorRecord[]
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onCancel: () => void
  onClearError: () => void
  onClearAllErrors: () => void
  onClearHistoryError: (id: string) => void
}

const vehicleTypes: VehicleType[] = ["SEDAN", "SUV", "HATCHBACK", "PICKUP", "DEPORTIVO", "MINIVAN", "OTRO"]

export default function CompactVehicleForm({
  formData,
  formErrors,
  loading,
  modalMode,
  apiError,
  errorHistory,
  onInputChange,
  onSubmit,
  onCancel,
  onClearError,
  onClearAllErrors,
  onClearHistoryError,
}: VehicleFormProps) {
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName)
  }

  const handleBlur = () => {
    setFocusedField(null)
  }

  return (
    <form onSubmit={onSubmit} className="animate-fadeIn h-full flex flex-col">
      <div className="flex-grow overflow-auto pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Marca y Modelo en la misma fila */}
          <div
            className={`transition-all duration-300 transform ${
              focusedField === "marca" ? "scale-[1.02] -translate-y-1" : ""
            }`}
          >
            <label className="block text-xs font-medium text-gray-700 mb-1">Marca</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <Car
                  size={16}
                  className={`text-gray-400 transition-colors ${focusedField === "marca" ? "text-[#333]" : ""}`}
                />
              </div>
              <input
                type="text"
                name="marca"
                value={formData.marca}
                onChange={onInputChange}
                onFocus={() => handleFocus("marca")}
                onBlur={handleBlur}
                className={`w-full pl-8 pr-2 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 transition-all duration-300 text-gray-800 ${
                  formErrors.marca
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-[#333] hover:border-gray-400"
                }`}
                placeholder="Marca"
              />
            </div>
            {formErrors.marca && <p className="mt-1 text-xs text-red-500 animate-fadeIn">{formErrors.marca}</p>}
          </div>

          <div
            className={`transition-all duration-300 transform ${
              focusedField === "modelo" ? "scale-[1.02] -translate-y-1" : ""
            }`}
          >
            <label className="block text-xs font-medium text-gray-700 mb-1">Modelo</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <Car
                  size={16}
                  className={`text-gray-400 transition-colors ${focusedField === "modelo" ? "text-[#333]" : ""}`}
                />
              </div>
              <input
                type="text"
                name="modelo"
                value={formData.modelo}
                onChange={onInputChange}
                onFocus={() => handleFocus("modelo")}
                onBlur={handleBlur}
                className={`w-full pl-8 pr-2 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 transition-all duration-300 text-gray-800 ${
                  formErrors.modelo
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-[#333] hover:border-gray-400"
                }`}
                placeholder="Modelo"
              />
            </div>
            {formErrors.modelo && <p className="mt-1 text-xs text-red-500 animate-fadeIn">{formErrors.modelo}</p>}
          </div>

          {/* Matrícula y Año */}
          <div
            className={`transition-all duration-300 transform ${
              focusedField === "matricula" ? "scale-[1.02] -translate-y-1" : ""
            }`}
          >
            <label className="block text-xs font-medium text-gray-700 mb-1">Matrícula</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <FileText
                  size={16}
                  className={`text-gray-400 transition-colors ${focusedField === "matricula" ? "text-[#333]" : ""}`}
                />
              </div>
              <input
                type="text"
                name="matricula"
                value={formData.matricula}
                onChange={onInputChange}
                onFocus={() => handleFocus("matricula")}
                onBlur={handleBlur}
                className={`w-full pl-8 pr-2 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 transition-all duration-300 text-gray-800 ${
                  formErrors.matricula
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-[#333] hover:border-gray-400"
                }`}
                placeholder="Matrícula"
              />
            </div>
            {formErrors.matricula && <p className="mt-1 text-xs text-red-500 animate-fadeIn">{formErrors.matricula}</p>}
          </div>

          <div
            className={`transition-all duration-300 transform ${
              focusedField === "anio" ? "scale-[1.02] -translate-y-1" : ""
            }`}
          >
            <label className="block text-xs font-medium text-gray-700 mb-1">Año</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <Calendar
                  size={16}
                  className={`text-gray-400 transition-colors ${focusedField === "anio" ? "text-[#333]" : ""}`}
                />
              </div>
              <input
                type="number"
                name="anio"
                value={formData.anio}
                onChange={onInputChange}
                onFocus={() => handleFocus("anio")}
                onBlur={handleBlur}
                min="1900"
                max={new Date().getFullYear() + 1}
                className={`w-full pl-8 pr-2 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 transition-all duration-300 text-gray-800 ${
                  formErrors.anio
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-[#333] hover:border-gray-400"
                }`}
                placeholder="Año"
              />
            </div>
            {formErrors.anio && <p className="mt-1 text-xs text-red-500 animate-fadeIn">{formErrors.anio}</p>}
          </div>

          {/* Tipo y Color */}
          <div
            className={`transition-all duration-300 transform ${
              focusedField === "tipo" ? "scale-[1.02] -translate-y-1" : ""
            }`}
          >
            <label className="block text-xs font-medium text-gray-700 mb-1">Tipo</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <Tag
                  size={16}
                  className={`text-gray-400 transition-colors ${focusedField === "tipo" ? "text-[#333]" : ""}`}
                />
              </div>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={onInputChange}
                onFocus={() => handleFocus("tipo")}
                onBlur={handleBlur}
                className={`w-full pl-8 pr-2 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 transition-all duration-300 text-gray-800 ${
                  formErrors.tipo
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-[#333] hover:border-gray-400"
                }`}
              >
                {vehicleTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            {formErrors.tipo && <p className="mt-1 text-xs text-red-500 animate-fadeIn">{formErrors.tipo}</p>}
          </div>

          <div
            className={`transition-all duration-300 transform ${
              focusedField === "color" ? "scale-[1.02] -translate-y-1" : ""
            }`}
          >
            <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <Paintbrush
                  size={16}
                  className={`text-gray-400 transition-colors ${focusedField === "color" ? "text-[#333]" : ""}`}
                />
              </div>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={onInputChange}
                onFocus={() => handleFocus("color")}
                onBlur={handleBlur}
                className={`w-full pl-8 pr-2 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 transition-all duration-300 text-gray-800 ${
                  formErrors.color
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-[#333] hover:border-gray-400"
                }`}
                placeholder="Color"
              />
            </div>
            {formErrors.color && <p className="mt-1 text-xs text-red-500 animate-fadeIn">{formErrors.color}</p>}
          </div>

          {/* Precio y Disponibilidad */}
          <div
            className={`transition-all duration-300 transform ${
              focusedField === "precioPorDia" ? "scale-[1.02] -translate-y-1" : ""
            }`}
          >
            <label className="block text-xs font-medium text-gray-700 mb-1">Precio por día</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <DollarSign
                  size={16}
                  className={`text-gray-400 transition-colors ${focusedField === "precioPorDia" ? "text-[#333]" : ""}`}
                />
              </div>
              <input
                type="number"
                name="precioPorDia"
                value={formData.precioPorDia}
                onChange={onInputChange}
                onFocus={() => handleFocus("precioPorDia")}
                onBlur={handleBlur}
                min="0"
                step="0.01"
                className={`w-full pl-8 pr-2 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 transition-all duration-300 text-gray-800 ${
                  formErrors.precioPorDia
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-[#333] hover:border-gray-400"
                }`}
                placeholder="Precio por día"
              />
            </div>
            {formErrors.precioPorDia && (
              <p className="mt-1 text-xs text-red-500 animate-fadeIn">{formErrors.precioPorDia}</p>
            )}
          </div>

          <div
            className={`transition-all duration-300 transform ${
              focusedField === "disponible" ? "scale-[1.02] -translate-y-1" : ""
            }`}
          >
            <label className="block text-xs font-medium text-gray-700 mb-1">Disponibilidad</label>
            <div className="relative flex items-center mt-2">
              <input
                type="checkbox"
                name="disponible"
                checked={formData.disponible}
                onChange={onInputChange}
                onFocus={() => handleFocus("disponible")}
                onBlur={handleBlur}
                className="h-4 w-4 text-[#333] border-gray-300 rounded focus:ring-[#333] mr-2"
              />
              <label htmlFor="disponible" className="text-sm text-gray-700">
                Disponible para alquiler
              </label>
            </div>
          </div>

          {/* Descripción (ocupa todo el ancho) */}
          <div
            className={`md:col-span-2 transition-all duration-300 transform ${
              focusedField === "descripcion" ? "scale-[1.02] -translate-y-1" : ""
            }`}
          >
            <label className="block text-xs font-medium text-gray-700 mb-1">Descripción</label>
            <div className="relative">
              <div className="absolute top-2 left-2 pointer-events-none">
                <FileText2
                  size={16}
                  className={`text-gray-400 transition-colors ${focusedField === "descripcion" ? "text-[#333]" : ""}`}
                />
              </div>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={onInputChange}
                onFocus={() => handleFocus("descripcion")}
                onBlur={handleBlur}
                rows={3}
                className={`w-full pl-8 pr-2 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 transition-all duration-300 text-gray-800 ${
                  formErrors.descripcion
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-[#333] hover:border-gray-400"
                }`}
                placeholder="Descripción del vehículo"
              />
            </div>
            {formErrors.descripcion && (
              <p className="mt-1 text-xs text-red-500 animate-fadeIn">{formErrors.descripcion}</p>
            )}
          </div>
        </div>
      </div>

      {/* Sección de errores */}
      <div className="mt-2 mb-2 space-y-2">
        {/* Mensaje de error actual */}
        {apiError && (
          <div className="bg-red-50 border border-red-200 rounded-md animate-fadeIn">
            <div className="flex items-start p-3">
              <AlertCircle size={18} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Error al procesar la solicitud</p>
                <p className="text-xs text-red-600 mt-1">{apiError}</p>
              </div>
              <button
                type="button"
                onClick={onClearError}
                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Historial de errores */}
        {errorHistory.length > 0 && (
          <ErrorHistory errors={errorHistory} onClearAll={onClearAllErrors} onClearError={onClearHistoryError} />
        )}
      </div>

      <div className="mt-auto flex justify-end space-x-3 pt-3 pb-1 bg-white border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full text-sm transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 active:translate-y-0 active:shadow-none"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#333] hover:bg-gray-700 text-white rounded-full text-sm transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 active:translate-y-0 active:shadow-none flex items-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              {modalMode === "create" ? "Creando..." : "Actualizando..."}
            </>
          ) : (
            <>
              {modalMode === "create" ? (
                <>
                  <Plus size={16} className="mr-1 animate-pulse" />
                  Crear Vehículo
                </>
              ) : (
                <>
                  <Check size={16} className="mr-1 animate-pulse" />
                  Actualizar Vehículo
                </>
              )}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
