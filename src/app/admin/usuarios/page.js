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

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");
  const [usuario, setUsuario] = useState({
    id: "",
    nombres: "",
    documentoIdentidad: "",
    nombreDeUsuario: "",
    password: "",
    rol: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const formularioRef = useRef(null);

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
    setUsuario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Crear una copia del usuario sin contraseña si está vacío
    const usuarioAEnviar = { ...usuario };
    if (!usuario.password) delete usuarioAEnviar.password;

    try {
      if (isEditing) {
        await apiClient.put(`/usuarios/${usuario.id}`, usuarioAEnviar);
        showModal("Usuario actualizado exitosamente");
      } else {
        await apiClient.post("/usuarios", usuarioAEnviar);
        showModal("Usuario registrado exitosamente");
      }
      setIsEditing(false);
      setUsuario({
        id: "",
        nombres: "",
        documentoIdentidad: "",
        nombreDeUsuario: "",
        password: "",
        rol: "",
      });

      cargarUsuarios();
    } catch (err) {
      console.error("Error al guardar usuario:", err);
      const errorMessage = err.response?.data?.message || "Error al guardar el usuario";
      showModal(errorMessage, "error");
    }
  };


  const handleEdit = (usr) => {
    const usuarioParaEditar = { ...usr };
    delete usuarioParaEditar.password;
    setUsuario(usuarioParaEditar);
    setIsEditing(true);
    formularioRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Está seguro de eliminar este usuario?")) return;

    try {
      await apiClient.delete(`/usuarios/${id}`);
      showModal("Usuario eliminado exitosamente");
      cargarUsuarios();
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      const errorMessage = err.response?.data?.message || "Error al eliminar el usuario";
      showModal(errorMessage, "error");

      if (err.response?.status === 403) {
        showModal("No tienes permisos para eliminar usuarios", "error");
      }
    }
  };

  return (
    <div className="">
      {modalVisible && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black border border-green-700 p-4 rounded-lg shadow-lg max-w-sm w-full text-center">
            <p className={`font-bold ${modalType === "error" ? "text-red-700" : "text-green-700"}`}>
              {modalMessage}
            </p>
          </div>
        </div>
      )}
      <div className="h-full w-full">
        <div ref={formularioRef} className="w-full h-24 bg-transparent"></div> {/* Usamos el ref aquí */}
        <div className="grid grid-rows-2 gap-3 ">
          {/* Formulario */}
          <div className="px-40 py-3 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-700">
              {isEditing ? "Editar Usuario" : "Nuevo Usuario"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombres</label>
                  <input
                    type="text"
                    name="nombres"
                    value={usuario.nombres}
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
                    value={usuario.documentoIdentidad}
                    onChange={handleChange}
                    className="mt-1 block bg-transparent w-full py-2 rounded-md border border-green-700 shadow-sm focus:border-morado focus:ring-morado text-gray-950"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
                  <input
                    type="text"
                    name="nombreDeUsuario"
                    value={usuario.nombreDeUsuario}
                    onChange={handleChange}
                    className="mt-1 block bg-transparent w-full py-2 rounded-md border border-green-700 shadow-sm focus:border-morado focus:ring-morado text-gray-950"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    value={usuario.password}
                    onChange={handleChange}
                    className="mt-1 block bg-transparent w-full py-2 rounded-md border border-verde shadow-sm focus:border-morado focus:ring-morado text-gray-950"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Rol</label>
                  <select
                    name="rol"
                    value={usuario.rol}
                    onChange={handleChange}
                    className="mt-1 block bg-transparent w-full py-2 rounded-md border border-green-700 shadow-sm focus:border-morado focus:ring-morado focus:bg-black text-white"
                    required
                  >
                    <option  value="">Selecciona un rol</option>
                    <option  value="admin">Administrador</option>
                    <option  value="seguridad">Seguridad</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  {isEditing ? "Actualizar" : "Registrar"} Usuario
                </button>
              </div>
            </form>
          </div>

          {/* Tabla de Usuarios */}
          <div className="p-6 rounded-lg shadow-lg overflow-x-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-700">Lista de Usuarios</h2>
            <table className="min-w-full  text-white rounded-md">
              <thead className="">
                <tr>
                  <th className="border border-green-700 text-gray-950 p-2">Nombres</th>
                  <th className="border border-green-700 text-gray-950 p-2">Documento de Identidad</th>
                  <th className="border border-green-700 text-gray-950 p-2">Nombre de Usuario</th>
                  <th className="border border-green-700 text-gray-950 p-2">Rol</th>
                  <th className="border border-green-700 text-gray-950 p-2">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-gray-950">
                {usuarios.map((usr) => (
                  <tr key={usr.id} className="border border-green-700">
                    <td className="p-2 text-gray-950">{usr.nombres}</td>
                    <td className="p-2 text-gray-950">{usr.documentoIdentidad}</td>
                    <td className="p-2 text-gray-950">{usr.nombreDeUsuario}</td>
                    <td className="p-2 text-gray-950">{usr.rol}</td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => {
                          handleEdit(usr);
                          formularioRef.current.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-green-700 text-white py-1 px-1 hover:underline rounded-md mr-2">
                        Editar
                      </button>
                      <button onClick={() => handleDelete(usr.id)} className="bg-red-500 text-white py-1 px-1 rounded-md hover:underline">Eliminar</button>
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

export default Usuarios;
