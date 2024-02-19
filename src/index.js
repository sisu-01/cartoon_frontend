import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';

import App from './App';
import Header from './layouts/Header';
import Footer from './layouts/Footer';

import './style.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Header />
        <Container fluid='md' className='pt-3'>
            <App />
        </Container>
        <Footer />
    </BrowserRouter>
);