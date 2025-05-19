// Define el tipo Vehicle
export type Vehicle = {
  id: number
  marca: string
  modelo: string
  matricula: string
  anio: number
  tipo: VehicleType
  color: string
  precioPorDia: number
  disponible: boolean
  descripcion: string
  promedioDias?: number
}

export type VehicleType = "SEDAN" | "SUV" | "HATCHBACK" | "PICKUP" | "DEPORTIVO" | "MINIVAN" | "OTRO"

export type VehicleTypeAverage = {
  tipoVehiculo: VehicleType
  promedioDias: number
}

export type FormData = {
  marca: string
  modelo: string
  matricula: string
  anio: number
  tipo: VehicleType
  color: string
  precioPorDia: number
  disponible: boolean
  descripcion: string
}

export type FormErrors = {
  [key: string]: string
}

export type AlertType = "success" | "error"

export type ModalMode = "create" | "edit" | "view" | "delete"

export type FilterType = "all" | "marca" | "matricula" | "tipo" | "disponible"

export type FilterOption = {
  value: FilterType
  label: string
}
