import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';

import MetaTag from '../components/MetaTag';
import Paging from '../components/Paging';

import * as common from '../utils/common';
import API_SERVER from '../utils/api';

function Writer() {
    const navigate = useNavigate();

    //url 파라미터들
    const searchParams = new URLSearchParams(window.location.search);
    const tempPage = useRef(Number(searchParams.get('page')) || 1);
    const tempSort = useRef(Number(searchParams.get('sort')) || 1);
    const sortList = [
        {'id': 1, 'label': '필명'},
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
        getWriter();
    }, []);

    //네비게이터에 쓸 url 제조기
    function getUrl(p=1) {
        tempPage.current = Number(p);
        let url = '';
        url += `/writer?page=${tempPage.current}`
        if (tempSort.current) {
            url += `&sort=${tempSort.current}`;
        }
        return url;
    }
    
    //브라우저 뒤로가기, 앞으로가기 감지
    window.onpopstate = () => {
        common.popNavigate({
            page: tempPage,
            sort: tempSort,
            callback: getWriter,
        });
    };
    
    //목록 가져오는 api
    function getWriter() {
        let url = '';
        url += API_SERVER;
        url += `/writer?page=${tempPage.current}`;
        if (tempSort.current) {
            url += `&sort=${tempSort.current}`;
        }
        if (false) {
            url += `&cut=0`;
        }
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
                const nickname = encodeURIComponent(i['nickname']);
                const date = common.dateFormat(i['date'], 'short');
                newArr.push(
                    <tr
                        key={key}
                        className='cursor-pointer'
                        onClick={() => trHandler(`/info?id=${i['id']}&nickname=${nickname}`)}
                        role='link'
                    >
                        {/* <td>{id}</td> */}
                        <td>
                                {i['nickname']}
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
        common.navigate(getUrl(page), getWriter);
    };

    //작가 정렬 핸들러
    function SortHandler(value) {
        tempSort.current = Number(value) || 1;
        common.navigate(getUrl(), getWriter);
    }

    return (
        <div className='Writer'>
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
                                    checked={tempSort.current === sort.id}
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
            <div>
                <Paging page={tempPage.current} perPage={perPage} count={count} pageBtn={5} handler={pageHandler}/>
            </div>
        </div>
    );
}

export default Writer;