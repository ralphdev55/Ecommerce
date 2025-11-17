// src/components/Sidebar.jsx
import React from 'react';

function Sidebar() {
return (
    <aside className="w-46 min-h-screen bg-gray-50 p-6 border-r hidden md:block lg:w-64">
    {/* Título de la Categoría */}
    <div className="p-3 text-center mb-8">
        <h2 className="text-2xl font-bold">Caramelos</h2>
    </div>
    
    {/* Botones de Filtro */}
    <div className="flex flex-col space-y-4">
        <a href="../../productos" className="bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition duration-200 text-center">
        Menta
        </a>
        <a href="../../productos" className="bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition duration-200 text-center">
        Chocolates
        </a>
    </div>
    </aside>
);
}

export default Sidebar;