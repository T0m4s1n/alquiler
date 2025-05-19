// Define el tipo Rental (Alquiler)
export type Rental = {
  id: number
  clienteId: number
  nombreCliente: string
  vehiculoId: number
  detalleVehiculo: string
  fechaInicio: string
  fechaFin: string
  fechaCreacion: string
  fechaDevolucion: string | null
  costoTotal: number
  estado: RentalStatus
  observaciones: string
}

export type RentalStatus = "PENDIENTE" | "ACTIVO" | "COMPLETADO" | "CANCELADO"

export type RentalFormData = {
  clienteId: number
  vehiculoId: number
  fechaInicio: string
  fechaFin: string
  observaciones: string
}

export type RentalFormErrors = {
  [key: string]: string
}

export type MonthlyIncomeByType = {
  anio: number
  mes: number
  tipoVehiculo: string
  ingresoTotal: number
}

export type AlertType = "success" | "error"

export type ModalMode = "create" | "edit" | "view" | "delete"

export type FilterType = "all" | "cliente" | "vehiculo" | "estado" | "fecha"

export type FilterOption = {
  value: FilterType
  label: string
}

export type CalendarEvent = {
  id: number
  title: string
  start: Date
  end: Date
  status: RentalStatus
  clientName: string
  vehicleDetails: string
  color: string
}
