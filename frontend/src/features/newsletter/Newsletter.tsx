import { Mail } from "lucide-react";
import { useActionState } from "react";
import { subscribeNewsletterAction } from "@/features/newsletter/actions";
import { Button } from "@/shared/ui/forms/Button";
import Link from "next/link";
import { company } from "@/shared/data/company";

const Newsletter = () => {
    const initialState = {
        success: false,
        error: null as string | null,
        data: undefined as unknown,
    };

    const [state, formAction] = useActionState(
        subscribeNewsletterAction,
        initialState,
    );

    return (
        <section className="w-full flex items-center bg-[#E38E49]">
            <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-5 px-4 py-6 sm:px-6 md:flex-row md:gap-10 md:py-5">
                {/* Left: Icon + Text */}
                <div className="flex shrink-0 items-center gap-3 sm:gap-4 text-center md:text-left">
                    <div className="hidden sm:flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full border-2 border-white/40">
                        <Mail
                            className="h-6 w-6 md:h-7 md:w-7 text-white"
                            strokeWidth={1.5}
                        />
                    </div>
                    <div>
                        <p className="text-sm font-semibold leading-tight text-white sm:text-base">
                            Entérate de nuestras ofertas y novedades.
                        </p>
                        <p className="text-sm font-extrabold uppercase text-[#0A3981] sm:text-base md:text-lg">
                            Obtén 10% de descuento.
                        </p>
                    </div>
                </div>

                {/* Right: Form */}
                <div className="w-full flex-1">
                    <form action={formAction}>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2.5">
                            <input
                                type="text"
                                name="name"
                                placeholder="Tu nombre"
                                required
                                className="h-10 sm:h-11 w-full sm:flex-1 rounded-md border-none bg-white px-3.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/30"
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Tu e-mail"
                                required
                                className="h-10 sm:h-11 w-full sm:flex-1 rounded-md border-none bg-white px-3.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/30"
                            />
                            <Button
                                type="submit"
                                className="h-10 sm:h-11 w-full sm:w-auto shrink-0 rounded-md bg-[#0A3981] px-5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#0A3981]/90 cursor-pointer"
                            >
                                Suscribirme
                            </Button>
                        </div>

                        {/* Privacy */}
                        <p className="mt-2 text-[10px] sm:text-[11px] leading-snug text-zinc-700">
                            Al enviar, confirmo que he leído y acepto la{" "}
                            <Link
                                href="/privacy-policy"
                                className="underline underline-offset-2 hover:text-zinc-900"
                            >
                                Declaración de privacidad
                            </Link>{" "}
                            y deseo recibir correos de marketing y/o
                            promocionales de {company.name}.
                        </p>

                        {state?.error && (
                            <p className="mt-2 rounded bg-red-600/20 px-3 py-1.5 text-xs text-red-900">
                                {String(state.error)}
                            </p>
                        )}
                        {state?.success && !state?.error && (
                            <p className="mt-2 rounded bg-green-700/20 px-3 py-1.5 text-xs text-green-900">
                                ¡Listo! Revisa tu correo para tu cupón de
                                descuento.
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
