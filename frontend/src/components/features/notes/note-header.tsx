"use client"

import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/forms/Button"

interface NoteHeaderProps {
    costNote: { serviceNumber: number; clientName: string }
    saving: boolean
    onBack: () => void
    onSave: () => void
}

export default function NoteHeader({ costNote, saving, onBack, onSave }: NoteHeaderProps) {
    return (
        <div className="bg-white border-b border-gray-200 shadow-sm">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" onClick={onBack} className="cursor-pointer hover:bg-gray-100 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver
                        </Button>
                        <div className="border-l border-gray-300 pl-4">
                            <h1 className="text-2xl font-bold text-gray-900">Nota de Costos</h1>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>Servicio #{costNote.serviceNumber}</span>
                                <span>•</span>
                                <span>{costNote.clientName}</span>
                            </div>
                        </div>
                    </div>
                    <Button onClick={onSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? "Guardando..." : "Guardar Nota"}
                    </Button>
                </div>
            </div>
        </div>
    )
}




