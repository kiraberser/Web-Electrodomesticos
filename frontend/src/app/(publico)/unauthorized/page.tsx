import Link from "next/link";

const UnauthorizedPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Acceso no autorizado</h1>
                <p className="text-gray-600 mb-6">No tienes permisos para acceder a esta página.</p>
                <Link
                    href="/"
                    className="inline-flex items-center bg-[#0A3981] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#0A3981]/90 transition-colors"
                >
                    Volver al inicio
                </Link>
            </div>
        </div>
    )
}

export default UnauthorizedPage;
