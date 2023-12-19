import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import Paging from '../components/Paging';

import * as common from '../utils/common';
import API_SERVER from '../utils/api';

function Series() {
    console.log('###Series');

    //url 파라미터들
    const searchParams = new URLSearchParams(window.location.search);
    const tempPage = useRef(Number(searchParams.get('page')) || 1);

    //페이징에 필요한 정보들
    const [seriesList, setSeriesList] = useState();
    const [perPage, setPerPage] = useState();
    const [count, setCount] = useState();

    //이전 페이지 버튼을 위한 주소 저장
    const location = window.location;
    localStorage.setItem('prev', location.pathname+location.search);

    useEffect(() => {
        getSeries();
    }, []);

    //네비게이터에 쓸 url 제조기
    function getUrl(p=1) {
        tempPage.current = Number(p);
        let url = '';
        url += `/seriees?page=${tempPage.current}`
        return url;
    }
    
    //브라우저 뒤로가기, 앞으로가기 감지
    window.onpopstate = () => {
        const popParams = new URLSearchParams(window.location.search);
        tempPage.current = Number(popParams.get('page')) || 1;
        //getSeries();
    };

    //목록 가져오는 api
    function getSeries() {
        let url = '';
        url += API_SERVER;
        url += `/series?page=${tempPage.current}`;
        console.log('getSeries:', url);
        fetch(url)
        .then(response => response.json())
        .then(data => {
            if(data['ok']){
                setSeriesList(data['list']);
                setPerPage(data['perPage']);
                setCount(data['count']);
            }else{
                setSeriesList();
                alert('그런거 없긔');
            }
        })
        .catch(err => {
            alert(err);
        });
    }

    //만화 목록 렌더링
    function renderSeriesList() {
        console.log('renderSeriesList');
        const newArr = [];
        if(seriesList){
            for(const key in seriesList) {
                const i = seriesList[key];
                newArr.push(
                    <tr key={key}>
                        <td>{i['id']}</td>
                        <td>
                            <Link to={`/list?id=${i['id']}`}>
                                {i['title']}
                            </Link>
                        </td>
                    </tr>
                );
            }
            return newArr;
        }else{
            return(
                <tr>
                    <td colSpan='2'>없어요</td>
                </tr>
            );
        }
    }

    //페이징 버튼 핸들러
    function pageHandler(e) {
        common.navigate(getUrl(e.target.value), getSeries);
    };

    return (
        <div className='Series'>
            <table>
                <thead>
                    <th>id</th>
                    <th>title</th>
                </thead>
                <tbody>
                    {renderSeriesList()}
                </tbody>
            </table>
            <div>
                <Paging page={tempPage.current} perPage={perPage} count={count} pageBtn={10} handler={pageHandler}/>
            </div>
        </div>
    );
}

export default Series;