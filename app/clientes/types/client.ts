// Define the Client type
export type Client = {
  id: number
  nombre: string
  apellido: string
  documento: string
  email: string
  telefono: string
  fechaNacimiento: string
  direccion: string
  fechaRegistro?: string
  cantidadAlquileres?: number
}

export type FormData = {
  nombre: string
  apellido: string
  documento: string
  email: string
  telefono: string
  fechaNacimiento: string
  direccion: string
}

export type FormErrors = {
  [key: string]: string
}

export type AlertType = "success" | "error"

export type ModalMode = "create" | "edit" | "view" | "delete"

export type FilterType = "all" | "nombre" | "documento" | "email"

export type FilterOption = {
  value: FilterType
  label: string
}
