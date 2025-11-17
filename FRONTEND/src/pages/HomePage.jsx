import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
import FeaturedProducts from '../components/FeaturedProducts';
import AboutFooter from '../components/AboutFooter';

const HomePage = () => {
return (
    <div>
    <HeroCarousel />
    <FeaturedProducts />
    <AboutFooter />
    </div>
);
};

export default HomePage;
