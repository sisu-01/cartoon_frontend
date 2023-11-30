import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import Header from './layouts/Header';
import Footer from './layouts/Footer';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Header />
        <App />
        <Footer />
    </BrowserRouter>
);