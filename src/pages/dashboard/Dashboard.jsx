import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendarCustom.css";
import PatientsSection from "./PatientsSection";
import PatientView from "./PatientView";
import SystemModal from "../../components/SystemModal";

function AgendaSection({
  role,
  activeDate,
  appointments,
  allAppointments,
  getDoctorLabel,
  getDoctorColorClass,
  getStatusConfig,
  deleteAppointment,
  setActiveSection,
  setSelectedDate,
  updateAppointmentStatus,
}) {
  const [showWeek, setShowWeek] = useState(false);

  const handleGoToday = () => {
    const today = new Date();
    setSelectedDate(today);
  };

  const handleGoTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow);
  };

  const baseDate = new Date(activeDate);
  baseDate.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(baseDate);
  startOfWeek.setDate(baseDate.getDate() - baseDate.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const sortedDayAppointments = [...appointments].sort((a, b) =>
    new Date(a.dateTime) - new Date(b.dateTime)
  );

  const weekAppointments = allAppointments
    .filter((a) => {
      const d = new Date(a.dateTime);
      d.setHours(0, 0, 0, 0);
      return d >= startOfWeek && d <= endOfWeek;
    })
    .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

  const listToRender = showWeek ? weekAppointments : sortedDayAppointments;
  const hasAppointments = listToRender.length > 0;

  const title = showWeek
    ? `Citas de la semana: ${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`
    : `Citas del día: ${activeDate.toLocaleDateString()}`;

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h3 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
          <span>{title}</span>
        </h3>

        <div className="flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={handleGoToday}
            className="px-3 py-1 rounded-full border border-gray-600 bg-gray-900/80 hover:bg-gray-800 text-gray-200"
          >
            Hoy
          </button>
          <button
            type="button"
            onClick={handleGoTomorrow}
            className="px-3 py-1 rounded-full border border-gray-600 bg-gray-900/80 hover:bg-gray-800 text-gray-200"
          >
            Mañana
          </button>
          <button
            type="button"
            onClick={() => setShowWeek((prev) => !prev)}
            className={`px-3 py-1 rounded-full border text-gray-200 ${
              showWeek
                ? "bg-cyan-600 border-cyan-400"
                : "bg-gray-900/80 hover:bg-gray-800 border-gray-600"
            }`}
          >
            Esta semana
          </button>
        </div>
      </div>

      {!hasAppointments ? (
        <div className="text-gray-400 text-sm space-y-2">
          <p>
            {role === "reception"
              ? "No hay citas para este rango de fechas."
              : "No tienes citas para este rango de fechas."}
          </p>
          {role === "reception" && (
            <button
              type="button"
              onClick={() => setActiveSection("agendar")}
              className="inline-flex items-center px-3 py-1.5 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs"
            >
              Agendar nueva cita
            </button>
          )}
        </div>
      ) : (
        <ul className="space-y-3">
          {listToRender.map((a) => {
            const dateObj = new Date(a.dateTime);
            const timeStr = dateObj.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            const dateStr = dateObj.toLocaleDateString();
            const statusValue = a.status || "programada";
            const { label: statusLabel, className: statusClass } =
              getStatusConfig(statusValue);

            return (
              <li
                key={a.id}
                className="bg-gray-900/80 border border-gray-800 p-4 rounded-xl shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <p className="text-cyan-300 font-semibold">{a.name}</p>
                  <p className="text-gray-300 text-sm">
                    {dateStr} · {timeStr}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">{a.reason}</p>

                  {a.doctorType && (
                    <p
                      className={`${getDoctorColorClass(
                        a.doctorType
                      )} text-xs mt-1`}
                    >
                      {getDoctorLabel(a.doctorType)}
                    </p>
                  )}

                  {a.notes && (
                    <p className="text-xs text-gray-300 mt-2 italic">
                      Nota: {a.notes}
                    </p>
                  )}

                  <span
                    className={`inline-flex items-center mt-2 px-2 py-0.5 rounded-full text-[11px] font-medium ${statusClass}`}
                  >
                    {statusLabel}
                  </span>

                  {role === "reception" && (
                    <select
                      className="mt-2 text-[11px] bg-gray-900 border border-gray-700 text-gray-100 rounded-full px-2 py-1"
                      value={statusValue}
                      onChange={(e) =>
                        updateAppointmentStatus(a.id, e.target.value)
                      }
                    >
                      <option value="programada">Programada</option>
                      <option value="completada">Completada</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                  )}
                </div>

                <button
                  onClick={() => deleteAppointment(a.id)}
                  className="self-start sm:self-auto bg-red-500 hover:bg-red-400 px-3 py-1.5 rounded-full text-white text-xs font-medium shadow-sm"
                >
                  Eliminar
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("agendar");
  const [appointments, setAppointments] = useState([]);
  const [role, setRole] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("appointments")) || [];
    setAppointments(saved);
  }, []);

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    const storedName = localStorage.getItem("userName") || "";

    if (!storedRole) {
      navigate("/login");
      return;
    }

    setRole(storedRole);
    setUserName(storedName);

    if (storedRole === "patient") {
      setActiveSection("patientView");
    } else {
      setActiveSection("agendar");
    }
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);

  const [name, setName] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [reason, setReason] = useState("");
  const [doctorType, setDoctorType] = useState("");
  const [status, setStatus] = useState("programada");
  const [notes, setNotes] = useState("");
  const [toast, setToast] = useState(null);
  const [modalConfig, setModalConfig] = useState(null);

  const showConfirm = (message, title = "Confirmar", confirmText = "Sí", cancelText = "No") => {
    return new Promise((resolve) => {
      setModalConfig({
        message,
        title,
        confirmText,
        cancelText,
        onConfirm: () => {
          resolve(true);
          setModalConfig(null);
        },
        onCancel: () => {
          resolve(false);
          setModalConfig(null);
        },
      });
    });
  };

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const getMinDateTimeLocalString = () => {
    const now = new Date();
    now.setSeconds(0, 0);
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const minDateTime = getMinDateTimeLocalString();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !dateTime || !reason || !doctorType) {
      showToast("Todos los campos son obligatorios.", "error");
      return;
    }

    const selectedDate = new Date(dateTime);
    const now = new Date();

    if (selectedDate < now) {
      showToast("No puedes agendar una cita en una fecha pasada.", "error");
      return;
    }

    const patientDoubleBooking = appointments.some(
      (a) => a.name === name && a.dateTime === dateTime
    );

    const doctorDoubleBooking = appointments.some(
      (a) => a.doctorType === doctorType && a.dateTime === dateTime
    );

    // Prevent booking the same doctor at the exact same date/time
    if (doctorDoubleBooking) {
      showToast(
        "No se puede agendar: el doctor ya tiene otra cita a esa fecha y hora.",
        "error"
      );
      return;
    }

    // Warn if the same patient already has a booking at the same time
    if (patientDoubleBooking) {
      const proceed = await showConfirm(
        "Este paciente ya tiene una cita en ese horario. ¿Deseas continuar?",
        "Posible doble cita",
        "Continuar",
        "Cancelar"
      );

      if (!proceed) {
        showToast(
          "No se creó la cita por posible doble agendamiento.",
          "warning"
        );
        return;
      }
      showToast(
        "Cita creada con posible doble agendamiento para este paciente.",
        "warning"
      );
    }

    const newAppointment = {
      id: Date.now(),
      name,
      dateTime,
      reason,
      doctorType,
      status,
      notes,
    };

    setAppointments([...appointments, newAppointment]);
    showToast("Cita creada correctamente.", "success");

    setName("");
    setDateTime("");
    setReason("");
    setDoctorType("");
    setStatus("programada");
    setNotes("");
  };

  const deleteAppointment = async (id) => {
    const confirmDelete = await showConfirm(
      "¿Seguro que deseas eliminar esta cita? Esta acción no se puede deshacer.",
      "Eliminar cita",
      "Eliminar",
      "Cancelar"
    );
    if (!confirmDelete) return;

    const updated = appointments.filter((item) => item.id !== id);
    setAppointments(updated);
    showToast("Cita eliminada correctamente.", "success");
  };

  const updateAppointmentStatus = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    showToast("Estado de la cita actualizado.", "success");
  };

  const handlePatientCancel = async (id) => {
    const appt = appointments.find((a) => a.id === id);
    if (!appt) return;

    const apptDate = new Date(appt.dateTime);
    const now = new Date();

    if (apptDate < now) {
      showToast("Solo puedes cancelar citas futuras.", "error");
      return;
    }

    const diffHours = (apptDate - now) / (1000 * 60 * 60);
    if (diffHours < 24) {
      showToast(
        "Solo puedes cancelar citas con al menos 24 horas de anticipación.",
        "error"
      );
      return;
    }

    const confirmCancel = await showConfirm(
      "¿Seguro que deseas cancelar esta cita?",
      "Cancelar cita",
      "Sí, cancelar",
      "No"
    );
    if (!confirmCancel) return;

    updateAppointmentStatus(id, "cancelada");
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
    const getDoctorLabel = (doctor) => {
      switch (doctor) {
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

    const getDoctorColorClass = (doctor) => {
      switch (doctor) {
        case "general":
          return "text-emerald-400";
        case "cardiologia":
          return "text-rose-400";
        case "pediatria":
          return "text-sky-400";
        case "ginecologia":
          return "text-pink-400";
        case "dermatologia":
          return "text-orange-400";
        case "traumatologia":
          return "text-yellow-400";
        case "neurologia":
          return "text-purple-400";
        default:
          return "text-cyan-400";
      }
    };

    const getStatusConfig = (statusValue) => {
      switch (statusValue) {
        case "completada":
          return {
            label: "Completada",
            className:
              "bg-emerald-900/60 text-emerald-200 border border-emerald-500/60",
          };
        case "cancelada":
          return {
            label: "Cancelada",
            className:
              "bg-red-900/60 text-red-200 border border-red-500/60",
          };
        default:
          return {
            label: "Programada",
            className:
              "bg-cyan-900/60 text-cyan-100 border border-cyan-500/60",
          };
      }
    };

    switch (activeSection) {
      case "agendar":
        return (
          <div className="p-8 grid grid-cols-1 2xl:grid-cols-3 gap-10">
            {/* ----- FORMULARIO ----- */}
            <div className="2xl:col-span-1">
              <h2 className="text-3xl font-bold text-cyan-400 mb-6">
                Agendar Cita
              </h2>

              <form
                onSubmit={handleSubmit}
                className="bg-gray-900/80 backdrop-blur border border-gray-800 p-6 rounded-2xl shadow-xl space-y-4"
              >
                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-medium">
                    Nombre del paciente
                  </label>
                  <input
                    type="text"
                    className="w-full p-2.5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-medium">
                    Fecha y hora
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full p-2.5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    value={dateTime}
                    min={minDateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-medium">
                    Tipo de doctor
                  </label>
                  <select
                    className="w-full p-2.5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                    value={doctorType}
                    onChange={(e) => setDoctorType(e.target.value)}
                  >
                    <option value="">Seleccione una opción</option>
                    <option value="general">Médico general</option>
                    <option value="cardiologia">Cardiólogo (Cardiología)</option>
                    <option value="pediatria">Pediatra (Pediatría)</option>
                    <option value="ginecologia">Ginecólogo/a (Ginecología)</option>
                    <option value="dermatologia">Dermatólogo/a (Dermatología)</option>
                    <option value="traumatologia">Traumatólogo/a (Traumatología)</option>
                    <option value="neurologia">Neurólogo/a (Neurología)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-medium">
                    Estado de la cita
                  </label>
                  <select
                    className="w-full p-2.5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="programada">Programada</option>
                    <option value="completada">Completada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-medium">
                    Motivo
                  </label>
                  <textarea
                    rows="3"
                    className="w-full p-2.5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm resize-none"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Ej. Consulta general"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-medium">
                    Notas / recomendaciones (opcional)
                  </label>
                  <textarea
                    rows="2"
                    className="w-full p-2.5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs resize-none"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ej. Indicar reposo, exámenes previos, etc."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-cyan-500 hover:bg-cyan-400 px-6 py-2.5 rounded-full text-white font-semibold shadow-md shadow-cyan-500/30 transition"
                >
                  Agendar
                </button>
              </form>
            </div>

            {/* ----- CALENDARIO ----- */}
            <div className="2xl:col-span-2">
              <h2 className="text-3xl font-bold text-cyan-400 mb-6 flex items-center justify-between gap-4">
                <span>Calendario</span>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="hidden sm:inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border border-gray-600 bg-gray-900/80 hover:bg-gray-800 text-gray-200"
                >
                  Imprimir agenda
                </button>
              </h2>

              <div className="bg-gray-900/80 backdrop-blur p-6 rounded-2xl shadow-xl inline-block border border-gray-800">
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  tileClassName={({ date }) =>
                    hasAppointment(date) ? "marked-day" : ""
                  }
                />
              </div>

              <AgendaSection
                role={role}
                activeDate={selectedDate}
                appointments={appointmentsForDay}
                allAppointments={appointments}
                getDoctorLabel={getDoctorLabel}
                getDoctorColorClass={getDoctorColorClass}
                getStatusConfig={getStatusConfig}
                deleteAppointment={deleteAppointment}
                setActiveSection={setActiveSection}
                setSelectedDate={setSelectedDate}
                updateAppointmentStatus={updateAppointmentStatus}
              />
            </div>
          </div>
        );

      case "patients":
        return <PatientsSection />;

      case "patientView":
        return (
          <PatientView
            appointments={appointments}
            onCancelAppointment={role === "patient" ? handlePatientCancel : null}
          />
        );

      default:
        return <div className="p-8 text-white">Secciones próximas…</div>;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  if (!role) {
    return null;
  }

  const isReception = role === "reception";

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-950/90 border-r border-gray-800/80 p-5 flex flex-col gap-6 shadow-xl shadow-black/40">
        <div className="pb-4 border-b border-gray-800/70">
          <h2 className="text-xl font-bold text-cyan-400 tracking-tight">eCitas</h2>
          <p className="text-xs text-gray-500 mt-1">
            Panel de gestión de pacientes y citas
          </p>
        </div>

        <ul className="space-y-2 text-sm">
          {isReception && (
            <li>
              <button
                onClick={() => setActiveSection("agendar")}
                className={`w-full text-left px-3 py-2 rounded-lg transition flex items-center gap-2 border-l-4 ${
                  activeSection === "agendar"
                    ? "bg-cyan-600/20 border-cyan-400 text-white"
                    : "border-transparent hover:bg-gray-900 text-gray-300"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Agendar citas</span>
              </button>
            </li>
          )}

          {isReception && (
            <li>
              <button
                onClick={() => setActiveSection("patients")}
                className={`w-full text-left px-3 py-2 rounded-lg transition flex items-center gap-2 border-l-4 ${
                  activeSection === "patients"
                    ? "bg-cyan-600/20 border-cyan-400 text-white"
                    : "border-transparent hover:bg-gray-900 text-gray-300"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Gestión de pacientes</span>
              </button>
            </li>
          )}

          <li>
            <button
              onClick={() => setActiveSection("patientView")}
              className={`w-full text-left px-3 py-2 rounded-lg transition flex items-center gap-2 border-l-4 ${
                activeSection === "patientView"
                  ? "bg-cyan-600/20 border-cyan-400 text-white"
                  : "border-transparent hover:bg-gray-900 text-gray-300"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Vista del paciente</span>
            </button>
          </li>
        </ul>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-gray-950/80 border-b border-gray-800/80 backdrop-blur px-8 py-4 flex items-center justify-between shadow-md shadow-black/40">
          <div>
            <h1 className="text-2xl font-bold text-cyan-400">Dashboard</h1>
            <p className="text-xs text-gray-400 mt-1">
              Administra tus citas, pacientes y consulta información clave.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-300">
              Rol: {role === "reception" ? "Recepción" : "Paciente"}
              {userName && ` · ${userName}`}
            </span>
            <button
              onClick={handleLogout}
              className="text-xs bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-full px-3 py-1 text-gray-200"
            >
              Cerrar sesión
            </button>
          </div>
        </header>
        <div className="px-4 sm:px-6 lg:px-8 pb-10">
          <div className="max-w-6xl mx-auto">
            {renderSection()}
          </div>
        </div>
      </main>

      {toast && (
        <div
          className={`fixed bottom-4 right-4 max-w-xs px-4 py-3 rounded-lg shadow-lg text-sm border transition-opacity duration-300 ${
            toast.type === "error"
              ? "bg-red-900/90 border-red-500/70 text-red-50"
              : toast.type === "success"
              ? "bg-emerald-900/90 border-emerald-500/70 text-emerald-50"
              : toast.type === "warning"
              ? "bg-amber-900/90 border-amber-500/70 text-amber-50"
              : "bg-gray-900/90 border-gray-600 text-gray-100"
          }`}
        >
          {toast.message}
        </div>
      )}
      {modalConfig && (
        <SystemModal
          message={modalConfig.message}
          title={modalConfig.title}
          confirmText={modalConfig.confirmText}
          cancelText={modalConfig.cancelText}
          onConfirm={modalConfig.onConfirm}
          onCancel={modalConfig.onCancel}
        />
      )}
    </div>
  );
}
