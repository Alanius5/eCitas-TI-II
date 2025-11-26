import React from "react";
import citaimages from "../images/cita.jpg";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex flex-col items-center justify-center text-center min-h-[85vh] bg-cover bg-center bg-no-repeat text-white px-6 overflow-hidden"
      style={{ backgroundImage: `url(${citaimages})` }}
    >
      {/* Capa de oscurecimiento SOLO dentro de la sección */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/60"></div>

      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col items-center">
        <h2 className="text-5xl font-bold mb-4 text-cyan-400 drop-shadow-lg">
          Gestiona tus citas médicas con facilidad
        </h2>
        <p className="max-w-2xl text-lg text-gray-200 mb-8 drop-shadow-md">
          eCitas te permite programar, administrar y recordar tus citas médicas en un solo lugar.
          Optimiza tu tiempo y mejora la atención a tus pacientes con nuestra plataforma intuitiva.
        </p>
        <div className="flex gap-4">
          <Link to="/login">
            <button className="bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-3 rounded-full font-semibold transition">
              Iniciar sesión
            </button>
          </Link>
          <Link to="/register">
            <button className="border border-cyan-400 text-cyan-400 px-6 py-3 rounded-full font-semibold hover:bg-cyan-400 hover:text-white transition">
              Registrarse
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
