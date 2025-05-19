"use client"

import { AlertCircle, X, Clock, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

export type ErrorRecord = {
  id: string
  message: string
  timestamp: Date
  operation: string
}

type ErrorHistoryProps = {
  errors: ErrorRecord[]
  onClearAll: () => void
  onClearError: (id: string) => void
}

export default function ErrorHistory({ errors, onClearAll, onClearError }: ErrorHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (errors.length === 0) return null

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-md overflow-hidden animate-fadeIn">
      <div className="flex items-center justify-between p-3 bg-red-100 cursor-pointer" onClick={toggleExpand}>
        <div className="flex items-center">
          <AlertCircle size={18} className="text-red-500 mr-2" />
          <h3 className="text-sm font-medium text-red-800">Historial de errores ({errors.length})</h3>
        </div>
        <div className="flex items-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onClearAll()
            }}
            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-200 transition-colors mr-1 text-xs"
          >
            Limpiar todo
          </button>
          {isExpanded ? (
            <ChevronUp size={16} className="text-red-500" />
          ) : (
            <ChevronDown size={16} className="text-red-500" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="max-h-40 overflow-y-auto">
          {errors.map((error) => (
            <div
              key={error.id}
              className="p-3 border-t border-red-200 flex items-start justify-between hover:bg-red-100/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center text-xs text-red-600 mb-1">
                  <Clock size={12} className="mr-1" />
                  <span>{formatTime(error.timestamp)}</span>
                  <span className="mx-1">•</span>
                  <span className="font-medium">{error.operation}</span>
                </div>
                <p className="text-xs text-red-800">{error.message}</p>
              </div>
              <button
                type="button"
                onClick={() => onClearError(error.id)}
                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-200 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
