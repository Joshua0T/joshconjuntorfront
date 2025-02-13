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

const Pagos = () => {
  const [pagos, setPagos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");
  const [pago, setPago] = useState({
    monto: "",
    fechaVencimiento: "",
    propietarioId: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [propietarios, setPropietarios] = useState([]);
  const formularioRef = useRef(null);

  const cargarPagos = async () => {
    try {
      const response = await apiClient.get("/pagos");
      setPagos(response.data);
    } catch (err) {
      console.error("Error al cargar pagos:", err);
      showModal("Error al cargar los pagos", "error");
      if (err.response?.status === 403) {
        showModal("No tienes permisos para ver los pagos", "error");
      }
    }
  };

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
    cargarPagos();
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
    setPago((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await apiClient.put(`/pagos/${pago.id}`, pago);
        showModal("Pago actualizado exitosamente");
      } else {
        await apiClient.post("/pagos", pago);
        showModal("Pago registrado exitosamente");
      }

      setIsEditing(false);
      setPago({
        monto: "",
        fechaVencimiento: "",
        propietarioId: "",
      });

      cargarPagos();
    } catch (err) {
      console.error("Error al guardar pago:", err);
      const errorMessage = err.response?.data?.message || "Error al guardar el pago";
      showModal(errorMessage, "error");
      
      if (err.response?.status === 403) {
        showModal("No tienes permisos para realizar esta acción", "error");
      }
    }
  };

  const handleEdit = (pay) => {
    setPago({
      ...pay,
      fechaVencimiento: pay.fechaVencimiento.split('T')[0]
    });
    setIsEditing(true);
    formularioRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Está seguro de eliminar este pago?")) return;

    try {
      await apiClient.delete(`/pagos/${id}`);
      showModal("Pago eliminado exitosamente");
      cargarPagos();
    } catch (err) {
      console.error("Error al eliminar pago:", err);
      const errorMessage = err.response?.data?.message || "Error al eliminar el pago";
      showModal(errorMessage, "error");
      
      if (err.response?.status === 403) {
        showModal("No tienes permisos para eliminar pagos", "error");
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
          <div className="px-40 py-3 rounded-lg shadow-lg h-[83vh] flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-6 text-gray-700">
              {isEditing ? "Editar Pago" : "Nuevo Pago"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Monto</label>
                  <input
                    type="number"
                    name="monto"
                    value={pago.monto}
                    onChange={handleChange}
                    className="mt-1 block bg-transparent w-full py-2 rounded-md border border-green-700 shadow-sm focus:border-morado focus:ring-morado text-gray-950"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha de Vencimiento</label>
                  <input
                    type="date"
                    name="fechaVencimiento"
                    value={pago.fechaVencimiento}
                    onChange={handleChange}
                    className="mt-1 block bg-transparent w-full py-2 rounded-md border border-green-700 shadow-sm focus:border-morado focus:ring-morado text-gray-950"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Propietario</label>
                  <select
                    name="propietarioId"
                    value={pago.propietarioId}
                    onChange={handleChange}
                    className="mt-1 block bg-transparent w-full py-2 rounded-md border border-green-700 shadow-sm focus:border-morado focus:ring-morado  text-gray-950"
                    required
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
                  className="w-full bg-green-700 text-white py-2 px-4 rounded-md  focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  {isEditing ? "Actualizar" : "Registrar"} Pago
                </button>
              </div>
            </form>
          </div>

          {/* Tabla de Pagos */}
          <div className="p-6 rounded-lg shadow-lg overflow-x-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-700">Lista de Pagos</h2>
            <table className="min-w-full text-white rounded-md">
              <thead>
                <tr>
                  <th className="border border-green-700 p-2 text-green-700">Monto</th>
                  <th className="border border-green-700 p-2 text-green-700">Fecha de Vencimiento</th>
                  <th className="border border-green-700 p-2 text-green-700">Propietario</th>
                  <th className="border border-green-700 p-2 text-green-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pagos.map((pay) => (
                  <tr key={pay.id} className="border border-green-700">
                    <td className="p-2 text-gray-950">${pay.monto}</td>
                    <td className="p-2 text-gray-950">{new Date(pay.fechaVencimiento).toLocaleDateString()}</td>
                    <td className="p-2 text-gray-950">{pay.Propietario?.nombres || "Sin propietario"}</td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleEdit(pay)}
                        className="bg-green-700 text-white py-1 px-1 hover:underline rounded-md mr-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(pay.id)}
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

export default Pagos;