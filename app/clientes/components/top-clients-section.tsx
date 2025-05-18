"use client"

import { Award } from "lucide-react"
import type { Client } from "../types/client"
import ClientAvatar from "./client-avatar"

type TopClientsSectionProps = {
  topClients: Client[]
  show: boolean
}

export default function TopClientsSection({ topClients, show }: TopClientsSectionProps) {
  if (!show) return null

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-fadeIn">
      <h2 className="text-2xl font-light uppercase tracking-wide mb-6 flex items-center">
        <Award className="mr-2" />
        Clientes con Más Alquileres
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
              <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alquileres</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {topClients.map((client, index) => (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="py-4 whitespace-nowrap">{index + 1}</td>
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
                  <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
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
