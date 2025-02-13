'use client'
import React from 'react'
import { useAuth } from '../context/authContext';

function PrincipalAdmin() {
  const { user } = useAuth();
  return (
    <div className="h-full ">
      <div className="w-full h-24 bg-transparent"></div>
      <div className='flex w-full h-full'>
        <section className='w-1/2 text-6xl font-bold flex justify-center items-center text-gray-950'>Bienvenido</section>
        <section className='w-1/2 flex justify-center'>
          <div className="border border-gray-950 p-8 rounded-lg shadow-lg w-full max-w-md ">
            <h1 className="text-2xl font-bold text-center text-gray-950 mb-6">
              Perfil de Usuario
            </h1>
            <img className='rounded-full w-40 h-40 mx-auto' src='https://i.pinimg.com/736x/f8/77/78/f87778ac6a3cfe80db70faab0bfc8afc.jpg'></img>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-green-700">ID</label>
                <p className="mt-1 p-2  border-b border-green-700 rounded-md text-gray-950">
                  {user.id}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700">
                  Nombres
                </label>
                <p className="mt-1 p-2 border-b border-green-700 rounded-md text-gray-950">
                  {user.nombres}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700">
                  Nombre de Usuario
                </label>
                <p className="mt-1 p-2 border-b border-green-700 rounded-md text-gray-950">
                  {user.nombreDeUsuario}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700">
                  Rol
                </label>
                <p className="mt-1 p-2 border-b border-green-700 rounded-md text-gray-950">
                  {user.rol}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>


    </div>
  )
}




export default PrincipalAdmin;