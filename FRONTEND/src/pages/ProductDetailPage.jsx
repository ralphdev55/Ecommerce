import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import CheckoutModal from '../components/CheckoutModal';

// --- Constante de la API ---
const API_URL = import.meta.env.VITE_API_URL;

// Componente para mostrar estrellas
const RatingStars = ({ rating }) => (
<div className="flex items-center">
        {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-2xl ${i < Math.round(rating) ? 'text-yellow-500' : 'text-gray-300'}`}>
                ★
                </span>
        ))}
</div>
);

function ProductDetailPage() {
const { productId } = useParams();
const [product, setProduct] = useState(null);
const [selectedImage, setSelectedImage] = useState(null);
const [quantity, setQuantity] = useState(1);
const [activeTab, setActiveTab] = useState('reviews');

const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);



const [isLoading, setIsLoading] = useState(false);
const [apiError, setApiError] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);

useEffect(() => {
let cancelled = false;

const fetchProduct = async () => {
setLoading(true);
setError(null);

try {
        const response = await fetch(`${API_URL}/api/products/${productId}/`);

        if (response.status === 404) {
        throw new Error('Producto no encontrado');
        }
        if (!response.ok) {
        throw new Error('Error al cargar el producto');
        }

const data = await response.json();

const placeholder = `https://placehold.co/600x600/E2E8F0/94A3B8?text=${encodeURIComponent(data.name || 'Producto')}`;
// Si la API devuelve una URL completa en `image`, la usamos; si devuelve un array `images`, lo usamos.
const mainImage = data.image || (Array.isArray(data.images) && data.images[0]) || placeholder;
const images = Array.isArray(data.images) && data.images.length ? data.images : [mainImage];

const transformed = {
id: data.id,
name: data.name || 'Sin nombre',
category: data.category || 'General',
price: parseFloat(data.price) || 0,
description: data.description || '',
images: images,
reviews: Array.isArray(data.reviews) ? data.reviews : [],
relatedProducts: Array.isArray(data.related_products) ? data.related_products : (Array.isArray(data.relatedProducts) ? data.relatedProducts : []),
};

if (!cancelled) {
setProduct(transformed);
setSelectedImage(mainImage);
}
} catch (err) {
        if (!cancelled) setError(err.message || 'Error desconocido');
} finally {
        if (!cancelled) setLoading(false);
}
};

fetchProduct();

return () => { cancelled = true; };
}, [productId]);

const handleQuantityChange = (amount) => {
setQuantity(prev => Math.max(1, prev + amount));
};



const handleConfirmPurchase = async () => {
        setIsLoading(true);
        setApiError(null);

        // 1. Cerrar el modal de checkout
        setIsCheckoutOpen(false); 

        const token = localStorage.getItem('authToken');
        if (!token) {
                setApiError('No estás autenticado. Por favor, inicia sesión.');
                setIsLoading(false);
                // (Aquí podrías redirigir al login)
                return;
        }

        try {
                // 2. Llamar a la API para crear la compra
                const response = await fetch('http://127.0.0.1:8000/api/comprar/', {
                method: 'POST',
                headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // ¡Usar Bearer!
                },
                body: JSON.stringify({
                        product_id: product.id, // o productId (asegúrate de que sea el ID)
                        quantity: quantity
                })
                });

                if (response.status === 401) {
                throw new Error('Tu sesión expiró. Inicia sesión de nuevo.');
                }

                const data = await response.json();

                if (!response.ok) {
                // El backend envía un error (ej. "Stock insuficiente")
                throw new Error(data.message || 'Error al procesar la compra.');
                }

                // 3. ¡ÉXITO!
                setIsLoading(false);
                // ¡Aquí está la magia! Abre el modal de confirmación
                setIsConfirmationOpen(true); 
                
                // Opcional: resetear la cantidad
                setQuantity(1);

        } catch (err) {
                // 4. Manejo de errores
                setIsLoading(false);
                setApiError(err.message);
        }
};


if (loading) return (
<div className="flex items-center justify-center h-screen">
<h1 className="text-2xl text-gray-600">Cargando producto...</h1>
</div>
);

if (error) return (
<div className="flex items-center justify-center h-screen">
<h1 className="text-2xl text-red-600">Error: {error}</h1>
</div>
);

