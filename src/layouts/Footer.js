import React from 'react';

import Container from 'react-bootstrap/Container';

function Footer() {
    return (
        <footer className='bg-secondary py-3'>
            <Container fluid='md'>
                <span className='text-white'>푸터 입니다.</span>
            </Container>
        </footer>
    );
};

export default Footer;