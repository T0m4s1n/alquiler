"use client"

import { AlertCircle, Trash2 } from "lucide-react"
import type { Client } from "../types/client"

type DeleteConfirmationProps = {
  client: Client
  loading: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteConfirmation({ client, loading, onConfirm, onCancel }: DeleteConfirmationProps) {
  return (
    <div className="text-center">
      <AlertCircle size={64} className="mx-auto text-red-500 mb-4" />
      <h4 className="text-xl font-medium mb-2">¿Está seguro de eliminar este cliente?</h4>
      <p className="text-gray-600 mb-6">
        Esta acción no se puede deshacer. Se eliminará permanentemente a{" "}
        <strong>
          {client.nombre} {client.apellido}
        </strong>{" "}
        y todos sus datos asociados.
      </p>

      <div className="flex justify-center space-x-4">
        <button
          onClick={onCancel}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full transition-all duration-300"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-300 flex items-center"
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
              Eliminar Cliente
            </>
          )}
        </button>
      </div>
    </div>
  )
}
