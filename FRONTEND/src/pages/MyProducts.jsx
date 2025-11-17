import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyProducts = async () => {
      const token = getAuthToken();

      if (!token) {
        setError('Acceso denegado. Por favor, inicia sesión.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/my-products/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('No se pudieron cargar tus productos. (Token inválido o expirado)');
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message || 'Ocurrió un error al cargar tus productos.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyProducts();
  }, []);

  if (loading) return <div className="p-8 text-center">Cargando tus productos...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Mis Productos</h1>
          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors">
            + Publicar Nuevo
          </button>
        </div>

        {products.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold">Aún no tienes productos</h3>
            <p className="text-gray-600 mt-2">¡Haz clic en "Publicar Nuevo" para empezar a vender!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ProductCard = ({ product }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-shadow duration-300 hover:shadow-xl">
    <img
      src={product.image || 'https://via.placeholder.com/400x300.png?text=Sin+Imagen'}
      alt={product.name}
      className="w-full h-48 object-cover"
    />

    <div className="p-4 flex flex-col flex-grow">
      <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{product.name}</h3>
      <p className="text-2xl font-semibold text-gray-800 mb-2">${product.price}</p>
      <p className="text-sm text-gray-600 mb-4">Stock disponible: {product.stock}</p>

      <div className="flex-grow" />

      <div className="flex justify-end gap-3 mt-2">
        <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 text-sm">Editar</button>
        <button className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 text-sm">Eliminar</button>
      </div>
    </div>
  </div>
);

export default MyProducts;
