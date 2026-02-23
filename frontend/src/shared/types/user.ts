export type CreateUserType = {
    name: string
    phone: string
    email: string
    password: string
}

export type LoginUserType = {
    email: string
    password: string
}

export type UserProfile = {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
    phone: string
    bio: string | null
    avatar: string | null
    address_street: string | null
    address_colony: string | null
    address_city: string | null
    address_state: string | null
    address_postal_code: string | null
    address_references: string | null
    full_address: string | null
    address: string | null // Legacy field
    primary_address?: Direccion | null // Dirección principal desde modelo Direccion
    date_joined: string
    is_staff: boolean
    is_superuser: boolean
}

export type UpdateUserProfileInput = {
    first_name?: string
    last_name?: string
    email?: string
    phone?: string
    bio?: string
    address_street?: string
    address_colony?: string
    address_city?: string
    address_state?: string
    address_postal_code?: string
    address_references?: string
    avatar?: File | string | null
}

export type Direccion = {
    id: number
    nombre: string
    street: string
    colony: string
    city: string
    state: string
    postal_code: string
    references: string | null
    is_primary: boolean
    full_address: string
    tipo_lugar?: 'casa' | 'edificio' | 'abarrotes' | 'otro' | null
    barrio_privado?: boolean
    conserjeria?: boolean
    nombre_lugar?: string | null
    horario_apertura?: string | null
    horario_cierre?: string | null
    horario_24hs?: boolean
    horarios_adicionales?: Record<string, { apertura: string; cierre: string }>
    created_at: string
    updated_at: string
}

export type CreateDireccionInput = {
    nombre: string
    street: string
    colony: string
    city: string
    state: string
    postal_code: string
    references?: string
    is_primary?: boolean
    tipo_lugar?: 'casa' | 'edificio' | 'abarrotes' | 'otro'
    barrio_privado?: boolean
    conserjeria?: boolean
    nombre_lugar?: string
    horario_apertura?: string
    horario_cierre?: string
    horario_24hs?: boolean
    horarios_adicionales?: Record<string, { apertura: string; cierre: string }>
}

export type UpdateDireccionInput = Partial<CreateDireccionInput>