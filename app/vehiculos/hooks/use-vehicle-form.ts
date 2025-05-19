"use client"

import type React from "react"

import { useState } from "react"
import type { FormData, FormErrors, Vehicle } from "../types/vehicle"

const initialFormData: FormData = {
  marca: "",
  modelo: "",
  matricula: "",
  anio: new Date().getFullYear(),
  tipo: "SEDAN",
  color: "",
  precioPorDia: 0,
  disponible: true,
  descripcion: "",
}

export default function useVehicleForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [formErrors, setFormErrors] = useState<FormErrors>({})

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    // Manejar diferentes tipos de inputs
    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement
      setFormData({
        ...formData,
        [name]: checkbox.checked,
      })
    } else if (name === "anio" || name === "precioPorDia") {
      // Convertir a número para los campos numéricos
      setFormData({
        ...formData,
        [name]: type === "number" ? Number.parseFloat(value) : value,
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
    const errors: FormErrors = {}
    if (!formData.marca.trim()) errors.marca = "La marca es obligatoria"
    if (!formData.modelo.trim()) errors.modelo = "El modelo es obligatorio"
    if (!formData.matricula.trim()) errors.matricula = "La matrícula es obligatoria"
    if (!formData.anio) errors.anio = "El año es obligatorio"
    else if (formData.anio < 1900 || formData.anio > new Date().getFullYear() + 1) errors.anio = "Año inválido"
    if (!formData.tipo) errors.tipo = "El tipo de vehículo es obligatorio"
    if (!formData.color.trim()) errors.color = "El color es obligatorio"
    if (formData.precioPorDia <= 0) errors.precioPorDia = "El precio por día debe ser mayor a 0"
    if (!formData.descripcion.trim()) errors.descripcion = "La descripción es obligatoria"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Reset form data
  const resetForm = () => {
    setFormData(initialFormData)
    setFormErrors({})
  }

  // Set form data from vehicle
  const setFormFromVehicle = (vehicle: Vehicle) => {
    setFormData({
      marca: vehicle.marca,
      modelo: vehicle.modelo,
      matricula: vehicle.matricula,
      anio: vehicle.anio,
      tipo: vehicle.tipo,
      color: vehicle.color,
      precioPorDia: vehicle.precioPorDia,
      disponible: vehicle.disponible,
      descripcion: vehicle.descripcion,
    })
  }

  return {
    formData,
    formErrors,
    handleInputChange,
    validateForm,
    resetForm,
    setFormFromVehicle,
  }
}
