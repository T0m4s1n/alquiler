"use client"

import { useState, useEffect } from "react"

export default function usePagination<T>(items: T[], itemsPerPage: number) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Update total pages when items change
  useEffect(() => {
    updateTotalPages(items.length)
  }, [items, itemsPerPage])

  // Update total pages based on items and items per page
  const updateTotalPages = (totalItems: number) => {
    setTotalPages(Math.max(1, Math.ceil(totalItems / itemsPerPage)))
  }

  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return items.slice(startIndex, endIndex)
  }

  // Handle pagination
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return {
    currentPage,
    totalPages,
    getCurrentPageItems,
    goToPage,
  }
}
