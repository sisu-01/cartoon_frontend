import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import MetaTag from '../components/MetaTag';
import Sort from '../components/Sort';
import Cut from '../components/Cut';
import Paging from '../components/Paging';

import * as common from '../utils/common';
import API_SERVER from '../utils/api';

function Series() {
    const navigate = useNavigate();

    //url 파라미터들
    const searchParams = new URLSearchParams(window.location.search);
    const [pageState, setPageState] = useState(Number(searchParams.get('page')) || 1);
    const [sortState, setSortState] = useState(searchParams.get('sort') === 'true' || false);
    const [cutState, setCutState] = useState(searchParams.get('cut') || false);
    const pageRef = useRef(pageState);
    const sortRef = useRef(sortState);
    const cutRef = useRef(cutState);

    //페이징에 필요한 정보들
    const [seriesList, setSeriesList] = useState();
    const [perPage, setPerPage] = useState();
    const [count, setCount] = useState();

    //이전 페이지 버튼을 위한 주소 저장
    const location = window.location;
    const currentUrl = location.pathname+location.search;
    localStorage.setItem('prev', currentUrl);

    useEffect(() => {
        getSeries(true);

        function handleBack() {
            const popParams = new URLSearchParams(window.location.search);
            pageRef.current = Number(popParams.get('page')) || 1;
            sortRef.current = Number(popParams.get('sort') === 'true' || false);
            cutRef.current = popParams.get('cut') || false;
            getSeries(true);
        }
        // 뒤로가기 이벤트를 감지할 때 handleBack 함수를 실행
        window.addEventListener('popstate', handleBack);
        return () => {
            // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
            window.removeEventListener('popstate', handleBack);
        };
    }, []);

    /**
     * 네비게이터에 쓸 url 제조기 object 담아서 보내시오..
     * @param {number} page 페이지
     * @param {boolean} sort 정렬
     * @param {number} cut 개추컷
     * @returns {string} url
     */
    function getUrl({
        page=false,
        sort=false,
        cut=false
    }) {
        //false라면? 즉 값을 받지 않는다면? 기본 state 적용
        if (page===false) page = pageState
        if (sort===false) sort = sortState;
        if (cut===false) cut = cutState;

        let url = '';
        url += `/series?page=${Number(page)}`
        if (sort) {
            url += '&sort=true';
        }
        if (Number(cut) > 0) {
            url += `&cut=${Number(cut)}`;
        }
        return url;
    }

    /**
     * 목록 가져오는 api
     * @param {boolean} isFirstOrPop useEffect 처음이냐 아니냐
     */
    function getSeries(isFirstOrPop) {
        let url = '';
        url += API_SERVER;
        url += `/series?page=${pageRef.current}`;
        if (sortRef.current) {
            url += '&sort=true';
        }
        if (cutRef.current) {
            url += `&cut=${cutRef.current}`;
        }
        fetch(url)
        .then(response => response.json())
        .then(data => {
            if(data['ok']){
                if(!isFirstOrPop) {
                    navigate(getUrl({
                        page: pageRef.current,
                        sort: sortRef.current,
                        cut: cutRef.current
                    }));
                }
                setPageState(pageRef.current);
                setSortState(sortRef.current);
                setCutState(cutRef.current);
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
        const newArr = [];
        if(seriesList){
            for(const key in seriesList) {
                const i = seriesList[key];
                const isUpdate = common.isDateWithin14Days(i['last_update']);
                newArr.push(
                    <Col key={key} sm={6} md={4} lg={3} xl={2} className='pad'>
                        <Link to={`/list?id=${i['id']}`}>
                            <div className='hover-handler series'>
                                {isUpdate?
                                    <span className='update-mark'>UP</span>
                                : ''}
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
                <div>없어요.. 뭔가 문제가 생긴듯 😥</div>
            );
        }
    }

    /**
     * ref 값 갱신하고 목록 api 호출
     * @param {number} page 페이지
     * @param {number} sort 정렬
     * @param {string} nickname 닉네임
     */
    function setRefAndFetch({
        page=false,
        sort=false,
        cut=false,
    }) {
        //false가 아니라면? 즉 값을 받았다면?
        if (page!==false) pageRef.current = page;
        if (sort!==false) sortRef.current = sort;
        if (cut!==false) cutRef.current = cut;
        getSeries();
    }

    //페이징 버튼 핸들러
    function pageHandler(page) {
        setRefAndFetch({page: page});
    };

    //개추 정렬 핸들러
    function SortHandler(checked) {
        setRefAndFetch({sort: checked});
    }

    //개추 최소 컷 핸들러
    function CutHandler(cut) {
        setRefAndFetch({cut: cut});
    }

    return (
        <div className='Series'>
            <MetaTag title='Test Series' description='테스트인 시리즈 분류' url={currentUrl} />
            <div className='mb-2'>
                <Sort checked={sortRef.current} handler={SortHandler}/>
                <Cut value={cutRef.current} handler={CutHandler}/>
            </div>
            <Row>
                {renderSeriesList()}
            </Row>
            <div className='mt-2'>
                <Paging page={pageRef.current} perPage={perPage} count={count} pageBtn={5} handler={pageHandler}/>
            </div>
        </div>
    );
}

export default Series;