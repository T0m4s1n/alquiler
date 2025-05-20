"use client"

import { Calendar, User, Car, DollarSign, Edit, Trash2, Info, CheckCircle, XCircle, PlayCircle } from "lucide-react"
import type { Rental } from "../types/rental"

type RentalsTableProps = {
  rentals: Rental[]
  onView: (rental: Rental) => void
  onEdit: (rental: Rental) => void
  onDelete: (rental: Rental) => void
  onComplete: (rental: Rental) => void
  onCancel: (rental: Rental) => void
  onActivate: (rental: Rental) => void
}

export default function RentalsTable({
  rentals,
  onView,
  onEdit,
  onDelete,
  onComplete,
  onCancel,
  onActivate,
}: RentalsTableProps) {
  // Función para formatear fechas de manera segura
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    
    try {
      const date = new Date(dateString)
      
      // Validar que la fecha sea válida
      if (isNaN(date.getTime())) return "Fecha inválida"
      
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch (error) {
      console.error("Error al formatear la fecha:", error)
      return "Error en fecha"
    }
  }

  // Obtener el color y texto según el estado
  const getStatusInfo = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PENDIENTE":
        return { color: "bg-blue-100 text-blue-800", text: "Pendiente" }
      case "ACTIVO":
        return { color: "bg-green-100 text-green-800", text: "Activo" }
      case "COMPLETADO":
        return { color: "bg-gray-100 text-gray-800", text: "Completado" }
      case "CANCELADO":
        return { color: "bg-red-100 text-red-800", text: "Cancelado" }
      default:
        return { color: "bg-gray-100 text-gray-800", text: status || "Desconocido" }
    }
  }

  // Verificar si hay alquileres para mostrar
  if (!rentals || rentals.length === 0) {
    return (
      <div className="min-w-full p-8 text-center">
        <p className="text-gray-500">No hay alquileres disponibles</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
            <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehículo</th>
            <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Período</th>
            <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costo</th>
            <th className="py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {rentals.map((rental) => {
            const statusInfo = getStatusInfo(rental.estado)

            return (
              <tr key={rental.id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">#{rental.id}</div>
                </td>
                <td className="py-4 whitespace-nowrap">
                  <div className="flex items-center group">
                    <User
                      size={16}
                      className="text-gray-400 mr-2 group-hover:text-gray-600 transition-colors duration-200"
                    />
                    <span className="group-hover:font-medium transition-all duration-200 text-gray-800">
                      {rental.nombreCliente || "Cliente no especificado"}
                    </span>
                  </div>
                </td>
                <td className="py-4 whitespace-nowrap">
                  <div className="flex items-center group">
                    <Car
                      size={16}
                      className="text-gray-400 mr-2 group-hover:text-gray-600 transition-colors duration-200"
                    />
                    <span className="group-hover:font-medium transition-all duration-200 text-gray-800">
                      {rental.detalleVehiculo || "Vehículo no especificado"}
                    </span>
                  </div>
                </td>
                <td className="py-4 whitespace-nowrap">
                  <div className="flex items-center group">
                    <Calendar
                      size={16}
                      className="text-gray-400 mr-2 group-hover:text-gray-600 transition-colors duration-200"
                    />
                    <span className="group-hover:font-medium transition-all duration-200 text-gray-800">
                      {formatDate(rental.fechaInicio)} - {formatDate(rental.fechaFin)}
                    </span>
                  </div>
                </td>
                <td className="py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                    {statusInfo.text}
                  </span>
                </td>
                <td className="py-4 whitespace-nowrap">
                  <div className="flex items-center group">
                    <DollarSign
                      size={16}
                      className="text-green-500 mr-1 group-hover:text-green-600 transition-colors duration-200"
                    />
                    <span className="group-hover:font-medium transition-all duration-200 text-gray-800">
                      ${typeof rental.costoTotal === 'number' ? rental.costoTotal.toFixed(2) : '0.00'}
                    </span>
                  </div>
                </td>
                <td className="py-4 whitespace-nowrap text-right">
                  <div className="flex justify-end space-x-1">
                    <button
                      onClick={() => onView(rental)}
                      className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-all duration-300"
                      title="Ver detalles"
                      type="button"
                    >
                      <Info size={16} className="text-gray-600 hover:text-gray-800 transition-colors duration-200" />
                    </button>

                    {rental.estado === "PENDIENTE" && (
                      <>
                        <button
                          onClick={() => onActivate(rental)}
                          className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-all duration-300"
                          title="Activar alquiler"
                          type="button"
                        >
                          <PlayCircle size={16} className="hover:text-green-800 transition-colors duration-200" />
                        </button>
                        <button
                          onClick={() => onEdit(rental)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-all duration-300"
                          title="Editar"
                          type="button"
                        >
                          <Edit size={16} className="hover:text-blue-800 transition-colors duration-200" />
                        </button>
                        <button
                          onClick={() => onCancel(rental)}
                          className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-all duration-300"
                          title="Cancelar"
                          type="button"
                        >
                          <XCircle size={16} className="hover:text-red-800 transition-colors duration-200" />
                        </button>
                      </>
                    )}

                    {rental.estado === "ACTIVO" && (
                      <>
                        <button
                          onClick={() => onComplete(rental)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-all duration-300"
                          title="Completar alquiler"
                          type="button"
                        >
                          <CheckCircle size={16} className="hover:text-blue-800 transition-colors duration-200" />
                        </button>
                        <button
                          onClick={() => onEdit(rental)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-all duration-300"
                          title="Editar"
                          type="button"
                        >
                          <Edit size={16} className="hover:text-blue-800 transition-colors duration-200" />
                        </button>
                      </>
                    )}

                    {(rental.estado === "COMPLETADO" || rental.estado === "CANCELADO") && (
                      <button
                        onClick={() => onDelete(rental)}
                        className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-all duration-300"
                        title="Eliminar"
                        type="button"
                      >
                        <Trash2 size={16} className="hover:text-red-800 transition-colors duration-200" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}