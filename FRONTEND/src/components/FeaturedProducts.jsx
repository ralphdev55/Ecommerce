import React from 'react';
import { Link } from 'react-router-dom';


const ProductCard = ({ id, name, price, imageUrl }) => (
  // <<< Tarjeta blanca con sombra y bordes redondeados
  <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col transition-transform duration-300 hover:-translate-y-1">
    <Link to={`/app/products/${id}`} className="block">
      <img 
        src={imageUrl} 
        alt={name}
        // <<< Imagen responsiva y con un placeholder en caso de error
        className="w-full h-48 object-cover"
        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x400/E2E8F0/94A3B8?text=Producto"; }}
      />
    </Link>
    
    {/* Contenido de la tarjeta */}
    <div className="p-4 flex flex-col flex-grow">
      <h3 className="text-lg font-semibold text-gray-900 truncate">{name}</h3>
      <p className="text-gray-600 mt-1">{price}</p>
      <div className="mt-2 text-yellow-500 text-sm">★★★★☆ <span className="text-gray-400">(24)</span></div>
      
      {/* Empuja el botón al fondo */}
      <div className="mt-auto pt-4">
        <button className="w-full bg-blue-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors">
          Añadir al carrito
        </button>
      </div>
    </div>
  </div>
);

// --- Componente Principal de la Sección ---
const FeaturedProducts = () => {
  // <<< Datos con imágenes de placeholder
  const products = [
    { id: '1', name: 'Caramelos de Menta', price: '5.99$ C/U', img: 'https://placehold.co/400x400/F0F9FF/0284C7?text=Menta' },
    { id: '2', name: 'Chocolate Oscuro 70%', price: '8.50$ C/U', img: 'https://placehold.co/400x400/FFF7ED/7C2D12?text=Chocolate' },
    { id: '3', name: 'Gomitas de Frutas', price: '4.25$ C/U', img: 'https://placehold.co/400x400/FEF2F2/DC2626?text=Gomitas' },
    { id: '4', name: 'Paletas de Fresa', price: '2.50$ C/U', img: 'https://placehold.co/400x400/FDF2F8/DB2777?text=Fresa' },
    // Solo mostramos 4, pero puedes añadir más si cambias el grid
  ];

  return (
    // <<< 1. Fondo de sección gris pálido
    <section className="w-full bg-gray-50 py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* --- Título de la Sección --- */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Productos más Vendidos</h2>
          <p className="text-lg text-gray-600 mt-2">Los favoritos de nuestros clientes</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              id={product.id} 
              name={product.name} 
              price={product.price} 
              imageUrl={product.img}
            />
          ))}
        </div>

        {/* <<< 3. Botón "Ver Todos" */}
        <div className="text-center mt-12">
          <Link 
            to="/app/products" // Asegúrate que esta sea tu ruta de productos
            className="inline-block bg-blue-700 text-white font-bold text-lg px-8 py-3 rounded-lg hover:bg-blue-800 transition-colors"
          >
            Ver todos los productos
          </Link>
        </div>

      </div>
    </section>
  );
};

export default FeaturedProducts;
