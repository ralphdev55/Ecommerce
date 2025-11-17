import React, { useState, useEffect } from 'react';

const CompraExitosa = () => {
  return (
    <div style={styles.successContainer}>
      <div style={styles.successCircle}>
        <div style={styles.successCheckmark}></div>
      </div>
      <h3 style={styles.successTitle}>¡Compra Exitosa!</h3>
      <p style={styles.successMessage}>
        Tu pedido ha sido procesado correctamente.
      </p>
    </div>
  );
};

const API_URL = process.env.REACT_APP_API_URL;

const getAuthToken = () => {
  return localStorage.getItem('authToken'); 
};

// --- OBJETO DE ESTILOS COMPLETO ---
const styles = {
  // --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
  // Estos son los estilos que faltaban para hacerlo flotante
  overlay: {
    position: 'fixed', // Clave: se superpone a todo
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fondo oscuro
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000, // Por encima de todo
    transition: 'opacity 0.3s ease',
  },
  modal: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px', // Ancho máximo
    position: 'relative', // Para el botón de cerrar
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)', // Sombra
    transform: 'translateY(-20px)', // Animación de entrada
    transition: 'transform 0.3s ease',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#888',
  },
  // --- Fin de la corrección ---

  // Tus estilos de éxito (ya estaban bien)
  successContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px 0',
  },
  successTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#28a745',
    marginTop: '16px',
  },
  successMessage: {
    fontSize: '1rem',
    color: '#333',
    marginTop: '8px',
  },
  successCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#28a745',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    animation: 'circle-in 0.5s ease-out forwards',
  },
  successCheckmark: {
    width: '25px',
    height: '50px',
    border: 'solid white',
    borderWidth: '0 8px 8px 0',
    transform: 'rotate(45deg)',
    animation: 'checkmark-in 0.3s 0.3s ease-out forwards',
    opacity: 0,
  },
};

const CheckoutModal = ({ isOpen, onClose, product, quantity }) => {

  const [userData, setUserData] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  const [compraRealizada, setCompraRealizada] = useState(false);
  const [estaProcesando, setEstaProcesando] = useState(false);
  const [errorCompra, setErrorCompra] = useState(null);

  const token = getAuthToken();

  useEffect(() => {
    if (isOpen) {
      // Resetea los estados
      setCompraRealizada(false);
      setErrorCompra(null);
      setEstaProcesando(false);
      
      const fetchUserData = async () => {
        if (!token) {
          setErrorCompra("No se encontró token de autenticación.");
          setUserLoading(false);
          return;
        }
        
        setUserLoading(true);
        try {
          const response = await fetch(`${API_URL}/api/profile/`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!response.ok) throw new Error('No se pudieron cargar los datos del usuario.');
          const data = await response.json();
          setUserData(data);
        } catch (err) {
          setErrorCompra(err.message);
        } finally {
          setUserLoading(false);
        }
      };

      fetchUserData();
    }
  }, [isOpen, token]); 

  const handleCompraClick = async () => {
    setEstaProcesando(true);
    setErrorCompra(null);
    
    try {
      const response = await fetch(`${API_URL}/api/comprar/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
            'product_id': product.id,
            'quantity': quantity
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al procesar la compra'); 
      }
      
      const data = await response.json();
      console.log('Compra creada:', data);
      setCompraRealizada(true); // ¡Éxito!

    } catch (err) {
      setErrorCompra(err.message);
    } finally {
      setEstaProcesando(false);
    }
  };

  // --- RENDERIZADO ---
  if (!isOpen) {
    return null; // No renderiza nada si está cerrado
  }

  // --- Contenido del Modal ---
  const renderContent = () => {
    // 1. Si la compra ya se hizo, muestra el éxito
    if (compraRealizada) {
      return (
        <div>
          <CompraExitosa />
          <button 
            onClick={onClose} 
            // Clases de Tailwind para el botón de cerrar
            className="w-full mt-4 bg-gray-600 text-white font-bold py-2 px-4 rounded hover:bg-gray-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      );
    }

    // 2. Si está cargando el usuario, muestra spinner
    if (userLoading) {
      return <div className="p-8 text-center">Cargando datos del usuario...</div>;
    }

    // 3. Muestra el formulario de confirmación
  	// --- CORRECCIÓN DE IMAGEN ---
  	// (La misma corrección de antes, `product.image` en lugar de `product.images[0]`)
    const precioTotal = product ? product.price * quantity : 0;
    const imageUrl = product && product.image ? `${API_URL}${product.image}` : 'https://via.placeholder.com/150';
    
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Confirmar Compra</h2>
        
        {/* Detalles del Producto */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold border-b pb-2">Resumen del Pedido</h3>
          {product ? (
            <>
              <div className="flex items-center my-2">
                <img 
                	src={imageUrl} 
                	alt={product.name} 
                	className="w-16 h-16 object-cover rounded mr-3"
            	  />
                <div>
                  <p className="font-bold">{product.name}</p>
                  <p className="text-sm text-gray-600">Cantidad: {quantity}</p>
                </div>
              </div>
              <p className="text-right text-xl font-bold">Total: ${precioTotal.toFixed(2)}</p>
            </>
          ) : (
            <p>Cargando producto...</p>
          )}
        </div>

        {/* Detalles del Usuario */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold border-b pb-2">Datos del Usuario</h3>
          {userData ? (
            <div className="mt-2 text-gray-700">
              <p><strong>Nombre:</strong> {userData.firstName}</p>
          _ <p><strong>Email:</strong> {userData.email}</p>
            </div>
          ) : (
            <p className="text-red-500">No se pudieron cargar los datos del usuario.</p>
          )}
        </div>

        {/* Botón de Confirmar */}
        <button
          onClick={handleCompraClick}
          disabled={estaProcesando || userLoading || !product}
          className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300 h-12 disabled:bg-gray-400"
        >
          {estaProcesando ? 'Procesando...' : 'Confirmar y Pagar'}
        </button>

        {errorCompra && (
          <p className="text-red-600 mt-4 text-center font-bold">
            Error: {errorCompra}
          </p>
        )}
      </div>
    );
  };

  // --- RETURN PRINCIPAL (El que crea el modal flotante) ---
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={{...styles.modal, transform: isOpen ? 'translateY(0)' : 'translateY(-20px)'}} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={onClose}>&times;</button>
        {renderContent()}
      </div>
    </div>
  );
};

export default CheckoutModal;