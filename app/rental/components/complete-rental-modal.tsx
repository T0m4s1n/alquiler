"use client"

import { useState } from "react"
import { Calendar, Check } from "lucide-react"
import type { Rental } from "../types/rental"

type CompleteRentalModalProps = {
  rental: Rental
  loading: boolean
  onConfirm: (returnDate: string) => void
  onCancel: () => void
}

export default function CompleteRentalModal({ rental, loading, onConfirm, onCancel }: CompleteRentalModalProps) {
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split("T")[0])

  return (
    <div className="text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
        <Check size={48} className="text-blue-500" />
      </div>

      <h4 className="text-xl font-medium mb-3 text-gray-800">Completar alquiler</h4>

      <div className="p-4 mb-6 bg-gray-50 rounded-lg border border-gray-100">
        <p className="text-gray-600 mb-4">Está a punto de completar el alquiler del vehículo:</p>
        <p className="font-medium text-gray-800 text-lg">{rental.detalleVehiculo}</p>
        <p className="text-gray-500 text-sm mb-4">Cliente: {rental.nombreCliente}</p>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de devolución</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size={18} className="text-gray-400" />
            </div>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              min={rental.fechaInicio}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>
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
          onClick={() => onConfirm(returnDate)}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center font-medium"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              Completando...
            </>
          ) : (
            <>
              <Check size={18} className="mr-2" />
              Completar Alquiler
            </>
          )}
        </button>
      </div>
    </div>
  )
}
