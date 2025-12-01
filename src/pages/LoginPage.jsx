import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import citasimages from "../images/citas.jpg";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === "Patient" && password === "12345") {
      localStorage.setItem("userRole", "patient");
      localStorage.setItem("userName", username);
      navigate("/dashboard");
      return;
    }

    if (username === "Reception" && password === "12345") {
      localStorage.setItem("userRole", "reception");
      localStorage.setItem("userName", username);
      navigate("/dashboard");
      return;
    }

    setError("Credenciales inválidas. Usa 'Patient' o 'Reception' y la contraseña '12345'.");
  };

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
      <div className="relative z-10 bg-gray-800 bg-opacity-80 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700/80">
        <h2 className="text-3xl font-bold text-center mb-2 text-cyan-400">
          Iniciar sesión
        </h2>
        <p className="text-xs text-gray-300 text-center mb-6">
          Demo: usuario <span className="font-semibold">Patient</span> o {" "}
          <span className="font-semibold">Reception</span>, contraseña {" "}
          <span className="font-semibold">12345</span>.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Usuario (Patient o Reception)"
            className="p-3 rounded-lg bg-gray-900/90 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-700"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="p-3 rounded-lg bg-gray-900/90 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-700"
          />
          {error && (
            <p className="text-xs text-red-400 bg-red-900/40 border border-red-500/40 rounded-md px-3 py-2">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="bg-cyan-500 hover:bg-cyan-400 text-white py-3 rounded-lg font-semibold transition shadow-lg shadow-cyan-500/30"
          >
            Entrar
          </button>
        </form>

        <p className="text-sm text-gray-300 mt-4 text-center">
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="text-cyan-400 hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
