"use client"

import { useState } from "react"
import type { Client, ModalMode } from "../types/vehicle"

export default function useModal() {
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<ModalMode>("create")
  const [currentClient, setCurrentClientState] = useState<Client | null>(null)

  // Open modal for create, edit, view or delete
  const openModal = (mode: ModalMode, client: Client | null = null) => {
    setModalMode(mode)
    setCurrentClientState(client)
    setShowModal(true)
  }

  // Close modal
  const closeModal = () => {
    setShowModal(false)
  }

  // Get modal title based on mode
  const getModalTitle = () => {
    switch (modalMode) {
      case "create":
        return "Crear Nuevo Cliente"
      case "edit":
        return "Editar Cliente"
      case "view":
        return "Detalles del Cliente"
      case "delete":
        return "Eliminar Cliente"
      default:
        return ""
    }
  }

  // Set current client directly
  const updateCurrentClient = (client: Client | null) => {
    setCurrentClientState(client)
  }

  return {
    showModal,
    modalMode,
    currentClient,
    openModal,
    closeModal,
    getModalTitle,
    updateCurrentClient,
  }
}
