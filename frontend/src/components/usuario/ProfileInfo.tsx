"use client"

import { Calendar, Mail, MapPin, Phone, User } from "lucide-react"
import type { UserProfile } from "@/types/user"
import { InfoItem } from "./InfoItem"

interface ProfileInfoProps {
    user: UserProfile
}

export function ProfileInfo({ user }: ProfileInfoProps) {
    // Formateo de fecha para mejor UX
    const formattedDate = new Date(user.date_joined).toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    return (
        <div className="px-6 pb-8">
            {/* Grid de Información */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-8">
                <InfoItem
                    icon={<Mail className="text-[#1F509A]" size={20} />}
                    label="Correo Electrónico"
                    value={user.email}
                />

                <InfoItem
                    icon={<Phone className="text-[#1F509A]" size={20} />}
                    label="Teléfono"
                    value={user.phone || "Sin teléfono registrado"}
                />

                <InfoItem
                    icon={<Calendar className="text-[#1F509A]" size={20} />}
                    label="Miembro desde"
                    value={formattedDate}
                />

                {/* Address Display */}
                {user.full_address || user.address_street ? (
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <div className="mt-1">
                                <MapPin className="text-[#1F509A]" size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-400 mb-2">Dirección de Envío</p>
                                <div className="space-y-1">
                                    {user.address_street && (
                                        <p className="text-gray-800 font-medium">{user.address_street}</p>
                                    )}
                                    {user.address_colony && (
                                        <p className="text-gray-700">{user.address_colony}</p>
                                    )}
                                    {(user.address_city || user.address_state) && (
                                        <p className="text-gray-700">
                                            {[user.address_city, user.address_state].filter(Boolean).join(", ")}
                                        </p>
                                    )}
                                    {user.address_postal_code && (
                                        <p className="text-gray-600 text-sm">CP: {user.address_postal_code}</p>
                                    )}
                                    {user.address_references && (
                                        <p className="text-gray-600 text-sm italic mt-2">
                                            Referencias: {user.address_references}
                                        </p>
                                    )}
                                    {!user.address_street && user.address && (
                                        <p className="text-gray-800 font-medium">{user.address}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <InfoItem
                        icon={<MapPin className="text-[#1F509A]" size={20} />}
                        label="Dirección"
                        value="Sin dirección registrada"
                    />
                )}

                <div className="col-span-1 md:col-span-2 mt-4 p-4 bg-[#D4EBF8]/30 rounded-lg border border-[#D4EBF8]">
                    <h3 className="text-[#0A3981] font-semibold mb-2 flex items-center gap-2">
                        <User size={18} /> Biografía
                    </h3>
                    <p className="text-gray-600 italic">
                        {user.bio ||
                            "Aún no has escrito una biografía. ¡Cuéntanos sobre ti!"}
                    </p>
                </div>
            </div>
        </div>
    )
}