if (!product) return (
<div className="flex items-center justify-center h-screen">
<h1 className="text-2xl text-gray-600">Producto no disponible</h1>
</div>
);

const averageRating = product.reviews.length > 0
? product.reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / product.reviews.length
: 0;


return (
<div className="bg-gray-50 min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden md:flex">
                        <div className="md:w-1/2 p-4">
                                <div className="bg-gray-100 rounded-lg overflow-hidden">
<img
        src={selectedImage}
        alt={product.name}
        className="w-full h-96 object-cover"
        onError={(e) => { e.target.src = `https://placehold.co/600x600/E2E8F0/94A3B8?text=Imagen+Rota`; }}
/>
</div>

<div className="flex space-x-2 mt-4">
{product.images.map((image, index) => (
        <button
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`w-16 h-16 rounded-md overflow-hidden border-2 ${selectedImage === image ? 'border-blue-700' : 'border-transparent'}`}
        >
                <img
                        src={image}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                />
        </button>
))}
</div>
</div>

<div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
<div>
<div className="text-sm text-gray-500 mb-2">
        <Link to="/app/products" className="hover:underline">Prodcustos</Link> /
        <Link to="/App/products" className="hover:underline"> {product.category}</Link>
</div>

<h1 className="text-3xl md:text-4xl font-bold text-gray-900">{product.name}</h1>

<button type="button" onClick={() => setActiveTab('reviews')} className="flex items-center mt-3">
        <RatingStars rating={averageRating} />
        <span className="ml-2 text-sm text-gray-600">({product.reviews.length} reseñas)</span>
</button>

        <p className="text-4xl font-extrabold text-gray-900 my-4">${product.price.toFixed(2)}</p>
        <span className='mr-4 font-bold text-gray-800'>Descripción:</span>
        <p className="text-gray-700 mb-6">{product.description}</p>
</div>

<div className="mt-6">
<div className="flex items-center mb-4">
        <label htmlFor="quantity" className="mr-4 font-bold text-gray-800">Cantidad</label>
        <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                        onClick={() => handleQuantityChange(-1)}
                        className="p-2 w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg"
                >
                        <span className="text-2xl font-bold">−</span>
                </button>
                <input
                        type=""
                        id="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        className="w-16 text-center border-l border-r p-2 h-10 focus:outline-none"
                />
                <button
                        onClick={() => handleQuantityChange(1)}
                        className="p-2 w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg"
                >
                        <span className="text-2xl font-bold">+</span>
                </button>
        </div>
</div>

<div className="flex space-x-4">
{/* Este botón ahora solo abre el modal */}
<button 
                        onClick={() => setIsCheckoutOpen(true)} // <-- Abre el 1er modal
                        className="bg-blue-700 text-white font-bold py-3 px-12 rounded-lg hover:bg-blue-800"
                        disabled={isLoading} // Deshabilita si está cargando
                    >
                        {isLoading ? 'Procesando...' : 'Comprar'}
                    </button>
</div>
</div>
</div>
</div>

{/* Sección Inferior: Pestañas */}
<div id="reviews" className="mt-12">
<div className="border-b border-gray-300">
<nav className="flex -mb-px space-x-8">
        <button
                onClick={() => setActiveTab('related')}
                className={`py-4 px-1 border-b-2 font-medium ${activeTab === 'related' ? 'border-blue-700 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
        >
                Productos Relacionados
        </button>
</nav>
</div>

<CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)} // Prop para cerrarlo
            onConfirm={handleConfirmPurchase} // Prop para confirmar
            product={product} // Pasa los datos que necesite
            quantity={quantity}
        />

<div className="mt-8">
{activeTab === 'related' && (
<div>
        <h3 className="text-xl font-bold mb-4">También te podría interesar</h3>
        {product.relatedProducts && product.relatedProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {product.relatedProducts.map(related => (
                                <Link to={`/App/products/${related.id}`} key={related.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                                        <img src={related.image || related.img} alt={related.name} className="w-full h-32 object-cover rounded-md mb-2" />
                                        <h4 className="font-semibold">{related.name}</h4>
                                        <p className="text-gray-600">{related.price}</p>
                                </Link>
                        ))}
                </div>
        ) : (
                <p>No hay productos relacionados.</p>
        )}
</div>
)}


</div>
</div>
</div>
</div>
);
}

export default ProductDetailPage;

