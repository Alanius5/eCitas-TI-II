import React from "react";
import { Link } from "react-router-dom";
import citasimages from "../images/citas.jpg";

export default function RegisterPage() {
  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat text-white px-4"
      style={{ backgroundImage: `url(${citasimages})` }}
    >
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>

      {/* Botón volver */}
      <Link
        to="/"
        className="absolute top-6 left-6 bg-gray-800 bg-opacity-60 hover:bg-opacity-80 text-cyan-400 font-semibold px-4 py-2 rounded-full transition"
      >
        ← Volver al inicio
      </Link>

      {/* Contenido */}
      <div className="relative z-10 bg-gray-800 bg-opacity-75 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-cyan-400">
          Crear cuenta
        </h2>

        <form className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Nombre completo"
            className="p-3 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            className="p-3 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="p-3 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <button
            type="submit"
            className="bg-cyan-500 hover:bg-cyan-400 text-white py-3 rounded-lg font-semibold transition"
          >
            Registrarse
          </button>
        </form>

        <p className="text-sm text-gray-300 mt-4 text-center">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="text-cyan-400 hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
