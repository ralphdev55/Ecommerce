import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Crear_Producto from '../components/Crear_Producto.jsx';

const PerfilDeUsuario = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // <-- Añadido estado de error
  const [activeSection, setActiveSection] = useState('info'); // 'info', 'address', 'security'

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  }
  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  
  useEffect(() => {
    // Esta función se ejecutará cuando el componente se monte
    const fetchUserData = () => {
      setLoading(true);
      setError(null); // Resetea el error en cada carga

      // 1. Obtenemos el token de localStorage
      const token = localStorage.getItem('authToken');

      // 2. Verificamos si hay token
      if (!token) {
        setError('No se encontró token. Por favor, inicia sesión.');
        setLoading(false);
        // Opcional: Redirigir al login
        // navigate('/login');
        return;
      }

const API_URL = import.meta.env.VITE_API_URL;
      // 3. Hacemos la petición a la API de perfil
      fetch(`${API_URL}/api/profile/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // --- ¡¡LA CORRECCIÓN ESTÁ AQUÍ!! ---
          // Cambiamos 'Token' por 'Bearer' para que coincida con SimpleJWT
          'Authorization': `Bearer ${token}` 
        }
      })
      .then(async response => {
        if (response.status === 401) {
          // El token es inválido o expiró
          throw new Error('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
        }
        if (!response.ok) {
          // Otro tipo de error del servidor
          throw new Error('No se pudo cargar el perfil.');
        }
        return response.json();
      })
      .then(data => {
        // 4. Éxito: Guardamos los datos del usuario
        // Mapeamos los campos del backend (firstName) a los del frontend (firstName)
        // ¡Tu backend ya coincide con el mock!
        setUser({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone || 'N/A', // Añadimos 'N/A' si no hay teléfono
            profilePic: data.profilePic || `https://placehold.co/150x150/E2E8F0/94A3B8?text=${data.firstName.charAt(0)}`, // Placeholder
        });
        setLoading(false);
      })
      .catch(err => {
        // 5. Error: Capturamos cualquier error
        console.error("Error al cargar perfil:", err);
        setError(err.message);
        setLoading(false);
      });
    };

    fetchUserData();
  }, []); // El array vacío [] asegura que esto se ejecute solo una vez

  // Manejador de cambios (¡Habilitado!)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // --- Renderizado de Carga ---
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <h1 className="text-2xl text-gray-600">Cargando perfil...</h1>
        {/* Aquí puedes poner un Spinner */}
      </div>
    );
  }

  // --- Renderizado de Error ---
  if (error) {
     return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-4">
        <h1 className="text-2xl text-red-600 mb-4 text-center">{error}</h1>
        {/* Aquí podrías poner un botón para reintentar o ir al login */}
      </div>
    );   
  }

  // --- Renderizado Principal (si user no es null) ---
  if (!user) {
    // Esto no debería pasar si loading es false y no hay error, pero es buena práctica
    return <div className="text-center p-8">No se pudieron cargar los datos del usuario.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Mi Cuenta</h1>

        <div className=" gap-8 flex-1 lg:flex-row flex flex-col ">
          
          {/* --- BARRA LATERAL DE NAVEGACIÓN --- */}
          <aside className=" mb-8 md:mb-0  lg:flex-row lg:w-1/5 md:w-3/4"> 
            <div className="bg-white shadow-lg rounded-lg p-6 sticky top-8">
              {/* Info de Perfil Rápida */}
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={user.profilePic} 
                  alt="Foto de perfil" 
                  className="w-16 h-16 rounded-full object-cover bg-gray-200"
                />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{user.firstName} {user.lastName}</h2>
                  <p className="text-sm text-gray-600 truncate">{user.email}</p>
                </div>
              </div>
              
              {/* Navegación */}
              <nav className="space-y-2">
                <button 
                  onClick={() => setActiveSection('info')}
                  className={`flex items-center gap-3 w-full py-3 px-4 rounded-lg transition-colors text-left
                    ${activeSection === 'info' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                  <span className="text-xl">👤</span> Información Personal
                </button>

                <button 
                  onClick={() => setActiveSection('security')}
                  className={`flex items-center gap-3 w-full py-3 px-4 rounded-lg transition-colors text-left
                    ${activeSection === 'security' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                  <span className="text-xl">🔒</span> Seguridad
                </button>
                <button 
                        onClick={ () => handleOpenModal('añadirProducto')} 
                        className={`flex items-center gap-3 w-full py-3 px-4 rounded-lg transition-colors text-left
                        ${activeSection === 'create' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100 text-gray-600'}`}
                      >
                        <span className="text-xl"></span> Añadir productos
                </button>

                <Link to={"/app/my-products"}
                className={`flex items-center gap-3 w-full py-3 px-4 rounded-lg transition-colors text-left
                      'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100 text-gray-600'}`} >
                <span className="text-xl"></span> Mis productos
                </Link>

              </nav>
            </div>
          </aside>

          {/* --- CONTENIDO PRINCIPAL (Sección Activa) --- */}
          <main className="md:w-3/4">
            <div className="space-y-8">

              {/* --- Sección: Información Personal --- */}
              {activeSection === 'info' && (
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Información Personal</h3>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input type="text" name="firstName" id="firstName" value={user.firstName} onChange={handleChange}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                      <input type="email" name="email" id="email" value={user.email} disabled
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                      <input type="tel" name="phone" id="phone" value={user.phone} onChange={handleChange}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="text-right pt-4">
                      <button type="submit" className="bg-blue-700 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors">
                        Guardar Cambios
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* --- Sección: Seguridad --- */}
              {activeSection === 'security' && (
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Cambiar Contraseña</h3>
                  <p className="text-gray-600 mb-6">
                    Para tu seguridad, te recomendamos elegir una contraseña fuerte que no uses en otro sitio.
                  </p>
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="currentPass" className="block text-sm font-medium text-gray-700 mb-1">Contraseña Actual</label>
                      <input type="password" name="currentPass" id="currentPass"
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ingresa tu contraseña actual"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label htmlFor="newPass" className="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
                        <input type="password" name="newPass" id="newPass"
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Mínimo 8 caracteres"
                        />
                      </div>
                      <div>
                        <label htmlFor="confirmPass" className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
                        <input type="password" name="confirmPass" id="confirmPass"
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Repite la nueva contraseña"
                        />
                      </div>
                    </div>
                    <div className="text-right pt-4">
                      <button type="submit" className="bg-blue-700 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors">
                        Actualizar Contraseña
                      </button>
                    </div>
                  </form>
                </div>
              )}

              

            </div>
          </main>
        </div>
      </div>
      {isModalOpen && (
        <Crear_Producto
          onClose={handleCloseModal} 
          // Aquí puedes pasar más props a tu modal, como el ID del usuario
          // userId={user.id} 
        />
      )}
    </div>
  );
};

export default PerfilDeUsuario;
