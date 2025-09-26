"use client"

import { FileText } from "lucide-react"

export default function NotesSection({ notes, onNotesChange }: { notes: string; onNotesChange: (v: string) => void }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-600" />
                    Notas y Observaciones
                </h2>
            </div>

            <div className="p-6">
                <textarea
                    value={notes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    placeholder="Describe trabajos, refacciones utilizadas, observaciones..."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none transition-all duration-200"
                />
            </div>
        </div>
    )
}












