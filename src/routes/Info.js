import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as common from '../util/common';

function Info() {
    console.log('########최초 한 번만 렌더 Info');
    const initParam = new URLSearchParams(window.location.search);
    const id = initParam.get('id');
    const nickname = initParam.get('nickname');
    const prev = localStorage.getItem('prev');

    //만화 목록이랑 페이징 들어갈 컴포넌트
    function List() {
        console.log('###List');

        //url 파라미터들
        const searchParams = new URLSearchParams(window.location.search);
        const tempPage = useRef(Number(searchParams.get('page')) || 1);
        const tempSort = useRef(searchParams.get('sort') === 'true' || false);
        const tempCut = useRef(searchParams.get('cut') || false);

        //페이징에 필요한 정보들
        const [cartoonList, setCartoonList] = useState();
        const [perPage, setPerPage] = useState();
        const [count, setCount] = useState();

        //최초 실행
        useEffect(() => { 
            getInfo();
        }, []);

        //네비게이터에 쓸 url 제조기
        function getUrl(p=1) {
            let url = '';
            url += `/info?page=${p}&id=${id}&nickname=${nickname}`
            if (tempSort.current) {
                url += '&sort=true';
            }
            if (tempCut.current > 0) {
                url += `&cut=${tempCut.current}`;
            }
            return url;
        }

        //나만의 네비게이터
        function navigate(url) {
            window.history.pushState(null, null, url);
            getInfo();
        }

        //브라우저 뒤로가기, 앞으로가기 감지
        window.onpopstate = () => {
            const popParams = new URLSearchParams(window.location.search);
            tempPage.current = Number(popParams.get('page')) || 1;
            tempSort.current = popParams.get('sort') === 'true' || false;
            tempCut.current = popParams.get('cut') || false;
            getInfo();
        }

        //목록 가져오는 api
        function getInfo() {
            let url = '';
            url += `http://localhost:4000`;
            url += `/info?page=${tempPage.current}&id=${id}&nickname=${nickname}`;
            if (tempSort.current) {
                url += '&sort=true';
            }
            if (tempCut.current) {
                url += `&cut=${tempCut.current}`;
            }
            console.log('getInfo:', url);
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
                            <td><a href={`https://gall.dcinside.com/board/view/?id=cartoon&no=${i['id']}`} target='blank'>{i['title']}</a></td>
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

        //페이징 버튼에 들어갈 함수
        function pageHandler(e) {
            console.log('pageHandler-------------------------------');
            tempPage.current = e.target.value;

            navigate(getUrl(tempPage.current));
        };

        //개추순으로 정렬 컴포넌트
        function Sort(props) {
            function SortHandler(checked) {
                tempSort.current = checked;
                navigate(getUrl());
            }
            return (
                <div>
                    <input type='checkbox' id='sort' checked={props.checked} onChange={({ target: { checked } }) => SortHandler(checked)} />
                    <label htmlFor='sort'>개추순으로 정렬</label>
                </div>
            );
        }

        //개추 최소 컷 컴포넌트
        function Cut() {
            function CutHandler(cut) {
                tempCut.current = cut;
                navigate(getUrl());
            }
            return (
                <div>
                    <select id='cut' onChange={({target: {value}}) => CutHandler(value)} value={tempCut.current}>
                        <option value>추컷</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                        <option value={250}>250</option>
                        <option value={500}>500</option>
                        <option value={1000}>1000</option>
                    </select>
                    <label htmlFor='cut'>개추컷</label>
                </div>
            );
        }

        return (
            <div className='List'>
                <div>
                    <Sort checked={tempSort.current} />
                    <Cut />
                </div>
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
                    {common.paging(tempPage.current, perPage, count, 5, pageHandler)}
                </div>
            </div>
        );
    }

    return (
        <div className='Info'>
            <div>
                Info<br/>
                {id==='a'?'유동':`아이디: ${id}`}<br/>
                닉네임: {nickname}
                <hr/>
                <Link to={`/cartoon${prev}`}>/cartoon{prev}</Link>
            </div>
            <List />
        </div>
    );
}

export default Info;