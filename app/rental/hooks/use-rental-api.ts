"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import type { Rental, RentalFormData, AlertType, FilterType, MonthlyIncomeByType } from "../types/rental"
import { API_BASE_URL } from "../config/api"

export default function useRentalApi() {
  const [rentals, setRentals] = useState<Rental[]>([])
  const [overdueRentals, setOverdueRentals] = useState<Rental[]>([])
  const [monthlyIncome, setMonthlyIncome] = useState<MonthlyIncomeByType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Alert state
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] = useState<AlertType>("success")

  // Fetch rentals on hook initialization
  useEffect(() => {
    fetchRentals()
    fetchOverdueRentals()
    fetchMonthlyIncome()
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

  // Fetch all rentals from API
  const fetchRentals = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/api/alquileres`)
      const data = response.data

      setRentals(data)
      setLoading(false)
      setError(null)
    } catch (err) {
      const errorMessage = extractErrorMessage(err)
      setError(errorMessage)
      setLoading(false)
      console.error(err)
    }
  }

  // Fetch filtered rentals from API
  const fetchFilteredRentals = async (filterType: FilterType, filterValue: string) => {
    if (!filterValue.trim() || filterType === "all") {
      return fetchRentals()
    }

    setLoading(true)
    try {
      let endpoint = `${API_BASE_URL}/api/alquileres`

      switch (filterType) {
        case "cliente":
          endpoint = `${API_BASE_URL}/api/alquileres/cliente/${filterValue}`
          break
        case "vehiculo":
          endpoint = `${API_BASE_URL}/api/alquileres/vehiculo/${filterValue}`
          break
        case "estado":
          endpoint = `${API_BASE_URL}/api/alquileres/estado/${filterValue}`
          break
        case "fecha":
          // Implementar lógica para filtrar por fecha si es necesario
          break
      }

      const response = await axios.get(endpoint)
      const data = Array.isArray(response.data) ? response.data : [response.data]

      setRentals(data)
      setLoading(false)
      setError(null)
    } catch (err) {
      const errorMessage = extractErrorMessage(err)
      setError(`Error al filtrar los alquileres: ${errorMessage}`)
      setLoading(false)
      console.error(err)
    }
  }

  // Fetch overdue rentals from API
  const fetchOverdueRentals = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/alquileres/vencidos`)
      const data = response.data

      setOverdueRentals(data)
    } catch (err) {
      console.error("Error al cargar los alquileres vencidos:", err)
    }
  }

  // Fetch monthly income by vehicle type
  const fetchMonthlyIncome = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/alquileres/ingresos-por-mes-y-tipo-vehiculo`)
      const data = response.data

      setMonthlyIncome(data)
    } catch (err) {
      console.error("Error al cargar los ingresos mensuales:", err)
    }
  }

  // Fetch rentals by client
  const fetchRentalsByClient = async (clientId: number) => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/api/alquileres/cliente/${clientId}`)
      const data = response.data

      setRentals(data)
      setLoading(false)
      setError(null)
      return data
    } catch (err) {
      const errorMessage = extractErrorMessage(err)
      setError(errorMessage)
      setLoading(false)
      console.error(err)
      return []
    }
  }

  // Fetch rentals by vehicle
  const fetchRentalsByVehicle = async (vehicleId: number) => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/api/alquileres/vehiculo/${vehicleId}`)
      const data = response.data

      setRentals(data)
      setLoading(false)
      setError(null)
      return data
    } catch (err) {
      const errorMessage = extractErrorMessage(err)
      setError(errorMessage)
      setLoading(false)
      console.error(err)
      return []
    }
  }

  // Fetch client rental history
  const fetchClientRentalHistory = async (clientId: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/alquileres/historial-cliente/${clientId}`)
      return response.data
    } catch (err) {
      console.error("Error al cargar el historial de alquileres del cliente:", err)
      return []
    }
  }

  // Create a new rental
  const createRental = async (formData: RentalFormData) => {
    setLoading(true)
    try {
      const response = await axios.post(`${API_BASE_URL}/api/alquileres`, formData)
      const newRental = response.data

      setRentals([...rentals, newRental])
      showAlertMessage("Alquiler creado con éxito", "success")
      return true
    } catch (err) {
      const errorMessage = extractErrorMessage(err)
      showAlertMessage(`Error al crear el alquiler: ${errorMessage}`, "error")
      console.error(err)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Update an existing rental
  const updateRental = async (id: number, formData: RentalFormData) => {
    setLoading(true)
    try {
      const response = await axios.put(`${API_BASE_URL}/api/alquileres/${id}`, formData)
      const updatedRental = response.data

      setRentals(rentals.map((rental) => (rental.id === id ? updatedRental : rental)))
      showAlertMessage("Alquiler actualizado con éxito", "success")
      return true
    } catch (err) {
      const errorMessage = extractErrorMessage(err)
      showAlertMessage(`Error al actualizar el alquiler: ${errorMessage}`, "error")
      console.error(err)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Complete a rental
  const completeRental = async (id: number, returnDate: string) => {
    setLoading(true)
    try {
      const response = await axios.patch(`${API_BASE_URL}/api/alquileres/${id}/completar?fechaDevolucion=${returnDate}`)
      const updatedRental = response.data

      setRentals(rentals.map((rental) => (rental.id === id ? updatedRental : rental)))
      showAlertMessage("Alquiler completado con éxito", "success")
      return true
    } catch (err) {
      const errorMessage = extractErrorMessage(err)
      showAlertMessage(`Error al completar el alquiler: ${errorMessage}`, "error")
      console.error(err)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Cancel a rental
  const cancelRental = async (id: number) => {
    setLoading(true)
    try {
      const response = await axios.patch(`${API_BASE_URL}/api/alquileres/${id}/cancelar`)
      const updatedRental = response.data

      setRentals(rentals.map((rental) => (rental.id === id ? updatedRental : rental)))
      showAlertMessage("Alquiler cancelado con éxito", "success")
      return true
    } catch (err) {
      const errorMessage = extractErrorMessage(err)
      showAlertMessage(`Error al cancelar el alquiler: ${errorMessage}`, "error")
      console.error(err)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Activate a rental
  const activateRental = async (id: number) => {
    setLoading(true)
    try {
      const response = await axios.patch(`${API_BASE_URL}/api/alquileres/${id}/activar`)
      const updatedRental = response.data

      setRentals(rentals.map((rental) => (rental.id === id ? updatedRental : rental)))
      showAlertMessage("Alquiler activado con éxito", "success")
      return true
    } catch (err) {
      const errorMessage = extractErrorMessage(err)
      showAlertMessage(`Error al activar el alquiler: ${errorMessage}`, "error")
      console.error(err)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Delete a rental
  const deleteRental = async (id: number) => {
    setLoading(true)
    try {
      await axios.delete(`${API_BASE_URL}/api/alquileres/${id}`)

      setRentals(rentals.filter((rental) => rental.id !== id))
      showAlertMessage("Alquiler eliminado con éxito", "success")
      return true
    } catch (err) {
      const errorMessage = extractErrorMessage(err)
      showAlertMessage(`Error al eliminar el alquiler: ${errorMessage}`, "error")
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
    rentals,
    overdueRentals,
    monthlyIncome,
    loading,
    error,
    showAlert,
    alertMessage,
    alertType,
    fetchRentals,
    fetchFilteredRentals,
    fetchRentalsByClient,
    fetchRentalsByVehicle,
    fetchClientRentalHistory,
    createRental,
    updateRental,
    completeRental,
    cancelRental,
    activateRental,
    deleteRental,
  }
}
