"use client"

import { AlertCircle } from "lucide-react"

type ErrorStateProps = {
  message: string
  onRetry: () => void
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="text-center py-10">
      <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
      <p className="text-lg text-red-500">{message}</p>
      <button onClick={onRetry} className="mt-4 px-4 py-2 bg-[#333] text-white rounded-full">
        Reintentar
      </button>
    </div>
  )
}
