"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

const Informes = () => {
  const [informes, setInformes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");
  const [informe, setInforme] = useState({
    motivo: "",
    descripcion: "",
    remitenteId: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const formularioRef = useRef(null);

  const cargarInformes = async () => {
    try {
      const response = await apiClient.get("/informes");
      setInformes(response.data);
    } catch (err) {
      console.error("Error al cargar informes:", err);
      showModal("Error al cargar los informes", "error");
      if (err.response?.status === 403) {
        showModal("No tienes permisos para ver los informes", "error");
      }
    }
  };

  const cargarUsuarios = async () => {
    try {
      const response = await apiClient.get("/usuarios");
      setUsuarios(response.data);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      showModal("Error al cargar los usuarios", "error");
      if (err.response?.status === 403) {
        showModal("No tienes permisos para ver los usuarios", "error");
      }
    }
  };

  useEffect(() => {
    cargarInformes();
    cargarUsuarios();
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
    setInforme((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await apiClient.put(`/informes/${informe.id}`, informe);
        showModal("Informe actualizado exitosamente");
      } else {
        await apiClient.post("/informes", informe);
        showModal("Informe registrado exitosamente");
      }

      setIsEditing(false);
      setInforme({
        motivo: "",
        descripcion: "",
        remitenteId: "",
      });

      cargarInformes();
    } catch (err) {
      console.error("Error al guardar informe:", err);
      const errorMessage = err.response?.data?.message || "Error al guardar el informe";
      showModal(errorMessage, "error");
      
      if (err.response?.status === 403) {
        showModal("No tienes permisos para realizar esta acción", "error");
      }
    }
  };

  const handleEdit = (inf) => {
    setInforme(inf);
    setIsEditing(true);
    formularioRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Está seguro de eliminar este informe?")) return;

    try {
      await apiClient.delete(`/informes/${id}`);
      showModal("Informe eliminado exitosamente");
      cargarInformes();
    } catch (err) {
      console.error("Error al eliminar informe:", err);
      const errorMessage = err.response?.data?.message || "Error al eliminar el informe";
      showModal(errorMessage, "error");
      
      if (err.response?.status === 403) {
        showModal("No tienes permisos para eliminar informes", "error");
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
              {isEditing ? "Editar Informe" : "Nuevo Informe"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Motivo</label>
                  <input
                    type="text"
                    name="motivo"
                    value={informe.motivo}
                    onChange={handleChange}
                    className="mt-1 block bg-transparent w-full py-2 rounded-md border border-green-700 shadow-sm focus:border-morado focus:ring-morado text-gray-950"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Descripción</label>
                  <textarea
                    name="descripcion"
                    value={informe.descripcion}
                    onChange={handleChange}
                    className="mt-1 block bg-transparent w-full py-2 rounded-md border border-green-700 shadow-sm focus:border-morado focus:ring-morado text-gray-950"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Remitente</label>
                  <select
                    name="remitenteId"
                    value={informe.remitenteId}
                    onChange={handleChange}
                    className="mt-1 block bg-transparent w-full py-2 rounded-md border border-green-700 shadow-sm focus:border-morado focus:ring-morado  text-gray-950"
                    required
                  >
                    <option value="">Seleccione el remitente</option>
                    {usuarios.map((usuario) => (
                      <option key={usuario.id} value={usuario.id}>
                        {usuario.nombres}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-verde text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  {isEditing ? "Actualizar" : "Registrar"} Informe
                </button>
              </div>
            </form>
          </div>

          {/* Tabla de Informes */}
          <div className="p-6 rounded-lg shadow-lg overflow-x-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-700">Lista de Informes</h2>
            <table className="min-w-full text-white rounded-md">
              <thead>
                <tr>
                  <th className="border border-green-700 p-2 text-green-700">Motivo</th>
                  <th className="border border-green-700 p-2 text-green-700">Descripción</th>
                  <th className="border border-green-700 p-2 text-green-700">Remitente</th>
                  <th className="border border-green-700 p-2 text-green-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {informes.map((inf) => (
                  <tr key={inf.id} className="border border-green-700">
                    <td className="p-2 text-gray-950">{inf.motivo}</td>
                    <td className="p-2 text-gray-950">{inf.descripcion}</td>
                    <td className="p-2 text-gray-950">{inf.Usuario?.nombres || "Sin remitente"}</td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleEdit(inf)}
                        className="bg-verde text-white py-1 px-1 hover:underline rounded-md mr-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(inf.id)}
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

export default Informes;