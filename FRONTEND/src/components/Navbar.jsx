
import React from 'react';
// Importamos los iconos que vamos a usar
import { FaSearch, FaHome, FaInfoCircle, FaShoppingCart, FaUser } from 'react-icons/fa';

function Navbar() {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center space-x-4">
      {/* 1. Logo Placeholder */}
      <div className="w-25 h-25 bg-white flex items-center justify-center">
          {/* 
          <img src="" alt="Logo" className="w-20 h-20 object-contain" /> 
          */}
        <span className="p-4">sweet market</span>
      </div>

      {/* 2. Barra de Búsqueda */}
      <div className="flex items-center border border-gray-300 rounded-md  sm:flex">
        <input
          type="text"
          placeholder="Buscar Caramelos"
          className="py-2 px-4 rounded-l-md focus:outline-none w-80 "
        />
        <button className="bg-blue-600 text-white p-3 rounded-r-md hover:bg-blue-700">
          <FaSearch />
        </button>
      </div>

      {/* 3. Iconos de Navegación */}
      <div className="flex items-center space-x-10 ">
        <a href="./" className="flex flex-col items-center text-gray-600 hover:text-blue-600  md:flex">
          <FaHome size={24} />
          <span className="text-sm mt-1">Inicio</span>
        </a>

        <a href="../../App/Miscompras" className="flex flex-col items-center text-gray-600 hover:text-blue-600  md:flex">
          <FaShoppingCart size={24} />
          <span className="text-sm mt-1">Compras</span>
        </a>

        <a href="../../App/perfil" className="flex flex-col items-center text-gray-600 hover:text-blue-600  md:flex">
          <FaUser size={24} />
          <span className="text-sm mt-1">Perfil</span>
        </a>

        <a href="../../App/perfil" className="flex flex-col items-center text-gray-600 hover:text-blue-600 md:hidden">
          <span className="text-sm mt-1">Hamburguesa</span>
        </a>

      </div>
    </nav>
  );
}

export default Navbar;