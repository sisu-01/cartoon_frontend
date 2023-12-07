import React, { useEffect, useRef,useState } from 'react';
import { Link } from 'react-router-dom';
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
    localStorage.setItem('prev', window.location.search);

    useEffect(() => {
        getCartoon();
    }, []);

    //네비게이터에 쓸 url 제조기
    function getUrl(p=1) {
        let url = '';
        url += `/cartoon?page=${p}`
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
        getCartoon();
    }

    //브라우저 뒤로가기, 앞으로가기 감지
    window.onpopstate = () => {
        const popParams = new URLSearchParams(window.location.search);
        tempPage.current = Number(popParams.get('page')) || 1;
        tempSort.current = popParams.get('sort') === 'true' || false;
        tempCut.current = popParams.get('cut') || false;
        getCartoon();
    }

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
                        <td><a href={`https://gall.dcinside.com/board/view/?id=cartoon&no=${i['id']}`} target='blank'>{i['title']}</a></td>
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

    //페이징 버튼에 들어갈 함수
    function pageHandler(e) {
        console.log('pageHandler-------------------------------');
        tempPage.current = Number(e.target.value);

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
        <div className='Cartoon'>
            <div>
                <Sort checked={tempSort.current} />
                <Cut />
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
            <div>
                {common.paging(tempPage.current, perPage, count, 10, pageHandler)}
            </div>
        </div>
    );
}

export default Cartoon;