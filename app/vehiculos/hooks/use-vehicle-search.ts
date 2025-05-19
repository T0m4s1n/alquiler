"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Vehicle } from "../types/vehicle"

export default function useVehicleSearch(vehicles: Vehicle[]) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>(vehicles)

  // Update filtered vehicles when search term or vehicles change
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredVehicles(vehicles)
    } else {
      const filtered = vehicles.filter(
        (vehicle) =>
          `${vehicle.marca} ${vehicle.modelo}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.color.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredVehicles(filtered)
    }
  }, [searchTerm, vehicles])

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
    filteredVehicles,
    handleSearchChange,
    clearSearch,
  }
}
