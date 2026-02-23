"use client"

import { Save } from "lucide-react"
import { Button } from "@/shared/ui/forms/Button"

interface ActionButtonsProps {
    saving: boolean
    onSaveAction: () => void
    onCancelAction: () => void
}

export function ActionButtons({ saving, onSaveAction, onCancelAction }: ActionButtonsProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="space-y-3">
                <Button
                    onClick={onSaveAction}
                    disabled={saving}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-sm transition-all duration-200 hover:shadow-md"
                    size="lg"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Guardando..." : "Guardar Nota"}
                </Button>

                <Button
                    variant="outline"
                    onClick={onCancelAction}
                    className="w-full cursor-pointer bg-transparent hover:bg-gray-50 transition-colors"
                >
                    Cancelar
                </Button>
            </div>
        </div>
    )
}
