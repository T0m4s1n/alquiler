"use client"

import type React from "react"

import { useState, useEffect } from "react"

// Components
import DashboardHeader from "./components/dashboard-header"
import SearchBar from "./components/search-bar"
import FilterBar from "./components/filter-bar"
import TopClientsSection from "./components/top-clients-section"
import ClientsTable from "./components/clients-table"
import Pagination from "./components/pagination"
import Modal from "./components/modal"
import ClientDetails from "./components/client-details"
import DeleteConfirmation from "./components/delete-confirmation"
import AlertMessage from "./components/alert-message"
import LoadingSpinner from "./components/loading-spinner"
import ErrorState from "./components/error-state"
import EmptyState from "./components/empty-state"
import SideDrawer from "./components/side-drawer"
import ClientsBackground from "./components/clients-background"
import CompactClientForm from "./components/compact-client-form"
import type { ErrorRecord } from "./components/error-history"

// Hooks
import useClientApi from "./hooks/use-client-api"
import usePagination from "./hooks/use-pagination"
import useSearch from "./hooks/use-search"
import useForm from "./hooks/use-form"
import useModal from "./hooks/use-modal"

// Types
import type { FilterType, Client } from "./types/client"

// Constants
const CLIENTS_PER_PAGE = 8
const MAX_ERROR_HISTORY = 10

