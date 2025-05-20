"use client"

import { AlertCircle, Trash2 } from "lucide-react"
import type { Client } from "../types/client"
import type { Vehicle } from "../types/vehicle"
import type { Rental } from "../types/rental"

type DeleteConfirmationProps = {
  client?: Client
  vehicle?: Vehicle
  rental?: Rental
  loading: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteConfirmation({
  client,
  vehicle,
  rental,
  loading,
  onConfirm,
  onCancel,
}: DeleteConfirmationProps) {
  // Determinar qué tipo de elemento se está eliminando
  const getItemType = () => {
    if (client) return "cliente"
    if (vehicle) return "vehículo"
    if (rental) return "alquiler"
    return "elemento"
  }

  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Obtener el título y detalles según el tipo de elemento
  const getItemDetails = () => {
    if (client) {
      return {
        title: `${client.nombre} ${client.apellido}`,
        details: `Documento: ${client.documento} | Email: ${client.email}`,
      }
    }
    if (vehicle) {
      return {
        title: `${vehicle.marca} ${vehicle.modelo}`,
        details: `Matrícula: ${vehicle.matricula} | Tipo: ${vehicle.tipo}`,
      }
    }
    if (rental) {
      return {
        title: `${rental.detalleVehiculo}`,
        details: `Cliente: ${rental.nombreCliente} | Período: ${formatDate(rental.fechaInicio)} - ${formatDate(rental.fechaFin)}`,
      }
    }
    return {
      title: "",
      details: "",
    }
  }

  const itemType = getItemType()
  const itemDetails = getItemDetails()

  return (
    <div className="text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
        <AlertCircle size={48} className="text-red-500" />
      </div>

      <h4 className="text-xl font-medium mb-3 text-gray-800">¿Está seguro de eliminar este {itemType}?</h4>

      <div className="p-4 mb-6 bg-gray-50 rounded-lg border border-gray-100">
        <p className="text-gray-600 mb-2">
          Esta acción no se puede deshacer. Se eliminará permanentemente el {itemType}:
        </p>
        <p className="font-medium text-gray-800 text-lg">{itemDetails.title}</p>
        <p className="text-gray-500 text-sm">{itemDetails.details}</p>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={onCancel}
          className="px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 rounded-full transition-all duration-300 font-medium"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center font-medium"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              Eliminando...
            </>
          ) : (
            <>
              <Trash2 size={18} className="mr-2" />
              Eliminar {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
