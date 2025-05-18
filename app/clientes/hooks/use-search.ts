"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Client } from "../types/client.ts"

export default function useSearch(clients: Client[]) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredClients, setFilteredClients] = useState<Client[]>(clients)

  // Update filtered clients when search term or clients change
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredClients(clients)
    } else {
      const filtered = clients.filter(
        (client) =>
          `${client.nombre} ${client.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.documento.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredClients(filtered)
    }
  }, [searchTerm, clients])

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  // Clear search
  const clearSearch = () => {
    setSearchTerm("")
  }

  return {
    searchTerm,
    filteredClients,
    handleSearchChange,
    clearSearch,
  }
}
