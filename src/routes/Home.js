import React from 'react';

import { useLocation } from 'react-router-dom';

import MetaTag from '../components/MetaTag';

function Home() {
    const currentUrl = useLocation().pathname;

    return (
        <div className='poong'>
            <MetaTag title='이름 미정' description='카연갤 필터 사이트얌' url={currentUrl} />
            <img src='/poong.jpg' />
        </div>
    );
}

export default Home;