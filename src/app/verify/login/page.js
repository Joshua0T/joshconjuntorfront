"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useAuth } from "@/app/context/authContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

function page() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setLoginError("");

      const result = await login({
        nombreDeUsuario: data.nombreDeUsuario,
        password: data.password
      });

      if (result.success) {
        router.push("/admin");
      } else {
        setLoginError(result.error || "Error al iniciar sesión");
      }
    } catch (error) {
      setLoginError("Ocurrió un error durante el inicio de sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 justify-center items-center h-screen w-screen bg-cover bg-center bg-no-repeat fixed top-0 left-0 z-[-1]">
      <div >
        <Image
          className="img"
          src="/Villa_sol.png"
          alt="Logo Conjunto Residencial"
          width={250}
          height={150}
          priority
        />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-transparent border border-verde p-6 rounded-lg shadow-lg flex flex-col items-center max-w-sm w-full h-2/2"
      >
        <h1 className="text-2xl w-full font-bold text-verde mb-2 text-center">
          Iniciar Sesión
        </h1>

        {loginError && (
          <div className="w-full p-3 mb-4 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
            {loginError}
          </div>
        )}

        <div className="mb-4 w-full">
          <label htmlFor="nombreDeUsuario" className="block text-gray-600 mb-1 text-sm">
            Nombre de Usuario
          </label>
          <input
            id="nombreDeUsuario"
            {...register("nombreDeUsuario", {
              required: "El nombre de usuario es requerido",
              minLength: {
                value: 3,
                message: "El nombre de usuario debe tener al menos 3 caracteres"
              }
            })}
            type="text"
            autoComplete="username"
            className="w-full p-2 border border-verde bg-transparent rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-morado focus:border-transparent text-gray-950"
            aria-label="Nombre de Usuario"
            aria-required="true"
            aria-invalid={errors.nombreDeUsuario ? "true" : "false"}
          />
          {errors.nombreDeUsuario && (
            <span className="text-red-500 text-xs mt-1" role="alert">
              {errors.nombreDeUsuario.message}
            </span>
          )}
        </div>

        <div className="mb-4 w-full">
          <label htmlFor="password" className="block text-gray-600 mb-1 text-sm">
            Contraseña
          </label>
          <input
            id="password"
            {...register("password", {
              required: "La contraseña es requerida",
              minLength: {
                value: 6,
                message: "La contraseña debe tener al menos 6 caracteres"
              }
            })}
            type="password"
            autoComplete="current-password"
            className="w-full p-2 border border-verde bg-transparent rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-morado focus:border-transparent text-gray-950"
            aria-label="Contraseña"
            aria-required="true"
            aria-invalid={errors.password ? "true" : "false"}
          />
          {errors.password && (
            <span className="text-red-500 text-xs mt-1" role="alert">
              {errors.password.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full p-2 bg-morado text-white rounded-md text-sm transition duration-300 mb-4 focus:outline-none focus:ring-2 focus:ring-verde focus:ring-offset-2
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'}`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              Iniciando...
            </span>
          ) : (
            'Iniciar Sesión'
          )}
        </button>
      </form>

    </div>
  );
}

export default page;