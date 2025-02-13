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

const Visitantes = () => {
  const [visitantes, setVisitantes] = useState([]);
  const [apartamentos, setApartamentos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");
  const [visitante, setVisitante] = useState({
    nombres: "",
    documento: "",
    telefono: "",
    apartamentoId: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const formularioRef = useRef(null);

  const cargarVisitantes = async () => {
    try {
      const response = await apiClient.get("/visitantes");
      setVisitantes(response.data);
    } catch (err) {
      console.error("Error al cargar visitantes:", err);
      showModal("Error al cargar los visitantes", "error");
      if (err.response?.status === 403) {
        showModal("No tienes permisos para ver los visitantes", "error");
      }
    }
  };

  const cargarApartamentos = async () => {
    try {
      const response = await apiClient.get("/apartamentos");
      setApartamentos(response.data);
    } catch (err) {
      console.error("Error al cargar apartamentos:", err);
      showModal("Error al cargar los apartamentos", "error");
      if (err.response?.status === 403) {
        showModal("No tienes permisos para ver los apartamentos", "error");
      }
    }
  };

  useEffect(() => {
    cargarVisitantes();
    cargarApartamentos();
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
    setVisitante((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await apiClient.put(`/visitantes/${visitante.id}`, visitante);
        showModal("Visitante actualizado exitosamente");
      } else {
        await apiClient.post("/visitantes", visitante);
        showModal("Visitante registrado exitosamente");
      }

      setIsEditing(false);
      setVisitante({
        nombres: "",
        documento: "",
        telefono: "",
        apartamentoId: "",
      });

      cargarVisitantes();
    } catch (err) {
      console.error("Error al guardar visitante:", err);
      const errorMessage = err.response?.data?.message || "Error al guardar el visitante";
      showModal(errorMessage, "error");
      
      if (err.response?.status === 403) {
        showModal("No tienes permisos para realizar esta acción", "error");
      }
    }
  };

  const handleEdit = (vis) => {
    setVisitante(vis);
    setIsEditing(true);
    formularioRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Está seguro de eliminar este visitante?")) return;

    try {
      await apiClient.delete(`/visitantes/${id}`);
      showModal("Visitante eliminado exitosamente");
      cargarVisitantes();
    } catch (err) {
      console.error("Error al eliminar visitante:", err);
      const errorMessage = err.response?.data?.message || "Error al eliminar el visitante";
      showModal(errorMessage, "error");
      
      if (err.response?.status === 403) {
        showModal("No tienes permisos para eliminar visitantes", "error");
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
              {isEditing ? "Editar Visitante" : "Nuevo Visitante"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <input
                    type="text"
                    name="nombres"
                    value={visitante.nombres}
                    onChange={handleChange}
                    className="mt-1 block bg-transparent w-full py-2 rounded-md border border-green-700 shadow-sm focus:border-morado focus:ring-morado text-gray-950"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Documento</label>
                  <input
                    type="text"
                    name="documento"
                    value={visitante.documento}
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
                    value={visitante.telefono}
                    onChange={handleChange}
                    className="mt-1 block bg-transparent w-full py-2 rounded-md border border-green-700 shadow-sm focus:border-morado focus:ring-morado text-gray-950"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Apartamento al que se dirige</label>
                  <select
                    name="apartamentoId"
                    value={visitante.apartamentoId}
                    onChange={handleChange}
                    className="mt-1 block bg-transparent w-full py-2 rounded-md border border-green-700 shadow-sm focus:border-morado focus:ring-morado  text-gray-950"
                    required
                  >
                    <option value="">Seleccione un apartamento</option>
                    {apartamentos.map((apartamento) => (
                      <option key={apartamento.id} value={apartamento.id}>
                        {apartamento.numeroApartamento}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  {isEditing ? "Actualizar" : "Registrar"} Visitante
                </button>
              </div>
            </form>
          </div>

          {/* Tabla de Visitantes */}
          <div className="p-6 rounded-lg shadow-lg overflow-x-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-700">Lista de Visitantes</h2>
            <table className="min-w-full text-white rounded-md">
              <thead>
                <tr>
                  <th className="border border-green-700 p-2 text-green-700">Nombre</th>
                  <th className="border border-green-700 p-2 text-green-700">Documento</th>
                  <th className="border border-green-700 p-2 text-green-700">Teléfono</th>
                  <th className="border border-green-700 p-2 text-green-700">Apartamento</th>
                  <th className="border border-green-700 p-2 text-green-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {visitantes.map((vis) => (
                  <tr key={vis.id} className="border border-verde">
                    <td className="p-2 text-gray-950">{vis.nombres}</td>
                    <td className="p-2 text-gray-950">{vis.documento}</td>
                    <td className="p-2 text-gray-950">{vis.telefono}</td>
                    <td className="p-2 text-gray-950">{vis.Apartamento?.numeroApartamento || "Sin apartamento"}</td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleEdit(vis)}
                        className="bg-green-700 text-white py-1 px-1 hover:underline rounded-md mr-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(vis.id)}
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

export default Visitantes;