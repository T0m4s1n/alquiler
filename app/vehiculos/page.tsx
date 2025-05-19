"use client"

import type React from "react"

import { useState, useEffect } from "react"

// Components
import DashboardHeader from "./components/dashboard-header"
import SearchBar from "./components/search-bar"
import FilterBar from "./components/filter-bar"
import StatsSection from "./components/stats-section"
import VehiclesTable from "./components/vehicles-table"
import Pagination from "./components/pagination"
import Modal from "./components/modal"
import VehicleDetails from "./components/vehicle-details"
import DeleteConfirmation from "./components/delete-confirmation"
import AlertMessage from "./components/alert-message"
import LoadingSpinner from "./components/loading-spinner"
import ErrorState from "./components/error-state"
import EmptyState from "./components/empty-state"
import SideDrawer from "./components/side-drawer"
import VehiclesBackground from "./components/vehicles-background"
import CompactVehicleForm from "./components/compact-vehicle-form"
import type { ErrorRecord } from "./components/error-history"

// Hooks
import useVehicleApi from "./hooks/use-vehicle-api"
import usePagination from "./hooks/use-pagination"
import useVehicleSearch from "./hooks/use-vehicle-search"
import useVehicleForm from "./hooks/use-vehicle-form"
import useModal from "./hooks/use-modal"

// Types
import type { FilterType } from "./types/vehicle"

// Constants
const VEHICLES_PER_PAGE = 8
const MAX_ERROR_HISTORY = 10

