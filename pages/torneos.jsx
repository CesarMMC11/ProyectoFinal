import react from 'react';
import Header from '../src/components/header';
import Navbar from '../src/components/Navbar';
import ContentWT from '../src/components/contentWT';
import Location from '../src/components/location';
import Footer from '../src/components/footer';


const Torneo = () => {
    return (
        <>
        <Header />
        <Navbar />
        <div class="titulo-principal">
            <h2>¡ Aqui puedes incribirte en nuestros Torneos Disponibles !</h2>
        </div>
        
            <main className="mainC">
            <form className="formularioDiseño" id="FormInscripcion">
            <h3>¡Formulario de inscripción para torneos!</h3>

            <label htmlFor="Nombre">Nombre y Apellido:</label>
            <input
                type="text"
                id="Nombre"
                placeholder="Nombre y Apellido de la dupla participante"
                required
            />
            <br />

            <label htmlFor="SelectPista">Selecciona el Torneo:</label>
            <select id="SelectPista">
                <option disabled value="">
                Selecciona la pista
                </option>
                <option id="pista1" value="Tipo Americano">
                Tipo Americano
                </option>
                <option id="pista2" value="Gran Inauguración">
                Gran Inauguración
                </option>
            </select>
            <br />

            <button id="btnReserva">¡Inscribirse!</button>
            </form>
        </main>
        <ContentWT/>
        <Location />
        <Footer />
        </>
    )
}

export default Torneo;