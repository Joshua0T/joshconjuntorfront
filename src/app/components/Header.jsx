"use client";
import { useAuth } from "../context/authContext";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useRouter } from "next/router";




function NavBar() {
  const { logout, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
   const router = useRouter
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const goToprofile = () =>{
    router.push ("/admin/perfil")
  }

  return (
    <div className="py-4 fixed px-6  w-full h-[15%] text-center font-bold text-xl flex justify-end shadow-xl rounded-b-lg border-gray-950 border-2">
      {isAuthenticated ? (
        <div className="flex justify-between w-full items-center">
          <Image
            className="img"
            src="/Villa_sol.png"
            alt="Logo Conjunto Residencial"
            width={150}
            height={80}
            priority
          />
          <nav>
            <ul className="flex h-full items-center gap-10">
              <li><Link href="/admin/usuarios" className={`text-lg ${pathname === "/admin/usuarios" ? 'text-black' : 'text-green-700 hover:text-gray-950'}`}>Usuarios</Link></li>
              <li><Link href="/admin/apartamentos" className={`text-lg ${pathname === "/admin/apartamentos" ? 'text-black' : 'text-green-700 hover:text-gray-950'}`}>Apartamentos</Link></li>
              <li><Link href="/admin/propietarios" className={`text-lg ${pathname === "/admin/propietarios" ? 'text-black' : 'text-green-700 hover:text-gray-950'}`}>Propietarios</Link></li>
              <li><Link href="/admin/pagos" className={`text-lg ${pathname === "/admin/pagos" ? 'text-black' : 'text-green-700 hover:text-gray-950'}`}>Pagos</Link></li>
              <li><Link href="/admin/informes" className={`text-lg ${pathname === "/admin/informes" ? 'text-black' : 'text-green-700 hover:text-gray-950'}`}>Informes</Link></li>
              <li><Link href="/admin/visitas" className={`text-lg ${pathname === "/admin/visitas" ? 'text-black' : 'text-green-700 hover:text-gray-950'}`}>Visitantes</Link></li>
            </ul>
          </nav>
          <div className="relative  ">
            <Image
              src="https://i.pinimg.com/736x/cc/f2/75/ccf275f72d52ab46745cfb99affc4bc5.jpg"
              alt="Menú"
              width={50}
              height={50}
              className="cursor-pointer  border-none "
              onClick={toggleDropdown}
            />
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <ul className="py-2">
                  <li>
                    <Link href="/admin/perfil" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Ir al Perfil</Link>
                  </li>
                  <li>
                    <button onClick={logout} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200">Cerrar Sesión</button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center w-full">
          <Image
            src="/Villa_Sol.png"
            alt="Logo "
            width={144}
            height={144}
            priority
          />
          <div className="flex items-center gap-2">
            <Link href="verify/login" className="px-2 py-3 rounded-full bg-morado">Iniciar Sesión</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default NavBar;
