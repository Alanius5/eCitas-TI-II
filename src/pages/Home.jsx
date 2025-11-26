import React from "react";
import Navbar from "../components/navbar";
import HeroSection from "../components/HeroSection";

export default function Home() {
  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <HeroSection />
      <section
        id="features"
        className="text-white text-center py-20 bg-gray-800"
      >
        <h3 className="text-3xl font-bold mb-6 text-cyan-400">
          Características principales
        </h3>
        <div className="grid md:grid-cols-3 gap-8 px-10 max-w-6xl mx-auto">
          <div className="p-6 bg-gray-700 rounded-xl">
            <h4 className="text-xl font-semibold mb-2">Agendamiento rápido</h4>
            <p className="text-gray-300">Crea, edita o cancela citas en segundos, con recordatorios automáticos.</p>
          </div>
          <div className="p-6 bg-gray-700 rounded-xl">
            <h4 className="text-xl font-semibold mb-2">Gestión de pacientes</h4>
            <p className="text-gray-300">Accede al historial médico y datos relevantes de cada paciente fácilmente.</p>
          </div>
          <div className="p-6 bg-gray-700 rounded-xl">
            <h4 className="text-xl font-semibold mb-2">Notificaciones inteligentes</h4>
            <p className="text-gray-300">Recibe alertas de próximas citas y evita olvidos o duplicaciones.</p>
          </div>
        </div>
      </section>

      <footer
        id="contact"
        className="text-gray-400 bg-gray-900 text-center py-6 border-t border-gray-700"
      >
        © 2025 eCitas. Todos los derechos reservados.
      </footer>
    </div>
  );
}
