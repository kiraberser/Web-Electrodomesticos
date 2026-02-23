"use client";

// @ts-nocheck - React 19 useActionState typing issue
import { useEffect, useState, useActionState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Home, Building2, Store, MapPin, Clock, Loader2, Plus, X } from "lucide-react";
import { Button } from "@/shared/ui/forms/Button";
import { Input } from "@/shared/ui/forms/InputField";
import { Label } from "@/shared/ui/forms/Label";
import { updateDireccionExtraInfoAction, type ActionState } from "@/features/auth/actions";
import toast from "react-hot-toast";
import { checkAuthentication } from "@/shared/lib/cookies";

type TipoLugar = "casa" | "edificio" | "abarrotes" | "otro";

interface HorarioAdicional {
    dia: string;
    apertura: string;
    cierre: string;
}

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

export default function ExtraInfoDetailsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const direccionId = searchParams.get("direccion_id");

    const [tipoLugar, setTipoLugar] = useState<TipoLugar | "">("");
    const [barrioPrivado, setBarrioPrivado] = useState(false);
    const [conserjeria, setConserjeria] = useState(false);
    const [nombreLugar, setNombreLugar] = useState("");
    const [horarioApertura, setHorarioApertura] = useState("00:00");
    const [horarioCierre, setHorarioCierre] = useState("00:00");
    const [horario24hs, setHorario24hs] = useState(false);
    const [horariosAdicionales, setHorariosAdicionales] = useState<HorarioAdicional[]>([]);
    const [mostrarHorarioAdicional, setMostrarHorarioAdicional] = useState(false);
    const [nuevoHorario, setNuevoHorario] = useState<HorarioAdicional>({
        dia: "",
        apertura: "00:00",
        cierre: "00:00",
    });

    const initialState: ActionState = { success: false, error: null };
    const [state, formAction, isPending] = useActionState<ActionState, FormData>(
        (prevState: ActionState, formData: FormData) => {
            if (!direccionId) {
                return { success: false, error: "Dirección no encontrada" };
            }
            return updateDireccionExtraInfoAction(Number(direccionId), prevState, formData);
        },
        initialState
    );

    const hasHandledSuccess = useRef(false);

    useEffect(() => {
        const isAuthenticated = checkAuthentication();
        if (!isAuthenticated) {
            router.push("/cuenta/login");
            return;
        }
        if (!direccionId) {
            toast.error("Dirección no encontrada");
            router.push("/checkout");
        }
    }, [router, direccionId]);

    useEffect(() => {
        if (state.success && !hasHandledSuccess.current) {
            hasHandledSuccess.current = true;
            toast.success("Información guardada exitosamente");
            setTimeout(() => {
                router.push("/cart");
            }, 1000);
        }
        
        if (state.error && !state.success) {
            const validationError = state.error;
            if (isValidationError(validationError)) {
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
    }, [state, router]);

    const tiposLugar = [
        { value: "casa", label: "Casa", icon: Home },
        { value: "edificio", label: "Edificio", icon: Building2 },
        { value: "abarrotes", label: "Abarrotes", icon: Store },
        { value: "otro", label: "Otro", icon: MapPin },
    ];

    const diasSemana = [
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
        "Domingo",
    ];

    const handleOmitir = () => {
        router.push("/cart");
    };

    const agregarHorarioAdicional = () => {
        if (!nuevoHorario.dia) {
            toast.error("Selecciona un día");
            return;
        }
        setHorariosAdicionales([...horariosAdicionales, nuevoHorario]);
        setNuevoHorario({ dia: "", apertura: "00:00", cierre: "00:00" });
        setMostrarHorarioAdicional(false);
    };

    const eliminarHorarioAdicional = (index: number) => {
        setHorariosAdicionales(horariosAdicionales.filter((_, i) => i !== index));
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <section className="container mx-auto px-4 py-8 max-w-3xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-[#0A3981]">
                        Completa los datos de tu domicilio
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Esta información nos ayudará a entregar tus compras.
                    </p>
                </div>

                <form action={formAction} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
                    {/* Tipo de lugar */}
                    <div>
                        <Label className="text-base font-semibold text-gray-900 mb-3 block">
                            Elige el tipo de lugar
                        </Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {tiposLugar.map((tipo) => {
                                const Icon = tipo.icon;
                                return (
                                    <button
                                        key={tipo.value}
                                        type="button"
                                        onClick={() => setTipoLugar(tipo.value as TipoLugar)}
                                        className={`p-4 rounded-xl border-2 transition-all ${
                                            tipoLugar === tipo.value
                                                ? "border-[#1F509A] bg-blue-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    >
                                        <Icon
                                            className={`w-6 h-6 mx-auto mb-2 ${
                                                tipoLugar === tipo.value
                                                    ? "text-[#1F509A]"
                                                    : "text-gray-400"
                                            }`}
                                        />
                                        <p
                                            className={`text-sm font-medium ${
                                                tipoLugar === tipo.value
                                                    ? "text-[#1F509A]"
                                                    : "text-gray-600"
                                            }`}
                                        >
                                            {tipo.label}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                        <input type="hidden" name="tipo_lugar" value={tipoLugar || ""} />
                        {isValidationError(state.error) && state.error.tipo_lugar && (
                            <p className="text-sm text-red-600 mt-1">
                                {state.error.tipo_lugar._errors[0]}
                            </p>
                        )}
                    </div>

                    {/* Barrio privado */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="barrio_privado"
                            name="barrio_privado"
                            checked={barrioPrivado}
                            onChange={(e) => setBarrioPrivado(e.target.checked)}
                            className="w-5 h-5 text-[#1F509A] border-gray-300 rounded focus:ring-[#1F509A]"
                        />
                        <Label htmlFor="barrio_privado" className="text-gray-700 cursor-pointer">
                            Se encuentra en un barrio privado o centro comercial
                        </Label>
                    </div>

                    {/* Conserjería */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="conserjeria"
                            name="conserjeria"
                            checked={conserjeria}
                            onChange={(e) => setConserjeria(e.target.checked)}
                            className="w-5 h-5 text-[#1F509A] border-gray-300 rounded focus:ring-[#1F509A]"
                        />
                        <Label htmlFor="conserjeria" className="text-gray-700 cursor-pointer">
                            Se pueden dejar paquetes en conserjería
                        </Label>
                    </div>

                    {/* Nombre del lugar */}
                    <div>
                        <Label htmlFor="nombre_lugar">Nombre del lugar</Label>
                        <Input
                            id="nombre_lugar"
                            name="nombre_lugar"
                            value={nombreLugar}
                            onChange={(e) => setNombreLugar(e.target.value)}
                            placeholder="Ej: Condesa"
                        />
                        <div className="mt-2">
                            <button
                                type="button"
                                onClick={() => setNombreLugar("")}
                                className="text-xs text-gray-500 hover:text-gray-700 underline"
                            >
                                Sin nombre
                            </button>
                        </div>
                        {isValidationError(state.error) && state.error.nombre_lugar && (
                            <p className="text-sm text-red-600 mt-1">
                                {state.error.nombre_lugar._errors[0]}
                            </p>
                        )}
                    </div>

                    {/* Horarios de atención */}
                    <div>
                        <Label className="text-base font-semibold text-gray-900 mb-3 block flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Horarios de atención
                        </Label>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <input
                                    type="checkbox"
                                    id="horario_24hs"
                                    name="horario_24hs"
                                    checked={horario24hs}
                                    onChange={(e) => setHorario24hs(e.target.checked)}
                                    className="w-5 h-5 text-[#1F509A] border-gray-300 rounded focus:ring-[#1F509A]"
                                />
                                <Label htmlFor="horario_24hs" className="text-gray-700 cursor-pointer">
                                    24 hs
                                </Label>
                            </div>

                            {!horario24hs && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="horario_apertura">Apertura</Label>
                                        <Input
                                            id="horario_apertura"
                                            name="horario_apertura"
                                            type="time"
                                            value={horarioApertura}
                                            onChange={(e) => setHorarioApertura(e.target.value)}
                                        />
                                        {isValidationError(state.error) && state.error.horario_apertura && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {state.error.horario_apertura._errors[0]}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="horario_cierre">Cierre</Label>
                                        <Input
                                            id="horario_cierre"
                                            name="horario_cierre"
                                            type="time"
                                            value={horarioCierre}
                                            onChange={(e) => setHorarioCierre(e.target.value)}
                                        />
                                        {isValidationError(state.error) && state.error.horario_cierre && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {state.error.horario_cierre._errors[0]}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Horarios adicionales */}
                            {horariosAdicionales.length > 0 && (
                                <div className="space-y-2 mt-4">
                                    <Label className="text-sm font-medium text-gray-700">
                                        Horarios adicionales:
                                    </Label>
                                    {horariosAdicionales.map((horario, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                                        >
                                            <span className="text-sm font-medium text-gray-700 flex-1">
                                                {horario.dia}: {horario.apertura} - {horario.cierre}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => eliminarHorarioAdicional(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!mostrarHorarioAdicional ? (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setMostrarHorarioAdicional(true)}
                                    className="mt-2 text-[#1F509A] hover:text-[#0A3981]"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Agregar otros días y horarios
                                </Button>
                            ) : (
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                                    <div>
                                        <Label htmlFor="nuevo_dia">Día</Label>
                                        <select
                                            id="nuevo_dia"
                                            value={nuevoHorario.dia}
                                            onChange={(e) =>
                                                setNuevoHorario({ ...nuevoHorario, dia: e.target.value })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F509A] focus:border-transparent"
                                        >
                                            <option value="">Selecciona un día</option>
                                            {diasSemana.map((dia) => (
                                                <option key={dia} value={dia}>
                                                    {dia}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <Label htmlFor="nuevo_apertura">Apertura</Label>
                                            <Input
                                                id="nuevo_apertura"
                                                type="time"
                                                value={nuevoHorario.apertura}
                                                onChange={(e) =>
                                                    setNuevoHorario({
                                                        ...nuevoHorario,
                                                        apertura: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="nuevo_cierre">Cierre</Label>
                                            <Input
                                                id="nuevo_cierre"
                                                type="time"
                                                value={nuevoHorario.cierre}
                                                onChange={(e) =>
                                                    setNuevoHorario({
                                                        ...nuevoHorario,
                                                        cierre: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            onClick={agregarHorarioAdicional}
                                            className="bg-[#1F509A] hover:bg-[#0A3981] text-white"
                                        >
                                            Agregar
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => {
                                                setMostrarHorarioAdicional(false);
                                                setNuevoHorario({ dia: "", apertura: "00:00", cierre: "00:00" });
                                            }}
                                        >
                                            Cancelar
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Hidden inputs for form submission */}
                    <input type="hidden" name="horarios_adicionales" value={JSON.stringify(horariosAdicionales)} />

                    {/* Botones de acción */}
                    <div className="flex gap-3 pt-4 border-t">
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 bg-[#E38E49] hover:bg-[#d68340] text-white"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                "Guardar"
                            )}
                        </Button>
                        <Button
                            type="button"
                            onClick={handleOmitir}
                            variant="ghost"
                            className="flex-1"
                        >
                            Omitir
                        </Button>
                    </div>
                </form>
            </section>
        </main>
    );
}
