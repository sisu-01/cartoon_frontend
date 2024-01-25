import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Paging from '../components/Paging';

import * as common from '../utils/common';
import API_SERVER from '../utils/api';

function List() {
    console.log('########최초 한 번만 렌더 List');
    const initParam = new URLSearchParams(window.location.search);
    const id = initParam.get('id');
    const prev = localStorage.getItem('prev') || false;

    //만화 목록이랑 페이징 들어갈 컴포넌트
    function List() {
        console.log('###List');

        //url 파라미터들
        const searchParams = new URLSearchParams(window.location.search);
        const tempPage = useRef(Number(searchParams.get('page')) || 1);

        //페이징에 필요한 정보들
        const [cartoonList, setCartoonList] = useState();
        const [perPage, setPerPage] = useState();
        const [count, setCount] = useState();

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
            console.log('getList:', url);
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
            if (cartoonList) {
                for(const key in cartoonList) {
                    const i = cartoonList[key];
                    const date = common.dateFormat(i['date']);
                    newArr.push(
                        <tr key={key}>
                            <td><a href={`https://gall.dcinside.com/board/view/?id=cartoon&no=${i['id']}`} target='_blank' rel='noopener noreferrer'>{i['title']}</a></td>
                            <td>{date}</td>
                            <td>{i['recommend']}</td>
                        </tr>
                    )
                }
                return newArr;
            } else {
                return(
                    <tr>
                        <td colSpan='3'>없어요</td>
                    </tr>
                );
            }
        }

        //페이징 버튼 핸들러
        function pageHandler(e) {
            common.navigate(getUrl(e.target.value), getList);
        };

        return (
            <div className='List'>
                <table>
                    <thead>
                        <tr>
                            <th>title</th>
                            <th>date</th>
                            <th>rec</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderCartoonList()}
                    </tbody>
                </table>
                <div>
                    <Paging page={tempPage.current} perPage={perPage} count={count} pageBtn={10} handler={pageHandler}/>
                </div>
            </div>
        );
    }

    return (
        <div className='List'>
            <div>
                List<br/>
                {id==='a'?'유동':`아이디: ${id}`}<br/>
                닉네임: 수정<br/>
                <span>에피소드가 누락돼있나요? 아래에 작가 상세 보기에서 찾아보시던가 구글에 검색 ㄱㄱ</span><br/>
                <button>작가 상세 보기</button>
                <hr/>
                {prev? <Link to={`${prev}`}>목록으로 돌아가기</Link>: ''}
            </div>
            <List />
        </div>
    );
}

export default List;