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