"use client";

import { useFormStatus } from "react-dom";
import { useActionState, useEffect, useRef, useState, useCallback } from "react";
import { X, Plus, Calendar, Package, User, Phone, FileText, CheckCircle2 } from "lucide-react";
import { Button, Input } from "@/components/ui/forms";
import { createService } from "@/actions/services";
import { useToast } from "@/hook/use-toast";
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme";

import Link from "next/link";

interface AddServiceModalProps {
    isOpen: boolean;
    onCloseAction: () => void;
}

// Submit button component with loading state
export function SubmitButton() {
    const { pending } = useFormStatus();
    
    return (
        <Button 
            type="submit" 
            disabled={pending}
            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {pending ? (
                <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creando...
                </>
            ) : (
                <>
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Servicio
                </>
            )}
        </Button>
    );
}

export function AddServiceModal({ isOpen, onCloseAction }: AddServiceModalProps) {
    const initialState = { success: false, error: null };
    const [state, formAction] = useActionState(createService, initialState);
    const hasClosedRef = useRef(false);
    const { toast } = useToast();
    const [showSuccess, setShowSuccess] = useState(false);
    const lastServiceIdRef = useRef<string | null>(null);
    const { dark } = useAdminTheme();

    const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        // No prevenir el submit; solo capturamos el ID para el CTA
        try {
            const form = e.currentTarget;
            const fd = new FormData(form);
            const id = (fd.get("noDeServicio") || "").toString().trim();
            if (id) lastServiceIdRef.current = id;
        } catch {}
    }, []);

    // On success: show toast and CTA, keep modal open until user decides
    useEffect(() => {
        if (state.success && !hasClosedRef.current) {
            hasClosedRef.current = true;
            setShowSuccess(true);
            toast({
                title: "Servicio creado",
                description: "Se ha registrado correctamente.",
                background: "green-500",
            });
        }
    }, [state.success, toast]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                {/* Backdrop */}
                <div className={`fixed inset-0 transition-opacity ${dark ? 'bg-black/70' : 'bg-black/50'}`} onClick={onCloseAction}></div>

                {/* Modal */}
                <div className={`relative rounded-lg shadow-xl max-w-2xl w-full mx-4 transform transition-all ${dark ? 'bg-[#0F172A] border border-white/10' : 'bg-white border border-gray-200'}`}>
                    {/* Header */}
                    <div className={`flex items-center justify-between p-6 border-b ${dark ? 'border-white/10' : 'border-gray-200'}`}>
                        <div className="flex items-center space-x-3">
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${dark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                                <Plus className={`w-5 h-5 ${dark ? 'text-blue-400' : 'text-blue-600'}`} />
                            </div>
                            <div>
                                <h3 className={`text-lg font-semibold ${dark ? 'text-gray-100' : 'text-gray-900'}`}>Nuevo Servicio</h3>
                                <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Registra un nuevo servicio de reparación</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onCloseAction}
                            className={`cursor-pointer ${dark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Form or Success State */}
                    {showSuccess ? (
                        <div className="p-6">
                            <div className="flex items-start gap-3 mb-4">
                                <CheckCircle2 className={`w-6 h-6 mt-0.5 ${dark ? 'text-green-400' : 'text-green-600'}`} />
                                <div>
                                    <h4 className={`text-lg font-semibold ${dark ? 'text-gray-100' : 'text-gray-900'}`}>Servicio creado</h4>
                                    <p className={dark ? 'text-gray-400' : 'text-gray-600'}>Puedes ver el detalle o cerrar este cuadro.</p>
                                </div>
                            </div>
                            <div className={`flex items-center justify-end gap-3 pt-4 border-t ${dark ? 'border-white/10' : 'border-gray-200'}`}>
                                <Button type="button" variant="outline" onClick={onCloseAction} className="cursor-pointer bg-transparent">
                                    Cerrar
                                </Button>
                                {lastServiceIdRef.current && (
                                    <Link href={`/admin/servicios/${lastServiceIdRef.current}`} className="cursor-pointer">
                                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Ver detalle</Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    ) : (
                    <form action={formAction} onSubmit={handleSubmit} className="p-6">
                        {/* Global error message */}
                        {state.error && typeof state.error === 'string' && (
                            <div className={`mb-4 p-3 rounded-md ${dark ? 'bg-red-500/20 border border-red-500/30' : 'bg-red-50 border border-red-200'}`}>
                                <p className={`text-sm ${dark ? 'text-red-400' : 'text-red-600'}`}>{state.error}</p>
                            </div>
                        )}

                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {/* Cliente */}
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    <User className="w-4 h-4 inline mr-2" />
                                    Cliente *
                                </label>
                                <Input
                                    type="text"
                                    name="cliente"
                                    placeholder="Nombre del cliente"
                                    className={`${state.error && typeof state.error === 'object' && state.error.cliente?._errors?.length > 0 ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""} ${dark ? 'text-black' : 'text-gray-700'}`}
                                />
                                {state.error && typeof state.error === 'object' && state.error.cliente?._errors?.length > 0 && (
                                    <p className="text-red-500 text-sm mt-1">{state.error.cliente._errors[0]}</p>
                                )}
                            </div>

                            {/* No de Servicio */}
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    <User className="w-4 h-4 inline mr-2" />
                                    No de Servicio *
                                </label>
                                <Input
                                    type="number"
                                    name="noDeServicio"
                                    placeholder="Número de servicio"
                                    className={`${state.error && typeof state.error === 'object' && state.error.noDeServicio?._errors?.length > 0 ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""} ${dark ? 'text-black' : 'text-gray-700'}`}
                                />
                                {state.error && typeof state.error === 'object' && state.error.noDeServicio?._errors?.length > 0 && (
                                    <p className="text-red-500 text-sm mt-1">{state.error.noDeServicio._errors[0]}</p>
                                )}
                            </div>

                            {/* Teléfono */}
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    <Phone className="w-4 h-4 inline mr-2" />
                                    Teléfono *
                                </label>
                                <Input
                                    type="tel"
                                    name="telefono"
                                    placeholder="Teléfono (10 dígitos)"
                                    className={`${state.error && typeof state.error === 'object' && state.error.telefono?._errors?.length > 0 ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""} ${dark ? 'text-black' : 'text-gray-700'}`}
                                />
                                {state.error && typeof state.error === 'object' && state.error.telefono?._errors?.length > 0 && (
                                    <p className="text-red-500 text-sm mt-1">{state.error.telefono._errors[0]}</p>
                                )}
                            </div>

                            {/* Estado */}
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Estado</label>
                                <select
                                    name="estado"
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${dark ? 'border-white/10 bg-slate-800 text-gray-200' : 'border-gray-300 bg-white text-gray-700'}`}
                                >
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="En Proceso">En Proceso</option>
                                    <option value="Reparado">Reparado</option>
                                    <option value="Entregado">Entregado</option>
                                    <option value="Cancelado">Cancelado</option>
                                </select>
                            </div>

                            {/* Marca */}
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Marca *</label>
                                <select
                                    name="marca"
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${dark ? 'border-white/10 bg-slate-800 text-gray-200' : 'border-gray-300 bg-white text-gray-700'} ${state.error && typeof state.error === 'object' && state.error.marca?._errors?.length > 0 ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                                >
                                    <option value="">Selecciona una marca</option>
                                    <option value="Oster">Oster</option>
                                    <option value="Siemens">Siemens</option>
                                    <option value="Bosch">Bosch</option>
                                    <option value="LG">LG</option>
                                </select>
                                {state.error && typeof state.error === 'object' && state.error.marca?._errors?.length > 0 && (
                                    <p className="text-red-500 text-sm mt-1">{state.error.marca._errors[0]}</p>
                                )}
                            </div>
                        </div>

                        {/* Aparato y Fecha en la misma fila */}
                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {/* Aparato */}
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    <Package className="w-4 h-4 inline mr-2" />
                                    Aparato *
                                </label>
                                <Input
                                    type="text"
                                    name="aparato"
                                    placeholder="Licuadora, Bomba de Agua, etc."
                                    className={`${state.error && typeof state.error === 'object' && state.error.aparato?._errors?.length > 0 ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""} ${dark ? 'text-black' : 'text-gray-700'}`}
                                />
                                {state.error && typeof state.error === 'object' && state.error.aparato?._errors?.length > 0 && (
                                    <p className="text-red-500 text-sm mt-1">{state.error.aparato._errors[0]}</p>
                                )}
                            </div>

                            {/* Fecha */}
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    <Calendar className="w-4 h-4 inline mr-2" />
                                    Fecha *
                                </label>
                                <Input
                                    name="fecha"
                                    type="date"
                                    className={`${state.error && typeof state.error === 'object' && state.error.fecha?._errors?.length > 0 ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""} ${dark ? 'text-black' : 'text-gray-700'}`}
                                />
                                {state.error && typeof state.error === 'object' && state.error.fecha?._errors?.length > 0 && (
                                    <p className="text-red-500 text-sm mt-1">{state.error.fecha._errors[0]}</p>
                                )}
                            </div>
                        </div>

                        {/* Observaciones */}
                        <div className={`mt-6 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                            <label className={`block text-sm font-medium mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                                <FileText className="w-4 h-4 inline mr-2"  />
                                Observaciones
                            </label>
                            <textarea
                                name='observaciones'
                                placeholder="Describe el problema o detalles adicionales..."
                                rows={4}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${dark ? 'border-white/10 bg-slate-800 text-gray-100' : 'border-gray-300 bg-white text-gray-700'}`}
                            />
                        </div>

                        {/* Footer */}
                        <div className={`flex items-center justify-end space-x-3 mt-8 pt-6 border-t ${dark ? 'border-white/10' : 'border-gray-200'}`}>
                            <Button type="button" variant="outline" onClick={onCloseAction} className="cursor-pointer bg-transparent">
                                Cancelar
                            </Button>
                            <SubmitButton />
                        </div>
                    </form>
                    )}
                </div>
            </div>
        </div>
    );
}
