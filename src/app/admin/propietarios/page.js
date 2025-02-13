"use client"
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

const Propietarios = () => {
  const [propietarios, setPropietarios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");
  const [propietario, setPropietario] = useState({
    nombres: "",
    documentoIdentidad: "",
    estadoPago: false,
    correo: "",
    telefono: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const formularioRef = useRef(null);

  const cargarPropietarios = async () => {
    try {
      const response = await apiClient.get("/propietarios");
      setPropietarios(response.data);
    } catch (err) {
      console.error("Error al cargar propietarios:", err);
      showModal("Error al cargar los propietarios", "error");
      if (err.response?.status === 403) {
        showModal("No tienes permisos para ver los propietarios", "error");
      }
    }
  };

  useEffect(() => {
    cargarPropietarios();
  }, []);

  const showModal = (message, type = "success") => {
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
    }, 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPropietario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await apiClient.put(`/propietarios/${propietario.id}`, propietario);
        showModal("Propietario actualizado exitosamente");
      } else {
        await apiClient.post("/propietarios", propietario);
        showModal("Propietario registrado exitosamente");
      }

      setIsEditing(false);
      setPropietario({
        nombres: "",
        documentoIdentidad: "",
        estadoPago: false,
        correo: "",
        telefono: ""
      });

      cargarPropietarios();
    } catch (err) {
      console.error("Error al guardar propietario:", err);
      const errorMessage = err.response?.data?.message || "Error al guardar el propietario";
      showModal(errorMessage, "error");
      
      if (err.response?.status === 403) {
        showModal("No tienes permisos para realizar esta acción", "error");
      }
    }
  };

  const handleEdit = (prop) => {
    setPropietario(prop);
    setIsEditing(true);
    formularioRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Está seguro de eliminar este propietario?")) return;

    try {
      await apiClient.delete(`/propietarios/${id}`);
      showModal("Propietario eliminado exitosamente");
      cargarPropietarios();
    } catch (err) {
      console.error("Error al eliminar propietario:", err);
      const errorMessage = err.response?.data?.message || "Error al eliminar el propietario";
      showModal(errorMessage, "error");
      
      if (err.response?.status === 403) {
        showModal("No tienes permisos para eliminar propietarios", "error");
      }
    }
  };

  return (
    <div className="">
      {modalVisible && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black border border-green-700 text-2xl p-4 rounded-lg shadow-lg max-w-sm w-full text-center">
            <p className={`font-bold ${modalType === "error" ? "text-red-700" : "text-green-700"}`}>
              {modalMessage}
            </p>
          </div>
        </div>
      )}
      <div className="h-full w-full">
        <div ref={formularioRef} className="w-full h-24 bg-transparent"></div>
        <div className="grid grid-rows-2 gap-3">
          {/* Formulario */}
          <div className="px-40 py-3 rounded-lg shadow-lg h-[83vh] flex flex-col justify-center ">
            <h2 className="text-2xl font-bold mb-6 text-gray-700">
              {isEditing ? "Editar Propietario" : "Nuevo Propietario"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombres</label>
                  <input
                    type="text"
                    name="nombres"
                    value={propietario.nombres}
                    onChange={handleChange}
                    className="mt-1 block bg-transparent w-full py-2 rounded-md border border-green-700 shadow-sm focus:border-morado focus:ring-morado text-gray-950"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Documento de Identidad</label>
                  <input
                    type="text"
                    name="documentoIdentidad"
                    value={propietario.documentoIdentidad}
                    onChange={handleChange}
                    className="mt-1 block bg-transparent w-full py-2 rounded-md border border-green-700 shadow-sm focus:border-morado focus:ring-morado text-gray-950"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                  <input
                    type="email"
                    name="correo"
                    value={propietario.correo}
                    onChange={handleChange}
                    className="mt-1 block bg-transparent w-full py-2 rounded-md border border-green-700 shadow-sm focus:border-morado focus:ring-morado text-gray-950"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                  <input
                    type="text"
                    name="telefono"
                    value={propietario.telefono}
                    onChange={handleChange}
                    className="mt-1 block bg-transparent w-full py-2 rounded-md border border-green-700 shadow-sm focus:border-morado focus:ring-morado text-gray-950"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  {isEditing ? "Actualizar" : "Registrar"} Propietario
                </button>
              </div>
            </form>
          </div>

          {/* Tabla de Propietarios */}
          <div className="p-6 rounded-lg shadow-lg overflow-x-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-700">Lista de Propietarios</h2>
            <table className="min-w-full text-white rounded-md">
              <thead>
                <tr>
                  <th className="border border-green-700 p-2 text-green-700">Nombres</th>
                  <th className="border border-green-700 p-2 text-green-700">Documento</th>
                  <th className="border border-green-700 p-2 text-green-700">Correo</th>
                  <th className="border border-green-700 p-2 text-green-700">Teléfono</th>
                  <th className="border border-green-700 p-2 text-green-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {propietarios.map((prop) => (
                  <tr key={prop.id} className="border border-green-700">
                    <td className="p-2 text-gray-950">{prop.nombres}</td>
                    <td className="p-2 text-gray-950">{prop.documentoIdentidad}</td>
                    <td className="p-2 text-gray-950">{prop.correo}</td>
                    <td className="p-2 text-gray-950">{prop.telefono}</td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleEdit(prop)}
                        className="bg-green-700 text-white py-1 px-1 hover:underline rounded-md mr-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(prop.id)}
                        className="bg-red-500 text-white py-1 px-1 rounded-md hover:underline"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Propietarios;