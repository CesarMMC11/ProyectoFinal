import React, { useRef, useEffect } from "react";
import { gsap } from "gsap"; // Importamos GSAP

const Location = () => {
    // Creamos una referencia para el contenedor principal
    const locationRef = useRef(null);

    useEffect(() => {
        // Animación para que el componente aparezca desde abajo automáticamente
        gsap.fromTo(
            locationRef.current,
            { x: '100%', opacity: 0 },
            { 
                x: '0%', 
                opacity: 1, 
                duration: 1.5, 
                ease: 'power3.out' 
            }
        );
    }, []);

    

    return (
        <div className="location" ref={locationRef}>
            <div className="titulo-principal">
                <h2>Cómo llegar a Command Park</h2>
            </div>
            <div className="comoLlegar" >
                <div className="leyenda">
                    <p>- Ubicados en el último piso del centro comercial Express,</p>
                    <p>después del Restaurant La Churrasqueria</p>
                    <p>Avenida Victor Baptista, justo pasando la Panadería Modelo.</p>
                </div>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15699.451223899625!2d-67.0607685393799!3d10.352853159013577!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c2a8d2b6162466f%3A0xcd90d8fd44b7a775!2sCommand%20Park!5e0!3m2!1ses!2sve!4v1739224732328!5m2!1ses!2sve"
                    width="700"
                    height="450"
                    style={{ border: "0" }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
        </div>
    );
};

export default Location;
