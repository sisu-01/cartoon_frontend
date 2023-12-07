import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import * as common from '../util/common';

function Info() {
    console.log('######################한 번만');
    const initParam = new URLSearchParams(window.location.search);
    const id = initParam.get('id');
    const nickname = initParam.get('nickname');
    const prev = localStorage.getItem('prev');

    function List() {
        console.log('##List');

        //url 파라미터들
        const [searchParams] = useSearchParams();
        const page = Number(searchParams.get('page')) || 1;
        const tempSort = searchParams.get('sort') === 'true' || false;
        const tempCut = searchParams.get('cut') || false;

        //페이징에 필요한 정보들
        const [cartoonList, setCartoonList] = useState();
        const [perPage, setPerPage] = useState();
        const [count, setCount] = useState();

        const navigate = useNavigate();
    
        useEffect(() => { 
            getInfo();
        }, [searchParams]);

        async function getInfo() {
            let url = '';
            url += `http://localhost:4000`;
            url += `/info?page=${page}&id=${id}&nickname=${nickname}`;
            if (tempSort) {
                url += '&sort=true';
            }
            if (tempCut) {
                url += `&cut=${tempCut}`;
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
        function getUrl({ p = 1, s = tempSort, c = tempCut}) {
            let url = '';
            url += `/info?page=${p}&id=${id}&nickname=${nickname}`
            if (s) {
                url += '&sort=true';
            }
            if (c > 0) {
                console.log('c의 침입니다!@#', c);
                url += `&cut=${c}`;
            }
            return url;
        }
        function pageHandler(e) {
            console.log('pageHandler-------------------------------');
            navigate(getUrl({p: e.target.value}));
        };
        function Sort(props) {
            function SortHandler(checked) {
                navigate(getUrl({s: checked}));
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
                navigate(getUrl({c: cut}));
            }
            return (
                <div>
                    <select id='cut' onChange={({target: {value}}) => CutHandler(value)} value={tempCut}>
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
                    <Sort checked={tempSort} />
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
                    {common.paging(page, perPage, count, 5, pageHandler)}
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