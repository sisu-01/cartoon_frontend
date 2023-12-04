import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import * as common from '../util/common';

function Info() {
    console.log('######################한 번만');
    const initUrl = new URL(window.location.href);
    const prev = initUrl.searchParams.get('prev') || '';
    const id = initUrl.searchParams.get('id');
    const nickname = initUrl.searchParams.get('nickname');

    //get param prev 제거
    //수정 새로고침 문제
    initUrl.searchParams.delete('prev');
    window.history.pushState(null, null, initUrl.href);

    function Test() {
        console.log('##Test');

        //url 파라미터들
        const [searchParams] = useSearchParams();
        //수정 useRef 필요하냐? 아닌것 같은데..
        //그냥 Test가 2번 랜더링 되는걸 막으면 useRef 필요없이 그냥 const 박아도 된잖아.
        const page = useRef(Number(searchParams.get('page')) || 1);
        const tempSort = useRef(searchParams.get('sort') === 'true' || false);
        const tempCut = useRef(searchParams.get('cut') || false);

        //페이징에 필요한 정보들
        const [cartoonList, setCartoonList] = useState();
        const [perPage, setPerPage] = useState();
        const [count, setCount] = useState();

        const navigate = useNavigate();
    
        useEffect(() => { 
            page.current = Number(searchParams.get('page')) || 1;
            tempSort.current = searchParams.get('sort') === 'true' || false;
            tempCut.current = searchParams.get('cut') || false;
            getInfo();
        }, [searchParams]);

        async function getInfo() {
            let url = '';
            url += `http://localhost:4000`;
            url += `/info?page=${page.current}&id=${id}&nickname=${nickname}`;
            if (tempSort.current) {
                url += '&sort=true';
            }
            if (tempCut.current) {
                url += `&cut=${tempCut.current}`;
            }
            console.log(url);
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
        function getUrl(p = 1) {
            let url = '';
            url += `/info?page=${p}&id=${id}&nickname=${nickname}`
            if (tempSort.current) {
                url += '&sort=true';
            }
            if (tempCut.current) {
                url += `&cut=${tempCut.current}`;
            }
            return url;
        }
        function pageHandler(e) {
            console.log('pageHandler-------------------------------');
            page.current = e.target.value;
            navigate(getUrl(page.current));
        };
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
            <div className='Test'>
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
                    {common.paging(page.current, perPage, count, 5, pageHandler)}
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
            <Test />
        </div>
    );
}

export default Info;