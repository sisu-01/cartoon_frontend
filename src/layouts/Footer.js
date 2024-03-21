import React from 'react';

import Container from 'react-bootstrap/Container';

import ForceRefresh from '../components/ForceRefresh';

function Footer() {
    return (
        <footer className='footer'>
            <Container fluid='md' className='d-flex justify-content-between'>
                <span className='text-white'>푸터 입니다. build 24.03.21</span>
                <ForceRefresh />
            </Container>
        </footer>
    );
};

export default Footer;