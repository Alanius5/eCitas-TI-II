import React from "react";

export default function SystemModal({ message, title, confirmText = "Aceptar", cancelText = "Cancelar", onConfirm, onCancel }) {
  if (!message) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />

      <div className="relative bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md w-full text-white shadow-xl">
        {title && <h3 className="text-lg font-semibold text-cyan-400 mb-2">{title}</h3>}
        <p className="text-sm text-gray-200 mb-4">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-600 text-sm text-gray-200"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="px-3 py-1.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-sm text-white"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