export default function VehicleDashboard() {
  // State for stats toggle
  const [showStats, setShowStats] = useState(false)

  // State for filtering
  const [isFiltering, setIsFiltering] = useState(false)
  const [activeFilterType, setActiveFilterType] = useState<FilterType>("all")
  const [activeFilterValue, setActiveFilterValue] = useState("")

  // State for side drawer (form)
  const [showFormDrawer, setShowFormDrawer] = useState(false)
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create")

  // State for side drawer (details)
  const [showDetailsDrawer, setShowDetailsDrawer] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null)

  // State for form errors
  const [formApiError, setFormApiError] = useState<string | null>(null)
  const [errorHistory, setErrorHistory] = useState<ErrorRecord[]>([])

  // State for main content
  const [mainContentClass, setMainContentClass] = useState("")

  // API and data hooks
  const {
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
  } = useVehicleApi()

  // Search hook
  const { searchTerm, filteredVehicles, handleSearchChange, clearSearch } = useVehicleSearch(vehicles)

  // Pagination hook
  const { currentPage, totalPages, getCurrentPageItems, goToPage } = usePagination(filteredVehicles, VEHICLES_PER_PAGE)

  // Form hook
  const { formData, formErrors, handleInputChange, validateForm, resetForm, setFormFromVehicle } = useVehicleForm()

  // Modal hook (solo para confirmación de eliminación)
  const {
    showModal,
    modalMode,
    currentClient: currentVehicle,
    openModal,
    closeModal,
    updateCurrentClient: updateCurrentVehicle,
  } = useModal()

  // Effect to animate main content when drawer opens/closes
  useEffect(() => {
    const isAnyDrawerOpen = showFormDrawer || showDetailsDrawer

    if (isAnyDrawerOpen) {
      // Small delay to ensure animation is visible
      setTimeout(() => {
        setMainContentClass("md:translate-x-[225px] lg:translate-x-[275px] transition-all duration-700 ease-in-out")
      }, 50)
    } else {
      setMainContentClass("md:translate-x-0 transition-all duration-700 ease-in-out")
    }
  }, [showFormDrawer, showDetailsDrawer])

  // Toggle stats view
  const toggleStats = () => {
    setShowStats(!showStats)
  }

  // Función para añadir un error al historial
  const addErrorToHistory = (message: string, operation: string) => {
    // Si ya hay un error con el mismo mensaje, no lo añadimos de nuevo
    if (errorHistory.some((err) => err.message === message)) {
      return
    }

    const newError: ErrorRecord = {
      id: Date.now().toString(),
      message,
      timestamp: new Date(),
      operation,
    }

    // Añadir el nuevo error al principio del historial y limitar a MAX_ERROR_HISTORY
    setErrorHistory((prev) => [newError, ...prev].slice(0, MAX_ERROR_HISTORY))
  }

  // Limpiar error actual del API
  const clearApiError = () => {
    if (formApiError) {
      // Añadir el error actual al historial antes de limpiarlo
      addErrorToHistory(formApiError, drawerMode === "create" ? "Crear Vehículo" : "Actualizar Vehículo")
      setFormApiError(null)
    }
  }

  // Limpiar todos los errores del historial
  const clearAllErrors = () => {
    setErrorHistory([])
  }

  // Limpiar un error específico del historial
  const clearHistoryError = (id: string) => {
    setErrorHistory((prev) => prev.filter((err) => err.id !== id))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Limpiar error previo
    setFormApiError(null)

    if (!validateForm()) return

    let success = false
    let errorMessage = null
    const operation = drawerMode === "create" ? "Crear Vehículo" : "Actualizar Vehículo"

    try {
      if (drawerMode === "create") {
        success = await createVehicle(formData)
      } else if (drawerMode === "edit" && currentVehicle) {
        success = await updateVehicle(currentVehicle.id, formData)
      }

      if (success) {
        closeFormDrawer()
        resetForm()
      }
    } catch (err: any) {
      // Capturar el mensaje de error
      errorMessage = err.message || "Error desconocido"

      // Si el error tiene una respuesta del servidor
      if (err.response && err.response.data) {
        if (typeof err.response.data.message === "string") {
          errorMessage = err.response.data.message
        } else if (typeof err.response.data.error === "string") {
          errorMessage = err.response.data.error
        } else if (typeof err.response.data === "string") {
          errorMessage = err.response.data
        }
      }

      // Establecer el error para mostrarlo en el formulario
      setFormApiError(errorMessage)
    }
  }

  // Handle delete vehicle
  const handleDeleteVehicle = async () => {
    if (!currentVehicle) return

    try {
      const success = await deleteVehicle(currentVehicle.id)

      if (success) {
        closeModal()
      }
    } catch (err: any) {
      // Capturar el mensaje de error
      let errorMessage = err.message || "Error desconocido"

      // Si el error tiene una respuesta del servidor
      if (err.response && err.response.data) {
        if (typeof err.response.data.message === "string") {
          errorMessage = err.response.data.message
        } else if (typeof err.response.data.error === "string") {
          errorMessage = err.response.data.error
        } else if (typeof err.response.data === "string") {
          errorMessage = err.response.data
        }
      }

      // Añadir al historial de errores
      addErrorToHistory(errorMessage, "Eliminar Vehículo")
    }
  }

  // Open form drawer with appropriate mode
  const openFormDrawer = (mode: "create" | "edit", vehicle = null) => {
    // Cerrar el drawer de detalles si está abierto
    if (showDetailsDrawer) {
      setShowDetailsDrawer(false)
    }

    // Limpiar errores previos
    setFormApiError(null)

    if (mode === "create") {
      resetForm()
    } else if (vehicle) {
      setFormFromVehicle(vehicle)
    }

    setDrawerMode(mode)
    updateCurrentVehicle(vehicle)
    setShowFormDrawer(true)
  }

  // Close form drawer
  const closeFormDrawer = () => {
    // Si hay un error actual, añadirlo al historial antes de cerrar
    if (formApiError) {
      addErrorToHistory(formApiError, drawerMode === "create" ? "Crear Vehículo" : "Actualizar Vehículo")
    }

    setShowFormDrawer(false)
    setFormApiError(null) // Limpiar errores al cerrar
  }

  // Open details drawer
  const openDetailsDrawer = (vehicle: any) => {
    // Cerrar el drawer de formulario si está abierto
    if (showFormDrawer) {
      setShowFormDrawer(false)
    }

    setSelectedVehicle(vehicle)
    setShowDetailsDrawer(true)
  }

  // Close details drawer
  const closeDetailsDrawer = () => {
    setShowDetailsDrawer(false)
  }

  // Get drawer title based on mode
  const getFormDrawerTitle = () => {
    return drawerMode === "create" ? "Crear Nuevo Vehículo" : "Editar Vehículo"
  }

  // Handle edit from view mode
  const handleEditFromDetails = () => {
    closeDetailsDrawer()
    setTimeout(() => openFormDrawer("edit", selectedVehicle), 100)
  }

  // Open delete confirmation modal
  const openDeleteModal = (vehicle: any) => {
    openModal("delete", vehicle)
  }

  // Handle filter application
  const handleFilter = (filterType: FilterType, filterValue: string) => {
    clearSearch() // Clear any local search when applying server-side filter

    setActiveFilterType(filterType)
    setActiveFilterValue(filterValue)

    if (filterType === "all" && !filterValue.trim()) {
      handleClearFilter()
      return
    }

    setIsFiltering(true)
    fetchFilteredVehicles(filterType, filterValue)
  }

  // Handle clearing filter
  const handleClearFilter = () => {
    setIsFiltering(false)
    setActiveFilterType("all")
    setActiveFilterValue("")
    fetchVehicles()
  }

  return (
    <div className="min-h-screen bg-gray-50 font-[Poppins] overflow-x-hidden">
      {/* Fondo con iconos - ahora como primer elemento */}
      <VehiclesBackground iconCount={500} zIndex={0} />

      <div className="relative z-10">
        {/* Header */}
        <DashboardHeader
          showStats={showStats}
          toggleStats={toggleStats}
          openCreateModal={() => openFormDrawer("create")}
        />

        {/* Alert message */}
        <AlertMessage message={alertMessage} type={alertType} show={showAlert} />

        {/* Side Drawer para formulario */}
        <SideDrawer show={showFormDrawer} title={getFormDrawerTitle()} onClose={closeFormDrawer}>
          <CompactVehicleForm
            formData={formData}
            formErrors={formErrors}
            loading={loading}
            modalMode={drawerMode}
            apiError={formApiError}
            errorHistory={errorHistory}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={closeFormDrawer}
            onClearError={clearApiError}
            onClearAllErrors={clearAllErrors}
            onClearHistoryError={clearHistoryError}
          />
        </SideDrawer>

        {/* Side Drawer para detalles del vehículo */}
        <SideDrawer show={showDetailsDrawer} title="Detalles del Vehículo" onClose={closeDetailsDrawer}>
          {selectedVehicle && (
            <VehicleDetails vehicle={selectedVehicle} onClose={closeDetailsDrawer} onEdit={handleEditFromDetails} />
          )}
        </SideDrawer>

        {/* Contenedor principal centrado con transición suave */}
        <div className={`flex justify-center transition-all duration-700 ease-in-out ${mainContentClass}`}>
          <main className="container max-w-5xl mx-auto py-8 px-4">
            {/* Filter bar */}
            <FilterBar onFilter={handleFilter} onClearFilter={handleClearFilter} isFiltering={isFiltering} />

            {/* Search and filters */}
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              totalItems={filteredVehicles.length}
              currentPage={currentPage}
              itemsPerPage={VEHICLES_PER_PAGE}
            />

            {/* Stats section */}
            <StatsSection unusedVehicles={unusedVehicles} typeAverages={typeAverages} show={showStats} />

            {/* Vehicles data grid */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
              {isFiltering && (
                <div className="mb-4 p-2 bg-gray-100/90 rounded-md flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Filtro activo:</span>
                    <span className="font-medium">
                      {activeFilterType === "marca"
                        ? "Marca"
                        : activeFilterType === "matricula"
                          ? "Matrícula"
                          : activeFilterType === "tipo"
                            ? "Tipo"
                            : activeFilterType === "disponible"
                              ? "Disponibles"
                              : "Todos"}
                    </span>
                    {activeFilterValue && activeFilterType !== "disponible" && (
                      <>
                        <span className="mx-2">|</span>
                        <span className="font-medium">{activeFilterValue}</span>
                      </>
                    )}
                  </div>
                  <button
                    onClick={handleClearFilter}
                    className="text-sm text-red-500 hover:text-red-700 transition-colors duration-300 hover:underline"
                  >
                    Limpiar filtro
                  </button>
                </div>
              )}

              {loading ? (
                <LoadingSpinner />
              ) : error ? (
                <ErrorState
                  message={error}
                  onRetry={isFiltering ? () => handleFilter(activeFilterType, activeFilterValue) : fetchVehicles}
                />
              ) : filteredVehicles.length === 0 ? (
                <EmptyState searchTerm={searchTerm} onClearSearch={clearSearch} />
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <VehiclesTable
                      vehicles={getCurrentPageItems()}
                      onView={(vehicle) => openDetailsDrawer(vehicle)}
                      onEdit={(vehicle) => openFormDrawer("edit", vehicle)}
                      onDelete={(vehicle) => openDeleteModal(vehicle)}
                    />
                  </div>

                  {/* Pagination */}
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
                </>
              )}
            </div>
          </main>
        </div>

        {/* Modal solo para confirmación de eliminación */}
        <Modal show={showModal && modalMode === "delete"} title="Eliminar Vehículo" onClose={closeModal}>
          {modalMode === "delete" && currentVehicle && (
            <DeleteConfirmation
              vehicle={currentVehicle}
              loading={loading}
              onConfirm={handleDeleteVehicle}
              onCancel={closeModal}
            />
          )}
        </Modal>
      </div>

      {/* Add custom CSS for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes zoomIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes slideDown {
          from { 
            opacity: 0;
            transform: translateY(-30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInRight {
          from { 
            opacity: 0;
            transform: translateX(-20px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInScale {
          from { 
            opacity: 0;
            transform: scale(0.8);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-zoomIn {
          animation: zoomIn 0.3s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.5s ease-out;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        
        .animate-fadeInRight {
          animation: fadeInRight 0.5s ease-out;
        }
        
        .animate-fadeInScale {
          animation: fadeInScale 0.5s ease-out;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .animate-pulse {
          animation: pulse 1.5s infinite;
        }
      `}</style>
    </div>
  )
}
