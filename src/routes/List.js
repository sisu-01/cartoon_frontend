import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
            alert("내용 복사 완료!");
        }
        return (
            <>
                <Button variant='outline-dark' onClick={() => makeUrl()}>공유하기</Button>    
                <textarea id="ShareUrl" class="d-none" cols="30" rows="10"></textarea>
            </>
        );
    }

    //만화 목록이랑 페이징 들어갈 컴포넌트
    function List() {

        //url 파라미터들
        const searchParams = new URLSearchParams(window.location.search);
        const tempPage = useRef(Number(searchParams.get('page')) || 1);

        //페이징에 필요한 정보들
        const [cartoonList, setCartoonList] = useState();
        const [perPage, setPerPage] = useState();
        const [count, setCount] = useState();

        const location = window.location;
        const currentUrl = location.pathname+location.search;

        //최초 실행
        useEffect(() => { 
            getList();
        }, []);

        //네비게이터에 쓸 url 제조기
        function getUrl(p=1) {
            tempPage.current = Number(p);
            let url = '';
            url += `/list?id=${id}&page=${tempPage.current}`
            return url;
        }

        //브라우저 뒤로가기, 앞으로가기 감지
        window.onpopstate = () => {
            common.popNavigate({
                page: tempPage,
                callback: getList,
            });
        };

        //목록 가져오는 api
        function getList() {
            let url = '';
            url += API_SERVER;
            url += `/list?id=${id}&page=${tempPage.current}`;
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
            if(cartoonList){
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

        //페이징 버튼 핸들러
        function pageHandler(page) {
            common.navigate(getUrl(page), getList);
        };

        return (
            <div className='List'>
                <MetaTag title={init['title']} description={`${init['writer_nickname']}의 연재 만화`} url={currentUrl} />
                {renderCartoonList()}
                <div className='mt-2'>
                    <Paging page={tempPage.current} perPage={perPage} count={count} pageBtn={5} handler={pageHandler}/>
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
                                        {init['writer_nickname']}
                                    </Link>
                                    <span>∙</span>
                                    작가
                                </>
                            )}
                        </span>
                        {/* {init['writer_id']==='a'?'유동':`아이디: ${init['writer_id']}`} */}
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