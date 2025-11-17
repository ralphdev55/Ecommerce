import React from 'react';
import { Link } from 'react-router-dom'; // Importante para enlazar al detalle

// No necesitamos API_URL aquí, la página principal ya construye la URL de la imagen.

const ProductCard = ({ product }) => {
// 'product' es el objeto que recibimos con toda la info
// (ej: product.name, product.price)

const placeholderImage = `https://placehold.co/300x300/E2E8F0/A0AEC0?text=${encodeURIComponent(product.name)}`;

// Usamos la imagen de la API (product.imageUrl) o el placeholder si no existe
const finalImageUrl = product.imageUrl || placeholderImage;

return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
    {/* Imagen del Producto */}
    {/* Usamos product.id para el enlace */}
    <Link to={`/app/products/${product.id}`} className="block">
        <img 
        className="w-full h-48 object-cover" 
        src={finalImageUrl} 
        alt={product.name} // Usamos product.name
        // Si la imagen de la API falla, la reemplazamos por el placeholder
        onError={(e) => {
            e.target.onerror = null; // Evita bucles infinitos
            e.target.src = placeholderImage;
        }}
        />
    </Link>

    {/* Contenido del Card */}
    <div className="p-4 flex flex-col flex-grow">
        <p className="text-sm text-gray-500">{product.category}</p> {/* Usamos product.category */}
        <h3 className="text-lg font-semibold text-gray-900 truncate" title={product.name}> {/* Usamos product.name */}
        {product.name}
        </h3>
        <div className="mt-auto pt-2">
        {/* Usamos product.price */}
        <p className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
        <Link 
            to={`/app/products/${product.id}`} // Usamos product.id
            className="mt-3 w-full block bg-blue-600 text-white font-semibold py-2 rounded-lg text-center hover:bg-blue-700 transition-colors"
        >
            Ver Detalles
        </Link>
        </div>
    </div>
    </div>
);
};

export default ProductCard;
