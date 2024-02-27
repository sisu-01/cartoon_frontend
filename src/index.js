import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';

import App from './App';
import Header from './layouts/Header';
import Footer from './layouts/Footer';

import './style.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <HelmetProvider>
            <Header />
            <main>
                <Container fluid='md'>
                    <App />
                </Container>
            </main>
            <Footer />
        </HelmetProvider>
    </BrowserRouter>
);
document.getElementById('root').classList.add('grid-container');