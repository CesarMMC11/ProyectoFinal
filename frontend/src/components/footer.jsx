import React, { useState } from "react";
import ContactModal from "../components/footerModals/contactoModal";
import PrivacyModal from "../components/footerModals/privacyModal";
import AboutUsModal from "../components/footerModals/aboutUs";
import MissionModal from "../../src/components/footerModals/misssion";

const Footer = () => {
    const [activeModal, setActiveModal] = useState(null);

    const openModal = (modalName) => {
        setActiveModal(modalName);
    };

    const closeModal = () => {
        setActiveModal(null);
    };

    return (
        <footer>
            <div className="container">
                <div className="footer-grid">
                    <div className="contactoFooter">
                        <a href="#" onClick={(e) => {e.preventDefault(); openModal('contact')}}>
                            <h6>Contactanos</h6>
                        </a>
                    </div>

                    <div className="contactoFooter">
                        <a href="#" onClick={(e) => {e.preventDefault(); openModal('privacy')}}>
                            <h6>Politicas y privacidad</h6>
                        </a>
                    </div>

                    <div className="contactoFooter">
                        <a href="#" onClick={(e) => {e.preventDefault(); openModal('about')}}>
                            <h6>Sobre Nosotros</h6>
                        </a>
                    </div>

                    <div className="contactoFooter">
                        <a href="#" onClick={(e) => {e.preventDefault(); openModal('mission')}}>
                            <h6>Misión y Visión</h6>
                        </a>
                    </div>
                </div>
                <div className="footer-bottom">
                    <div className="social-icons">
                        <a href="#"><i className="fab fa-facebook-f"></i></a>
                        <a href="#"><i className="fab fa-twitter"></i></a>
                        <a href="https://www.instagram.com/commandpark/"><i className="fab fa-instagram"></i></a>
                        <a href="#"><i className="fab fa-tiktok"></i></a>
                    </div>

                    <div className="commandPark">
                        @Club Command Park
                    </div>

                    <div className="commandPark">
                        Ven por el Padel, Quédate por la experiencia!
                    </div>
                </div>
            </div>

            {/* Modales */}
            {activeModal === 'contact' && <ContactModal onClose={closeModal} />}
            {activeModal === 'privacy' && <PrivacyModal onClose={closeModal} />}
            {activeModal === 'about' && <AboutUsModal onClose={closeModal} />}
            {activeModal === 'mission' && <MissionModal onClose={closeModal} />}
        </footer>
    );
};

export default Footer;
