
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard'; // Ajusta la ruta si es necesario

const API_URL = 'http://127.0.0.1:8000';

// --- Componente de la Página ---
const ProductosPage = () => {
const [products, setProducts] = useState([]);
const [filteredProducts, setFilteredProducts] = useState([]);

// --- 2. Añadimos estados de Carga y Error ---
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

// Estados para los filtros (sin cambios)
const [categoryFilter, setCategoryFilter] = useState('all');
const [priceSort, setPriceSort] = useState('default');


const transformData = (data) => {
    return data.map(product => ({
    ...product,
    price: parseFloat(product.price),
    imageUrl: product.image 
    }));
};


useEffect(() => {
    // Definimos una función async dentro del hook
        const fetchProducts = async () => {
    try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_URL}/api/products/`);
        if (!response.ok) {
        throw new Error('No se pudieron cargar los productos');
        }
        const data = await response.json();
        const transformed = transformData(data); // Transformamos los datos
        setProducts(transformed);
        setFilteredProducts(transformed);
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
    };
    fetchProducts();
}, []); // El array vacío [] asegura que se ejecute solo 1 vez al cargar

// 2. Aplicar filtros (Esta parte no necesita cambios)
useEffect(() => {
    let tempProducts = [...products];

    // Filtrar por Categoría
    if (categoryFilter !== 'all') {
    tempProducts = tempProducts.filter(p => p.category === categoryFilter);
    }

    // Ordenar por Precio
    if (priceSort === 'low-to-high') {
    tempProducts.sort((a, b) => a.price - b.price); // Menor a Mayor
    } else if (priceSort === 'high-to-low') {
    tempProducts.sort((a, b) => b.price - a.price); // Mayor a Menor
    }

    setFilteredProducts(tempProducts);
}, [categoryFilter, priceSort, products]);

// Obtener categorías únicas para el dropdown (Esta parte no necesita cambios)
const categories = ['all', ...new Set(products.map(p => p.category))];


// --- 4. Añadimos renderizado para Carga y Error ---

if (loading) {
    return (
    <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-700">Cargando productos...</p>
        {/* Aquí podrías poner un spinner de carga */}
    </div>
    );
}

if (error) {
    return (
    <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
        <strong className="font-bold">¡Error!</strong>
        <span className="block sm:inline"> {error}</span>
        <p className="text-sm mt-2">Asegúrate de que el servidor de Django esté corriendo en {API_URL}</p>
        </div>
    </div>
    );
}

// --- Renderizado principal (Cuando todo está bien) ---
return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
    <div className="max-w-7xl mx-auto">
        
        {/* 1. Título */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Todos los Productos
        </h1>

        {/* 2. Filtros (Sin cambios) */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm top-0 z-10">
        <div className="flex-1">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Filtrar por Categoría
            </label>
            <select 
            id="category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            {categories.map(cat => (
                <option key={cat} value={cat}>
                {cat === 'all' ? 'Todas las Categorías' : cat}
                </option>
            ))}
            </select>
        </div>
        <div className="flex-1">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Ordenar por Precio
            </label>
            <select 
            id="price"
            value={priceSort}
            onChange={(e) => setPriceSort(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <option value="default">Por defecto</option>
            <option value="low-to-high">Menor a Mayor</option>
            <option value="high-to-low">Mayor a Menor</option>
            </select>
        </div>
        </div>

        {/* Grid de productos (Sin cambios) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
        ))}
        </div>

        {/* Mensaje por si no hay productos (Sin cambios) */}
        {filteredProducts.length === 0 && (
        <div className="text-center p-10 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600 text-lg">
            No se encontraron productos que coincidan con los filtros.
            </p>
        </div>
        )}

    </div>
    </div>
);
};

export default ProductosPage;