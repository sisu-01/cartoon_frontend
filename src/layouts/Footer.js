import React from 'react';

import Container from 'react-bootstrap/Container';

function Footer() {
    return (
        <footer className='footer'>
            <Container fluid='md'>
                <span className='text-white'>푸터 입니다. build 24.03.12</span>
            </Container>
        </footer>
    );
};

export default Footer;