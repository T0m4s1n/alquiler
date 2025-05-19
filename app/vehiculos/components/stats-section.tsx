"use client"

import { BarChart, Car, Calendar } from "lucide-react"
import { useEffect, useState } from "react"
import type { Vehicle, VehicleTypeAverage } from "../types/vehicle"
import VehicleAvatar from "./vehicle-avatar"

type StatsSectionProps = {
  unusedVehicles: Vehicle[]
  typeAverages: VehicleTypeAverage[]
  show: boolean
}

export default function StatsSection({ unusedVehicles, typeAverages, show }: StatsSectionProps) {
  const [animateRows, setAnimateRows] = useState(false)

  // Reiniciar animación cuando se muestra/oculta la sección
  useEffect(() => {
    if (show) {
      // Pequeño retraso para que la animación de los elementos comience después de que el contenedor aparezca
      const timer = setTimeout(() => {
        setAnimateRows(true)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setAnimateRows(false)
    }
  }, [show])

  if (!show) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Vehículos sin alquileres en los últimos 30 días */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 animate-slideDown overflow-hidden">
        <h2 className="text-2xl font-light uppercase tracking-wide mb-6 flex items-center animate-fadeInScale">
          <Car className="mr-2 text-red-500" />
          Vehículos Sin Uso (30 días)
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="animate-fadeInRight" style={{ animationDelay: "200ms" }}>
                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehículo</th>
                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matrícula</th>
                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio/día
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {unusedVehicles.length === 0 ? (
                <tr className={`${animateRows ? "animate-fadeInUp" : "opacity-0"}`}>
                  <td colSpan={4} className="py-4 text-center text-gray-500">
                    No hay vehículos sin uso en los últimos 30 días
                  </td>
                </tr>
              ) : (
                unusedVehicles.map((vehicle, index) => (
                  <tr
                    key={vehicle.id}
                    className={`hover:bg-gray-50/80 transition-all duration-300 ${
                      animateRows ? "animate-fadeInUp" : "opacity-0"
                    }`}
                    style={{ animationDelay: `${300 + index * 100}ms` }}
                  >
                    <td className="py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <VehicleAvatar marca={vehicle.marca} modelo={vehicle.modelo} tipo={vehicle.tipo} />
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {vehicle.marca} {vehicle.modelo}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 whitespace-nowrap">{vehicle.matricula}</td>
                    <td className="py-4 whitespace-nowrap">{vehicle.tipo}</td>
                    <td className="py-4 whitespace-nowrap">${vehicle.precioPorDia.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Promedio de duración por tipo de vehículo */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 animate-slideDown overflow-hidden">
        <h2 className="text-2xl font-light uppercase tracking-wide mb-6 flex items-center animate-fadeInScale">
          <BarChart className="mr-2 text-blue-500" />
          Promedio de Alquiler por Tipo
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="animate-fadeInRight" style={{ animationDelay: "200ms" }}>
                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Promedio (días)
                </th>
                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gráfico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {typeAverages.length === 0 ? (
                <tr className={`${animateRows ? "animate-fadeInUp" : "opacity-0"}`}>
                  <td colSpan={3} className="py-4 text-center text-gray-500">
                    No hay datos de promedio disponibles
                  </td>
                </tr>
              ) : (
                typeAverages.map((item, index) => {
                  // Calcular el ancho de la barra basado en el promedio (máximo 100%)
                  const maxAverage = Math.max(...typeAverages.map((t) => t.promedioDias))
                  const barWidth = (item.promedioDias / maxAverage) * 100

                  return (
                    <tr
                      key={item.tipoVehiculo}
                      className={`hover:bg-gray-50/80 transition-all duration-300 ${
                        animateRows ? "animate-fadeInUp" : "opacity-0"
                      }`}
                      style={{ animationDelay: `${300 + index * 100}ms` }}
                    >
                      <td className="py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span
                            className={`inline-block w-3 h-3 rounded-full mr-2 ${
                              item.tipoVehiculo === "SEDAN"
                                ? "bg-blue-500"
                                : item.tipoVehiculo === "SUV"
                                  ? "bg-green-500"
                                  : item.tipoVehiculo === "HATCHBACK"
                                    ? "bg-purple-500"
                                    : item.tipoVehiculo === "PICKUP"
                                      ? "bg-orange-500"
                                      : item.tipoVehiculo === "DEPORTIVO"
                                        ? "bg-red-500"
                                        : item.tipoVehiculo === "MINIVAN"
                                          ? "bg-yellow-500"
                                          : "bg-gray-500"
                            }`}
                          ></span>
                          {item.tipoVehiculo}
                        </div>
                      </td>
                      <td className="py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar size={16} className="text-gray-400 mr-2" />
                          <span className="font-medium">{item.promedioDias.toFixed(1)} días</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${
                              item.tipoVehiculo === "SEDAN"
                                ? "bg-blue-500"
                                : item.tipoVehiculo === "SUV"
                                  ? "bg-green-500"
                                  : item.tipoVehiculo === "HATCHBACK"
                                    ? "bg-purple-500"
                                    : item.tipoVehiculo === "PICKUP"
                                      ? "bg-orange-500"
                                      : item.tipoVehiculo === "DEPORTIVO"
                                        ? "bg-red-500"
                                        : item.tipoVehiculo === "MINIVAN"
                                          ? "bg-yellow-500"
                                          : "bg-gray-500"
                            }`}
                            style={{ width: `${barWidth}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
