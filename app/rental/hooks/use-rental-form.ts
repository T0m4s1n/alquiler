"use client"

import type React from "react"

import { useState } from "react"
import type { RentalFormData, RentalFormErrors, Rental } from "../types/rental"

const initialFormData: RentalFormData = {
  clienteId: 0,
  vehiculoId: 0,
  fechaInicio: "",
  fechaFin: "",
  observaciones: "",
}

export default function useRentalForm() {
  const [formData, setFormData] = useState<RentalFormData>(initialFormData)
  const [formErrors, setFormErrors] = useState<RentalFormErrors>({})

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    // Manejar diferentes tipos de inputs
    if (name === "clienteId" || name === "vehiculoId") {
      setFormData({
        ...formData,
        [name]: Number(value),
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }

    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      })
    }
  }

  // Validate form data
  const validateForm = () => {
    const errors: RentalFormErrors = {}
    if (!formData.clienteId) errors.clienteId = "El cliente es obligatorio"
    if (!formData.vehiculoId) errors.vehiculoId = "El vehículo es obligatorio"
    if (!formData.fechaInicio) errors.fechaInicio = "La fecha de inicio es obligatoria"
    if (!formData.fechaFin) errors.fechaFin = "La fecha de fin es obligatoria"

    // Validar que la fecha de fin sea posterior a la fecha de inicio
    if (formData.fechaInicio && formData.fechaFin) {
      const startDate = new Date(formData.fechaInicio)
      const endDate = new Date(formData.fechaFin)

      if (endDate <= startDate) {
        errors.fechaFin = "La fecha de fin debe ser posterior a la fecha de inicio"
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Reset form data
  const resetForm = () => {
    setFormData(initialFormData)
    setFormErrors({})
  }

  // Set form data from rental
  const setFormFromRental = (rental: Rental) => {
    setFormData({
      clienteId: rental.clienteId,
      vehiculoId: rental.vehiculoId,
      fechaInicio: rental.fechaInicio,
      fechaFin: rental.fechaFin,
      observaciones: rental.observaciones,
    })
  }

  return {
    formData,
    formErrors,
    handleInputChange,
    validateForm,
    resetForm,
    setFormFromRental,
  }
}
