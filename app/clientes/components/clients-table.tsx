"use client"

import { UserCircle, FileText, Mail, Phone, Calendar, Edit, Trash2 } from "lucide-react"
import type { Client } from "../types/client"
import ClientAvatar from "./client-avatar"

type ClientsTableProps = {
  clients: Client[]
  onView: (client: Client) => void
  onEdit: (client: Client) => void
  onDelete: (client: Client) => void
}

export default function ClientsTable({ clients, onView, onEdit, onDelete }: ClientsTableProps) {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
          <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
          <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
          <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registro</th>
          <th className="py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {clients.map((client) => (
          <tr key={client.id} className="hover:bg-gray-50">
            <td className="py-4 whitespace-nowrap">
              <div className="flex items-center">
                <ClientAvatar nombre={client.nombre} apellido={client.apellido} />
                <div className="ml-4">
                  <div className="font-medium text-black">
                    {client.nombre} {client.apellido}
                  </div>
                  <div className="text-sm text-black">ID: {client.id}</div>
                </div>
              </div>
            </td>
            <td className="py-4 whitespace-nowrap">
              <div className="flex items-center text-black">
                <FileText size={16} className="mr-2" />
                <span>{client.documento}</span>
              </div>
            </td>
            <td className="py-4 whitespace-nowrap">
              <div className="text-sm text-black">
                <div className="flex items-center mb-1">
                  <Mail size={16} className="mr-2" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone size={16} className="mr-2" />
                  <span>{client.telefono}</span>
                </div>
              </div>
            </td>
            <td className="py-4 whitespace-nowrap">
              <div className="flex items-center text-black">
                <Calendar size={16} className="mr-2" />
                <span>{client.fechaRegistro}</span>
              </div>
            </td>
            <td className="py-4 whitespace-nowrap text-right">
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => onView(client)}
                  className="p-2 bg-gray-100 text-black rounded-full hover:bg-gray-200 transition-colors"
                  title="Ver detalles"
                >
                  <UserCircle size={18} />
                </button>
                <button
                  onClick={() => onEdit(client)}
                  className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                  title="Editar"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => onDelete(client)}
                  className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                  title="Eliminar"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}