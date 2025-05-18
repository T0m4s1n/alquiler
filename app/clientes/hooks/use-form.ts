"use client"

import type React from "react"

import { useState } from "react"
import type { FormData, FormErrors, Client } from "../types/client.ts"

const initialFormData: FormData = {
  nombre: "",
  apellido: "",
  documento: "",
  email: "",
  telefono: "",
  fechaNacimiento: "",
  direccion: "",
}

export default function useForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [formErrors, setFormErrors] = useState<FormErrors>({})

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

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
    if (!formData.nombre.trim()) errors.nombre = "El nombre es obligatorio"
    if (!formData.apellido.trim()) errors.apellido = "El apellido es obligatorio"
    if (!formData.documento.trim()) errors.documento = "El documento es obligatorio"
    if (!formData.email.trim()) errors.email = "El email es obligatorio"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email inválido"
    if (!formData.telefono.trim()) errors.telefono = "El teléfono es obligatorio"
    if (!formData.fechaNacimiento) errors.fechaNacimiento = "La fecha de nacimiento es obligatoria"
    if (!formData.direccion.trim()) errors.direccion = "La dirección es obligatoria"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Reset form data
  const resetForm = () => {
    setFormData(initialFormData)
    setFormErrors({})
  }

  // Set form data from client
  const setFormFromClient = (client: Client) => {
    setFormData({
      nombre: client.nombre,
      apellido: client.apellido,
      documento: client.documento,
      email: client.email,
      telefono: client.telefono,
      fechaNacimiento: client.fechaNacimiento,
      direccion: client.direccion,
    })
  }

  return {
    formData,
    formErrors,
    handleInputChange,
    validateForm,
    resetForm,
    setFormFromClient,
  }
}
