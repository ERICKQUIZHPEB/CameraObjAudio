// Home.js

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Bienvenido a la Aplicación</h1>
        <p>Descubre el poder de la detección de objetos en tiempo real con Teachable Machine.</p>
        <Link to="/detect" className="start-button">
          Comenzar
        </Link>
      </div>
    </div>
  );
};

export default Home;
