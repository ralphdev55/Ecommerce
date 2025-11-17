import React from 'react';
import { FaLock, FaEnvelope, FaUser } from 'react-icons/fa';

import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Para el estado de carga

    const navigate = useNavigate();

    const API_URL = process.env.REACT_APP_API_URL;
    // --- Manejador del envío ---
    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true); // Inicia la carga

        // Validación simple en el frontend
        if (!nombre || !email || !password) {
            setError("Todos los campos son obligatorios.");
            setIsLoading(false);
            return;
        }

        const payload = {
            username: email,
            email: email,
            password: password,
            first_name: nombre
        };

        fetch(`${API_URL}/api/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        .then(async response => {
            if (!response.ok) {
                const errorData = await response.json(); 
                let errorMessage = 'Error en el registro.';
                if (errorData.email) {
                    errorMessage = `Email: ${errorData.email[0]}`; 
                } else if (errorData.username) {
                    errorMessage = `Usuario: ${errorData.username[0]}`;
                } else if (errorData.password) {
                    errorMessage = `Contraseña: ${errorData.password[0]}`;
                } else if (errorData.first_name) {
                    errorMessage = `Nombre: ${errorData.first_name[0]}`;
                } else if (Array.isArray(errorData) && errorData.length > 0) {
                    errorMessage = errorData[0];
                } else if (typeof errorData === 'object' && errorData !== null) {
                    const firstKey = Object.keys(errorData)[0];
                    errorMessage = `${firstKey}: ${errorData[firstKey][0]}`;
                }
                throw new Error(errorMessage);
            }
            return response.json();
        })
        .then(data => {
            console.log('Registro exitoso, token:', data.token);
            localStorage.setItem('authToken', data.token);

            localStorage.setItem('refreshToken', data.refresh);
            
            navigate('/app'); 
            // ---------------------------------

        })
        .catch(err => {
            setError(err.message);
        })
        .finally(() => {
            setIsLoading(false); // Termina la carga
        });
    };

    return (
        // Contenedor principal que centra el formulario
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        
        {/* Tarjeta principal del registro */}
        <div className="flex flex-col-reverse md:flex-row w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
            
            {/* --- LADO DERECHO: FORMULARIO DE REGISTRO --- */}
            <div className="w-full md:w-1/2 p-8 bg-gray-100">
            <h2 className="text-3xl font-bold mb-6 border-b-2 pb-2">Regístrate</h2>


            {/* --- FORMULARIO --- */}
            <form onSubmit={handleSubmit}>
                {/* Campo de Nombre */}
                <div className="mb-4">
                <div className="relative flex items-center bg-gray-300 p-3 rounded-md">
                    <FaUser className="text-gray-500 mr-3" />
                    <input
                        type="text"
                        placeholder="Nombre"
                        className="w-full bg-transparent focus:outline-none"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                </div>
                </div>

                {/* Campo de Correo Electrónico */}
                <div className="mb-4">
                <div className="relative flex items-center bg-gray-300 p-3 rounded-md">
                    <FaEnvelope className="text-gray-500 mr-3" />
                    <input
                        type="email"
                        placeholder="Ingrese su correo electrónico"
                        className="w-full bg-transparent focus:outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                </div>

                {/* Campo de Contraseña */}
                <div className="mb-2">
                <div className="relative flex items-center bg-gray-300 p-3 rounded-md">
                    <FaLock className="text-gray-500 mr-3" />
                    <input
                        type="password"
                        placeholder="Ingrese su contraseña"
                        className="w-full bg-transparent focus:outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                </div>


                {/* Enlace de 'Ya estas registrado?' */}
                <div className="text-right mb-6">
                    <Link to="/" className="text-blue-600 hover:underline text-sm">
                        ¿Ya estas registrado?
                    </Link>
                </div>

                {error && <div className='mb-4 text-red-600 text-sm text-center font-medium'>{error}</div>}

                <button
                    type="submit" 
                    className="w-full bg-blue-700 text-white text-center py-3 rounded-md hover:bg-blue-800 transition duration-200 font-semibold disabled:bg-blue-400"
                    disabled={isLoading}
                >
                    {isLoading ? 'Registrando...' : 'Registrarse'}
                </button>
            </form>
            </div>

            {/* --- LADO IZQUIERDO: MENSAJE PARA INICIAR SESIÓN --- */}
            <div className="w-full md:w-1/2 bg-blue-800 text-white flex flex-col items-center justify-center p-8 rounded-t-lg md:rounded-l-lg md:rounded-t-none">
                <h2 className="text-4xl font-bold mb-6 text-center">¿Ya te encuentras registrado?</h2>
                <Link to="/">
                    <button className="bg-white text-blue-800 py-3 px-8 rounded-full hover:bg-gray-100 transition duration-200 font-semibold">
                        Iniciar Sesión
                    </button>
                </Link>
            </div>
            
        </div>
        </div>
    );
}

export default RegisterPage;


