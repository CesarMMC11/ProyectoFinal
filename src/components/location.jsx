import React from "react";

const Location = () => {
return (
<div className="location">
    <div className="titulo-principal">
    <h2>Cómo llegar a Command Park</h2>
    </div>
    <div className="comoLlegar">
    <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15699.451223899625!2d-67.0607685393799!3d10.352853159013577!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c2a8d2b6162466f%3A0xcd90d8fd44b7a775!2sCommand%20Park!5e0!3m2!1ses!2sve!4v1739224732328!5m2!1ses!2sve"
        width="600"
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
