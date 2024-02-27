import React from 'react';

import MetaTag from '../components/MetaTag';

function Home() {

    return (
        <div className='poong'>
            <MetaTag title='이름 미정' description='카연갤 필터 사이트얌' url='/' />
            <img src='/poong.jpg' alt='카툰-연재 갤러리는 김풍이 만든 사이트입니다.'/>
        </div>
    );
}

export default Home;