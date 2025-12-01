import React, { useEffect, useState } from "react";

export default function PatientView({ appointments, onCancelAppointment }) {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("patients")) || [];
    setPatients(stored);
    if (stored.length > 0) {
      setSelectedPatientId(String(stored[0].id));
    }
  }, []);

  const handleChangePatient = (e) => {
    setSelectedPatientId(e.target.value);
  };

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedPatient = filteredPatients.find(
    (p) => String(p.id) === String(selectedPatientId)
  ) ||
  patients.find((p) => String(p.id) === String(selectedPatientId));

  const rawAppointmentsForPatient = selectedPatient
    ? appointments.filter((a) => a.name === selectedPatient.name)
    : [];

  const filterBySpecialty = (list) => {
    if (specialtyFilter === "all") return list;
    return list.filter((a) => a.doctorType === specialtyFilter);
  };

  const now = new Date();

  const upcomingAppointments = filterBySpecialty(
    rawAppointmentsForPatient.filter((a) => new Date(a.dateTime) >= now)
  ).sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

  const pastAppointments = filterBySpecialty(
    rawAppointmentsForPatient.filter((a) => new Date(a.dateTime) < now)
  ).sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

  const getDoctorLabel = (doctorType) => {
    switch (doctorType) {
      case "general":
        return "Médico general";
      case "cardiologia":
        return "Cardiólogo / Cardiología";
      case "pediatria":
        return "Pediatra";
      case "ginecologia":
        return "Ginecólogo / Ginecología";
      case "dermatologia":
        return "Dermatólogo / Dermatología";
      case "traumatologia":
        return "Traumatólogo / Traumatología";
      case "neurologia":
        return "Neurólogo / Neurología";
      default:
        return "Especialista";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "completada":
        return "Completada";
      case "cancelada":
        return "Cancelada";
      default:
        return "Programada";
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-cyan-400 mb-1">
            Vista del paciente
          </h2>
          <p className="text-gray-400 text-sm">
            Consulta la información básica del paciente y sus citas programadas.
          </p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full md:w-96 space-y-2">
          <label className="block text-gray-300 text-sm">Seleccionar paciente</label>
          {patients.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No hay pacientes registrados todavía.
            </p>
          ) : (
            <>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre"
                className="w-full mb-2 bg-gray-900 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {filteredPatients.length === 0 ? (
                <p className="text-xs text-gray-400">
                  No se encontraron pacientes con ese nombre.
                </p>
              ) : (
                <select
                  value={selectedPatientId}
                  onChange={handleChangePatient}
                  className="w-full bg-gray-900 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {filteredPatients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              )}
            </>
          )}
        </div>
      </div>

      {selectedPatient ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Información básica del paciente */}
          <section className="xl:col-span-1 bg-gray-900/80 border border-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-cyan-400 mb-4">
              Información del paciente
            </h3>
            <div className="space-y-3 text-gray-200 text-sm">
              <p>
                <span className="text-gray-400 text-xs">Nombre:</span>
                <br />
                <span className="font-semibold text-base">
                  {selectedPatient.name}
                </span>
              </p>
              {selectedPatient.phone && (
                <p>
                  <span className="text-gray-400 text-xs">Teléfono:</span>
                  <br />
                  <span className="font-medium">{selectedPatient.phone}</span>
                </p>
              )}
              {selectedPatient.email && (
                <p>
                  <span className="text-gray-400 text-xs">Correo:</span>
                  <br />
                  <span className="font-medium">{selectedPatient.email}</span>
                </p>
              )}
              {selectedPatient.birthDate && (
                <p>
                  <span className="text-gray-400 text-xs">Fecha de nacimiento:</span>
                  <br />
                  <span className="font-medium">
                    {new Date(selectedPatient.birthDate).toLocaleDateString()}
                  </span>
                </p>
              )}
              {selectedPatient.gender && (
                <p>
                  <span className="text-gray-400 text-xs">Género:</span>
                  <br />
                  <span className="font-medium">{selectedPatient.gender}</span>
                </p>
              )}
              {selectedPatient.address && (
                <p>
                  <span className="text-gray-400 text-xs">Dirección:</span>
                  <br />
                  <span className="font-medium">{selectedPatient.address}</span>
                </p>
              )}
            </div>
          </section>

          {/* Citas del paciente */}
          <section className="xl:col-span-2 bg-gray-900/80 border border-gray-800 rounded-2xl p-6 shadow-lg space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <h3 className="text-xl font-semibold text-cyan-400">
                Citas del paciente
              </h3>
              <div className="flex flex-wrap gap-2 text-xs items-center">
                <span className="text-gray-300">Filtrar por especialidad:</span>
                <select
                  className="bg-gray-800 border border-gray-700 text-white rounded-full px-3 py-1"
                  value={specialtyFilter}
                  onChange={(e) => setSpecialtyFilter(e.target.value)}
                >
                  <option value="all">Todas</option>
                  <option value="general">Médico general</option>
                  <option value="cardiologia">Cardiología</option>
                  <option value="pediatria">Pediatría</option>
                  <option value="ginecologia">Ginecología</option>
                  <option value="dermatologia">Dermatología</option>
                  <option value="traumatologia">Traumatología</option>
                  <option value="neurologia">Neurología</option>
                </select>
              </div>
            </div>

            {rawAppointmentsForPatient.length === 0 ? (
              <p className="text-gray-400 text-sm">
                Este paciente no tiene citas registradas.
              </p>
            ) : (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-emerald-400 mb-3">
                    Próximas citas
                  </h4>
                  {upcomingAppointments.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                      No hay citas futuras para este paciente.
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {upcomingAppointments.map((a) => (
                        <li
                          key={a.id}
                          className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                        >
                          <div>
                            <p className="text-sm font-semibold text-cyan-300">
                              {new Date(a.dateTime).toLocaleDateString()} -{" "}
                              {new Date(a.dateTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                            <p className="text-gray-200 text-sm mt-1">
                              {a.reason}
                            </p>
                            {a.doctorType && (
                              <p className="text-xs text-gray-200 mt-1">
                                {getDoctorLabel(a.doctorType)}
                              </p>
                            )}
                            {a.notes && (
                              <p className="text-xs text-gray-300 mt-2 italic">
                                Nota: {a.notes}
                              </p>
                            )}
                            <p className="text-xs text-emerald-300 mt-1">
                              Estado: {getStatusLabel(a.status)}
                            </p>
                          </div>

                          {onCancelAppointment && (
                            <button
                              type="button"
                              onClick={() => onCancelAppointment(a.id)}
                              className="self-start md:self-auto text-xs bg-red-500 hover:bg-red-400 text-white px-3 py-1.5 rounded-full"
                            >
                              Cancelar cita
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-300 mb-3">
                    Historial de citas
                  </h4>
                  {pastAppointments.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                      Aún no hay historial de citas para este paciente.
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {pastAppointments.map((a) => (
                        <li
                          key={a.id}
                          className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 flex flex-col gap-2"
                        >
                          <p className="text-sm font-semibold text-cyan-300">
                            {new Date(a.dateTime).toLocaleDateString()} -{" "}
                            {new Date(a.dateTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          <p className="text-gray-200 text-sm">{a.reason}</p>
                          {a.doctorType && (
                            <p className="text-xs text-gray-200">
                              {getDoctorLabel(a.doctorType)}
                            </p>
                          )}
                          {a.notes && (
                            <p className="text-xs text-gray-300 italic">
                              Nota: {a.notes}
                            </p>
                          )}
                          <p className="text-xs text-gray-400">
                            Estado: {getStatusLabel(a.status)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      ) : (
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 text-gray-400 text-sm">
          Selecciona un paciente para ver su información.
        </div>
      )}
    </div>
  );
}
