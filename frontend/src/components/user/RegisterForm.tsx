'use client'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { UserSignup, SignupSchema } from "@/schema";
import { Button, InputField } from "@/components/ui/forms";

export const RegisterForm = () => {
    const { 
        register, 
        handleSubmit, 
        formState: { errors } 
        } = useForm<UserSignup>({
        resolver: zodResolver(SignupSchema),
    });

    const onSubmit = (data: UserSignup) => {
        console.log("Registro exitoso:", data);
        // Aquí puedes manejar el registro del usuario, como enviar los datos a una API
    };

    return (
 <div className="flex items-center  justify-center min-h-screen bg-base-200">
      <div className="card w-full border border-gray-300 max-w-md shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-4">Crear cuenta</h2>

          <form method="POST" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <InputField
              type="email"
              name="email"
              label="Correo electrónico"
              register={register}
              error={errors.email}
            />

            <InputField
              type="password"
              name="contraseña"
              label="Contraseña"
              register={register}
              error={errors.contraseña}
            />

            <InputField
              type="password"
              name="confirmarContraseña"
              label="Confirmar contraseña"
              register={register}
              error={errors.confirmarContraseña}
            />

            <InputField
              type="text"
              name="nombre"
              label="Nombre completo"
              register={register}
              error={errors.nombre}
            />

            <InputField
              type="number"
              name="edad"
              label="Edad (opcional)"
              register={register}
              error={errors.edad}
            />

            <Button />
          </form>
        </div>
      </div>
    </div>
    );  
}