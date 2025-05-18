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
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl mx-auto overflow-hidden transition-transform duration-300 transform animate-zoomIn">
        {/* Modal header */}
        <div className="bg-[#333] text-white px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-medium">{title}</h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-700 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Modal body */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
