import React from 'react';
import Header from '../src/components/header';
import Navbar from '../src/components/Navbar';
import Carrusel from '../src/components/carrusel';
import ContentGrid from '../src/components/contentGrid';
import Location from '../src/components/location';
import Footer from '../src/components/footer';

const Home = () => {
    return (
        <>
        <Header/>
        <Navbar />
        <Carrusel/>
        <ContentGrid/>
        <Location/>
        <Footer/>

        </>
    )
};

export default Home;