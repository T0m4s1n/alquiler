"use client"

import type React from "react"

import type { RentalFormData, RentalFormErrors } from "../types/rental"
import type { Client } from "../types/client"
import type { Vehicle } from "../types/vehicle"
import { Plus, Check, Calendar, FileText, User, Car, AlertCircle, X } from "lucide-react"
import { useState, useEffect } from "react"
import ErrorHistory, { type ErrorRecord } from "./error-history"

type RentalFormProps = {
  formData: RentalFormData
  formErrors: RentalFormErrors
  loading: boolean
  modalMode: "create" | "edit"
  apiError: string | null
  errorHistory: ErrorRecord[]
  clients: Client[]
  vehicles: Vehicle[]
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onCancel: () => void
  onClearError: () => void
  onClearAllErrors: () => void
  onClearHistoryError: (id: string) => void
}

export default function RentalForm({
  formData,
  formErrors,
  loading,
  modalMode,
  apiError,
  errorHistory,
  clients,
  vehicles,
  onInputChange,
  onSubmit,
  onCancel,
  onClearError,
  onClearAllErrors,
  onClearHistoryError,
}: RentalFormProps) {
  // Estado para animaciones de focus
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([])

  // Filtrar vehículos disponibles
  useEffect(() => {
    setAvailableVehicles(vehicles.filter((v) => v.disponible))
  }, [vehicles])

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName)
  }

  const handleBlur = () => {
    setFocusedField(null)
  }

  // Calcular el costo total estimado
  const calculateEstimatedCost = () => {
    if (!formData.fechaInicio || !formData.fechaFin || !formData.vehiculoId) return 0

    const selectedVehicle = vehicles.find((v) => v.id === formData.vehiculoId)
    if (!selectedVehicle) return 0

    const startDate = new Date(formData.fechaInicio)
    const endDate = new Date(formData.fechaFin)
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    return days * selectedVehicle.precioPorDia
  }

  const estimatedCost = calculateEstimatedCost()

  return (
    <form onSubmit={onSubmit} className="animate-fadeIn h-full flex flex-col">
      <div className="flex-grow overflow-auto pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Cliente */}
          <div
            className={`md:col-span-2 transition-all duration-300 transform ${
              focusedField === "clienteId" ? "scale-[1.02] -translate-y-1" : ""
            }`}
          >
            <label className="block text-xs font-medium text-gray-700 mb-1">Cliente</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <User
                  size={16}
                  className={`text-gray-400 transition-colors ${focusedField === "clienteId" ? "text-[#333]" : ""}`}
                />
              </div>
              <select
                name="clienteId"
                value={formData.clienteId}
                onChange={onInputChange}
                onFocus={() => handleFocus("clienteId")}
                onBlur={handleBlur}
                className={`w-full pl-8 pr-2 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 transition-all duration-300 text-gray-800 ${
                  formErrors.clienteId
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-[#333] hover:border-gray-400"
                }`}
              >
                <option value={0}>Seleccione un cliente</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.nombre} {client.apellido} - {client.documento}
                  </option>
                ))}
              </select>
            </div>
            {formErrors.clienteId && <p className="mt-1 text-xs text-red-500 animate-fadeIn">{formErrors.clienteId}</p>}
          </div>

          {/* Vehículo */}
          <div
            className={`md:col-span-2 transition-all duration-300 transform ${
              focusedField === "vehiculoId" ? "scale-[1.02] -translate-y-1" : ""
            }`}
          >
            <label className="block text-xs font-medium text-gray-700 mb-1">Vehículo</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <Car
                  size={16}
                  className={`text-gray-400 transition-colors ${focusedField === "vehiculoId" ? "text-[#333]" : ""}`}
                />
              </div>
              <select
                name="vehiculoId"
                value={formData.vehiculoId}
                onChange={onInputChange}
                onFocus={() => handleFocus("vehiculoId")}
                onBlur={handleBlur}
                className={`w-full pl-8 pr-2 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 transition-all duration-300 text-gray-800 ${
                  formErrors.vehiculoId
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-[#333] hover:border-gray-400"
                }`}
              >
                <option value={0}>Seleccione un vehículo</option>
                {availableVehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.marca} {vehicle.modelo} - {vehicle.matricula} (${vehicle.precioPorDia}/día)
                  </option>
                ))}
              </select>
            </div>
            {formErrors.vehiculoId && (
              <p className="mt-1 text-xs text-red-500 animate-fadeIn">{formErrors.vehiculoId}</p>
            )}
            {availableVehicles.length === 0 && (
              <p className="mt-1 text-xs text-amber-500">No hay vehículos disponibles para alquilar</p>
            )}
          </div>

          {/* Fecha de inicio y fin */}
          <div
            className={`transition-all duration-300 transform ${
              focusedField === "fechaInicio" ? "scale-[1.02] -translate-y-1" : ""
            }`}
          >
            <label className="block text-xs font-medium text-gray-700 mb-1">Fecha de inicio</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <Calendar
                  size={16}
                  className={`text-gray-400 transition-colors ${focusedField === "fechaInicio" ? "text-[#333]" : ""}`}
                />
              </div>
              <input
                type="date"
                name="fechaInicio"
                value={formData.fechaInicio}
                onChange={onInputChange}
                onFocus={() => handleFocus("fechaInicio")}
                onBlur={handleBlur}
                min={new Date().toISOString().split("T")[0]}
                className={`w-full pl-8 pr-2 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 transition-all duration-300 text-gray-800 ${
                  formErrors.fechaInicio
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-[#333] hover:border-gray-400"
                }`}
              />
            </div>
            {formErrors.fechaInicio && (
              <p className="mt-1 text-xs text-red-500 animate-fadeIn">{formErrors.fechaInicio}</p>
            )}
          </div>

          <div
            className={`transition-all duration-300 transform ${
              focusedField === "fechaFin" ? "scale-[1.02] -translate-y-1" : ""
            }`}
          >
            <label className="block text-xs font-medium text-gray-700 mb-1">Fecha de fin</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <Calendar
                  size={16}
                  className={`text-gray-400 transition-colors ${focusedField === "fechaFin" ? "text-[#333]" : ""}`}
                />
              </div>
              <input
                type="date"
                name="fechaFin"
                value={formData.fechaFin}
                onChange={onInputChange}
                onFocus={() => handleFocus("fechaFin")}
                onBlur={handleBlur}
                min={formData.fechaInicio || new Date().toISOString().split("T")[0]}
                className={`w-full pl-8 pr-2 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 transition-all duration-300 text-gray-800 ${
                  formErrors.fechaFin
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-[#333] hover:border-gray-400"
                }`}
              />
            </div>
            {formErrors.fechaFin && <p className="mt-1 text-xs text-red-500 animate-fadeIn">{formErrors.fechaFin}</p>}
          </div>

          {/* Observaciones */}
          <div
            className={`md:col-span-2 transition-all duration-300 transform ${
              focusedField === "observaciones" ? "scale-[1.02] -translate-y-1" : ""
            }`}
          >
            <label className="block text-xs font-medium text-gray-700 mb-1">Observaciones</label>
            <div className="relative">
              <div className="absolute top-2 left-2 pointer-events-none">
                <FileText
                  size={16}
                  className={`text-gray-400 transition-colors ${focusedField === "observaciones" ? "text-[#333]" : ""}`}
                />
              </div>
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={onInputChange}
                onFocus={() => handleFocus("observaciones")}
                onBlur={handleBlur}
                rows={3}
                className={`w-full pl-8 pr-2 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 transition-all duration-300 text-gray-800 ${
                  formErrors.observaciones
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-[#333] hover:border-gray-400"
                }`}
                placeholder="Observaciones adicionales sobre el alquiler"
              />
            </div>
            {formErrors.observaciones && (
              <p className="mt-1 text-xs text-red-500 animate-fadeIn">{formErrors.observaciones}</p>
            )}
          </div>

          {/* Costo estimado */}
          {formData.fechaInicio && formData.fechaFin && formData.vehiculoId > 0 && (
            <div className="md:col-span-2 mt-2">
              <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                <h4 className="text-sm font-medium text-blue-800 mb-1">Costo estimado</h4>
                <p className="text-blue-700 font-medium text-lg">${estimatedCost.toFixed(2)}</p>
              </div>
            </div>
          )}
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
                  Crear Alquiler
                </>
              ) : (
                <>
                  <Check size={16} className="mr-1 animate-pulse" />
                  Actualizar Alquiler
                </>
              )}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
