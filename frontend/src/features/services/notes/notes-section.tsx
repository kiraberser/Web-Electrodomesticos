"use client"

import { FileText } from "lucide-react"
import { useAdminTheme } from "@/features/admin/hooks/useAdminTheme"

export default function NotesSection({ notes, onNotesChange }: { notes: string; onNotesChange: (v: string) => void }) {
    const { dark } = useAdminTheme()
    
    return (
        <div className={`rounded-xl shadow-sm border overflow-hidden ${
            dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>
            <div className={`bg-gradient-to-r px-6 py-4 border-b ${
                dark 
                    ? "from-purple-900/30 to-pink-900/30 border-gray-700" 
                    : "from-purple-50 to-pink-50 border-gray-200"
            }`}>
                <h2 className={`text-lg font-semibold flex items-center ${
                    dark ? "text-gray-100" : "text-gray-900"
                }`}>
                    <FileText className={`w-5 h-5 mr-2 ${dark ? "text-purple-400" : "text-purple-600"}`} />
                    Notas y Observaciones
                </h2>
            </div>

            <div className="p-6">
                <textarea
                    value={notes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    placeholder="Describe trabajos, refacciones utilizadas, observaciones..."
                    rows={6}
                    className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none transition-all duration-200 ${
                        dark 
                            ? "bg-gray-800 text-gray-100 border-gray-600 placeholder:text-gray-400" 
                            : "bg-white text-gray-900 border-gray-300 placeholder:text-gray-700"
                    } border`}
                />
            </div>
        </div>
    )
}












