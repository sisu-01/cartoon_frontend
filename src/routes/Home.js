import React from 'react';

import MetaTag from '../components/MetaTag';

function Home() {

    return (
        <div className='poong'>
            <MetaTag title='이름 미정' description='카연갤 필터 사이트얌' url='/' />
            <img src='/poong.jpg' />
        </div>
    );
}

export default Home;