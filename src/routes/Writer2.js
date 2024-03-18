import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import MetaTag from '../components/MetaTag';
import Paging from '../components/Paging';

import * as common from '../utils/common';
import API_SERVER from '../utils/api';

function Writer2() {
    console.log('###Writer2.js');
    const navigate = useNavigate();

    //url 파라미터들
    const searchParams = new URLSearchParams(window.location.search);
    const [tempPage, setTempPage] = useState(Number(searchParams.get('page')) || 1);
    const [tempSort, setTempSort] = useState(Number(searchParams.get('sort')) || 1);
    const [tempNickname, setTempNickname] = useState(searchParams.get('nickname') !== null ? String(searchParams.get('nickname')) : '');

    const sortList = [
        {'id': 1, 'label': '가나다순'},
        {'id': 2, 'label': '첫념글'},
        {'id': 3, 'label': '작품개수'},
        {'id': 4, 'label': '누적개추'},
        {'id': 5, 'label': '평균개추'}
    ]

    //페이징에 필요한 정보들
    const [writerList, setWriterList] = useState();
    const [perPage, setPerPage] = useState();
    const [count, setCount] = useState();

    //이전 페이지 버튼을 위한 주소 저장
    const location = window.location;
    const currentUrl = location.pathname+location.search;
    localStorage.setItem('prev', currentUrl);

    useEffect(() => {
        console.log('useEffect');
        getWriter();
    }, [tempPage, tempSort, tempNickname]);

    /**
     * 네비게이터에 쓸 url 제조기 object 담아서 보내시오~
     * @param {number} page 페이지
     * @param {number} sort 정렬
     * @param {string} nickname 닉네임
     */
    function getUrl({
        page=false,
        sort=false,
        nickname=false
    }) {
        //false라면? 즉 값을 받지 않는다면? 기본 state 적용
        if (!page) page = tempPage;
        if (!sort) sort = tempSort;
        if (!nickname) nickname = tempNickname;

        let url = '';
        url += `/writer2?page=${Number(page)}`
        if (sort) {
            url += `&sort=${sort}`;
        }
        if (nickname) {
            url += `&nickname=${nickname}`;
        }
        return url;
    }
    
    //브라우저 뒤로가기, 앞으로가기 감지
    window.onpopstate = () => {
        const popParams = new URLSearchParams(window.location.search);
        setTempPage(Number(popParams.get('page')) || 1);
        setTempSort(Number(popParams.get('sort')) || 1);
        setTempNickname(popParams.get('nickname') !== null ? String(popParams.get('nickname')) : '');
    };
    
    //목록 가져오는 api
    function getWriter() {
        let url = '';
        url += API_SERVER;
        url += `/writer?page=${tempPage}`;
        if (tempSort) {
            url += `&sort=${tempSort}`;
        }
        if (tempNickname !== '') {
            url += `&nickname=${tempNickname}`;
        }
        console.log(url);
        fetch(url)
        .then(response => response.json())
        .then(data => {
            if(data['ok']){
                setWriterList(data['list']);
                setPerPage(data['perPage']);
                setCount(data['count']);
            }else{
                setWriterList();
                alert('그런거 없긔');
            }
        })
        .catch(err => {
            alert(err);
        });
    }

    //작가 목록 렌더링
    function renderWriterList() {
        const newArr = [];
        if (writerList) {
            for(const key in writerList) {
                const i = writerList[key];
                // const id = i['id'] === 'a'? '유동': i['id'];
                const URInickname = encodeURIComponent(i['nickname']);
                const date = common.dateFormat(i['date'], 'short');
                newArr.push(
                    <tr
                        key={key}
                        className='cursor-pointer'
                        onClick={() => trHandler(`/info?id=${i['id']}&nickname=${URInickname}`)}
                        role='link'>
                        <td>
                            <span className='cartoon-writer'>{i['nickname']}</span>
                        </td>
                        <td>{date}</td>
                        <td>{i['count']}</td>
                        <td>{i['recommend']}</td>
                        <td>{i['average']}</td>
                    </tr>
                );
            }
        } else {
            return(
                <tr>
                    <td colSpan='5'>없어요</td>
                </tr>
            );
        }
        return newArr;
    }
    
    //tr 핸들러
    function trHandler(url) {
        navigate(url);
    }

    //페이징 버튼 핸들러
    function pageHandler(page) {
        navigate(getUrl({
            page: page,
        }));
        setTempPage(page);
    };

    //작가 정렬 핸들러
    function SortHandler(value) {
        navigate(getUrl({
            page: 1,
            sort: Number(value) || 1,
        }));
        setTempPage(1);
        setTempSort(Number(value) || 1);
    }

    //작가 검색 핸들러
    function SearchHandler(value) {
        navigate(getUrl({
            page: 1,
            nickname: value,
        }));
        setTempPage(1);
        setTempNickname(value);
    }

    function NicknameForm(props) {
        const [tempText, setTempText] = useState(props.default);

        //작가 검색 시간 체크
        let searchTimer;
        const searchIntervalTime = 500; // 0.5초
        function clearTime() {
            clearTimeout(searchTimer);
        }
        function setTime() {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(() => {props.SearchHandler(tempText)}, searchIntervalTime);
        }

        return (
            <Form.Control
                value={tempText}
                aria-label='nickname'
                aria-describedby='writer-nickname'
                onChange={(e) => setTempText(e.target.value)}
                onKeyDown={() => clearTime()}
                onKeyUp={() => setTime()}
            />
        );
    }

    return (
        <div className='Writer'>
            <span>작가 이름을 눌러 상세 페이지로 이동할 수 있습니다.</span>
            <MetaTag title='Writer' description='작가 목록' url={currentUrl} />
            <Table responsive striped bordered hover>
                <thead>
                    <tr>
                        {sortList.map(sort => (
                            <th key={sort.id}>
                                <Form.Check
                                    type='radio'
                                    id={sort.id}
                                    name='sort'
                                    value={sort.id}
                                    checked={tempSort === sort.id}
                                    onChange={({target: {value}}) => SortHandler(value)}
                                    inline
                                    label={sort.label}
                                />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {renderWriterList()}
                </tbody>
            </Table>
            <InputGroup className='mb-3'>
                <InputGroup.Text id='writer-nickname'>작가 이름</InputGroup.Text>
                <NicknameForm SearchHandler={SearchHandler} default={tempNickname}/>
            </InputGroup>
            <div>
                <Paging page={tempPage} perPage={perPage} count={count} pageBtn={5} handler={pageHandler}/>
            </div>
        </div>
    );
}

export default Writer2;