import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendarCustom.css";
import PatientsSection from "./PatientsSection";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("agendar");
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("appointments")) || [];
    setAppointments(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);

  const [name, setName] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !dateTime || !reason) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    const newAppointment = {
      id: Date.now(),
      name,
      dateTime,
      reason,
    };

    setAppointments([...appointments, newAppointment]);

    setName("");
    setDateTime("");
    setReason("");
  };

  const deleteAppointment = (id) => {
    const updated = appointments.filter((item) => item.id !== id);
    setAppointments(updated);
  };

  const [selectedDate, setSelectedDate] = useState(new Date());

  const appointmentsForDay = appointments.filter((a) => {
    const apptDate = new Date(a.dateTime);
    return (
      apptDate.getFullYear() === selectedDate.getFullYear() &&
      apptDate.getMonth() === selectedDate.getMonth() &&
      apptDate.getDate() === selectedDate.getDate()
    );
  });

  const hasAppointment = (date) => {
    return appointments.some((a) => {
      const apptDate = new Date(a.dateTime);
      return (
        apptDate.getFullYear() === date.getFullYear() &&
        apptDate.getMonth() === date.getMonth() &&
        apptDate.getDate() === date.getDate()
      );
    });
  };

  const renderSection = () => {
    switch (activeSection) {
      case "agendar":
        return (
          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* ----- FORMULARIO ----- */}
            <div>
              <h2 className="text-3xl font-bold text-cyan-500 mb-6">
                Agendar Cita
              </h2>

              <form
                onSubmit={handleSubmit}
                className="bg-gray-800 p-6 rounded-xl shadow-md"
              >
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">
                    Nombre del paciente
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Fecha y hora</label>
                  <input
                    type="datetime-local"
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Motivo</label>
                  <textarea
                    rows="3"
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Ej. Consulta general"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-400 px-6 py-2 rounded-full text-white font-semibold"
                >
                  Agendar
                </button>
              </form>
            </div>

            {/* ----- CALENDARIO ----- */}
            <div>
              <h2 className="text-3xl font-bold text-cyan-500 mb-6">
                Calendario
              </h2>

              <div className="bg-gray-800 p-6 rounded-xl shadow-lg inline-block">
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  tileClassName={({ date }) =>
                    hasAppointment(date) ? "marked-day" : ""
                  }
                />
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-200 mb-3">
                  Citas del día:{" "}
                  <span className="text-cyan-400">
                    {selectedDate.toLocaleDateString()}
                  </span>
                </h3>

                {appointmentsForDay.length === 0 ? (
                  <p className="text-gray-400">No hay citas en esta fecha.</p>
                ) : (
                  <ul className="space-y-3">
                    {appointmentsForDay.map((a) => (
                      <li
                        key={a.id}
                        className="bg-gray-800 p-4 rounded-lg shadow-md flex justify-between"
                      >
                        <div>
                          <p className="text-cyan-400 font-semibold">{a.name}</p>
                          <p className="text-gray-300">
                            {new Date(a.dateTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          <p className="text-gray-400">{a.reason}</p>
                        </div>

                        <button
                          onClick={() => deleteAppointment(a.id)}
                          className="bg-red-500 hover:bg-red-400 px-3 py-1 rounded text-white text-sm"
                        >
                          Eliminar
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        );

      case "patients":
        return <PatientsSection />;

      default:
        return <div className="p-8 text-white">Secciones próximas…</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* SIDEBAR */}
      <aside className="w-60 bg-gray-900 text-white min-h-screen p-5 border-r border-gray-700">
        <h2 className="text-xl font-bold mb-6 text-cyan-400">Dashboard</h2>

        <ul className="space-y-4">
          <li>
            <button
              onClick={() => setActiveSection("agendar")}
              className={`w-full text-left p-2 rounded ${
                activeSection === "agendar"
                  ? "bg-cyan-600"
                  : "hover:bg-gray-700"
              }`}
            >
              Agendar citas
            </button>
          </li>

          <li>
            <button
              onClick={() => setActiveSection("patients")}
              className={`w-full text-left p-2 rounded ${
                activeSection === "patients"
                  ? "bg-cyan-600"
                  : "hover:bg-gray-700"
              }`}
            >
              Pacientes
            </button>
          </li>
        </ul>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 overflow-y-auto">{renderSection()}</main>
    </div>
  );
}
