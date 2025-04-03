import React, { useState } from 'react';

const PaymentModal = ({ show, onHide, item, itemType, onPaymentComplete }) => {
const [paymentProof, setPaymentProof] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const [success, setSuccess] = useState('');
const [activeTab, setActiveTab] = useState('mobile');

// Datos del club (puedes reemplazar con datos reales)
const clubData = {
name: 'Club de Pádel Command Park',
bankName: 'Banco Mercantil 0105',
Cedula: '28.306.588',
accountHolder: 'Club de Pádel C.P.',
phoneNumber: '+58 0424 2853055',
price: '50.00' // Precio por defecto
};

// Manejar cambio de archivo (comprobante de pago)
const handleFileChange = (e) => {
if (e.target.files && e.target.files[0]) {
    setPaymentProof(e.target.files[0]);
}
};

// Enviar comprobante de pago móvil
const handleMobilePaymentSubmit = async (e) => {
e.preventDefault();

if (!paymentProof) {
    setError('Por favor, sube un comprobante de pago');
    return;
}

setLoading(true);
setError('');

try {
    const formData = new FormData();
    formData.append('paymentProof', paymentProof);
    formData.append('itemType', itemType);
    formData.append('itemId', item.id);
    formData.append('amount', item.amount || clubData.price);
    formData.append('method', 'mobile');
    
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3456/payments/upload-proof', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`
    },
    body: formData
    });
    
    if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al procesar el pago');
    }
    
    const data = await response.json();
    setSuccess('Comprobante de pago enviado correctamente. El pago está en revisión.');
    
    // Notificar al componente padre que el pago se ha completado
    if (onPaymentComplete) {
    onPaymentComplete();
    }
    
    // Cerrar el modal después de 3 segundos
    setTimeout(() => {
    onHide();
    }, 3000);
    
} catch (error) {
    console.error('Error:', error);
    setError(error.message);
} finally {
    setLoading(false);
}
};

// Si el modal no debe mostrarse, no renderizar nada
if (!show) return null;

return (
<div className="payment-modal-overlay">
    <div className="payment-modal">
    <div className="payment-modal-header">
        <h2>Realizar Pago</h2>
        <button className="close-button" onClick={onHide}>&times;</button>
    </div>
    
    <div className="payment-modal-body">
        <div className="payment-details">
        <h3>Detalles del Pago</h3>
        <p><strong>Tipo:</strong> {itemType === 'reserva' ? 'Reserva' : itemType === 'torneo' ? 'Torneo' : 'Clase'}</p>
        <p><strong>Fecha:</strong> {new Date(item.fecha).toLocaleDateString('es-ES')}</p>
        {itemType === 'reserva' && <p><strong>Hora:</strong> {item.hora}</p>}
        <p><strong>Monto:</strong> ${item.amount || clubData.price}</p>
        </div>
        
        <div className="payment-tabs">
        <div 
            className={`payment-tab ${activeTab === 'mobile' ? 'active' : ''}`}
            onClick={() => setActiveTab('mobile')}
        >
            Pago Móvil
        </div>
        <div 
            className={`payment-tab ${activeTab === 'paypal' ? 'active' : ''}`}
            onClick={() => setActiveTab('paypal')}
        >
            PayPal
        </div>
        </div>
        
        <div className="payment-tab-content">
        {activeTab === 'mobile' && (
            <div className="mobile-payment">
            <div className="club-info">
                <h3>Datos para Pago Móvil</h3>
                <p><strong>Banco:</strong> {clubData.bankName}</p>
                <p><strong>Cedula:</strong> {clubData.Cedula}</p>
                <p><strong>Titular:</strong> {clubData.accountHolder}</p>
                <p><strong>Teléfono:</strong> {clubData.phoneNumber}</p>
            </div>
            
            <form onSubmit={handleMobilePaymentSubmit}>
                <div className="form-group">
                <label>Comprobante de Pago</label>
                <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                />
                <small>Sube una captura de pantalla o imagen del comprobante de pago.</small>
                </div>
                
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                
                <button 
                type="submit" 
                className="submit-payment-btn"
                disabled={loading || !paymentProof}
                >
                {loading ? 'Procesando...' : 'Enviar Comprobante'}
                </button>
            </form>
            </div>
        )}
        
        {activeTab === 'paypal' && (
            <div className="paypal-payment">
            <p>La integración con PayPal estará disponible próximamente.</p>
            <p>Por favor, utiliza la opción de Pago Móvil por ahora.</p>
            
            {/* Aquí iría la integración real con PayPal */}
            </div>
        )}
        </div>
    </div>
    </div>
</div>
);
};

export default PaymentModal;
