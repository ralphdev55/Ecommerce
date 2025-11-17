import React, { useState, useEffect } from 'react'; // Importa useState y useEffect
import { FaFilter, FaCandyCane } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// --- COMPONENTE DE LA TARJETA DE PEDIDO ---
// (Este componente no cambia)
const OrderCard = ({ order }) => {
// Los nombres (productName, purchaseDate) ya coinciden 
// con el JSON de tu API gracias al Serializer que creamos.
const { purchaseDate, productName, quantity, imageUrl } = order;

return (
    <div className="w-full border border-gray-300 rounded-lg shadow-sm overflow-hidden mb-4">
    <div className="bg-gray-100 px-6 py-3 border-b border-gray-300">
        <h3 className="font-semibold text-gray-800">Fecha de la Compra: {purchaseDate}</h3>
    </div>
    <div className="p-4 bg-white">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center w-full md:w-auto">
            {imageUrl ? (
            <img src={imageUrl} alt={productName} className="w-16 h-16 rounded-md object-cover mr-4" />
            ) : (
            <div className="w-16 h-16 rounded-md bg-gray-200 flex items-center justify-center mr-4">
                <FaCandyCane className="text-gray-500 text-3xl" />
            </div>
            )}
            <div>
            <h4 className="text-lg font-bold text-gray-900">{productName}</h4>
            <p className="text-sm text-gray-600">Cantidad: {quantity}</p>
            </div>
        </div>
        <div className="flex items-center w-full md:w-auto md:justify-end">
            <Link
            to="./../App/productos" // (Esta ruta quizás debas ajustarla)
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
            >
            Ver Detalles
            </Link>
        </div>
        </div>
    </div>
    </div>
);
};


// --- COMPONENTE PRINCIPAL DE LA PÁGINA ---
const MisCompras = () => {
// Estados para guardar los datos, el estado de carga y los errores
const [orders, setOrders] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);

// useEffect se ejecuta una vez, cuando el componente se monta
useEffect(() => {
    // Definimos la URL de tu API
    const token = localStorage.getItem('authToken');
    const apiUrl = 'http://127.0.0.1:8000/api/historial/';
    if (!token) {
    setError('No estás autenticado. Por favor, inicia sesión.');
    setIsLoading(false);
      // Opcional: redirigir al login
      // navigate('/login');
      return; // Detiene la ejecución
    }

    // Hacemos la petición
    fetch(apiUrl, {
        headers: {
    'Authorization': `Bearer ${token}`
}
    })
        .then(response => {
            if (response.status === 401) { // 401 No Autorizado
                throw new Error('Tu sesión expiró o el token es inválido.');
            }
            if (!response.ok) {
                throw new Error('Error al cargar los datos.');
            }
            return response.json();
            })
    .then(data => {
    // ¡Éxito! Guardamos los datos en el estado
    setOrders(data);
    setIsLoading(false);
    })
    .catch(err => {
    // Capturamos cualquier error
    setError(err.message);
    setIsLoading(false);
    });
}, []); // El array vacío [] asegura que esto solo se ejecute una vez

// --- Renderizado condicional ---
if (isLoading) {
    return <div className="text-center p-8">Cargando historial...</div>;
}

if (error) {
    // Muestra un error claro si algo falla
    return <div className="text-center p-8 text-red-600">Error: {error}</div>;
}

// --- Si todo sale bien, muestra la página ---
return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
    <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">
            Mis compras
        </h2>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-100">
            <FaFilter className="text-gray-600" />
            Filtrar por Fecha
        </button>
        </div>

        {/* Lista de Pedidos: Ahora usa 'orders' del estado */}
        <div className="flex flex-col gap-4">
        {orders.length > 0 ? (
            orders.map(order => (
            <OrderCard key={order.id} order={order} />
            ))
        ) : (
            <p className="text-gray-600">No tienes compras en tu historial.</p>
        )}
        </div>
    </div>
    </div>
);
};

export default MisCompras;