import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';

import MetaTag from '../components/MetaTag';
import Paging from '../components/Paging';
import SearchTextForm from '../components/SearchTextForm';

import * as common from '../utils/common';
import API_SERVER from '../utils/api';

function Writer() {
    const navigate = useNavigate();

    //url 파라미터들
    const searchParams = new URLSearchParams(window.location.search);
    const [pageState, setPageState] = useState(Number(searchParams.get('page')) || 1);
    const [sortState, setSortState] = useState(Number(searchParams.get('sort')) || 1);
    const [nicknameState, setNicknameState] = useState(searchParams.get('nickname') !== null ? String(searchParams.get('nickname')) : '');
    const pageRef = useRef(pageState);
    const sortRef = useRef(sortState);
    const nicknameRef = useRef(nicknameState);

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
        getWriter(true);

        function handleBack() {
            const popParams = new URLSearchParams(window.location.search);
            pageRef.current = Number(popParams.get('page')) || 1;
            sortRef.current = Number(popParams.get('sort')) || 1;
            nicknameRef.current = popParams.get('nickname') !== null ? String(popParams.get('nickname')) : '';
            getWriter(true);
        }
        // 뒤로가기 이벤트를 감지할 때 handleBack 함수를 실행
        window.addEventListener('popstate', handleBack);
        return () => {
            // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
            window.removeEventListener('popstate', handleBack);
        };
    }, []);
    
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
        if (page===false) page = pageState;
        if (sort===false) sort = sortState;
        if (nickname===false) nickname = nicknameState;

        let url = '';
        url += `/writer?page=${Number(page)}`
        if (sort) {
            url += `&sort=${sort}`;
        }
        if (nickname) {
            url += `&nickname=${nickname}`;
        }
        return url;
    }

    /**
     * 목록 가져오는 api
     * @param {boolean} isFirstOrPop useEffect 처음이냐 아니냐
     */
    function getWriter(isFirstOrPop) {
        let url = '';
        url += API_SERVER;
        url += `/writer?page=${pageRef.current}`;
        if (sortRef.current) {
            url += `&sort=${sortRef.current}`;
        }
        if (nicknameRef.current !== '') {
            url += `&nickname=${nicknameRef.current}`;
        }
        fetch(url)
        .then(response => response.json())
        .then(data => {
            if(data['ok']){
                if(!isFirstOrPop) {
                    navigate(getUrl({
                        page: pageRef.current,
                        sort: sortRef.current,
                        nickname: nicknameRef.current
                    }));
                }
                setPageState(pageRef.current);
                setSortState(sortRef.current);
                setNicknameState(nicknameRef.current);
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
                const URInickname = encodeURIComponent(i['nickname']);
                const date = common.dateFormat(i['date'], 'short');
                const isAnony = i['id']==='a'? true : false;
                newArr.push(
                    <tr
                        key={key}
                        className='cursor-pointer'
                        onClick={() => trHandler(`/info?id=${i['id']}&nickname=${URInickname}`)}
                        role='link'>
                        <td>
                            <span className='cartoon-writer'>{i['nickname']}{isAnony? '': <span className='fix-icon'>✅</span>}</span>
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

    /**
     * ref 값 갱신하고 getWriter 호출
     * @param {number} page 페이지
     * @param {number} sort 정렬
     * @param {string} nickname 닉네임
     */
    function setRefAndFetch({
        page=false,
        sort=false,
        nickname=false,
    }) {
        //false가 아니라면? 즉 값을 받았다면?
        if (page!==false) pageRef.current = page;
        if (sort!==false) sortRef.current = sort;
        if (nickname!==false) nicknameRef.current = nickname;
        getWriter();
    }

    //페이징 버튼 핸들러
    function pageHandler(page) {
        setRefAndFetch({page: page});
    };

    //작가 정렬 핸들러
    function SortHandler(value) {
        setRefAndFetch({page: 1, sort: Number(value) || 1});
    }

    //작가 검색 핸들러
    function SearchHandler(value) {
        setRefAndFetch({page:1, nickname: value});
    }

    //수정 디버그용 console.log
    // 언젠가 뒤로가기 렌더링 두번 해결한다면..
    // let zz;
    // for(const key in writerList) {
    //     const i = writerList[key];
    //     zz = i['nickname'];
    //     break;
    // }
    // console.log(`###Writer.js\npage:${pageState}\nsort:${sortList[sortState-1]['label']}\nnick:${nicknameState}\nlist:${zz}\npage:${perPage}\ncunt:${count}`);
    
    return (
        <div className='Writer'>
            <span>아래의 행을 선택해 상세 페이지로 이동할 수 있습니다.</span>
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
                                    checked={sortState === sort.id}
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
            <SearchTextForm label={'작가 이름'} SearchHandler={SearchHandler} default={nicknameState}/>
            <div>
                <Paging page={pageState} perPage={perPage} count={count} pageBtn={5} handler={pageHandler}/>
            </div>
        </div>
    );
}

export default Writer;