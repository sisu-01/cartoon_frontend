import React, { useRef, useEffect } from 'react';

//import API_SERVER from '../utils/api';

function Series() {
    //url 파라미터들
    const searchParams = new URLSearchParams(window.location.search);
    const tempPage = useRef(Number(searchParams.get('page')) || 1);
    const tempSort = useRef(Number(searchParams.get('sort')) || 1);

    //이전 페이지 버튼을 위한 주소 저장
    const location = window.location;
    localStorage.setItem('prev', location.pathname+location.search);

    useEffect(() => {
        //getSeries();
    }, []);
    
    //브라우저 뒤로가기, 앞으로가기 감지
    window.onpopstate = () => {
        const popParams = new URLSearchParams(window.location.search);
        tempPage.current = Number(popParams.get('page')) || 1;
        tempSort.current = Number(popParams.get('sort')) || 1;
        //getSeries();
    };

    return (
        <div className='Series'>
            series<br/>
            우와우 ㅋㅋㄴ
        </div>
    );
}

export default Series;