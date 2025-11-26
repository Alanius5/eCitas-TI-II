import React, { useState } from "react";

export default function PatientsSection() {
  const [patients, setPatients] = useState([
    { id: 1, name: "Juan Pérez", phone: "555-123-4567" },
    { id: 2, name: "María López", phone: "555-987-6543" },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setPatients([
      ...patients,
      {
        id: Date.now(),
        name: formData.name,
        phone: formData.phone,
      },
    ]);

    setFormData({ name: "", phone: "" });
  };

  const handleDelete = (id) => {
    setPatients(patients.filter((p) => p.id !== id));
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-3xl font-bold mb-6 text-cyan-400">
        Gestión de Pacientes
      </h2>

      {/* Formulario */}
      <form
        onSubmit={handleAdd}
        className="bg-gray-800 p-4 rounded-xl max-w-md mb-8 shadow-lg"
      >
        <h3 className="text-xl font-semibold mb-4">Agregar paciente</h3>

        <input
          type="text"
          placeholder="Nombre completo"
          className="w-full p-2 rounded mb-3 bg-gray-700 text-white"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <input
          type="text"
          placeholder="Teléfono"
          className="w-full p-2 rounded mb-3 bg-gray-700 text-white"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />

        <button
          type="submit"
          className="w-full bg-cyan-500 hover:bg-cyan-400 text-white py-2 rounded"
        >
          Guardar
        </button>
      </form>

      {/* Lista de Pacientes */}
      <div className="bg-gray-800 p-4 rounded-xl shadow-xl">
        <h3 className="text-xl font-semibold mb-4">Pacientes registrados</h3>

        {patients.length === 0 ? (
          <p className="text-gray-400 text-center">No hay pacientes registrados</p>
        ) : (
          <ul className="space-y-3">
            {patients.map((p) => (
              <li
                key={p.id}
                className="flex justify-between items-center bg-gray-700 p-3 rounded"
              >
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-sm text-gray-300">{p.phone}</p>
                </div>

                <button
                  className="text-red-400 hover:text-red-300"
                  onClick={() => handleDelete(p.id)}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
