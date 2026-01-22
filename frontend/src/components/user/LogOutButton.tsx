"use client"

import { actionLogOutUser } from "@/actions/auth"
import { useCart } from "@/context/CartContext"

const LogOutButton = () => {
    const { clearLocalCart } = useCart()

    const handleLogoutClick = () => {
        try {
            localStorage.removeItem('electromart-cart')
        } catch {
            // ignore storage errors
        }
        clearLocalCart()
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('cart-auth-changed'))
        }
    }

    return (
        <div className="border-t border-gray-100 pt-1">
            <form action={actionLogOutUser}>
                <button
                    type="submit"
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    onClick={handleLogoutClick}
                >
                    Cerrar Sesión
                </button>
            </form>
        </div>
    )
}

export default LogOutButton