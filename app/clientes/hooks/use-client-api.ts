"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import type { Client, FormData, AlertType, FilterType } from "../types/client"
import { API_BASE_URL } from "../config/api"

export default function useClientApi() {
  const [clients, setClients] = useState<Client[]>([])
  const [topClients, setTopClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Alert state
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] = useState<AlertType>("success")

  // Fetch clients on hook initialization
  useEffect(() => {
    fetchClients()
    fetchTopClients()
  }, [])

  // Fetch all clients from API
  const fetchClients = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/api/clientes`)
      const data = response.data

      setClients(data)
      setLoading(false)
      setError(null)
    } catch (err) {
      setError("Error al cargar los clientes")
      setLoading(false)
      console.error(err)
    }
  }

  // Fetch filtered clients from API
  const fetchFilteredClients = async (filterType: FilterType, filterValue: string) => {
    if (!filterValue.trim() || filterType === "all") {
      return fetchClients()
    }

    setLoading(true)
    try {
      let endpoint = `${API_BASE_URL}/api/clientes`

      switch (filterType) {
        case "nombre":
          endpoint = `${API_BASE_URL}/api/clientes/nombre/${filterValue}`
          break
        case "documento":
          endpoint = `${API_BASE_URL}/api/clientes/documento/${filterValue}`
          break
        case "email":
          endpoint = `${API_BASE_URL}/api/clientes/email/${filterValue}`
          break
      }

      const response = await axios.get(endpoint)
      const data = Array.isArray(response.data) ? response.data : [response.data]

      setClients(data)
      setLoading(false)
      setError(null)
    } catch (err) {
      setError("Error al filtrar los clientes")
      setLoading(false)
      console.error(err)
    }
  }

  // Fetch top clients from API
  const fetchTopClients = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/clientes/mas-alquileres`)
      const data = response.data

      setTopClients(data)
    } catch (err) {
      console.error("Error al cargar los clientes top:", err)
    }
  }

  // Create a new client
  const createClient = async (formData: FormData) => {
    setLoading(true)
    try {
      const response = await axios.post(`${API_BASE_URL}/api/clientes`, formData)
      const newClient = response.data

      setClients([...clients, newClient])
      showAlertMessage("Cliente creado con éxito", "success")
      return true
    } catch (err) {
      showAlertMessage("Error al crear el cliente", "error")
      console.error(err)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Update an existing client
  const updateClient = async (id: number, formData: FormData) => {
    setLoading(true)
    try {
      const response = await axios.put(`${API_BASE_URL}/api/clientes/${id}`, formData)
      const updatedClient = response.data

      setClients(clients.map((client) => (client.id === id ? updatedClient : client)))
      showAlertMessage("Cliente actualizado con éxito", "success")
      return true
    } catch (err) {
      showAlertMessage("Error al actualizar el cliente", "error")
      console.error(err)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Delete a client
  const deleteClient = async (id: number) => {
    setLoading(true)
    try {
      await axios.delete(`${API_BASE_URL}/api/clientes/${id}`)

      setClients(clients.filter((client) => client.id !== id))
      showAlertMessage("Cliente eliminado con éxito", "success")
      return true
    } catch (err) {
      showAlertMessage("Error al eliminar el cliente", "error")
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

    // Auto hide after 3 seconds
    setTimeout(() => {
      setShowAlert(false)
    }, 3000)
  }

  return {
    clients,
    topClients,
    loading,
    error,
    showAlert,
    alertMessage,
    alertType,
    fetchClients,
    fetchFilteredClients,
    createClient,
    updateClient,
    deleteClient,
  }
}
