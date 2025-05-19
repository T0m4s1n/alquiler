"use client"

import { FileText, Tag, Calendar, Edit, Trash2, DollarSign, Info } from "lucide-react"
import type { Vehicle } from "../types/vehicle"
import VehicleAvatar from "./vehicle-avatar"

type VehiclesTableProps = {
  vehicles: Vehicle[]
  onView: (vehicle: Vehicle) => void
  onEdit: (vehicle: Vehicle) => void
  onDelete: (vehicle: Vehicle) => void
}

export default function VehiclesTable({ vehicles, onView, onEdit, onDelete }: VehiclesTableProps) {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehículo</th>
          <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matrícula</th>
          <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles</th>
          <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
          <th className="py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {vehicles.map((vehicle) => (
          <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors duration-200">
            <td className="py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="transition-transform duration-300 transform hover:scale-110">
                  <VehicleAvatar marca={vehicle.marca} modelo={vehicle.modelo} tipo={vehicle.tipo} />
                </div>
                <div className="ml-4">
                  <div className="font-medium text-gray-900 hover:text-[#333] transition-colors duration-200">
                    {vehicle.marca} {vehicle.modelo}
                  </div>
                  <div className="text-sm text-gray-500">{vehicle.anio}</div>
                </div>
              </div>
            </td>
            <td className="py-4 whitespace-nowrap">
              <div className="flex items-center group">
                <FileText
                  size={16}
                  className="text-gray-800 mr-2 group-hover:text-[#333] transition-colors duration-200"
                />
                <span className="group-hover:font-medium transition-all duration-200 text-gray-800">{vehicle.matricula}</span>
              </div>
            </td>
            <td className="py-4 whitespace-nowrap">
              <div className="text-sm">
                <div className="flex items-center mb-1 group">
                  <Tag
                    size={16}
                    className="text-gray-800 mr-2 group-hover:text-[#333] transition-colors duration-200"
                  />
                  <span className="group-hover:font-medium transition-all duration-200 text-gray-800">
                    {vehicle.tipo} - {vehicle.color}
                  </span>
                </div>
                <div className="flex items-center group">
                  <Calendar
                    size={16}
                    className="text-gray-800 mr-2 group-hover:text-[#333] transition-colors duration-200"
                  />
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      vehicle.disponible ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {vehicle.disponible ? "Disponible" : "No disponible"}
                  </span>
                </div>
              </div>
            </td>
            <td className="py-4 whitespace-nowrap">
              <div className="flex items-center group">
                <DollarSign
                  size={16}
                  className="text-green-400 mr-2 group-hover:text-green-500 transition-colors duration-200"
                />
                <span className="group-hover:font-medium transition-all duration-200 text-gray-800">
                  ${vehicle.precioPorDia.toFixed(2)}/día
                </span>
              </div>
            </td>
            <td className="py-4 whitespace-nowrap text-right">
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => onView(vehicle)}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-all duration-300 transform hover:scale-110 hover:rotate-3 hover:shadow-md"
                  title="Ver detalles"
                >
                  <Info size={18} className="text-gray-600 hover:text-[#333] transition-colors duration-200" />
                </button>
                <button
                  onClick={() => onEdit(vehicle)}
                  className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-all duration-300 transform hover:scale-110 hover:rotate-3 hover:shadow-md"
                  title="Editar"
                >
                  <Edit size={18} className="hover:text-blue-800 transition-colors duration-200" />
                </button>
                <button
                  onClick={() => onDelete(vehicle)}
                  className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-all duration-300 transform hover:scale-110 hover:rotate-3 hover:shadow-md"
                  title="Eliminar"
                >
                  <Trash2 size={18} className="hover:text-red-800 transition-colors duration-200" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
