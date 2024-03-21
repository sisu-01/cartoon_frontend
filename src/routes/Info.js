import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import ListGroup from 'react-bootstrap/ListGroup';

import MetaTag from '../components/MetaTag';
import Sort from '../components/Sort';
import Cut from '../components/Cut';
import Paging from '../components/Paging';

import * as common from '../utils/common';
import API_SERVER from '../utils/api';

function Info() {
    const initParam = new URLSearchParams(window.location.search);
    const id = initParam.get('id');
    const nickname = initParam.get('nickname');
    const prev = localStorage.getItem('prev') || false;

    const [init, setInit] = useState(null);

    useEffect(() => {
        async function init() {
            let url = '';
            url += API_SERVER;
            url += `/infoCount?id=${id}&nickname=${encodeURIComponent(nickname)}`;
            await fetch(url)
            .then(response => response.json())
            .then(data => {
                if(data['ok']){
                    setInit(data);
                }else{
                    alert('그런거 없긔');
                }
            })
            .catch(err => {
                alert(err);
            });
        }
        init();
    }, [id, nickname]);

    //만화 목록이랑 페이징 들어갈 컴포넌트
    function List() {
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
        const [cartoonList, setCartoonList] = useState();
        const [perPage, setPerPage] = useState();
        const [count, setCount] = useState();

        //수정 메타데이터를 위한 것?
        const location = window.location;
        const currentUrl = location.pathname+location.search;

        //최초 실행
        useEffect(() => { 
            getInfo(true);

            function handleBack() {
                const popParams = new URLSearchParams(window.location.search);
                pageRef.current = Number(popParams.get('page')) || 1;
                sortRef.current = Number(popParams.get('sort') === 'true' || false);
                cutRef.current = popParams.get('cut') || false;
                getInfo(true);
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
           url += `/info?id=${id}&nickname=${nickname}&page=${Number(page)}`
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
        function getInfo(isFirstOrPop) {
            let url = '';
            url += API_SERVER;
            url += `/info?page=${pageRef.current}&id=${id}&nickname=${encodeURIComponent(nickname)}`;
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
                    setCartoonList(data['list']);
                    setPerPage(data['perPage']);
                    setCount(data['count']);
                }else{
                    setCartoonList();
                    alert('그런거 없긔');
                }
            })
            .catch(err => {
                alert(err);
            });
        }
        
        //만화 목록 렌더링
        function renderCartoonList() {
            const newArr = [];
            if (cartoonList) {
                for(const key in cartoonList) {
                    const i = cartoonList[key];
                    const date = common.dateFormat(i['date']);
                    const isUpdate = common.isDateWithin14Days(i['date']);
                    newArr.push(
                        <ListGroup.Item key={key}>
                            <a href={`https://gall.dcinside.com/board/view/?id=cartoon&no=${i['id']}`} target='_blank' rel='noopener noreferrer'>
                                <div className='hover-handler'>
                                    {isUpdate?
                                        <span className='update-mark'>UP</span>
                                    : ''}
                                    <span className='cartoon-title word-break'>{i['title']}</span>
                                    <div className='cartoon-info'>
                                        <span>★{i['recommend']}&nbsp;</span>
                                        <span>{date}</span>
                                    </div>
                                </div>
                            </a>
                        </ListGroup.Item>
                    )
                }
                return (<ListGroup variant='flush'>{newArr}</ListGroup>);
            } else {
                return(
                    <ListGroup>
                        <ListGroup.Item>
                            없어요
                        </ListGroup.Item>
                    </ListGroup>
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
            sort='default',
            cut=false,
        }) {
            //false가 아니라면? 즉 값을 받았다면?
            if (page!==false) pageRef.current = page;
            if (sort!=='default') sortRef.current = sort;
            if (cut!==false) cutRef.current = cut;
            getInfo();
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
            <div className='List'>
                <MetaTag title={`${nickname}의 만화들`} description={`${nickname}의 만화 목록`} url={currentUrl} />
                <div>
                    <Sort checked={sortRef.current} handler={SortHandler}/>
                    <Cut value={cutRef.current} handler={CutHandler}/>
                </div>
                {renderCartoonList()}
                <div className='mt-2'>
                    <Paging page={pageRef.current} perPage={perPage} count={count} pageBtn={5} handler={pageHandler}/>
                </div>
            </div>
        );
    }

    return (
        <div className='Info'>
            {init ? (
                <>
                    <div>
                        {prev? <Link to={`${prev}`}>목록으로 돌아가기</Link>: ''}
                        <br/>
                        <div className='d-flex align-items-center'>
                            <h2>
                                <em className='cartoon-writer'>{nickname}</em>
                                <span>님의 작품</span>
                            </h2>
                            <span className='ms-1 text-secondary'>총 {init['count']}</span>
                        </div>
                        {/* {id==='a'?'유동':`아이디: ${id}`} */}
                    </div>
                    <List />
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default Info;