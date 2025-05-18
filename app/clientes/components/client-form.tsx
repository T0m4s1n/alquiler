"use client"

import type React from "react"

import type { FormData, FormErrors } from "../types/client"
import { Plus, Check } from "lucide-react"

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
  return (
    <form onSubmit={onSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={onInputChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              formErrors.nombre ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-[#333]"
            }`}
            placeholder="Ingrese el nombre"
          />
          {formErrors.nombre && <p className="mt-1 text-sm text-red-500">{formErrors.nombre}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={onInputChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              formErrors.apellido ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-[#333]"
            }`}
            placeholder="Ingrese el apellido"
          />
          {formErrors.apellido && <p className="mt-1 text-sm text-red-500">{formErrors.apellido}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Documento</label>
          <input
            type="text"
            name="documento"
            value={formData.documento}
            onChange={onInputChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              formErrors.documento ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-[#333]"
            }`}
            placeholder="Ingrese el documento de identidad"
          />
          {formErrors.documento && <p className="mt-1 text-sm text-red-500">{formErrors.documento}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onInputChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              formErrors.email ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-[#333]"
            }`}
            placeholder="Ingrese el email"
          />
          {formErrors.email && <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={onInputChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              formErrors.telefono ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-[#333]"
            }`}
            placeholder="Ingrese el teléfono"
          />
          {formErrors.telefono && <p className="mt-1 text-sm text-red-500">{formErrors.telefono}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
          <input
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={onInputChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              formErrors.fechaNacimiento ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-[#333]"
            }`}
          />
          {formErrors.fechaNacimiento && <p className="mt-1 text-sm text-red-500">{formErrors.fechaNacimiento}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={onInputChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              formErrors.direccion ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-[#333]"
            }`}
            placeholder="Ingrese la dirección"
          />
          {formErrors.direccion && <p className="mt-1 text-sm text-red-500">{formErrors.direccion}</p>}
        </div>
      </div>

      <div className="mt-8 flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full transition-all duration-300"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-[#333] hover:bg-gray-700 text-white rounded-full transition-all duration-300 flex items-center"
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
                  <Plus size={18} className="mr-2" />
                  Crear Cliente
                </>
              ) : (
                <>
                  <Check size={18} className="mr-2" />
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
