"use client"

import { AlertCircle, Check } from "lucide-react"
import type { AlertType } from "../types/client"

type AlertMessageProps = {
  message: string
  type: AlertType
  show: boolean
}

export default function AlertMessage({ message, type, show }: AlertMessageProps) {
  if (!show) return null

  return (
    <div
      className={`fixed top-8 right-8 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3 transition-all ${
        type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
      }`}
    >
      {type === "success" ? <Check /> : <AlertCircle />}
      <p>{message}</p>
    </div>
  )
}
