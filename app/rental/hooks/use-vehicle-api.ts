"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import type { Vehicle, FormData, AlertType, FilterType, VehicleTypeAverage } from "../types/vehicle"
import { API_BASE_URL } from "../config/api"

export default function useVehicleApi() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [unusedVehicles, setUnusedVehicles] = useState<Vehicle[]>([])
  const [typeAverages, setTypeAverages] = useState<VehicleTypeAverage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Alert state
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] = useState<AlertType>("success")

  // Fetch vehicles on hook initialization
  useEffect(() => {
    fetchVehicles()
    fetchUnusedVehicles()
    fetchTypeAverages()
  }, [])

  // Función para extraer el mensaje de error del backend
  const extractErrorMessage = (err: any): string => {
    // Intentar obtener el mensaje de error del backend
    if (err.response && err.response.data) {
      // Si el backend devuelve un mensaje específico
      if (typeof err.response.data.message === "string") {
        return err.response.data.message
      }
      // Si el backend devuelve un objeto de error con mensaje
      if (typeof err.response.data.error === "string") {
        return err.response.data.error
      }
      // Si el backend devuelve directamente un string como mensaje
      if (typeof err.response.data === "string") {
        return err.response.data
      }
    }

    // Si no podemos extraer un mensaje específico, usar el mensaje genérico del error
    return err.message || "Error en la operación"
  }

  // Fetch all vehicles from API
  const fetchVehicles = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/api/vehiculos`)
      const data = response.data

      setVehicles(data)
      setLoading(false)
      setError(null)
    } catch (err) {
      const errorMessage = extractErrorMessage(err)
      setError(errorMessage)
      setLoading(false)
      console.error(err)
    }
  }

  // Fetch filtered vehicles from API
  const fetchFilteredVehicles = async (filterType: FilterType, filterValue: string) => {
    if (!filterValue.trim() || filterType === "all") {
      return fetchVehicles()
    }

    setLoading(true)
    try {
      let endpoint = `${API_BASE_URL}/api/vehiculos`

      switch (filterType) {
        case "marca":
          endpoint = `${API_BASE_URL}/api/vehiculos/marca/${filterValue}`
          break
        case "matricula":
          endpoint = `${API_BASE_URL}/api/vehiculos/matricula/${filterValue}`
          break
        case "tipo":
          endpoint = `${API_BASE_URL}/api/vehiculos/tipo/${filterValue}`
          break
        case "disponible":
          endpoint = `${API_BASE_URL}/api/vehiculos/disponibles`
          break
      }

      const response = await axios.get(endpoint)
      const data = Array.isArray(response.data) ? response.data : [response.data]

      setVehicles(data)
      setLoading(false)
      setError(null)
    } catch (err) {
      const errorMessage = extractErrorMessage(err)
      setError(`Error al filtrar los vehículos: ${errorMessage}`)
      setLoading(false)
      console.error(err)
    }
  }

  // Fetch unused vehicles from API
  const fetchUnusedVehicles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/vehiculos/sin-alquileres-ultimos-30-dias`)
      const data = response.data

      setUnusedVehicles(data)
    } catch (err) {
      console.error("Error al cargar los vehículos sin uso:", err)
    }
  }

  // Fetch type averages from API
  const fetchTypeAverages = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/vehiculos/promedio-duracion-por-tipo`)
      const data = response.data

      setTypeAverages(data)
    } catch (err) {
      console.error("Error al cargar los promedios por tipo:", err)
    }
  }

  // Create a new vehicle
  const createVehicle = async (formData: FormData) => {
    setLoading(true)
    try {
      const response = await axios.post(`${API_BASE_URL}/api/vehiculos`, formData)
      const newVehicle = response.data

      setVehicles([...vehicles, newVehicle])
      showAlertMessage("Vehículo creado con éxito", "success")
      return true
    } catch (err) {
      const errorMessage = extractErrorMessage(err)
      showAlertMessage(`Error al crear el vehículo: ${errorMessage}`, "error")
      console.error(err)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Update an existing vehicle
  const updateVehicle = async (id: number, formData: FormData) => {
    setLoading(true)
    try {
      const response = await axios.put(`${API_BASE_URL}/api/vehiculos/${id}`, formData)
      const updatedVehicle = response.data

      setVehicles(vehicles.map((vehicle) => (vehicle.id === id ? updatedVehicle : vehicle)))
      showAlertMessage("Vehículo actualizado con éxito", "success")
      return true
    } catch (err) {
      const errorMessage = extractErrorMessage(err)
      showAlertMessage(`Error al actualizar el vehículo: ${errorMessage}`, "error")
      console.error(err)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Delete a vehicle
  const deleteVehicle = async (id: number) => {
    setLoading(true)
    try {
      await axios.delete(`${API_BASE_URL}/api/vehiculos/${id}`)

      setVehicles(vehicles.filter((vehicle) => vehicle.id !== id))
      showAlertMessage("Vehículo eliminado con éxito", "success")
      return true
    } catch (err) {
      const errorMessage = extractErrorMessage(err)
      showAlertMessage(`Error al eliminar el vehículo: ${errorMessage}`, "error")
      console.error(err)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Show alert message
  const showAlertMessage = (message: string, type: AlertType) => {
    setAlertMessage(message)
    setAlertType(type)
    setShowAlert(true)

    // Auto hide after 5 seconds for longer error messages
    setTimeout(() => {
      setShowAlert(false)
    }, 5000)
  }

  return {
    vehicles,
    unusedVehicles,
    typeAverages,
    loading,
    error,
    showAlert,
    alertMessage,
    alertType,
    fetchVehicles,
    fetchFilteredVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
  }
}
