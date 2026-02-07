'use client'

import { useToast } from '@/hook/use-toast'

interface Toast {
    id: string;
    open?: boolean;
    title?: string;
    description?: string;
    background?: string;
}

export function ToastViewport() {
    const { toasts, dismiss } = useToast()
    
    if (!toasts || toasts.length === 0) return null

    return (
        <div className="fixed bottom-4 right-4 space-y-2 z-50">
            {(toasts as Toast[]).map((toast) => (
                toast.open && (
                    <div
                        key={toast.id}
                        className={`border border-${toast.background || 'gray'} text-white px-4 rounded-md p-3 bg-white`}
                    >
                        <div className="flex-1">
                            <p className={`text-${toast.background || 'gray'}`}><strong className={`font-semibold`}>{toast.title}</strong></p>
                            {toast.description && <p className="text-sm text-gray-600">{toast.description}</p>}
                        </div>
                        <button
                            onClick={() => dismiss(toast.id)}
                            className="text-sm text-blue-600 hover:underline cursor-pointer"
                        >
                            Cerrar
                        </button>
                    </div>
                )
            ))}
        </div>
    )
}
