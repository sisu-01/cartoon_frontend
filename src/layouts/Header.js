import React from 'react';
import {Link} from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
  
function Header() {
    return (
        <header>
            <Navbar className="bg-body-tertiary">
                <Container fluid='md'>
                    <Navbar.Brand as={Link} to="/">이름-미정</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Root</Nav.Link>
                        <Nav.Link as={Link} to="/cartoon">Cartoon</Nav.Link>
                        <Nav.Link as={Link} to="/writer">Writer</Nav.Link>
                        <Nav.Link as={Link} to="/series">Test</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;