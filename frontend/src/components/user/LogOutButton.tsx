import { actionLogOutUser } from "@/actions/auth"

const LogOutButton = () => {
    return (
        <div className="border-t border-gray-100 pt-1">
            <form action={actionLogOutUser}>
                <button
                    type="submit"
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                    Cerrar Sesión
                </button>
            </form>
        </div>
    )
}

export default LogOutButton