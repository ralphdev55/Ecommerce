import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Importa Link
import { FaFacebook, FaGithub, FaLock, FaEnvelope, FaTwitter } from 'react-icons/fa'; 

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

const API_URL = process.env.REACT_APP_API_URL;

    fetch(`${API_URL}/api/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
    .then(async response => {
      if (!response.ok) {
        const errorData = await response.json();
        // DRF Simple JWT devuelve el error en 'detail'
        const errorMessage = errorData.detail || 'Credenciales inválidas. Inténtalo de nuevo.';
        throw new Error(errorMessage);
      }
      return response.json();
    })
    .then(data => {
      localStorage.setItem('authToken', data.access);
      setIsLoading(false);
      navigate('/App'); 
    })
    .catch(err => {
      setError(err.message);
      setIsLoading(false);
    });
  };

  return (
    <div className="flex-1 p-8">
      <h2 className="text-3xl font-bold mb-6 border-b-2 pb-2">Inicio de Sesión</h2>
      <form onSubmit={handleSubmit}>
        <p className="text-center text-gray-600 mb-6">INGRESE SUS DATOS</p>

        {/* Campo de Correo Electrónico */}
        <div className="mb-4">
          <div className="relative flex items-center bg-gray-200 p-3 rounded-md">
            <FaEnvelope className="text-gray-500 mr-3" />
            <input
              type=""
              placeholder="Correo Electrónico"
              className="w-full bg-transparent focus:outline-none"
              // --- CORRECCIÓN CLAVE ---
              value={username} // Conecta con el estado
              onChange={(e) => setUsername(e.target.value)} // Actualiza el estado
              required
            />
          </div>
        </div>

        {/* Campo de Contraseña */}
        <div className="mb-2">
          <div className="relative flex items-center bg-gray-200 p-3 rounded-md">
            <FaLock className="text-gray-500 mr-3" />
            <input
              type="password"
              placeholder="Ingrese su contraseña"
              className="w-full bg-transparent focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Enlace de Olvidaste la Contraseña */}
        <div className="text-right mb-6">
          {/* CORRECCIÓN: Usar <Link> en lugar de <a> */}
          <Link to="/password-reset" className="text-blue-600 hover:underline text-sm">
            ¿Olvidaste la contraseña?
          </Link>
        </div>

        <button 
          type="submit" 
          disabled={isLoading} 
          className="w-full bg-blue-700 text-white py-3 rounded-md hover:bg-blue-800 transition duration-200 font-semibold disabled:bg-gray-400"
        >
          {isLoading ? 'Verificando...' : 'Iniciar Sesión'}
        </button>
        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
      </form>
    </div>
  );
}

export default LoginForm;