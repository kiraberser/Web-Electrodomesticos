import Link from "next/link"
import { Phone, MapPin, Clock } from "lucide-react"
import { company } from "@/data/company"


const InformationBar = () => {
    return (
        <>
            <div className="bg-gradient-to-r from-[#0A3981] to-[#0A3981] text-white text-sm">
                <div className="container mx-auto px-4 py-2">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                        <div className="flex items-center space-x-4 text-xs sm:text-sm">
                            <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4 flex-shrink-0" />
                                <a
                                    href={`tel:${company.phone}`}
                                    className="hover:text-blue-200 transition-colors font-medium cursor-pointer"
                                >
                                    {company.phone}
                                </a>
                            </div>
                            <div className="w-px h-4 bg-blue-400"></div>
                            <div className="hidden sm:flex items-center space-x-2">
                                <MapPin className="w-4 h-4 flex-shrink-0" />
                                <span>{company.address}</span>
                            </div>
                            <div className="w-px h-4 bg-blue-400 hidden sm:block"></div>
                            <div className="hidden md:flex items-center space-x-2">
                                <Clock className="w-4 h-4 flex-shrink-0" />
                                <span>{company.hours}</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 text-xs sm:text-sm">
                            <div className="bg-orange-500 px-3 py-1 rounded-full text-white font-medium">
                                🚚 Envío gratis en compras +$800
                            </div>
                            <div className="hidden sm:flex items-center space-x-4">
                                <Link href="/blog" className="hover:text-blue-200 transition-colors font-medium cursor-pointer">
                                    Blog
                                </Link>
                                <div className="w-px h-4 bg-blue-400"></div>
                                <Link href="/contacto" className="hover:text-blue-200 transition-colors font-medium cursor-pointer">
                                    Contacto
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default InformationBar