export default function ClientDashboard() {
  // State for top clients toggle
  const [showTopClients, setShowTopClients] = useState(false)

  // State for filtering
  const [isFiltering, setIsFiltering] = useState(false)
  const [activeFilterType, setActiveFilterType] = useState<FilterType>("all")
  const [activeFilterValue, setActiveFilterValue] = useState("")

  // State for side drawer (form)
  const [showFormDrawer, setShowFormDrawer] = useState(false)
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create")

  // State for side drawer (details)
  const [showDetailsDrawer, setShowDetailsDrawer] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  // State for form errors
  const [formApiError, setFormApiError] = useState<string | null>(null)
  const [errorHistory, setErrorHistory] = useState<ErrorRecord[]>([])

  // State for main content
  const [mainContentClass, setMainContentClass] = useState("")

  // API and data hooks
  const {
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
  } = useClientApi()

  // Search hook
  const { searchTerm, filteredClients, handleSearchChange, clearSearch } = useSearch(clients)

  // Verificar si hay una búsqueda activa
  const isSearchActive = searchTerm.trim() !== ""

  // Pagination hook
  const { currentPage, totalPages, getCurrentPageItems, goToPage } = usePagination(filteredClients, CLIENTS_PER_PAGE)

  // Form hook
  const { formData, formErrors, handleInputChange, validateForm, resetForm, setFormFromClient } = useForm()

  // Modal hook (solo para confirmación de eliminación)
  const { showModal, modalMode, currentClient, openModal, closeModal, updateCurrentClient } = useModal()

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

  // Toggle top clients view
  const toggleTopClients = () => {
    setShowTopClients(!showTopClients)
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
      addErrorToHistory(formApiError, drawerMode === "create" ? "Crear Cliente" : "Actualizar Cliente")
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

    try {
      if (drawerMode === "create") {
        success = await createClient(formData)
      } else if (drawerMode === "edit" && currentClient) {
        success = await updateClient(currentClient.id, formData)
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

  // Handle delete client
  const handleDeleteClient = async () => {
    if (!currentClient) return

    try {
      const success = await deleteClient(currentClient.id)

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
      addErrorToHistory(errorMessage, "Eliminar Cliente")
    }
  }

  // Open form drawer with appropriate mode
  const openFormDrawer = (mode: "create" | "edit", client: Client | null = null) => {
    // Cerrar el drawer de detalles si está abierto
    if (showDetailsDrawer) {
      setShowDetailsDrawer(false)
    }

    // Limpiar errores previos
    setFormApiError(null)

    if (mode === "create") {
      resetForm()
    } else if (client) {
      setFormFromClient(client)
    }

    setDrawerMode(mode)
    updateCurrentClient(client)
    setShowFormDrawer(true)
  }

  // Close form drawer
  const closeFormDrawer = () => {
    // Si hay un error actual, añadirlo al historial antes de cerrar
    if (formApiError) {
      addErrorToHistory(formApiError, drawerMode === "create" ? "Crear Cliente" : "Actualizar Cliente")
    }

    setShowFormDrawer(false)
    setFormApiError(null) // Limpiar errores al cerrar
  }

  // Open details drawer
  const openDetailsDrawer = (client: any) => {
    // Cerrar el drawer de formulario si está abierto
    if (showFormDrawer) {
      setShowFormDrawer(false)
    }

    setSelectedClient(client)
    setShowDetailsDrawer(true)
  }

  // Close details drawer
  const closeDetailsDrawer = () => {
    setShowDetailsDrawer(false)
  }

  // Get drawer title based on mode
  const getFormDrawerTitle = () => {
    return drawerMode === "create" ? "Crear Nuevo Cliente" : "Editar Cliente"
  }

  // Handle edit from view mode
  const handleEditFromDetails = () => {
    closeDetailsDrawer()
    setTimeout(() => openFormDrawer("edit", selectedClient), 100)
  }

  // Open delete confirmation modal
  const openDeleteModal = (client: any) => {
    openModal("delete", client)
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
    fetchFilteredClients(filterType, filterValue)
  }

  // Handle clearing filter
  const handleClearFilter = () => {
    setIsFiltering(false)
    setActiveFilterType("all")
    setActiveFilterValue("")
    fetchClients()
  }
  
  // Obtener los clientes a mostrar (todos los filtrados si hay búsqueda activa, o solo la página actual)
  const getDisplayedClients = () => {
    // Si hay búsqueda activa, mostramos todos los resultados filtrados
    if (isSearchActive) {
      return filteredClients
    }
    
    // Si no hay búsqueda, mostramos solo la página actual
    return getCurrentPageItems()
  }

  return (
    <div className="min-h-screen bg-gray-50 font-[Poppins] overflow-x-hidden">
      {/* Fondo con iconos - ahora como primer elemento */}
      <ClientsBackground iconCount={500} zIndex={0} />

      <div className="relative z-10">
        {/* Header */}
        <DashboardHeader
          showTopClients={showTopClients}
          toggleTopClients={toggleTopClients}
          openCreateModal={() => openFormDrawer("create")}
        />

        {/* Alert message */}
        <AlertMessage message={alertMessage} type={alertType} show={showAlert} />

        {/* Side Drawer para formulario */}
        <SideDrawer show={showFormDrawer} title={getFormDrawerTitle()} onClose={closeFormDrawer}>
          <CompactClientForm
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

        {/* Side Drawer para detalles del cliente */}
        <SideDrawer show={showDetailsDrawer} title="Detalles del Cliente" onClose={closeDetailsDrawer}>
          {selectedClient && (
            <ClientDetails client={selectedClient} onClose={closeDetailsDrawer} onEdit={handleEditFromDetails} />
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
              totalItems={filteredClients.length}
              currentPage={currentPage}
              itemsPerPage={CLIENTS_PER_PAGE}
              isSearchActive={isSearchActive}
            />

            {/* Top clients section */}
            <TopClientsSection topClients={topClients} show={showTopClients} />

            {/* Clients data grid */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
              {isFiltering && (
                <div className="mb-4 p-2 bg-gray-100/90 rounded-md flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Filtro activo:</span>
                    <span className="font-medium">
                      {activeFilterType === "nombre"
                        ? "Nombre"
                        : activeFilterType === "documento"
                          ? "Documento"
                          : activeFilterType === "email"
                            ? "Email"
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
                  onRetry={isFiltering ? () => handleFilter(activeFilterType, activeFilterValue) : fetchClients}
                />
              ) : filteredClients.length === 0 ? (
                <EmptyState searchTerm={searchTerm} onClearSearch={clearSearch} />
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <ClientsTable
                      clients={getDisplayedClients()}
                      onView={(client) => openDetailsDrawer(client)}
                      onEdit={(client) => openFormDrawer("edit", client)}
                      onDelete={(client) => openDeleteModal(client)}
                    />
                  </div>

                  {/* Pagination - solo se muestra si no hay búsqueda activa */}
                  {!isSearchActive && (
                    <Pagination 
                      currentPage={currentPage} 
                      totalPages={totalPages} 
                      onPageChange={goToPage}
                      isSearchActive={isSearchActive}
                    />
                  )}
                </>
              )}
            </div>
          </main>
        </div>

        {/* Modal solo para confirmación de eliminación */}
        <Modal show={showModal && modalMode === "delete"} title="Eliminar Cliente" onClose={closeModal}>
          {modalMode === "delete" && currentClient && (
            <DeleteConfirmation
              client={currentClient}
              loading={loading}
              onConfirm={handleDeleteClient}
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