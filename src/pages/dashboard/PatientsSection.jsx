import React, { useEffect, useState } from "react";

export default function PatientsSection() {
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "Juan Pérez",
      phone: "555-123-4567",
      birthDate: "1990-05-10",
      gender: "Masculino",
      email: "juan.perez@example.com",
      address: "Av. Principal 123, Ciudad",
    },
    {
      id: 2,
      name: "María López",
      phone: "555-987-6543",
      birthDate: "1988-09-22",
      gender: "Femenino",
      email: "maria.lopez@example.com",
      address: "Calle Secundaria 456, Ciudad",
    },
  ]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("patients"));
    if (stored && Array.isArray(stored) && stored.length > 0) {
      setPatients(stored);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("patients", JSON.stringify(patients));
  }, [patients]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    birthDate: "",
    gender: "",
    email: "",
    address: "",
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setPatients([
      ...patients,
      {
        id: Date.now(),
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        birthDate: formData.birthDate,
        gender: formData.gender,
        email: formData.email.trim(),
        address: formData.address.trim(),
      },
    ]);

    setFormData({
      name: "",
      phone: "",
      birthDate: "",
      gender: "",
      email: "",
      address: "",
    });
  };

  const handleDelete = (id) => {
    const patient = patients.find((p) => p.id === id);
    const confirmDelete = window.confirm(
      `¿Seguro que deseas eliminar al paciente "${patient?.name || ""}"? Esta acción no se puede deshacer.`
    );
    if (!confirmDelete) return;

    setPatients(patients.filter((p) => p.id !== id));
  };

  return (
    <div className="p-6 text-white max-w-5xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold mb-2 text-cyan-400">
        Gestión de Pacientes
      </h2>

      {/* Formulario */}
      <form
        onSubmit={handleAdd}
        className="bg-gray-900/80 border border-gray-800 rounded-2xl max-w-md mb-4 shadow-xl shadow-black/40 p-5"
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
          className="w-full p-2 rounded mb-1 bg-gray-700 text-white"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <p className="text-xs text-gray-300 mb-3">
          Ejemplo: 555-123-4567
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs text-gray-300 mb-1">
              Fecha de nacimiento
            </label>
            <input
              type="date"
              className="w-full p-2 rounded bg-gray-700 text-white"
              value={formData.birthDate}
              onChange={(e) =>
                setFormData({ ...formData, birthDate: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-xs text-gray-300 mb-1">Género</label>
            <select
              className="w-full p-2 rounded bg-gray-700 text-white"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            >
              <option value="">Seleccionar</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        </div>

        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full p-2 rounded mb-3 bg-gray-700 text-white"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <textarea
          rows="2"
          placeholder="Dirección"
          className="w-full p-2 rounded mb-4 bg-gray-700 text-white text-sm resize-none"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        ></textarea>

        <button
          type="submit"
          className="w-full bg-cyan-500 hover:bg-cyan-400 text-white py-2 rounded"
        >
          Guardar
        </button>
      </form>

      {/* Lista de Pacientes */}
      <div className="bg-gray-900/80 border border-gray-800 p-4 rounded-2xl shadow-xl">
        <h3 className="text-xl font-semibold mb-4">Pacientes registrados</h3>

        {patients.length === 0 ? (
          <div className="text-gray-400 text-center text-sm space-y-2">
            <p>No hay pacientes registrados.</p>
            <p>Usa el formulario superior para agregar el primer paciente.</p>
          </div>
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
                  {p.email && (
                    <p className="text-xs text-gray-300">{p.email}</p>
                  )}
                </div>

                <button
                  className="text-red-400 hover:text-red-300 text-sm"
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
