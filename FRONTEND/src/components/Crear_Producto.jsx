import React, { useState } from 'react';

// URL de tu API
const API_URL = 'http://127.0.0.1:8000';

// --- CAMBIOS ---
// 1. El componente ahora es un "Modal"
// 2. Recibe la prop "onClose" para poder cerrarse
function CreateProductForm({ onClose }) {
// Estados para los campos de texto
const [name, setName] = useState('');
const [description, setDescription] = useState('');
const [price, setPrice] = useState('');
const [stock, setStock] = useState(0);
const [category, setCategory] = useState('General');

// Estado para el ARCHIVO de imagen
const [imageFile, setImageFile] = useState(null);

// Estados de UI
const [message, setMessage] = useState(null);
const [isLoading, setIsLoading] = useState(false);

// Manejador para cuando el usuario selecciona un archivo
const handleFileChange = (e) => {
    // 'e.target.files' es un array, nos quedamos con el primer archivo
    if (e.target.files) {
    setImageFile(e.target.files[0]);
    }
};

const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // 1. OBTENER EL TOKEN
    const token = localStorage.getItem('authToken');

    // 2. CREAR EL FORMDATA
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('category', category);

    if (imageFile) {
    formData.append('image', imageFile);
    }

    try {
    // 3. ENVIAR EL FORMDATA
    const response = await fetch(`${API_URL}/api/products/`, {
        method: 'POST',
        headers: {
        'Authorization': `Bearer ${token}` 
        },
        body: formData,
    });

    if (!response.ok) {
        const errData = await response.json();
        throw new Error(JSON.stringify(errData) || 'Error al crear el producto');
    }

    const newProduct = await response.json();
    
    // Éxito
    setMessage(`Producto "${newProduct.name}" creado con éxito!`);
    // Limpiar el formulario
    setName('');
    setDescription('');
    setPrice('');
    setStock(0);
    setCategory('General');
    setImageFile(null);
    e.target.reset(); 

    // Opcional: Cerrar el modal automáticamente tras 2 segundos de éxito
    setTimeout(() => {
        onClose();
    }, 2000);

    } catch (err) {
    setMessage(`Error: ${err.message}`);
    } finally {
    setIsLoading(false);
    }
};

const handleBackdropClick = (e) => {
    // Si el clic fue en el fondo (el div wrapper), cierra el modal
    if (e.target === e.currentTarget) {
    onClose();
    }
};

return (
    // Fondo oscuro semi-transparente
    <div 
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity"
    onClick={handleBackdropClick} // Cierra al hacer clic en el fondo
    >
    <div 
        className="relative bg-white w-full max-w-lg p-6 md:p-8 rounded-lg shadow-xl m-4 overflow-y-auto max-h-[90vh]"
        // Evita que el clic EN el modal lo cierre (detiene la propagación al fondo)
        onClick={(e) => e.stopPropagation()} 
    >
        {/* --- INICIO DEL CONTENIDO DEL MODAL (AQUÍ ESTABA EL ERROR) --- */}
        
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Crear Nuevo Producto</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
            <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
        </div>

        <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
            id="description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio</label>
            <input
                type="number"
                id="price"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            </div>
            <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
            <input
                type="number"
                id="stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            </div>
        </div>

        <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoría</label>
            <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
        </div>

        <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Imagen del Producto</label>
            <input
            type="file"
            id="image"
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp" // Acepta solo imágenes
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {imageFile && (
            <p className="text-xs text-gray-500 mt-1">Archivo seleccionado: {imageFile.name}</p>
            )}
        </div>

        <div className="pt-4">
            <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
            {isLoading ? 'Guardando...' : 'Crear Producto'}
            </button>
        </div>
        </form>

        {/* Mensaje de éxito o error */}
        {message && (
        <p className={`mt-4 text-center font-medium ${message.startsWith('Error:') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
        </p>
        )}
        {/* --- FIN DEL CONTENIDO DEL MODAL --- */}
    </div>
    </div>
);
}

// Renombramos el export default para que coincida con el nombre del archivo
export default CreateProductForm;

