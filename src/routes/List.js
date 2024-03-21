import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

import MetaTag from '../components/MetaTag';
import Paging from '../components/Paging';

import * as common from '../utils/common';
import API_SERVER from '../utils/api';

function List() {
    const initParam = new URLSearchParams(window.location.search);
    const id = initParam.get('id');
    const prev = localStorage.getItem('prev') || false;
    const [init, setInit] = useState(null);
    
    useEffect(() => {
        async function init() {
            let url = '';
            url += API_SERVER;
            url += `/listInfo?id=${id}`;
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
    }, [id]);

    function ShareSeries() {
        function makeUrl() {
            var obShareUrl = document.getElementById("ShareUrl");
            obShareUrl.className = 'test';
    
            let result = '';
            result += `${window.location.href}\n`
            result += `제목: ${init['title']}\n`;
            result += `작가: ${init['writer_nickname']}`;
    
            obShareUrl.value = result;
            obShareUrl.select(); // 해당 값이 선택되도록 select() 합니다
            document.execCommand("copy"); // 클립보드에 복사합니다.
            obShareUrl.blur(); // 선된것을 다시 선택안된것으로 바꿈니다.
            obShareUrl.className = "d-none";
            alert("url 복사 완료!");
        }
        return (
            <>
                <Button variant='outline-dark' onClick={() => makeUrl()}>공유하기</Button>    
                <textarea id="ShareUrl" className="d-none" cols="30" rows="10"></textarea>
            </>
        );
    }

    //만화 목록이랑 페이징 들어갈 컴포넌트
    function List() {
        const navigate = useNavigate();

        //url 파라미터들
        const searchParams = new URLSearchParams(window.location.search);
        const [pageState, setPageState] = useState(Number(searchParams.get('page')) || 1);
        const pageRef = useRef(pageState);

        //페이징에 필요한 정보들
        const [cartoonList, setCartoonList] = useState();
        const [perPage, setPerPage] = useState();
        const [count, setCount] = useState();

        //수정 메타데이터를 위한 것?
        const location = window.location;
        const currentUrl = location.pathname+location.search;

        //최초 실행
        useEffect(() => { 
            getList(true);

            function handleBack() {
                const popParams = new URLSearchParams(window.location.search);
                pageRef.current = Number(popParams.get('page')) || 1;
                getList(true);
            }
            // 뒤로가기 이벤트를 감지할 때 handleBack 함수를 실행
            window.addEventListener('popstate', handleBack);
            return () => {
                // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
                window.removeEventListener('popstate', handleBack);
            };
        }, []);

        //네비게이터에 쓸 url 제조기
        function getUrl(p=1) {
            pageRef.current = Number(p);
            let url = '';
            url += `/list?id=${id}&page=${pageRef.current}`
            return url;
        }
        /**
         * 네비게이터에 쓸 url 제조기 object 담아서 보내시오..
         * @param {number} page 페이지
         * @returns {string} url
         */
        function getUrl({
            page=false
        }) {
           //false라면? 즉 값을 받지 않는다면? 기본 state 적용
           if (page===false) page = pageState
   
           let url = '';
           url += `/list?id=${id}&page=${Number(page)}`

           return url;
        }

        /**
         * 목록 가져오는 api
         * @param {boolean} isFirstOrPop useEffect 처음이냐 아니냐
         */
        function getList(isFirstOrPop) {
            let url = '';
            url += API_SERVER;
            url += `/list?id=${id}&page=${pageRef.current}`;
            fetch(url)
            .then(response => response.json())
            .then(data => {
                if(data['ok']){
                    if(!isFirstOrPop) {
                        navigate(getUrl({
                            page: pageRef.current
                        }));
                    }
                    setPageState(pageRef.current);
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
            if(cartoonList){
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
                    );
                }
                return (<ListGroup variant='flush'>{newArr}</ListGroup>);
            }else{
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
         */
        function setRefAndFetch({
            page=false,
        }) {
            //false가 아니라면? 즉 값을 받았다면?
            if (page!==false) pageRef.current = page;
            getList();
        }

        //페이징 버튼 핸들러
        function pageHandler(page) {
            setRefAndFetch({page: page});
        };

        return (
            <div className='List'>
                <MetaTag title={init['title']} description={`${init['writer_nickname']}의 연재 만화`} url={currentUrl} />
                {renderCartoonList()}
                <div className='mt-2'>
                    <Paging page={pageRef.current} perPage={perPage} count={count} pageBtn={5} handler={pageHandler}/>
                </div>
            </div>
        );
    }

    return (
        <div className='List'>
            {init ? (
                <>
                    <div>
                        {prev && <Link to={`${prev}`}>목록으로 돌아가기</Link>}
                    </div>
                    <div>
                        <h2 className='fw-semibold'>
                            {init['title']}
                        </h2>
                    </div>
                    <div>
                        <span className='d-flex gap-1 text-secondary'>
                            {init['writer_id'] && init['writer_nickname'] && (
                                <>
                                    <Link to={`/info?id=${init['writer_id']}&nickname=${init['writer_nickname']}`}
                                        className='cartoon-writer'>
                                        <span>{init['writer_nickname']}</span>
                                        {init['writer_id']==='a'? '' : <span className='fix-icon'>✅</span>}
                                    </Link>
                                    <span>∙</span>
                                    작가
                                </>
                            )}
                        </span>
                        <span>시리즈 기능이 완벽하지 않으니 작가 상세 페이지도 확인해보세요.</span>
                    </div>
                    <div className='my-2'>
                        <ShareSeries />
                    </div>
                    <div className='mt-1 border-bottom text-secondary fw-medium'>
                        총 {init['count']} 화
                    </div>
                    <List />
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default List;