import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// Importamos los iconos que vamos a usar, incluyendo el menú y la X
import { FaSearch, FaHome, FaShoppingCart, FaUser, FaBars, FaTimes } from 'react-icons/fa';

function Navbar() {
  // 1. Estado para controlar el menú móvil (abierto/cerrado)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contenedor principal del Navbar (Desktop y Botón Móvil) */}
        <div className="flex justify-between items-center h-20">
          
          {/* 1. Logo (siempre visible) */}
          <Link to={"./"} className="flex-shrink-0 flex items-center">
            {/* <img src="" alt="Logo" className="w-20 h-20 object-contain" /> */}
            <span className="text-2xl font-bold text-blue-600">Sweet Market</span>
          </Link>

          {/* 2. Barra de Búsqueda (SÓLO visible en pantallas medianas 'md' y grandes) */}
          <div className="hidden md:flex flex-1 justify-center px-8">
            <div className="flex items-center border border-gray-300 rounded-md w-full max-w-lg">
              <input
                type="text"
                placeholder="Buscar Caramelos"
                className="py-2 px-4 rounded-l-md focus:outline-none w-full"
              />
              <button className="bg-blue-600 text-white p-3 rounded-r-md hover:bg-blue-700">
                <FaSearch />
              </button>
            </div>
          </div>

          {/* 3. Iconos de Navegación (SÓLO visibles en 'md' y grandes) */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to={"./"} className="flex flex-col items-center text-gray-600 hover:text-blue-600">
              <FaHome size={24} />
              <span className="text-sm mt-1">Inicio</span>
            </Link>
            <Link to={"/app/Miscompras"} className="flex flex-col items-center text-gray-600 hover:text-blue-600">
              <FaShoppingCart size={24} />
              <span className="text-sm mt-1">Compras</span>
            </Link>
            <Link to={"/app/perfil"} className="flex flex-col items-center text-gray-600 hover:text-blue-600">
              <FaUser size={24} />
              <span className="text-sm mt-1">Perfil</span>
            </Link>
          </div>

          {/* 4. Botón de Hamburguesa (SÓLO visible en pantallas pequeñas, oculto en 'md') */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)} // Cambia el estado
              className="p-2 rounded-md text-gray-600 hover:text-blue-600"
              aria-label="Menú principal"
              aria-expanded={isMenuOpen}
            >
              {/* Muestra el ícono de 'X' si el menú está abierto, o 'Hamburguesa' si está cerrado */}
              {isMenuOpen ? <FaTimes size={26} /> : <FaBars size={26} />}
            </button>
          </div>
          
        </div>
      </div>

      {/* --- 5. MENÚ DESPLEGABLE MÓVIL --- */}
      {/* Se muestra u oculta basado en el estado 'isMenuOpen' */}
      {/* La clase 'md:hidden' asegura que NUNCA se muestre en pantallas grandes */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden border-t border-gray-200`}>
        <div className="px-4 pt-4 pb-6 space-y-4">

          {/* Barra de Búsqueda (para Móvil) */}
          <div className="flex items-center border border-gray-300 rounded-md">
            <input
              type="text"
              placeholder="Buscar Caramelos"
              className="py-2 px-4 rounded-l-md focus:outline-none w-full"
            />
            <button className="bg-blue-600 text-white p-3 rounded-r-md hover:bg-blue-700">
              <FaSearch />
            </button>
          </div>

          {/* Enlaces de Navegación (para Móvil) */}
          <Link
            to={"./"}
            className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600"
            onClick={() => setIsMenuOpen(false)} // Cierra el menú al hacer clic
          >
            <FaHome />
            <span>Inicio</span>
          </Link>
          <Link
            to={"/app/Miscompras"}
            className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600"
            onClick={() => setIsMenuOpen(false)}
          >
            <FaShoppingCart />
            <span>Compras</span>
          </Link>
          <Link
            to={"/app/perfil"}
            className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600"
            onClick={() => setIsMenuOpen(false)}
          >
            <FaUser />
            <span>Perfil</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;