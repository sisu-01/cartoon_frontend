import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
    }, [id]);

    //만화 목록이랑 페이징 들어갈 컴포넌트
    function List() {

        //url 파라미터들
        const searchParams = new URLSearchParams(window.location.search);
        const tempPage = useRef(Number(searchParams.get('page')) || 1);
        const tempSort = useRef(searchParams.get('sort') === 'true' || false);
        const tempCut = useRef(searchParams.get('cut') || false);

        //페이징에 필요한 정보들
        const [cartoonList, setCartoonList] = useState();
        const [perPage, setPerPage] = useState();
        const [count, setCount] = useState();

        const location = window.location;
        const currentUrl = location.pathname+location.search;

        //최초 실행
        useEffect(() => { 
            getInfo();
        }, []);

        //네비게이터에 쓸 url 제조기
        function getUrl(p=1) {
            tempPage.current = Number(p);
            let url = '';
            url += `/info?page=${tempPage.current}&id=${id}&nickname=${nickname}`
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
                callback: getInfo,
            });
        };

        //목록 가져오는 api
        function getInfo() {
            let url = '';
            url += API_SERVER;
            url += `/info?page=${tempPage.current}&id=${id}&nickname=${encodeURIComponent(nickname)}`;
            if (tempSort.current) {
                url += '&sort=true';
            }
            if (tempCut.current) {
                url += `&cut=${tempCut.current}`;
            }
            fetch(url)
            .then(response => response.json())
            .then(data => {
                if(data['ok']){
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
                    newArr.push(
                        <ListGroup.Item key={key}>
                            <a href={`https://gall.dcinside.com/board/view/?id=cartoon&no=${i['id']}`} target='_blank' rel='noopener noreferrer'>
                                <div className='hover-handler'>
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

        //페이징 버튼 핸들러
        function pageHandler(page) {
            common.navigate(getUrl(page), getInfo);
        };

        //개추 정렬 핸들러
        function SortHandler(checked) {
            tempSort.current = checked;
            common.navigate(getUrl(), getInfo);
        }

        //개추 최소 컷 핸들러
        function CutHandler(cut) {
            tempCut.current = cut;
            common.navigate(getUrl(), getInfo);
        }

        return (
            <div className='List'>
                <MetaTag title={`${nickname}의 만화들`} description={`${nickname}의 만화 목록`} url={currentUrl} />
                <div>
                    <Sort checked={tempSort.current} handler={SortHandler}/>
                    <Cut value={tempCut.current} handler={CutHandler}/>
                </div>
                {renderCartoonList()}
                <div className='mt-2'>
                    <Paging page={tempPage.current} perPage={perPage} count={count} pageBtn={5} handler={pageHandler}/>
                </div>
            </div>
        );
    }

    return (
        <div className='Info'>
            <div>
                {prev? <Link to={`${prev}`}>목록으로 돌아가기</Link>: ''}
                <br/>
                <div className='d-flex align-items-center'>
                    <h2>
                        <em className='cartoon-writer'>{nickname}</em>
                        <span>님의 작품</span>
                    </h2>
                    {init ? (
                        <span className='ms-1 text-secondary'>총 {init['count']}</span>
                    ) : ('')}
                </div>
                {/* {id==='a'?'유동':`아이디: ${id}`} */}
            </div>
            <List />
        </div>
    );
}

export default Info;