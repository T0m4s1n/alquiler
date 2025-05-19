"use client"

import { Car, FileText, Calendar, Tag, DollarSign, Edit, CheckSquare, XSquare } from "lucide-react"
import type { Vehicle } from "../types/vehicle"
import VehicleAvatar from "./vehicle-avatar"

type VehicleDetailsProps = {
  vehicle: Vehicle
  onClose: () => void
  onEdit: () => void
}

export default function VehicleDetails({ vehicle, onClose, onEdit }: VehicleDetailsProps) {
  return (
    <div className="animate-fadeIn h-full flex flex-col">
      <div className="flex-grow overflow-auto pr-2">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center space-x-4 mb-2">
            <VehicleAvatar marca={vehicle.marca} modelo={vehicle.modelo} tipo={vehicle.tipo} size="lg" />
            <div>
              <h4 className="text-xl font-medium text-gray-800">
                {vehicle.marca} {vehicle.modelo}
              </h4>
              <p className="text-gray-500">Vehículo #{vehicle.id}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="text-sm font-medium text-gray-800 uppercase mb-3">Información Básica</h5>
            <div className="space-y-3">
              <div className="flex items-start">
                <FileText size={18} className="text-gray-800 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-800">Matrícula</p>
                  <p className="font-medium text-gray-500">{vehicle.matricula}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar size={18} className="text-gray-800 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-800">Año</p>
                  <p className="font-medium text-gray-500">{vehicle.anio}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Tag size={18} className="text-gray-800 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-800">Tipo</p>
                  <p className="font-medium text-gray-500">{vehicle.tipo}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="text-sm font-medium text-gray-800 uppercase mb-3">Características</h5>
            <div className="space-y-3">
              <div className="flex items-start">
                <DollarSign size={18} className="text-gray-800 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-800">Precio por día</p>
                  <p className="font-medium text-gray-500">${vehicle.precioPorDia.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Car size={18} className="text-gray-800 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-800">Color</p>
                  <p className="font-medium text-gray-500">{vehicle.color}</p>
                </div>
              </div>
              <div className="flex items-start">
                {vehicle.disponible ? (
                  <CheckSquare size={18} className="text-green-500 mr-3 mt-1" />
                ) : (
                  <XSquare size={18} className="text-red-500 mr-3 mt-1" />
                )}
                <div>
                  <p className="text-sm text-gray-800">Estado</p>
                  <p className={`font-medium ${vehicle.disponible ? "text-green-600" : "text-red-600"}`}>
                    {vehicle.disponible ? "Disponible" : "No disponible"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="text-sm font-medium text-gray-500 uppercase mb-3">Descripción</h5>
            <p className="text-gray-700">{vehicle.descripcion}</p>
          </div>

          {vehicle.promedioDias !== undefined && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="text-sm font-medium text-gray-500 uppercase mb-3">Estadísticas</h5>
              <div className="flex items-start">
                <Calendar size={18} className="text-gray-400 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Promedio de días alquilado</p>
                  <p className="font-medium">{vehicle.promedioDias.toFixed(1)} días</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-end space-x-3 pt-3 pb-1 bg-white border-t border-gray-200">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full text-sm transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 active:translate-y-0 active:shadow-none"
        >
          Cerrar
        </button>
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-[#333] hover:bg-gray-700 text-white rounded-full text-sm transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 active:translate-y-0 active:shadow-none flex items-center"
        >
          <Edit size={16} className="mr-1" />
          Editar Vehículo
        </button>
      </div>
    </div>
  )
}
