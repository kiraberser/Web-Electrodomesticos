"use client";

// @ts-nocheck - React 19 useActionState typing issue
import { useEffect, useState, useActionState, useRef } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Plus, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/forms/Button";
import { Input } from "@/components/ui/forms/InputField";
import { Label } from "@/components/ui/forms/Label";
import { Textarea } from "@/components/ui/display/Textarea";
import { getDireccionesAction, createDireccionAction, type ActionState } from "@/actions/auth";
import type { Direccion } from "@/types/user";
import toast from "react-hot-toast";
import { checkAuthentication } from "@/lib/cookies";

function isValidationError(error: unknown): error is Record<string, { _errors: string[] }> {
    return (
        error !== null &&
        typeof error === 'object' &&
        !Array.isArray(error) &&
        Object.values(error).every(
            (value) =>
                typeof value === 'object' &&
                value !== null &&
                '_errors' in value &&
                Array.isArray(value._errors)
        )
    )
}

export default function CheckoutPage() {
    const router = useRouter();
    const [direcciones, setDirecciones] = useState<Direccion[]>([]);
    const [selectedDireccion, setSelectedDireccion] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    
    const initialState: ActionState = { success: false, error: null };
    const [state, formAction, isPending] = useActionState<ActionState, FormData>(
        createDireccionAction,
        initialState
    );

    const hasHandledSuccess = useRef(false);

    useEffect(() => {
        const isAuthenticated = checkAuthentication();
        if (!isAuthenticated) {
            router.push("/cuenta/login");
            return;
        }
        loadDirecciones();
    }, [router]);

    useEffect(() => {
        if (state.success && state.data && !hasHandledSuccess.current) {
            hasHandledSuccess.current = true;
            const nuevaDireccion = state.data as Direccion;
            toast.success("Dirección creada exitosamente");
            setDirecciones(prev => [...prev, nuevaDireccion]);
            setSelectedDireccion(nuevaDireccion.id);
            setShowForm(false);
            setTimeout(() => {
                hasHandledSuccess.current = false;
            }, 100);
        }
        
        if (state.error && !state.success) {
            const validationError = state.error;
            if (isValidationError(validationError)) {
                // Los errores de validación se mostrarán en los campos
                Object.keys(validationError).forEach((field) => {
                    const errors = validationError[field]._errors;
                    if (errors.length > 0) {
                        toast.error(`${field}: ${errors[0]}`);
                    }
                });
            } else {
                toast.error(String(validationError));
            }
        }
    }, [state]);

    const loadDirecciones = async () => {
        try {
            setLoading(true);
            const response = await getDireccionesAction();
            if (response.success && response.data) {
                const data = response.data as Direccion[];
                setDirecciones(data);
                if (data.length > 0) {
                    const primary = data.find(d => d.is_primary) || data[0];
                    setSelectedDireccion(primary.id);
                } else {
                    setShowForm(true);
                }
            } else {
                toast.error("Error al cargar direcciones");
            }
        } catch (error) {
            console.error("Error cargando direcciones:", error);
            toast.error("Error al cargar direcciones");
        } finally {
            setLoading(false);
        }
    };

    const handleContinue = () => {
        if (!selectedDireccion) {
            toast.error("Por favor selecciona una dirección");
            return;
        }
        router.push(`/addresses/extra-info-details?direccion_id=${selectedDireccion}`);
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#0A3981]" />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <section className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-[#0A3981]">Dirección de entrega</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Selecciona o agrega una dirección para recibir tu pedido
                    </p>
                </div>

                {showForm ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Agregar nueva dirección
                        </h2>
                        <form action={formAction} className="space-y-4">
                            <div>
                                <Label htmlFor="nombre">Nombre de la dirección *</Label>
                                <Input
                                    id="nombre"
                                    name="nombre"
                                    required
                                    placeholder="Ej: Casa, Oficina"
                                />
                                {isValidationError(state.error) && state.error.nombre && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {state.error.nombre._errors[0]}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="street">Calle y número *</Label>
                                <Input
                                    id="street"
                                    name="street"
                                    required
                                    placeholder="Ej: Avenida Maximino Ávila Camacho 800"
                                />
                                {isValidationError(state.error) && state.error.street && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {state.error.street._errors[0]}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="colony">Colonia *</Label>
                                    <Input
                                        id="colony"
                                        name="colony"
                                        required
                                    />
                                    {isValidationError(state.error) && state.error.colony && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {state.error.colony._errors[0]}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="city">Ciudad *</Label>
                                    <Input
                                        id="city"
                                        name="city"
                                        required
                                    />
                                    {isValidationError(state.error) && state.error.city && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {state.error.city._errors[0]}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="state">Estado *</Label>
                                    <Input
                                        id="state"
                                        name="state"
                                        required
                                    />
                                    {isValidationError(state.error) && state.error.state && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {state.error.state._errors[0]}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="postal_code">Código Postal *</Label>
                                    <Input
                                        id="postal_code"
                                        name="postal_code"
                                        placeholder="00000"
                                        maxLength={5}
                                        required
                                    />
                                    {isValidationError(state.error) && state.error.postal_code && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {state.error.postal_code._errors[0]}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="references">Referencias adicionales</Label>
                                <Textarea
                                    id="references"
                                    name="references"
                                    placeholder="Cerca de..."
                                    rows={3}
                                />
                            </div>

                            <input type="hidden" name="is_primary" value="true" />

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="bg-[#1F509A] hover:bg-[#0A3981] text-white"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Guardando...
                                        </>
                                    ) : (
                                        "Guardar dirección"
                                    )}
                                </Button>
                                {direcciones.length > 0 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setShowForm(false)}
                                    >
                                        Cancelar
                                    </Button>
                                )}
                            </div>
                        </form>
                    </div>
                ) : (
                    <>
                        {direcciones.length > 0 ? (
                            <div className="space-y-4 mb-6">
                                {direcciones.map((direccion) => (
                                    <div
                                        key={direccion.id}
                                        onClick={() => setSelectedDireccion(direccion.id)}
                                        className={`bg-white rounded-2xl border-2 p-5 cursor-pointer transition-all ${
                                            selectedDireccion === direccion.id
                                                ? "border-[#1F509A] shadow-md"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <MapPin className="w-5 h-5 text-[#1F509A]" />
                                                    <h3 className="font-semibold text-gray-900">
                                                        {direccion.nombre}
                                                    </h3>
                                                    {direccion.is_primary && (
                                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                                            Principal
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    {direccion.full_address}
                                                </p>
                                                {direccion.references && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {direccion.references}
                                                    </p>
                                                )}
                                            </div>
                                            {selectedDireccion === direccion.id && (
                                                <div className="ml-4">
                                                    <div className="w-6 h-6 rounded-full bg-[#1F509A] flex items-center justify-center">
                                                        <Check className="w-4 h-4 text-white" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : null}

                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setShowForm(true)}
                                className="w-full border-2 border-dashed border-gray-300 hover:border-[#1F509A] text-gray-600 hover:text-[#1F509A]"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Agregar nueva dirección
                            </Button>
                        </div>

                        {selectedDireccion && (
                            <div className="mt-6 flex justify-end">
                                <Button
                                    onClick={handleContinue}
                                    className="bg-[#E38E49] hover:bg-[#d68340] text-white px-8"
                                >
                                    Continuar
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </section>
        </main>
    );
}
