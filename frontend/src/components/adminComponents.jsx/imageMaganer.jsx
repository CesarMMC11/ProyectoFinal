import React, { useState, useEffect } from 'react';

const ImageManager = ({ section }) => {
    const [image, setImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Función para normalizar el valor de section
    const normalizeSection = (sectionValue) => {
        // Mapeo de valores singulares a plurales
        const sectionMap = {
            'torneo': 'torneos',
            'reserva': 'reservas',
            'clase': 'clases'
        };
        
        // Si el valor está en el mapeo, devuelve el valor normalizado
        return sectionMap[sectionValue] || sectionValue;
    };
    
    // Normalizar el valor de section
    const normalizedSection = normalizeSection(section);

    useEffect(() => {
        fetchImage();
    }, [section]);

    const fetchImage = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/images/section/${normalizedSection}`);
            if (response.ok) {
                const data = await response.json();
                setImage(data);
            } else if (response.status !== 404) {
                // 404 es normal si no hay imagen
                throw new Error('Error al cargar la imagen');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Error al cargar la imagen');
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Por favor selecciona una imagen');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const formData = new FormData();
            formData.append('image', selectedFile);
            formData.append('section', normalizedSection);
            
            // Para depuración
            console.log('Enviando sección:', normalizedSection);
            
            const token = localStorage.getItem('token');
            const response = await fetch( `${import.meta.env.VITE_API_URL}/images/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al subir la imagen');
            }

            const data = await response.json();
            setImage(data.image);
            setSelectedFile(null);
            setSuccess('Imagen subida correctamente');
           
            // Limpiar el input de archivo
            document.getElementById('file-input').value = '';
        } catch (error) {
            console.error('Error:', error);
            setError(error.message || 'Error al subir la imagen');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!image) return;

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/images/${image.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al eliminar la imagen');
            }

            setImage(null);
            setSuccess('Imagen eliminada correctamente');
        } catch (error) {
            console.error('Error:', error);
            setError('Error al eliminar la imagen');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="image-manager">
            <h3>Gestionar imagen de {section}</h3>
           
            {image && (
                <div className="current-image">
                    <h4>Imagen actual:</h4>
                    <img
                        src={`${import.meta.env.VITE_API_URL}${image.path}`}
                        alt={`Imagen de ${section}`}
                    />
                    <button
                        className="delete-button"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        Eliminar imagen
                    </button>
                </div>
            )}
           
            <div className="upload-section">
                <h4>Subir nueva imagen:</h4>
                <input
                    type="file"
                    id="file-input"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={loading}
                />
                <button
                    className="upload-button"
                    onClick={handleUpload}
                    disabled={!selectedFile || loading}
                >
                    {loading ? 'Subiendo...' : 'Subir imagen'}
                </button>
            </div>
           
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
        </div>
    );
};

export default ImageManager;
