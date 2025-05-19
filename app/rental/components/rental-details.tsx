"use client"

import { Calendar, Clock, User, Car, DollarSign, FileText, Tag, Edit, X, Check } from "lucide-react"
import type { Rental } from "../types/rental"

type RentalDetailsProps = {
  rental: Rental
  onClose: () => void
  onEdit: () => void
  onComplete: () => void
  onCancel: () => void
  onActivate: () => void
}

export default function RentalDetails({
  rental,
  onClose,
  onEdit,
  onComplete,
  onCancel,
  onActivate,
}: RentalDetailsProps) {
  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Obtener el color y texto según el estado
  const getStatusInfo = () => {
    switch (rental.estado) {
      case "PENDIENTE":
        return { color: "bg-blue-100 text-blue-800", text: "Pendiente" }
      case "ACTIVO":
        return { color: "bg-green-100 text-green-800", text: "Activo" }
      case "COMPLETADO":
        return { color: "bg-gray-100 text-gray-800", text: "Completado" }
      case "CANCELADO":
        return { color: "bg-red-100 text-red-800", text: "Cancelado" }
      default:
        return { color: "bg-gray-100 text-gray-800", text: "Desconocido" }
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <div className="animate-fadeIn h-full flex flex-col">
      <div className="flex-grow overflow-auto pr-2">
        <div className="grid grid-cols-1 gap-4">
          {/* Encabezado con estado */}
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xl font-medium text-gray-800">Alquiler #{rental.id}</h4>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>{statusInfo.text}</span>
          </div>

          {/* Información del cliente */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="text-sm font-medium text-gray-800 uppercase mb-3">Cliente</h5>
            <div className="flex items-start">
              <User size={18} className="text-gray-800 mr-3 mt-1" />
              <div>
                <p className="font-medium text-gray-500">{rental.nombreCliente}</p>
                <p className="text-sm text-gray-500">ID: {rental.clienteId}</p>
              </div>
            </div>
          </div>

          {/* Información del vehículo */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="text-sm font-medium text-gray-800 uppercase mb-3">Vehículo</h5>
            <div className="flex items-start">
              <Car size={18} className="text-gray-800 mr-3 mt-1" />
              <div>
                <p className="font-medium text-gray-500">{rental.detalleVehiculo}</p>
                <p className="text-sm text-gray-500">ID: {rental.vehiculoId}</p>
              </div>
            </div>
          </div>

          {/* Fechas */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="text-sm font-medium text-gray-800 uppercase mb-3">Fechas</h5>
            <div className="space-y-3">
              <div className="flex items-start">
                <Calendar size={18} className="text-gray-800 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Período de alquiler</p>
                  <p className="font-medium text-gray-500">
                    {formatDate(rental.fechaInicio)} - {formatDate(rental.fechaFin)}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock size={18} className="text-gray-800 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-800">Fecha de creación</p>
                  <p className="font-medium text-gray-500">{formatDate(rental.fechaCreacion)}</p>
                </div>
              </div>
              {rental.fechaDevolucion && (
                <div className="flex items-start">
                  <Clock size={18} className="text-gray-800 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-800">Fecha de devolución</p>
                    <p className="font-medium text-gray-500">{formatDate(rental.fechaDevolucion)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Información financiera */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="text-sm font-medium text-gray-800 uppercase mb-3">Información financiera</h5>
            <div className="flex items-start">
              <DollarSign size={18} className="text-gray-800 mr-3 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Costo total</p>
                <p className="font-medium text-lg text-gray-500">${rental.costoTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Observaciones */}
          {rental.observaciones && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="text-sm font-medium text-gray-500 uppercase mb-3">Observaciones</h5>
              <div className="flex items-start">
                <FileText size={18} className="text-gray-400 mr-3 mt-1" />
                <p className="text-gray-700">{rental.observaciones}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-2 pt-3 pb-1 bg-white border-t border-gray-200">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full text-sm transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 active:translate-y-0 active:shadow-none"
        >
          Cerrar
        </button>

        {rental.estado === "PENDIENTE" && (
          <>
            <button
              onClick={onActivate}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 active:translate-y-0 active:shadow-none flex items-center"
            >
              <Tag size={16} className="mr-1" />
              Activar
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 active:translate-y-0 active:shadow-none flex items-center"
            >
              <X size={16} className="mr-1" />
              Cancelar
            </button>
          </>
        )}

        {rental.estado === "ACTIVO" && (
          <button
            onClick={onComplete}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-sm transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 active:translate-y-0 active:shadow-none flex items-center"
          >
            <Check size={16} className="mr-1" />
            Completar
          </button>
        )}

        {(rental.estado === "PENDIENTE" || rental.estado === "ACTIVO") && (
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-[#333] hover:bg-gray-700 text-white rounded-full text-sm transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 active:translate-y-0 active:shadow-none flex items-center"
          >
            <Edit size={16} className="mr-1" />
            Editar
          </button>
        )}
      </div>
    </div>
  )
}
