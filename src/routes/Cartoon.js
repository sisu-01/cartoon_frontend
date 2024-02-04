import React, { useEffect, useRef,useState } from 'react';
import { Link } from 'react-router-dom';

import ListGroup from 'react-bootstrap/ListGroup';

import Sort from '../components/Sort';
import Cut from '../components/Cut';
import Paging from '../components/Paging';

import * as common from '../utils/common';
import API_SERVER from '../utils/api';

function Cartoon() {
    console.log('###Cartoon');

    //url 파라미터들
    const searchParams = new URLSearchParams(window.location.search);
    const tempPage = useRef(Number(searchParams.get('page')) || 1);
    const tempSort = useRef(searchParams.get('sort') === 'true' || false);
    const tempCut = useRef(searchParams.get('cut') || false);

    //페이징에 필요한 정보들
    const [cartoonList, setCartoonList] = useState();
    const [perPage, setPerPage] = useState();
    const [count, setCount] = useState();

    //이전 페이지 버튼을 위한 주소 저장
    const location = window.location;
    localStorage.setItem('prev', location.pathname+location.search);

    useEffect(() => {
        getCartoon();
    }, []);

    //네비게이터에 쓸 url 제조기
    function getUrl(p=1) {
        tempPage.current = Number(p);
        let url = '';
        url += `/cartoon?page=${tempPage.current}`
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
            callback: getCartoon,
        });
    };

    //목록 가져오는 api
    function getCartoon() {
        let url = '';
        url += API_SERVER;
        url += `/cartoon?page=${tempPage.current}`;
        if (tempSort.current) {
            url += '&sort=true';
        }
        if (tempCut.current) {
            url += `&cut=${tempCut.current}`;
        }
        console.log('getCartoon:', url);
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
        console.log('renderCartoonList');
        const newArr = [];
        if(cartoonList){
            for(const key in cartoonList) {
                const i = cartoonList[key];
                const date = common.dateFormat(i['date']);
                newArr.push(
                    <tr key={key}>
                        <td><a href={`https://gall.dcinside.com/board/view/?id=cartoon&no=${i['id']}`} target='_blank' rel='noopener noreferrer'>{i['title']}</a></td>
                        <td>
                            <Link to={`/info?id=${i['writer_id']}&nickname=${i['writer_nickname']}`}>
                                {i['writer_nickname']}
                            </Link>
                        </td>
                        <td>{date}</td>
                        <td>{i['recommend']}</td>
                    </tr>
                );
            }
            return newArr;
        }else{
            return(
                <tr>
                    <td colSpan='5'>없어요</td>
                </tr>
            );
        }
    }

    //만화 목록 렌더링2
    function renderCartoonList2() {
        console.log('renderCartoonList2');
        const newArr = [];
        if(cartoonList){
            for(const key in cartoonList) {
                const i = cartoonList[key];
                const date = common.dateFormat(i['date']);
                newArr.push(
                    <ListGroup.Item key={key} className='d-flex'>
                        <div className='flex-grow-1'>
                            <a href={`https://gall.dcinside.com/board/view/?id=cartoon&no=${i['id']}`} target='_blank' rel='noopener noreferrer'>
                                <span>{i['title']}</span>
                                <div>
                                    <span>★{i['recommend']}&nbsp;</span>
                                    <span>{date}</span>
                                </div>
                            </a>
                        </div>
                        <div>
                            <Link to={`/info?id=${i['writer_id']}&nickname=${i['writer_nickname']}`}>{i['writer_nickname']}</Link>
                        </div>
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
        common.navigate(getUrl(page), getCartoon);
    };

    //개추 정렬 핸들러
    function SortHandler(checked) {
        tempSort.current = checked;
        common.navigate(getUrl(), getCartoon);
    }

    //개추 최소 컷 핸들러
    function CutHandler(cut) {
        tempCut.current = cut;
        common.navigate(getUrl(), getCartoon);
    }

    return (
        <div className='Cartoon'>
            <div>
                <Sort checked={tempSort.current} handler={SortHandler}/>
                <Cut value={tempCut.current} handler={CutHandler}/>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>title</th>
                        <th>writer</th>
                        <th>date</th>
                        <th>rec</th>
                    </tr>
                </thead>
                <tbody>
                    {renderCartoonList()}
                </tbody>
            </table>
            {renderCartoonList2()}
            <div>
                <Paging page={tempPage.current} perPage={perPage} count={count} pageBtn={10} handler={pageHandler}/>
            </div>
        </div>
    );
}

export default Cartoon;