import React from "react";
import { Link } from "react-router-dom";
import eCitasLogo from "../images/ecitaslogo.png";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-md">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src={eCitasLogo} alt="eCitas Logo" className="h-10 w-10" />
        <h1 className="text-2xl font-bold text-cyan-400">eCitas</h1>
      </div>

      {/* Menú */}
      <ul className="flex gap-6 items-center">
        <li>
          <a href="#home" className="hover:text-cyan-400">Inicio</a>
        </li>
        <li>
          <a href="#features" className="hover:text-cyan-400">Características</a>
        </li>
        <li>
          <a href="#contact" className="hover:text-cyan-400">Contacto</a>
        </li>

     
      </ul>
    </nav>
  );
}
