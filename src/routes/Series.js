import React, { useEffect, useRef, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import MetaTag from '../components/MetaTag';
import Sort from '../components/Sort';
import Cut from '../components/Cut';
import Paging from '../components/Paging';

import * as common from '../utils/common';
import API_SERVER from '../utils/api';

function Series() {
    console.log('###Series');

    //url 파라미터들
    const searchParams = new URLSearchParams(window.location.search);
    const tempPage = useRef(Number(searchParams.get('page')) || 1);
    const tempSort = useRef(searchParams.get('sort') === 'true' || false);
    const tempCut = useRef(searchParams.get('cut') || false);

    //페이징에 필요한 정보들
    const [seriesList, setSeriesList] = useState();
    const [perPage, setPerPage] = useState();
    const [count, setCount] = useState();

    //이전 페이지 버튼을 위한 주소 저장
    const location = window.location;
    localStorage.setItem('prev', location.pathname+location.search);

    const currentUrl = useLocation().pathname;

    useEffect(() => {
        getSeries();
    }, []);

    //네비게이터에 쓸 url 제조기
    function getUrl(p=1) {
        tempPage.current = Number(p);
        let url = '';
        url += `/series?page=${tempPage.current}`
        if (tempSort.current) {
            url += '&sort=true';
        }
        if (tempCut.current > 0) {
            url += `&cut=${tempCut.current}`;
        }
        return url;
    }
    
    //브라우저 뒤로가기, 앞으로가기 감지
    window.onpopstate = () => {
        common.popNavigate({
            page: tempPage,
            sort: tempSort,
            cut: tempCut,
            callback: getSeries,
        });
    };

    //목록 가져오는 api
    function getSeries() {
        let url = '';
        url += API_SERVER;
        url += `/series?page=${tempPage.current}`;
        if (tempSort.current) {
            url += '&sort=true';
        }
        if (tempCut.current) {
            url += `&cut=${tempCut.current}`;
        }
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

    //만화 목록 렌더링2
    function renderSeriesList() {
        console.log('renderSeriesList');
        const newArr = [];
        if(seriesList){
            for(const key in seriesList) {
                const i = seriesList[key];
                newArr.push(
                    <Col key={key} sm={6} md={4} lg={3} xl={2} className='pad'>
                        <Link to={`/list?id=${i['id']}`}>
                            <div className='hover-handler series'>
                                <span className='cartoon-title word-break'>
                                    {i['title']}
                                </span>
                            </div>
                        </Link>
                    </Col>
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
    function pageHandler(page) {
        common.navigate(getUrl(page), getSeries);
    };

    //개추 정렬 핸들러
    function SortHandler(checked) {
        tempSort.current = checked;
        common.navigate(getUrl(), getSeries);
    }

    //개추 최소 컷 핸들러
    function CutHandler(cut) {
        tempCut.current = cut;
        common.navigate(getUrl(), getSeries);
    }

    return (
        <div className='Series'>
            <MetaTag title='Test Series' description='테스트인 시리즈 분류' url={currentUrl} />
            <div className='mb-2'>
                <Sort checked={tempSort.current} handler={SortHandler}/>
                <Cut value={tempCut.current} handler={CutHandler}/>
            </div>
            <Row>
                {renderSeriesList()}
            </Row>
            <div className='mt-2'>
                <Paging page={tempPage.current} perPage={perPage} count={count} pageBtn={10} handler={pageHandler}/>
            </div>
        </div>
    );
}

export default Series;