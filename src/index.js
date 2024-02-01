import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './layouts/Header';
import Footer from './layouts/Footer';

import Container from 'react-bootstrap/Container';

const root = ReactDOM.createRoot(document.getElementById('root'));
const containerStyle = {
    borderColor: 'blue',
    borderWidth: '1px',
    borderStyle: 'solid',
  };
root.render(
    <BrowserRouter>
        <Header />
        <Container fluid='md' style={containerStyle}>
            <App />
        </Container>
        <Footer />
    </BrowserRouter>
);