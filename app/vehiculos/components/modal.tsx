"use client"

import type React from "react"

import { X } from "lucide-react"

type ModalProps = {
  show: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
}

export default function Modal({ show, title, onClose, children }: ModalProps) {
  if (!show) return null

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 p-4 pointer-events-none">
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-3xl mx-auto overflow-hidden transition-all duration-300 transform animate-zoomIn pointer-events-auto border border-gray-200"
        style={{
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
      >
        {/* Modal header */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 flex justify-between items-center border-b border-gray-200">
          <h3 className="text-xl font-medium text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-200 transition-colors text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal body */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
