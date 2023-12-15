import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Paging from '../components/Paging';

import * as common from '../utils/common';
import API_SERVER from '../utils/api';

function Writer() {
    //url 파라미터들
    const searchParams = new URLSearchParams(window.location.search);
    const tempPage = useRef(Number(searchParams.get('page')) || 1);
    const tempSort = useRef(Number(searchParams.get('sort')) || 1);
    const sortList = [
        {'id': 1, 'label': '작가이름'},
        {'id': 2, 'label': '개추평균'},
        {'id': 3, 'label': '날짜'},
        {'id': 4, 'label': '작품개수'}
    ]

    //페이징에 필요한 정보들
    const [writerList, setWriterList] = useState();
    const [perPage, setPerPage] = useState();
    const [count, setCount] = useState();

    //이전 페이지 버튼을 위한 주소 저장
    const location = window.location;
    localStorage.setItem('prev', location.pathname+location.search);

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
        if (false) {
            url += `&cut=0`;
        }
        return url;
    }
    
    //브라우저 뒤로가기, 앞으로가기 감지
    window.onpopstate = () => {
        const popParams = new URLSearchParams(window.location.search);
        tempPage.current = Number(popParams.get('page')) || 1;
        tempSort.current = Number(popParams.get('sort')) || 1;
        getWriter();
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
        console.log('getWriter:', url);
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
        console.log('renderWriterList');
        const newArr = [];
        if (writerList) {
            for(const key in writerList) {
                const i = writerList[key];
                const id = i['id'] === 'a'? '유동': i['id'];
                const date = common.dateFormat(i['date']);
                newArr.push(
                    <tr key={key}>
                        <td>{id}</td>
                        <td>
                            <Link to={`/info?id=${i['id']}&nickname=${i['nickname']}`}>
                                {i['nickname']}
                            </Link>
                        </td>
                        <td>{date}</td>
                        <td>{i['count']}</td>
                        <td>{i['average']}</td>
                    </tr>
                );
            }
        } else {
            return(
                <tr>
                    <td colSpan='3'>없어요</td>
                </tr>
            );
        }
        return newArr;
    }

    //페이징 버튼 핸들러
    function pageHandler(e) {
        common.navigate(getUrl(e.target.value), getWriter);
    };

    //작가 정렬 핸들러
    function SortHandler(value) {
        tempSort.current = Number(value) || 1;
        common.navigate(getUrl(), getWriter);
    }

    return (
        <div className='Writer'>
            <div>
                <div>정렬</div>
                {sortList.map(sort => (
                    <label key={`sort_${sort.id}`}>
                        <input
                            type='radio'
                            id={sort.id}
                            name='sort'
                            value={sort.id}
                            checked={tempSort.current === sort.id}
                            onChange={({target: {value}}) => SortHandler(value)}
                        />
                        {sort.label}
                    </label>
                ))}
            </div>
            <table>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>nickname</th>
                        <th>first rec</th>
                        <th>count</th>
                        <th>average</th>
                    </tr>
                </thead>
                <tbody>
                    {renderWriterList()}
                </tbody>
            </table>
            <div>
                <Paging page={tempPage.current} perPage={perPage} count={count} pageBtn={10} handler={pageHandler}/>
            </div>
        </div>
    );
}

export default Writer;