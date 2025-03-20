import React from 'react';
import { useState, useEffect } from 'react';

const ThemeToggle = () => {
const [isDarkMode, setIsDarkMode] = useState(false);

// Función para alternar el tema
const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
};

// Aplicar el tema al body
useEffect(() => {
    if (isDarkMode) {
    document.body.classList.add("dark-mode");
    document.body.classList.remove("light-mode");
    } else {
    document.body.classList.add("light-mode");
    document.body.classList.remove("dark-mode");
    }
}, [isDarkMode]);

return (
    <div className="container">
    <label className="switch">
        <input
        type="checkbox"
        checked={isDarkMode}
        onChange={toggleTheme}
        />
        <span className="slider"></span>
    </label>
    </div>
);
};

export default ThemeToggle;