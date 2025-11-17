// src/components/RegisterPrompt.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function RegisterPrompt() {
  return (
    <div className="flex-1 bg-blue-800 text-white flex flex-col items-center justify-center p-8 rounded-r-lg">
      <h2 className="text-4xl font-bold mb-6 text-center">¿AÚN NO ESTÁS REGISTRADO?</h2>
      <Link to="./Register">
        <button className="bg-white text-blue-800 py-3 px-8 rounded-full hover:bg-gray-100 transition duration-200 font-semibold">
          Registrarse
        </button>
      </Link>
    </div>
  );
}

export default RegisterPrompt;