"use client"

import type React from "react"

import { useState, useEffect } from "react"

// Components
import RentalDashboardHeader from "./components/rental-dashboard-header"
import SearchBar from "./components/search-bar"
import RentalFilterBar from "./components/rental-filter-bar"
import RentalCalendar from "./components/rental-calendar"
import RentalsTable from "./components/rentals-table"
import IncomeChart from "./components/income-chart"
import Pagination from "./components/pagination"
import Modal from "./components/modal"
import RentalDetails from "./components/rental-details"
import CompleteRentalModal from "./components/complete-rental-modal"
import DeleteConfirmation from "./components/delete-confirmation"
import AlertMessage from "./components/alert-message"
import LoadingSpinner from "./components/loading-spinner"
import ErrorState from "./components/error-state"
import EmptyState from "./components/empty-state"
import SideDrawer from "./components/side-drawer"
import RentalForm from "./components/rental-form"
import RentalsBackground from "./components/rentals-background"
import type { ErrorRecord } from "./components/error-history"

// Hooks
import useRentalApi from "./hooks/use-rental-api"
import useClientApi from "./hooks/use-client-api"
import useVehicleApi from "./hooks/use-vehicle-api"
import usePagination from "./hooks/use-pagination"
import useRentalForm from "./hooks/use-rental-form"
import useModal from "./hooks/use-modal"

// Types
import type { FilterType, Rental } from "./types/rental"

// Constants
const RENTALS_PER_PAGE = 8
const MAX_ERROR_HISTORY = 10

