"use client"

import { FileText, Calendar, Mail, Phone, Home, Edit } from "lucide-react"
import type { Client } from "../types/client"
import ClientAvatar from "./client-avatar"

type ClientDetailsProps = {
  client: Client
  onClose: () => void
  onEdit: () => void
}

export default function ClientDetails({ client, onClose, onEdit }: ClientDetailsProps) {
  return (
    <div className="animate-fadeIn h-full flex flex-col">
      <div className="flex-grow overflow-auto pr-2">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center space-x-4 mb-2">
            <ClientAvatar nombre={client.nombre} apellido={client.apellido} size="lg" />
            <div>
              <h4 className="text-xl font-medium text-gray-800">
                {client.nombre} {client.apellido}
              </h4>
              <p className="text-gray-800">Cliente #{client.id}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="text-sm font-medium text-gray-800 uppercase mb-3">Información Personal</h5>
            <div className="space-y-3">
              <div className="flex items-start">
                <FileText size={18} className="text-gray-800 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-800">Documento</p>
                  <p className="font-medium text-gray-500">{client.documento}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar size={18} className="text-gray-800 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-800">Fecha de Nacimiento</p>
                  <p className="font-medium text-gray-500">{client.fechaNacimiento}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="text-sm font-medium text-gray-800 uppercase mb-3">Información de Contacto</h5>
            <div className="space-y-3">
              <div className="flex items-start">
                <Mail size={18} className="text-gray-800 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-800">Email</p>
                  <p className="font-medium text-gray-500">{client.email}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone size={18} className="text-gray-800 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-800">Teléfono</p>
                  <p className="font-medium text-gray-500">{client.telefono}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Home size={18} className="text-gray-800 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-800">Dirección</p>
                  <p className="font-medium text-gray-500">{client.direccion}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="text-sm font-medium text-gray-800 uppercase mb-3">Información Adicional</h5>
            <div className="flex items-start">
              <Calendar size={18} className="text-gray-800 mr-3 mt-1" />
              <div>
                <p className="text-sm text-gray-800">Fecha de Registro</p>
                <p className="font-medium text-gray-500">{client.fechaRegistro}</p>
              </div>
            </div>
          </div>
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
          Editar Cliente
        </button>
      </div>
    </div>
  )
}
