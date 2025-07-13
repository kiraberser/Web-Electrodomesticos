

export const FeaturesGrid = () => {
    return (
        <div className="m-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:mt-12 lg:grid-cols-4 ">
            <div className="flex flex-col items-center rounded-lg bg-white p-4 text-center shadow-sm">
                <div className="mb-2 rounded-full bg-[#D4EBF8] p-2">
                    <svg className="h-6 w-6 text-[#0A3981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-sm font-semibold text-[#0A3981]">Servicio Rápido</h3>
                <p className="text-xs text-gray-600">24/7</p>
            </div>

            <div className="flex flex-col items-center rounded-lg bg-white p-4 text-center shadow-sm">
                <div className="mb-2 rounded-full bg-[#D4EBF8] p-2">
                    <svg className="h-6 w-6 text-[#0A3981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <h3 className="text-sm font-semibold text-[#0A3981]">Garantía</h3>
                <p className="text-xs text-gray-600">100% Garantizado</p>
            </div>

            <div className="flex flex-col items-center rounded-lg bg-white p-4 text-center shadow-sm">
                <div className="mb-2 rounded-full bg-[#D4EBF8] p-2">
                    <svg className="h-6 w-6 text-[#0A3981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <h3 className="text-sm font-semibold text-[#0A3981]">Repuestos</h3>
                <p className="text-xs text-gray-600">Originales</p>
            </div>

            <div className="flex flex-col items-center rounded-lg bg-white p-4 text-center shadow-sm">
                <div className="mb-2 rounded-full bg-[#D4EBF8] p-2">
                    <svg className="h-6 w-6 text-[#0A3981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                <h3 className="text-sm font-semibold text-[#0A3981]">Técnicos</h3>
                <p className="text-xs text-gray-600">Certificados</p>
            </div>
        </div>
    );
}