export default function RentalDashboard() {
  // State for calendar toggle
  const [showCalendar, setShowCalendar] = useState(false)

  // State for filtering
  const [isFiltering, setIsFiltering] = useState(false)
  const [activeFilterType, setActiveFilterType] = useState<FilterType>("all")
  const [activeFilterValue, setActiveFilterValue] = useState("")

  // State for side drawer (form)
  const [showFormDrawer, setShowFormDrawer] = useState(false)
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create")

  // State for side drawer (details)
  const [showDetailsDrawer, setShowDetailsDrawer] = useState(false)
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null)

  // State for complete rental modal
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [rentalToComplete, setRentalToComplete] = useState<Rental | null>(null)

  // State for form errors
  const [formApiError, setFormApiError] = useState<string | null>(null)
  const [errorHistory, setErrorHistory] = useState<ErrorRecord[]>([])

  // State for main content
  const [mainContentClass, setMainContentClass] = useState("")

  // State for search
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredRentals, setFilteredRentals] = useState<Rental[]>([])

  // API and data hooks
  const {
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
    createRental,
    updateRental,
    completeRental,
    cancelRental,
    activateRental,
    deleteRental,
  } = useRentalApi()

  // Client and vehicle API hooks
  const { clients, fetchClients } = useClientApi()
  const { vehicles, fetchVehicles } = useVehicleApi()

  // Pagination hook
  const { currentPage, totalPages, getCurrentPageItems, goToPage } = usePagination(filteredRentals, RENTALS_PER_PAGE)

  // Form hook
  const { formData, formErrors, handleInputChange, validateForm, resetForm, setFormFromRental } = useRentalForm()

  // Modal hook (solo para confirmación de eliminación)
  const {
    showModal,
    modalMode,
    currentClient: currentRental,
    openModal,
    closeModal,
    updateCurrentClient: updateCurrentRental,
  } = useModal()

  // Fetch clients and vehicles on mount
  useEffect(() => {
    fetchClients()
    fetchVehicles()
  }, [])

  // Filter rentals based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredRentals(rentals)
    } else {
      const filtered = rentals.filter(
        (rental) =>
          rental.nombreCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rental.detalleVehiculo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rental.estado.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredRentals(filtered)
    }
  }, [searchTerm, rentals])

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

  // Toggle calendar view
  const toggleCalendar = () => {
    setShowCalendar(!showCalendar)
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
      addErrorToHistory(formApiError, drawerMode === "create" ? "Crear Alquiler" : "Actualizar Alquiler")
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

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  // Clear search
  const clearSearch = () => {
    setSearchTerm("")
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Limpiar error previo
    setFormApiError(null)

    if (!validateForm()) return

    let success = false
    let errorMessage = null
    const operation = drawerMode === "create" ? "Crear Alquiler" : "Actualizar Alquiler"

    try {
      if (drawerMode === "create") {
        success = await createRental(formData)
      } else if (drawerMode === "edit" && currentRental) {
        success = await updateRental(currentRental.id, formData)
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

  // Handle delete rental
  const handleDeleteRental = async () => {
    if (!currentRental) return

    try {
      const success = await deleteRental(currentRental.id)

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
      addErrorToHistory(errorMessage, "Eliminar Alquiler")
    }
  }

  // Handle complete rental
  const handleCompleteRental = async (returnDate: string) => {
    if (!rentalToComplete) return

    try {
      const success = await completeRental(rentalToComplete.id, returnDate)

      if (success) {
        setShowCompleteModal(false)
        setRentalToComplete(null)
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
      addErrorToHistory(errorMessage, "Completar Alquiler")
    }
  }

  // Handle cancel rental
  const handleCancelRental = async (rental: Rental) => {
    try {
      await cancelRental(rental.id)
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
      addErrorToHistory(errorMessage, "Cancelar Alquiler")
    }
  }

  // Handle activate rental
  const handleActivateRental = async (rental: Rental) => {
    try {
      await activateRental(rental.id)
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
      addErrorToHistory(errorMessage, "Activar Alquiler")
    }
  }

  // Open form drawer with appropriate mode
  const openFormDrawer = (mode: "create" | "edit", rental = null) => {
    // Cerrar el drawer de detalles si está abierto
    if (showDetailsDrawer) {
      setShowDetailsDrawer(false)
    }

    // Limpiar errores previos
    setFormApiError(null)

    if (mode === "create") {
      resetForm()
    } else if (rental) {
      setFormFromRental(rental)
    }

    setDrawerMode(mode)
    updateCurrentRental(rental)
    setShowFormDrawer(true)
  }

  // Close form drawer
  const closeFormDrawer = () => {
    // Si hay un error actual, añadirlo al historial antes de cerrar
    if (formApiError) {
      addErrorToHistory(formApiError, drawerMode === "create" ? "Crear Alquiler" : "Actualizar Alquiler")
    }

    setShowFormDrawer(false)
    setFormApiError(null) // Limpiar errores al cerrar
  }

  // Open details drawer
  const openDetailsDrawer = (rental: Rental) => {
    // Cerrar el drawer de formulario si está abierto
    if (showFormDrawer) {
      setShowFormDrawer(false)
    }

    setSelectedRental(rental)
    setShowDetailsDrawer(true)
  }

  // Close details drawer
  const closeDetailsDrawer = () => {
    setShowDetailsDrawer(false)
  }

  // Get drawer title based on mode
  const getFormDrawerTitle = () => {
    return drawerMode === "create" ? "Crear Nuevo Alquiler" : "Editar Alquiler"
  }

  // Handle edit from view mode
  const handleEditFromDetails = () => {
    closeDetailsDrawer()
    setTimeout(() => openFormDrawer("edit", selectedRental), 100)
  }

  // Open delete confirmation modal
  const openDeleteModal = (rental: Rental) => {
    openModal("delete", rental)
  }

  // Open complete rental modal
  const openCompleteModal = (rental: Rental) => {
    setRentalToComplete(rental)
    setShowCompleteModal(true)
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
    fetchFilteredRentals(filterType, filterValue)
  }

  // Handle clearing filter
  const handleClearFilter = () => {
    setIsFiltering(false)
    setActiveFilterType("all")
    setActiveFilterValue("")
    fetchRentals()
  }

  return (
    <div className="min-h-screen bg-gray-50 font-[Poppins] overflow-x-hidden">
      {/* Fondo con iconos de alquileres */}
      <RentalsBackground iconCount={500} zIndex={0}/>

      <div className="relative z-10">
        {/* Header */}
        <RentalDashboardHeader
          showCalendar={showCalendar}
          toggleCalendar={toggleCalendar}
          openCreateModal={() => openFormDrawer("create")}
        />

        {/* Alert message */}
        <AlertMessage message={alertMessage} type={alertType} show={showAlert} />

        {/* Side Drawer para formulario */}
        <SideDrawer show={showFormDrawer} title={getFormDrawerTitle()} onClose={closeFormDrawer}>
          <RentalForm
            formData={formData}
            formErrors={formErrors}
            loading={loading}
            modalMode={drawerMode}
            apiError={formApiError}
            errorHistory={errorHistory}
            clients={clients}
            vehicles={vehicles}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={closeFormDrawer}
            onClearError={clearApiError}
            onClearAllErrors={clearAllErrors}
            onClearHistoryError={clearHistoryError}
          />
        </SideDrawer>

        {/* Side Drawer para detalles del alquiler */}
        <SideDrawer show={showDetailsDrawer} title="Detalles del Alquiler" onClose={closeDetailsDrawer}>
          {selectedRental && (
            <RentalDetails
              rental={selectedRental}
              onClose={closeDetailsDrawer}
              onEdit={handleEditFromDetails}
              onComplete={() => openCompleteModal(selectedRental)}
              onCancel={() => handleCancelRental(selectedRental)}
              onActivate={() => handleActivateRental(selectedRental)}
            />
          )}
        </SideDrawer>

        {/* Contenedor principal centrado con transición suave */}
        <div className={`flex justify-center transition-all duration-700 ease-in-out ${mainContentClass}`}>
          <main className="container max-w-5xl mx-auto py-8 px-4">
            {/* Filter bar */}
            <RentalFilterBar onFilter={handleFilter} onClearFilter={handleClearFilter} isFiltering={isFiltering} />

            {/* Search and filters */}
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              totalItems={filteredRentals.length}
              currentPage={currentPage}
              itemsPerPage={RENTALS_PER_PAGE}
            />

            {/* Income chart */}
            {monthlyIncome.length > 0 && (
              <div className="mb-8">
                <IncomeChart data={monthlyIncome} />
              </div>
            )}

            {/* Calendar view */}
            {showCalendar && (
              <div className="mb-8">
                <RentalCalendar rentals={rentals} onEventClick={openDetailsDrawer} />
              </div>
            )}

            {/* Rentals data grid */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
              {isFiltering && (
                <div className="mb-4 p-2 bg-gray-100/90 rounded-md flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Filtro activo:</span>
                    <span className="font-medium">
                      {activeFilterType === "cliente"
                        ? "Cliente"
                        : activeFilterType === "vehiculo"
                          ? "Vehículo"
                          : activeFilterType === "estado"
                            ? "Estado"
                            : activeFilterType === "fecha"
                              ? "Fecha"
                              : "Todos"}
                    </span>
                    {activeFilterValue && (
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
                  onRetry={isFiltering ? () => handleFilter(activeFilterType, activeFilterValue) : fetchRentals}
                />
              ) : filteredRentals.length === 0 ? (
                <EmptyState searchTerm={searchTerm} onClearSearch={clearSearch} />
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <RentalsTable
                      rentals={getCurrentPageItems()}
                      onView={(rental) => openDetailsDrawer(rental)}
                      onEdit={(rental) => openFormDrawer("edit", rental)}
                      onDelete={(rental) => openDeleteModal(rental)}
                      onComplete={(rental) => openCompleteModal(rental)}
                      onCancel={(rental) => handleCancelRental(rental)}
                      onActivate={(rental) => handleActivateRental(rental)}
                    />
                  </div>

                  {/* Pagination */}
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
                </>
              )}
            </div>
          </main>
        </div>

        {/* Modal para confirmación de eliminación */}
        <Modal show={showModal && modalMode === "delete"} title="Eliminar Alquiler" onClose={closeModal}>
          {modalMode === "delete" && currentRental && (
            <DeleteConfirmation
              rental={currentRental}
              loading={loading}
              onConfirm={handleDeleteRental}
              onCancel={closeModal}
            />
          )}
        </Modal>

        {/* Modal para completar alquiler */}
        <Modal show={showCompleteModal} title="Completar Alquiler" onClose={() => setShowCompleteModal(false)}>
          {rentalToComplete && (
            <CompleteRentalModal
              rental={rentalToComplete}
              loading={loading}
              onConfirm={handleCompleteRental}
              onCancel={() => setShowCompleteModal(false)}
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
