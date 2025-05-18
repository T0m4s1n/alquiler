"use client"

import { Trophy } from "lucide-react"
import { useEffect, useState } from "react"
import type { Client } from "../types/client"
import ClientAvatar from "./client-avatar"

type TopClientsSectionProps = {
  topClients: Client[]
  show: boolean
}

export default function TopClientsSection({ topClients, show }: TopClientsSectionProps) {
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
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 mb-8 animate-slideDown overflow-hidden">
      <h2 className="text-2xl font-light uppercase tracking-wide mb-6 flex items-center animate-fadeInScale text-[#333]">
        <Trophy className="mr-2 text-yellow-500" />
        Clientes con Más Alquileres
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="animate-fadeInRight" style={{ animationDelay: "200ms" }}>
              <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
              <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alquileres</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {topClients.map((client, index) => (
              <tr
                key={client.id}
                className={`hover:bg-gray-50/80 transition-all duration-300 ${animateRows ? "animate-fadeInUp" : "opacity-0"}`}
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                <td className="py-4 whitespace-nowrap">
                  {index === 0 ? (
                    <div className="flex items-center justify-center w-6 h-6 bg-yellow-100 rounded-full text-yellow-800 font-bold animate-pulse">
                      1
                    </div>
                  ) : index === 1 ? (
                    <div className="flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full text-gray-700 font-bold">
                      2
                    </div>
                  ) : index === 2 ? (
                    <div className="flex items-center justify-center w-6 h-6 bg-yellow-50 rounded-full text-yellow-700 font-bold">
                      3
                    </div>
                  ) : (
                    index + 1
                  )}
                </td>
                <td className="py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <ClientAvatar nombre={client.nombre} apellido={client.apellido} />
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">
                        {client.nombre} {client.apellido}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 whitespace-nowrap">{client.documento}</td>
                <td className="py-4 whitespace-nowrap">{client.email}</td>
                <td className="py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                      index === 0
                        ? "bg-yellow-100 text-yellow-800"
                        : index === 1
                          ? "bg-gray-200 text-gray-800"
                          : index === 2
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-green-100 text-green-800"
                    }`}
                  >
                    {client.cantidadAlquileres} alquileres
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
