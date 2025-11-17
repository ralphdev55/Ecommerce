import React from 'react';
import { Link } from 'react-router-dom';

const HeroCarousel = () => {
return (
    // <<< 1. Contenedor de la sección, con el margen y ancho que tenías
    <section className="w-full max-w-6xl mx-auto my-8">
      
      {/* <<< 2. La "Tarjeta" principal del Hero */}
      {/* - 'relative' para posicionar el texto encima
        - Aumentamos la altura (h-72 o h-96 en pantallas medianas)
        - 'rounded-2xl' para un look más suave y moderno
        - 'shadow-xl' para el efecto de profundidad
        - 'overflow-hidden' para que la imagen respete los bordes redondeados
      */}
      <div className="relative h-72 md:h-96 w-full rounded-2xl shadow-xl overflow-hidden">
        
        {/* --- 1. Imagen de Fondo --- */}
        {/* Usamos un placeholder con un tono rosado, como tu original.
          En una app real, aquí iría tu foto: src="/images/banner-dulces.jpg"
        */}
        <img 
          src="https://placehold.co/1200x500/FDF2F8/DB2777?text=SweetMarket" 
          alt="Banner de dulces"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* --- 2. Capa de Gradiente para Contraste --- */}
        {/* Esto oscurece un poco la parte de abajo para que el texto se lea bien */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* --- 3. Contenido de Texto y Botón (CTA) --- */}
        {/* - 'absolute' y 'bottom-0' para posicionar el texto abajo
          - 'z-10' para que esté sobre la imagen y el gradiente
        */}
        <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Tu Paraíso de Dulces
          </h2>
          <p className="text-lg md:text-xl mt-3 max-w-lg text-gray-100">
            Golosinas, chocolates y más, directos a tu puerta.
          </p>
          <Link 
            to="/app/products" // Enlaza a tu página de productos
            className="inline-block bg-white text-pink-600 font-bold text-lg px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors mt-6 shadow-md"
          >
            Ir a la Tienda
          </Link>
        </div>
      </div>
    </section>
);
};

export default HeroCarousel;
