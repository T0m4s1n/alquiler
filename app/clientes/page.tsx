"use client"

import type React from "react"

import { useState, useEffect } from "react"

import type { Client } from "./types/client"

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

// Hooks
import useClientApi from "./hooks/use-client-api"
import usePagination from "./hooks/use-pagination"
import useSearch from "./hooks/use-search"
import useForm from "./hooks/use-form"
import useModal from "./hooks/use-modal"

// Types
import type { FilterType } from "./types/client"

// Constants
const CLIENTS_PER_PAGE = 8

export default function ClientDashboard() {
  // State for top clients toggle
  const [showTopClients, setShowTopClients] = useState(false)

  // State for filtering
  const [isFiltering, setIsFiltering] = useState(false)
  const [activeFilterType, setActiveFilterType] = useState<FilterType>("all")
  const [activeFilterValue, setActiveFilterValue] = useState("")

  // State for side drawer
  const [showDrawer, setShowDrawer] = useState(false)
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create")

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

  // Pagination hook
  const { currentPage, totalPages, getCurrentPageItems, goToPage } = usePagination(filteredClients, CLIENTS_PER_PAGE)

  // Form hook
  const { formData, formErrors, handleInputChange, validateForm, resetForm, setFormFromClient } = useForm()

  // Modal hook
  const { showModal, modalMode, currentClient, openModal, closeModal, getModalTitle, updateCurrentClient } = useModal()

  // Effect to animate main content when drawer opens/closes
  useEffect(() => {
    if (showDrawer) {
      // Small delay to ensure animation is visible
      setTimeout(() => {
        setMainContentClass("md:translate-x-[225px] lg:translate-x-[275px] transition-all duration-700 ease-in-out")
      }, 50)
    } else {
      setMainContentClass("md:translate-x-0 transition-all duration-700 ease-in-out")
    }
  }, [showDrawer])

  // Toggle top clients view
  const toggleTopClients = () => {
    setShowTopClients(!showTopClients)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) return

    let success = false

    if (drawerMode === "create") {
      success = await createClient(formData)
    } else if (drawerMode === "edit" && currentClient) {
      success = await updateClient(currentClient.id, formData)
    }

    if (success) {
      closeDrawer()
      resetForm()
    }
  }

  // Handle delete client
  const handleDeleteClient = async () => {
    if (!currentClient) return

    const success = await deleteClient(currentClient.id)

    if (success) {
      closeModal()
    }
  }

  // Types


  // Open drawer with appropriate mode
  const openDrawer = (mode: "create" | "edit", client: Client | null = null) => {
    if (mode === "create") {
      resetForm()
    } else if (client) {
      setFormFromClient(client)
    }
  
    setDrawerMode(mode)
    updateCurrentClient(client)
    setShowDrawer(true)
  }

  // Close drawer
  const closeDrawer = () => {
    setShowDrawer(false)
  }

  // Get drawer title based on mode
  const getDrawerTitle = () => {
    return drawerMode === "create" ? "Crear Nuevo Cliente" : "Editar Cliente"
  }

  // Open modal with appropriate mode (only for view and delete)
  const handleOpenModal = (mode: "view" | "delete", client: Client | null = null) => {
    openModal(mode, client)
  }

  // Handle edit from view mode
  const handleEditFromView = () => {
    closeModal()
    setTimeout(() => openDrawer("edit", currentClient), 100)
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

  return (
    <div className="min-h-screen bg-gray-50 font-[Poppins] overflow-x-hidden">
      {/* Fondo con iconos - ahora como primer elemento */}
      <ClientsBackground iconCount={500} zIndex={0} />

      <div className="relative z-10">
        {/* Header */}
        <DashboardHeader
          showTopClients={showTopClients}
          toggleTopClients={toggleTopClients}
          openCreateModal={() => openDrawer("create")}
        />

        {/* Alert message */}
        <AlertMessage message={alertMessage} type={alertType} show={showAlert} />

        {/* Side Drawer for form */}
        <SideDrawer show={showDrawer} title={getDrawerTitle()} onClose={closeDrawer}>
          <CompactClientForm
            formData={formData}
            formErrors={formErrors}
            loading={loading}
            modalMode={drawerMode}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={closeDrawer}
          />
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
                      clients={getCurrentPageItems()}
                      onView={(client) => handleOpenModal("view", client)}
                      onEdit={(client) => openDrawer("edit", client)}
                      onDelete={(client) => handleOpenModal("delete", client)}
                    />
                  </div>

                  {/* Pagination */}
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
                </>
              )}
            </div>
          </main>
        </div>

        {/* Modal for view or delete (no longer for forms) */}
        <Modal show={showModal} title={getModalTitle()} onClose={closeModal}>
          {modalMode === "delete" && currentClient ? (
            <DeleteConfirmation
              client={currentClient}
              loading={loading}
              onConfirm={handleDeleteClient}
              onCancel={closeModal}
            />
          ) : modalMode === "view" && currentClient ? (
            <ClientDetails client={currentClient} onClose={closeModal} onEdit={handleEditFromView} />
          ) : null}
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
