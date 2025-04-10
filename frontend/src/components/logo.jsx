import React from "react";

const Logo = () => {
    return (
        <>
        <div className="padel-logo-container">
            <svg className="padel-logo" viewBox="0 0 100 160" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="2" />
                <path d="M50 95 L50 150 M30 150 L70 150" stroke="white" strokeWidth="2" />
                {/* Patrón de puntos */}
                <g transform="translate(20,20)">
                    <circle cx="10" cy="10" r="2" fill="white" />
                    <circle cx="20" cy="10" r="2" fill="white" />
                    <circle cx="30" cy="10" r="2" fill="white" />
                    <circle cx="40" cy="10" r="2" fill="white" />
                    <circle cx="50" cy="10" r="2" fill="white" />

                    <circle cx="10" cy="20" r="2" fill="white" />
                    <circle cx="20" cy="20" r="2" fill="white" />
                    <circle cx="30" cy="20" r="2" fill="white" />
                    <circle cx="40" cy="20" r="2" fill="white" />
                    <circle cx="50" cy="20" r="2" fill="white" />

                    <circle cx="10" cy="30" r="2" fill="white" />
                    <circle cx="20" cy="30" r="2" fill="white" />
                    <circle cx="30" cy="30" r="2" fill="white" />
                    <circle cx="40" cy="30" r="2" fill="white" />
                    <circle cx="50" cy="30" r="2" fill="white" />
                </g>
            </svg>
            <h1>BIENVENIDO A PADEL CLUB COMMAND PARK</h1>
        </div>
        </>
    );
};

export default Logo;

