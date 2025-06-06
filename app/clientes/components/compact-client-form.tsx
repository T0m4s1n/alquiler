"use client"

import type React from "react"

import type { FormData, FormErrors } from "../types/client"
import { Plus, Check, User, Mail, Phone, Calendar, FileText, MapPin, AlertCircle, X } from "lucide-react"
import { useState } from "react"
import ErrorHistory, { type ErrorRecord } from "./error-history"

type ClientFormProps = {
  formData: FormData
  formErrors: FormErrors
  loading: boolean
  modalMode: "create" | "edit"
  apiError: string | null
  errorHistory: ErrorRecord[]
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onCancel: () => void
  onClearError: () => void
  onClearAllErrors: () => void
  onClearHistoryError: (id: string) => void
}

export default function CompactClientForm({
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
}: ClientFormProps) {
  // Estado para animaciones de focus
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
          {/* Nombre y Apellido en la misma fila */}
          <div
            className={`transition-all duration-300 transform ${
              focusedField === "nombre" ? "scale-[1.02] -translate-y-1" : ""
            }`}
          >
            <label className="block text-xs font-medium text-gray-700 mb-1">Nombre</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <User
                  size={16}
                  className={`text-gray-400 transition-colors ${focusedField === "nombre" ? "text-[#333]" : ""}`}
                />
              </div>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={onInputChange}
                onFocus={() => handleFocus("nombre")}
                onBlur={handleBlur}
                className={`w-full pl-8 pr-2 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 transition-all duration-300 text-gray-800 ${
                  formErrors.nombre
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-[#333] hover:border-gray-400"
                }`}
                placeholder="Nombre"
              />
            </div>
            {formErrors.nombre && <p className="mt-1 text-xs text-red-500 animate-fadeIn">{formErrors.nombre}</p>}
          </div>

          <div
            className={`transition-all duration-300 transform ${
              focusedField === "apellido" ? "scale-[1.02] -translate-y-1" : ""
            }`}
          >
            <label className="block text-xs font-medium text-gray-700 mb-1">Apellido</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <User
                  size={16}
                  className={`text-gray-400 transition-colors ${focusedField === "apellido" ? "text-[#333]" : ""}`}
                />
              </div>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={onInputChange}
                onFocus={() => handleFocus("apellido")}
                onBlur={handleBlur}
                className={`w-full pl-8 pr-2 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 transition-all duration-300 text-gray-800 ${
                  formErrors.apellido
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-[#333] hover:border-gray-400"
                }`}
                placeholder="Apellido"
              />
            </div>
            {formErrors.apellido && <p className="mt-1 text-xs text-red-500 animate-fadeIn">{formErrors.apellido}</p>}
          </div>

          {/* Documento y Email */}
          <div
            className={`transition-all duration-300 transform ${
              focusedField === "documento" ? "scale-[1.02] -translate-y-1" : ""
            }`}
          >
            <label className="block text-xs font-medium text-gray-700 mb-1">Documento</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <FileText
                  size={16}
                  className={`text-gray-400 transition-colors ${focusedField === "documento" ? "text-[#333]" : ""}`}
                />
              </div>
              <input
                type="text"
                name="documento"
                value={formData.documento}
                onChange={onInputChange}
                onFocus={() => handleFocus("documento")}
                onBlur={handleBlur}
                className={`w-full pl-8 pr-2 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 transition-all duration-300 text-gray-800 ${
                  formErrors.documento
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-[#333] hover:border-gray-400"
                }`}
                placeholder="Documento de identidad"
              />
            </div>
            {formErrors.documento && <p className="mt-1 text-xs text-red-500 animate-fadeIn">{formErrors.documento}</p>}
          </div>

          <div
            className={`transition-all duration-300 transform ${
              focusedField === "email" ? "scale-[1.02] -translate-y-1" : ""
            }`}
          >
            <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <Mail
                  size={16}
                  className={`text-gray-400 transition-colors ${focusedField === "email" ? "text-[#333]" : ""}`}
                />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onInputChange}
                onFocus={() => handleFocus("email")}
                onBlur={handleBlur}
                className={`w-full pl-8 pr-2 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 transition-all duration-300 text-gray-800 ${
                  formErrors.email
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-[#333] hover:border-gray-400"
                }`}
                placeholder="Email"
              />
            </div>
            {formErrors.email && <p className="mt-1 text-xs text-red-500 animate-fadeIn">{formErrors.email}</p>}
          </div>

          {/* Teléfono y Fecha de Nacimiento */}
          <div
            className={`transition-all duration-300 transform ${
              focusedField === "telefono" ? "scale-[1.02] -translate-y-1" : ""
            }`}
          >
            <label className="block text-xs font-medium text-gray-700 mb-1">Teléfono</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <Phone
                  size={16}
                  className={`text-gray-400 transition-colors ${focusedField === "telefono" ? "text-[#333]" : ""}`}
                />
              </div>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={onInputChange}
                onFocus={() => handleFocus("telefono")}
                onBlur={handleBlur}
                className={`w-full pl-8 pr-2 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 transition-all duration-300 text-gray-800 ${
                  formErrors.telefono
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-[#333] hover:border-gray-400"
                }`}
                placeholder="Teléfono"
              />
            </div>
            {formErrors.telefono && <p className="mt-1 text-xs text-red-500 animate-fadeIn">{formErrors.telefono}</p>}
          </div>

          <div
            className={`transition-all duration-300 transform ${
              focusedField === "fechaNacimiento" ? "scale-[1.02] -translate-y-1" : ""
            }`}
          >
            <label className="block text-xs font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <Calendar
                  size={16}
                  className={`text-gray-400 transition-colors ${
                    focusedField === "fechaNacimiento" ? "text-[#333]" : ""
                  }`}
                />
              </div>
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={onInputChange}
                onFocus={() => handleFocus("fechaNacimiento")}
                onBlur={handleBlur}
                className={`w-full pl-8 pr-2 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 transition-all duration-300 text-gray-800 ${
                  formErrors.fechaNacimiento
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-[#333] hover:border-gray-400"
                }`}
              />
            </div>
            {formErrors.fechaNacimiento && (
              <p className="mt-1 text-xs text-red-500 animate-fadeIn">{formErrors.fechaNacimiento}</p>
            )}
          </div>

          {/* Dirección (ocupa todo el ancho) */}
          <div
            className={`md:col-span-2 transition-all duration-300 transform ${
              focusedField === "direccion" ? "scale-[1.02] -translate-y-1" : ""
            }`}
          >
            <label className="block text-xs font-medium text-gray-700 mb-1">Dirección</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <MapPin
                  size={16}
                  className={`text-gray-400 transition-colors ${focusedField === "direccion" ? "text-[#333]" : ""}`}
                />
              </div>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={onInputChange}
                onFocus={() => handleFocus("direccion")}
                onBlur={handleBlur}
                className={`w-full pl-8 pr-2 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 transition-all duration-300 text-gray-800 ${
                  formErrors.direccion
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-[#333] hover:border-gray-400"
                }`}
                placeholder="Dirección completa"
              />
            </div>
            {formErrors.direccion && <p className="mt-1 text-xs text-red-500 animate-fadeIn">{formErrors.direccion}</p>}
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
                  Crear Cliente
                </>
              ) : (
                <>
                  <Check size={16} className="mr-1 animate-pulse" />
                  Actualizar Cliente
                </>
              )}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
