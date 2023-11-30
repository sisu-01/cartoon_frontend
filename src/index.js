import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Header from './layouts/Header';
import Footer from './layouts/Footer';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
        <Header />
        <App />
        <Footer />
    </>
);