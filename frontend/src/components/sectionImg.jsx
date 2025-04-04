import React, { useState, useEffect } from 'react';

const SectionImage = ({ section }) => {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:3456/images/section/${section}`);
                
                if (response.ok) {
                    const data = await response.json();
                    setImage(data);
                    setError(null);
                } else if (response.status !== 404) {
                    // 404 es normal si no hay imagen
                    throw new Error('Error al cargar la imagen');
                }
            } catch (error) {
                console.error('Error al cargar imagen:', error);
                setError('No se pudo cargar la imagen');
            } finally {
                setLoading(false);
            }
        };

        fetchImage();
    }, [section]);

    if (loading) {
        return <div className="section-image-loading">Cargando imagen...</div>;
    }

    if (error) {
        return <div className="section-image-error">{error}</div>;
    }

    if (!image) {
        return null; // No mostrar nada si no hay imagen
    }

    return (
        <div className="section-image-container">
            <img 
                src={`http://localhost:3456${image.path}`} 
                alt={`Imagen de ${section}`} 
                className="section-image"
            />
        </div>
    );
};

export default SectionImage;
