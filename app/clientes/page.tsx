"use client"

import type React from "react"

import { useState } from "react"

// Use the shared Client type definition
import type { Client } from "./types/client"

// Components
import DashboardHeader from "./components/dashboard-header"
import SearchBar from "./components/search-bar"
import TopClientsSection from "./components/top-clients-section"
import ClientsTable from "./components/clients-table"
import Pagination from "./components/pagination"
import Modal from "./components/modal"
import ClientForm from "./components/client-form"
import ClientDetails from "./components/client-details"
import DeleteConfirmation from "./components/delete-confirmation"
import AlertMessage from "./components/alert-message"
import LoadingSpinner from "./components/loading-spinner"
import ErrorState from "./components/error-state"
import EmptyState from "./components/empty-state"

// Hooks
import useClientApi from "./hooks/use-client-api"
import usePagination from "./hooks/use-pagination"
import useSearch from "./hooks/use-search"
import useForm from "./hooks/use-form"
import useModal from "./hooks/use-modal"

// Constants
const CLIENTS_PER_PAGE = 8

export default function ClientDashboard() {
  // State for top clients toggle
  const [showTopClients, setShowTopClients] = useState(false)

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
  const { showModal, modalMode, currentClient, openModal, closeModal, getModalTitle } = useModal()

  // Toggle top clients view
  const toggleTopClients = () => {
    setShowTopClients(!showTopClients)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) return

    let success = false

    if (modalMode === "create") {
      success = await createClient(formData)
    } else if (modalMode === "edit" && currentClient) {
      success = await updateClient(currentClient.id, formData)
    }

    if (success) {
      closeModal()
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

  // Open modal with appropriate mode
  const handleOpenModal = (
    mode: "create" | "edit" | "view" | "delete",
    client: Client | null = null
  ) => {
    if (mode === "create") {
      resetForm()
    } else if (client) {
      setFormFromClient(client)
    }

    openModal(mode, client)
  }

  // Handle edit from view mode
  const handleEditFromView = () => {
    closeModal()
    setTimeout(() => {
      if (currentClient) {
        handleOpenModal("edit", currentClient)
      }
    }, 100)
  }

  return (
    <div className="min-h-screen bg-gray-100 font-[Poppins]">
      {/* Header */}
      <DashboardHeader
        showTopClients={showTopClients}
        toggleTopClients={toggleTopClients}
        openCreateModal={() => handleOpenModal("create")}
      />

      {/* Alert message */}
      <AlertMessage message={alertMessage} type={alertType} show={showAlert} />

      <main className="container mx-auto py-8 px-4">
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

        {/* Clients data grid */}x
        <div className="bg-white rounded-xl shadow-md p-6">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorState message={error} onRetry={fetchClients} />
          ) : filteredClients.length === 0 ? (
            <EmptyState searchTerm={searchTerm} onClearSearch={clearSearch} />
          ) : (
            <>
              <div className="overflow-x-auto">
                <ClientsTable
                  clients={getCurrentPageItems()}
                  onView={(client) => handleOpenModal("view", client)}
                  onEdit={(client) => handleOpenModal("edit", client)}
                  onDelete={(client) => handleOpenModal("delete", client)}
                />
              </div>

              {/* Pagination */}
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
            </>
          )}
        </div>
      </main>

      {/* Modal for create, edit, view or delete */}
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
        ) : (
          <ClientForm
            formData={formData}
            formErrors={formErrors}
            loading={loading}
            modalMode={modalMode as "create" | "edit"}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={closeModal}
          />
        )}
      </Modal>

      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes zoomIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-zoomIn {
          animation: zoomIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
