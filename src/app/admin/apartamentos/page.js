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

const Apartamentos = () => {
  const [apartamentos, setApartamentos] = useState([]);
  const [apartamento, setApartamento] = useState({
    numeroApartamento: "",
    metros: "",
    estado: "ocupado",
    propietarioId: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");
  const [propietarios, setPropietarios] = useState([]);
  const formularioRef = useRef(null);

  const cargarApartamentos = async () => {
    try {
      const response = await apiClient.get("/apartamentos");
      setApartamentos(response.data);
    } catch (err) {
      console.error("Error al cargar apartamentos:", err);
      mostrarModal("Error al cargar los apartamentos", "error");
      if (err.response?.status === 403) {
        mostrarModal("No tienes permisos para ver los apartamentos", "error");
      }
    }
  };

  const cargarPropietarios = async () => {
    try {
      const response = await apiClient.get("/propietarios");
      setPropietarios(response.data);
    } catch (err) {
      console.error("Error al cargar propietarios:", err);
      mostrarModal("Error al cargar los propietarios", "error");
      if (err.response?.status === 403) {
        mostrarModal("No tienes permisos para ver los propietarios", "error");
      }
    }
  };

  useEffect(() => {
    cargarApartamentos();
    cargarPropietarios();
  }, []);

  const mostrarModal = (message, type = "success") => {
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
    }, 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApartamento((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await apiClient.put(`/apartamentos/${apartamento.id}`, apartamento);
        mostrarModal("Apartamento actualizado exitosamente");
      } else {
        await apiClient.post("/apartamentos", apartamento);
        mostrarModal("Apartamento registrado exitosamente");
      }

      setIsEditing(false);
      setApartamento({
        numeroApartamento: "",
        metros: "",
        estado: "ocupado",
        propietarioId: "",
      });

      cargarApartamentos();
    } catch (err) {
      console.error("Error al guardar apartamento:", err);
      const errorMessage = err.response?.data?.message || "Error al guardar el apartamento";
      mostrarModal(errorMessage, "error");

      if (err.response?.status === 403) {
        mostrarModal("No tienes permisos para realizar esta acción", "error");
      }
    }
  };

  const handleEdit = (apt) => {
    setApartamento(apt);
    setIsEditing(true);
    formularioRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Está seguro de eliminar este apartamento?")) return;

    try {
      await apiClient.delete(`/apartamentos/${id}`);
      mostrarModal("Apartamento eliminado exitosamente");
      cargarApartamentos();
    } catch (err) {
      console.error("Error al eliminar apartamento:", err);
      const errorMessage = err.response?.data?.message || "Error al eliminar el apartamento";
      mostrarModal(errorMessage, "error");

      if (err.response?.status === 403) {
        mostrarModal("No tienes permisos para eliminar apartamentos", "error");
      }
    }
  };

  return (
    <div className="">
      {modalVisible && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black border border-green-700 p-4 rounded-lg shadow-lg max-w-sm w-full text-2xl text-center">
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
              {isEditing ? "Editar Apartamento" : "Nuevo Apartamento"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Número de Apartamento</label>
                  <input
                    type="text"
                    name="numeroApartamento"
                    value={apartamento.numeroApartamento}
                    onChange={handleChange}
                    className="mt-1 block bg-transparent w-full py-2 rounded-md border border-green-700 shadow-sm focus:border-morado focus:ring-morado text-gray-950"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Metros Cuadrados</label>
                  <input
                    type="number"
                    name="metros"
                    value={apartamento.metros}
                    onChange={handleChange}
                    className="mt-1 block bg-transparent w-full py-2 rounded-md border border-green-700 shadow-sm focus:border-morado focus:ring-morado text-gray-950"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Estado</label>
                  <select
                    name="estado"
                    value={apartamento.estado}
                    onChange={handleChange}
                    className="mt-1 block bg-transparent w-full py-2 rounded-md border border-green-700 shadow-sm focus:border-morado focus:ring-morado text-gray-950"
                    required
                  >
                    <option value="ocupado">Ocupado</option>
                    <option value="desocupado">Desocupado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Propietario</label>
                  <select
                    name="propietarioId"
                    value={apartamento.propietarioId}
                    onChange={handleChange}
                    className="mt-1 block bg-transparent w-full py-2 rounded-md border border-green-700 shadow-sm focus:border-morado focus:ring-morado text-gray-950"
                  >
                    <option value="">Seleccione un propietario</option>
                    {propietarios.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.nombres}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-verde text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  {isEditing ? "Actualizar" : "Registrar"} Apartamento
                </button>
              </div>
            </form>
          </div>

          {/* Tabla de Apartamentos */}
          <div className="p-6 rounded-lg shadow-lg overflow-x-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-700">Lista de Apartamentos</h2>
            <table className="min-w-full text-white rounded-md">
              <thead>
                <tr>
                  <th className="border border-green-700 p-2 text-green-700">Número de Apartamento</th>
                  <th className="border border-green-700 p-2 text-green-700">Metros Cuadrados</th>
                  <th className="border border-green-700 p-2 text-green-700">Estado</th>
                  <th className="border border-green-700 p-2 text-green-700">Propietario</th>
                  <th className="border border-green-700 p-2 text-green-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {apartamentos.map((apt) => (
                  <tr key={apt.id} className="border border-green-700 ">
                    <td className="p-2 text-gray-950">{apt.numeroApartamento}</td>
                    <td className="p-2 text-gray-950">{apt.metros}</td>
                    <td className="p-2 text-gray-950">{apt.estado}</td>
                    <td className="p-2 text-gray-950">{apt.Propietario?.nombres || "No asignado"}</td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleEdit(apt)}
                        className="bg-verde text-white py-1 px-1 hover:underline rounded-md mr-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(apt.id)}
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

export default Apartamentos;