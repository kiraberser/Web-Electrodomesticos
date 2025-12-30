import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getUser } from "@/api/user"
import type { UserProfile } from "@/types/user"
import { PerfilClient } from "./PerfilClient"

export const metadata: Metadata = {
    title: "Perfil - Refaccionaria Vega",
    description: "Gestiona tu perfil de usuario",
}

export default async function PerfilPage() {
    try {
        const user = await getUser()

        if (!user) {
            redirect("/cuenta")
        }

        // Asegurar que el usuario tenga el tipo correcto
        const userProfile: UserProfile = {
            id: user.id,
            username: user.username,
            email: user.email,
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            phone: user.phone || "",
            bio: user.bio || null,
            avatar: user.avatar || null,
            address_street: user.address_street || null,
            address_colony: user.address_colony || null,
            address_city: user.address_city || null,
            address_state: user.address_state || null,
            address_postal_code: user.address_postal_code || null,
            address_references: user.address_references || null,
            full_address: user.full_address || null,
            address: user.address || null, // Legacy field
            primary_address: (user as any).primary_address || null, // Dirección principal desde Direccion
            date_joined: user.date_joined,
            is_staff: user.is_staff || false,
            is_superuser: user.is_superuser || false,
        }

        return <PerfilClient user={userProfile} />
    } catch (error) {
        console.error("Error loading user profile:", error)
        redirect("/cuenta")
    }
}
