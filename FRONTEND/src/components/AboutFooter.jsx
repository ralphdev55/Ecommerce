import React from 'react';

const AboutFooter = () => {
return (
    // <<< 1. Contenedor de sección con el fondo gris pálido
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* <<< 2. La "Tarjeta" principal, blanca y con sombra */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          
          {/* <<< 3. Mantenemos el grid, pero ahora dentro de la tarjeta */}
          <div className="grid md:grid-cols-2">
            
            {/* --- Columna Izquierda: ¿Quiénes Somos? --- */}
            {/* <<< 4. Añadimos más padding y un borde decorativo */}
            <div className="p-8 md:p-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">¿Quiénes Somos?</h3>
              
              <div className="border-l-4 border-blue-600 pl-6 space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  SweetMarket es una tienda en línea dedicada a la venta de caramelos y golosinas. Nuestro objetivo es ofrecer a los amantes de lo dulce un espacio donde puedan encontrar sus productos favoritos de forma rápida, segura y divertida.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Nos especializamos en reunir una gran variedad de caramelos, chocolates, gomitas y dulces artesanales, brindando una experiencia de compra única y accesible para todos los gustos.
                </p>
              </div>
            </div>

            {/* --- Columna Derecha: Más Sobre Nosotros --- */}
            {/* <<< 5. Rediseño completo de esta sección. Con un fondo sutil */}
            <div className="p-8 md:p-12 bg-gray-50/70">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Más Sobre Nosotros</h3>
              
              {/* <<< 6. Una lista vertical, más elegante que los círculos */}
              <div className="space-y-6">
                
                {/* Item 1: Contáctanos */}
                <a href="mailto:contacto@sweetmarket.com" className="flex items-center gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center transition-colors group-hover:bg-blue-200">
                    <span className="text-2xl">✉️</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-gray-800 transition-colors group-hover:text-blue-700">Contáctanos</h4>
                    <p className="text-gray-600">contacto@sweetmarket.com</p>
                  </div>
                </a>

                {/* Item 2: Instagram */}
                <a href="#" className="flex items-center gap-4 group"> {/* Enlaza a tu Instagram */}
                  <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center transition-colors group-hover:bg-pink-200">
                    <span className="text-2xl">📸</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-gray-800 transition-colors group-hover:text-pink-700">Instagram</h4>
                    <p className="text-gray-600">@SweetMarketOficial</p>
                  </div>
                </a>

                {/* Item 3: Tienda Física */}
                <a href="#" className="flex items-center gap-4 group"> {/* Enlaza a Google Maps */}
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center transition-colors group-hover:bg-green-200">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-gray-800 transition-colors group-hover:text-green-700">Tienda Física</h4>
                    <p className="text-gray-600">Av. Principal 123, Caracas</p>
                  </div>
                </a>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
);
};

export default AboutFooter;
