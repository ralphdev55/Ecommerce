const successStyles = {
    padding: '20px',
    margin: '20px 0',
    border: '2px solid #4CAF50', // Verde éxito
    backgroundColor: '#f0fff0', // Fondo verde claro
    borderRadius: '8px',
    textAlign: 'center',
    color: '#333'
};

function ConfirmBuys() {
    return (
    <div style={successStyles}>
        <h2>✅ ¡Compra Exitosa!</h2>
        <p>Tu pedido ha sido procesado correctamente.</p>
        <p>Recibirás un correo de confirmación en breve.</p>
    </div>
    );
}
export default ConfirmBuys;