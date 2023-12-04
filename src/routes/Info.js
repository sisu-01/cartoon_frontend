import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as common from '../util/common';

function Info() {
    console.log('######################한 번만');
    const initParam = new URLSearchParams(window.location.search);
    const id = initParam.get('id');
    const nickname = initParam.get('nickname');
    const result = '/cartoon/원래거';

    function Test() {
        console.log('##Test');

        //url 파라미터들
        const [searchParams] = useSearchParams();
        const page = useRef(Number(searchParams.get('page')) || 1);
        const tempSort = useRef(searchParams.get('sort') === 'true' || false);
        const tempCut = useRef(searchParams.get('cut') || false);

        //페이징에 필요한 정보들
        const [cartoonList, setCartoonList] = useState();
        const [perPage, setPerPage] = useState();
        const [count, setCount] = useState();

        const navigate = useNavigate();

        async function getInfo() {
            let url = '';
            url += `http://localhost:4000/info`;
            url += `?page=${page.current}&id=${id}&nickname=${nickname}`;
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
    
        useEffect(() => { 
            page.current = Number(searchParams.get('page')) || 1;
            tempSort.current = searchParams.get('sort') === 'true' || false;
            tempCut.current = searchParams.get('cut') || false;
            getInfo();
        }, [searchParams]);
    
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
    
        function pageHandler(e) {
            console.log('pageHandler-------------------------------');
            const page = e.target.value;

            let url = '';
            url += `/info?page=${page}&id=${id}&nickname=${nickname}`
            if (tempSort.current) {
                url += '&sort=true';
            }
            if (tempCut.current) {
                url += `&cut=${tempCut.current}`;
            }
            navigate(url);
        };

        function Sort(props) {
            function SortHandler(checked) {
                let url = '';
                url += `/info?page=1&id=${id}&nickname=${nickname}`
                if (checked) {
                    url += '&sort=true';
                }
                if (tempCut.current) {
                    url += `&cut=${tempCut.current}`;
                }
                navigate(url);
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
                console.log('cut', cut);
                let url = '';
                url += `/info?page=1&id=${id}&nickname=${nickname}`
                if (tempSort.current) {
                    url += '&sort=true';
                }
                if (cut > 0) {
                    url += `&cut=${cut}`;
                }
                navigate(url);
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
            <div>
                <Sort checked={tempSort.current} />
                <Cut />
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
            Info<br/>
            {id==='a'?'유동':`아이디: ${id}`}<br/>
            닉네임: {nickname}
            <hr/>
            <button>{result}</button>
            <Test />
        </div>
    );
}

export default Info;