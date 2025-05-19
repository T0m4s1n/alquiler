"use client"

import { AlertCircle, Check, X } from "lucide-react"
import { useState, useEffect } from "react"
import type { AlertType } from "../types/client"

type AlertMessageProps = {
  message: string
  type: AlertType
  show: boolean
}

export default function AlertMessage({ message, type, show }: AlertMessageProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      setProgress(100)

      // Iniciar la animación de progreso
      const duration = 5000 // 5 segundos
      const interval = 50 // Actualizar cada 50ms
      const step = (interval / duration) * 100

      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress - step
          return newProgress > 0 ? newProgress : 0
        })
      }, interval)

      return () => clearInterval(timer)
    } else {
      setIsVisible(false)
    }
  }, [show])

  if (!isVisible) return null

  return (
    <div
      className={`fixed top-8 right-8 z-50 p-4 rounded-lg shadow-lg flex flex-col max-w-md transition-all ${
        type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
      }`}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-3">
          {type === "success" ? <Check size={20} /> : <AlertCircle size={20} />}
          <div className="flex-1 pr-8">
            <p className="font-medium">{message.split(":")[0]}</p>
            {message.includes(":") && <p className="text-sm mt-1 opacity-90">{message.split(":")[1]}</p>}
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Barra de progreso */}
      <div className="h-1 bg-white bg-opacity-30 mt-3 rounded-full overflow-hidden">
        <div
          className="h-full bg-white transition-all duration-300 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  )
}
