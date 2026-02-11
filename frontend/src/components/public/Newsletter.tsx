import { Mail } from "lucide-react";
import { useActionState } from "react";
import { subscribeNewsletterAction } from "@/actions/newsletter";
import { Button } from "../ui/forms/Button";
import Link from "next/link";
import { company } from "@/data/company";

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
        <section className="w-full h-50 md:h-auto min-h-50 flex items-center bg-[#E38E49]">
            <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-6 md:flex-row md:gap-10 md:py-5">
                {/* Left: Icon + Text */}
                <div className="flex shrink-0 items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/40">
                        <Mail
                            className="h-7 w-7 text-white"
                            strokeWidth={1.5}
                        />
                    </div>
                    <div>
                        <p className="text-sm font-semibold leading-tight text-white md:text-base">
                            Entérate de nuestras ofertas,
                            <br />
                            novedades y más.
                        </p>
                        <p className="text-base font-extrabold uppercase text-[#0A3981] md:text-lg">
                            Obtén 10% de descuento.
                        </p>
                    </div>
                </div>

                {/* Right: Form */}
                <div className="w-full flex-1">
                    <form action={formAction}>
                        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
                            <input
                                type="text"
                                name="name"
                                placeholder="Digita tu nombre"
                                required
                                className="h-11 flex-1 rounded-md border-none bg-white px-4 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/30"
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Digita tu e-mail"
                                required
                                className="h-11 flex-1 rounded-md border-none bg-white px-4 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/30"
                            />
                            <Button
                                type="submit"
                                className="h-11 shrink-0 rounded-md bg-[#0A3981] px-6 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#0A3981]/90"
                            >
                                Suscribirme
                            </Button>
                        </div>

                        {/* Privacy */}
                        <p className="mt-2 text-[11px] leading-snug text-zinc-700">
                            Al enviar, confirmo que he leído y acepto su{" "}
                            <Link
                                href="/privacidad"
                                className="underline underline-offset-2 hover:text-zinc-900"
                            >
                                Declaración de privacidad
                            </Link>{" "}
                            y me gustaría recibir correos electrónicos de
                            marketing y/o promocionales de {company.name}.
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
