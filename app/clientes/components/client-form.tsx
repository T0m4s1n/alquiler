"use client"

import type React from "react"

import type { FormData, FormErrors } from "../types/client"
import { Plus, Check, User, Mail, Phone, Calendar, FileText, MapPin } from "lucide-react"
import { useState } from "react"

type ClientFormProps = {
  formData: FormData
  formErrors: FormErrors
  loading: boolean
  modalMode: "create" | "edit"
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onCancel: () => void
}

export default function ClientForm({
  formData,
  formErrors,
  loading,
  modalMode,
  onInputChange,
  onSubmit,
  onCancel,
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
    <form onSubmit={onSubmit} className="animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombre */}
        <div
          className={`transition-all duration-300 transform ${
            focusedField === "nombre" ? "scale-[1.02] -translate-y-1" : ""
          }`}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User
                size={18}
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
              className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-300 ${
                formErrors.nombre
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-[#333] hover:border-gray-400"
              }`}
              placeholder="Ingrese el nombre"
            />
          </div>
          {formErrors.nombre && <p className="mt-1 text-sm text-red-500 animate-fadeIn">{formErrors.nombre}</p>}
        </div>

        {/* Apellido */}
        <div
          className={`transition-all duration-300 transform ${
            focusedField === "apellido" ? "scale-[1.02] -translate-y-1" : ""
          }`}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User
                size={18}
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
              className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-300 ${
                formErrors.apellido
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-[#333] hover:border-gray-400"
              }`}
              placeholder="Ingrese el apellido"
            />
          </div>
          {formErrors.apellido && <p className="mt-1 text-sm text-red-500 animate-fadeIn">{formErrors.apellido}</p>}
        </div>

        {/* Documento */}
        <div
          className={`transition-all duration-300 transform ${
            focusedField === "documento" ? "scale-[1.02] -translate-y-1" : ""
          }`}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">Documento</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FileText
                size={18}
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
              className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-300 ${
                formErrors.documento
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-[#333] hover:border-gray-400"
              }`}
              placeholder="Ingrese el documento de identidad"
            />
          </div>
          {formErrors.documento && <p className="mt-1 text-sm text-red-500 animate-fadeIn">{formErrors.documento}</p>}
        </div>

        {/* Email */}
        <div
          className={`transition-all duration-300 transform ${
            focusedField === "email" ? "scale-[1.02] -translate-y-1" : ""
          }`}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail
                size={18}
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
              className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-300 ${
                formErrors.email
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-[#333] hover:border-gray-400"
              }`}
              placeholder="Ingrese el email"
            />
          </div>
          {formErrors.email && <p className="mt-1 text-sm text-red-500 animate-fadeIn">{formErrors.email}</p>}
        </div>

        {/* Teléfono */}
        <div
          className={`transition-all duration-300 transform ${
            focusedField === "telefono" ? "scale-[1.02] -translate-y-1" : ""
          }`}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone
                size={18}
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
              className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-300 ${
                formErrors.telefono
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-[#333] hover:border-gray-400"
              }`}
              placeholder="Ingrese el teléfono"
            />
          </div>
          {formErrors.telefono && <p className="mt-1 text-sm text-red-500 animate-fadeIn">{formErrors.telefono}</p>}
        </div>

        {/* Fecha de Nacimiento */}
        <div
          className={`transition-all duration-300 transform ${
            focusedField === "fechaNacimiento" ? "scale-[1.02] -translate-y-1" : ""
          }`}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar
                size={18}
                className={`text-gray-400 transition-colors ${focusedField === "fechaNacimiento" ? "text-[#333]" : ""}`}
              />
            </div>
            <input
              type="date"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={onInputChange}
              onFocus={() => handleFocus("fechaNacimiento")}
              onBlur={handleBlur}
              className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-300 ${
                formErrors.fechaNacimiento
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-[#333] hover:border-gray-400"
              }`}
            />
          </div>
          {formErrors.fechaNacimiento && (
            <p className="mt-1 text-sm text-red-500 animate-fadeIn">{formErrors.fechaNacimiento}</p>
          )}
        </div>

        {/* Dirección */}
        <div
          className={`transition-all duration-300 transform ${
            focusedField === "direccion" ? "scale-[1.02] -translate-y-1" : ""
          }`}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin
                size={18}
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
              className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-300 ${
                formErrors.direccion
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-[#333] hover:border-gray-400"
              }`}
              placeholder="Ingrese la dirección"
            />
          </div>
          {formErrors.direccion && <p className="mt-1 text-sm text-red-500 animate-fadeIn">{formErrors.direccion}</p>}
        </div>
      </div>

      <div className="mt-4 flex justify-end space-x-4 sticky bottom-0 pt-2 pb-2 bg-white border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 active:translate-y-0 active:shadow-none"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#333] hover:bg-gray-700 text-white rounded-full transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 active:translate-y-0 active:shadow-none flex items-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              {modalMode === "create" ? "Creando..." : "Actualizando..."}
            </>
          ) : (
            <>
              {modalMode === "create" ? (
                <>
                  <Plus size={18} className="mr-2 animate-pulse" />
                  Crear Cliente
                </>
              ) : (
                <>
                  <Check size={18} className="mr-2 animate-pulse" />
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
