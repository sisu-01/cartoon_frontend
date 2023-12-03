import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation , useSearchParams } from 'react-router-dom';
import * as common from '../util/common';

function Info2() {
    console.log('######################한 번만');
    const initParam = new URLSearchParams(window.location.search);
    const id = initParam.get('id');
    const nickname = initParam.get('nickname');
    const result = '/cartoon/원래거';

    function Test() {
        console.log('##Test');
        const [searchParams] = useSearchParams();
        const tempPage = Number(searchParams.get('page')) || 1;
        const tempOrder = searchParams.get('order') === 'true' || false;
        const tempCut = searchParams.get('cut') || false;

        const [page, setPage] = useState();
        const [cartoonList, setCartoonList] = useState();
        const [perPage, setPerPage] = useState();
        const [count, setCount] = useState();
        const navigate = useNavigate();
        
        //필터
        const [cut, setCut] = useState();

        async function getInfo() {
            let url = '';
            url += `http://localhost:4000/info`;
            url += `?page=${tempPage}&id=${id}&nickname=${nickname}`;
            //개추 순 필터가 있다면>
            if (tempOrder) {
                url += '&order=true';
            }
            //개추 컷이 있다면
            if (tempCut > 0) {
                url += `&cut=${tempCut}`;
            }
            console.log(url);
            fetch(url)
            .then(response => response.json())
            .then(data => {
                if(data['ok']){
                    setCartoonList(data['list']);
                    setPage(data['page']);
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
            console.log('pageHandler');
            const page = e.target.value;

            let url = '';
            url += `/info2?page=${page}&id=${id}&nickname=${nickname}`

            //개추 순 필터가 있다면>
            if (tempOrder) {
                url += '&order=true';
            }
            //개추 컷이 있다면
            if (tempCut > 0) {
                url += `&cut=${tempCut}`;
            }
            navigate(url);
        };

        function Order(props) {
            function OrderHandler(checked) {
                let url = '';
                url += `/info2?page=1&id=${id}&nickname=${nickname}`

                //개추 순 필터가 있다면>
                if (checked) {
                    url += '&order=true';
                }
                //개추 컷이 있다면
                if (tempCut > 0) {
                    url += `&cut=${tempCut}`;
                }
                navigate(url);
            }
            return (
                <div>
                    <input type='checkbox' id='order' checked={props.checked} onChange={({ target: { checked } }) => OrderHandler(checked)} />
                    <label htmlFor='order'>개추순으로 정렬</label>
                </div>
            );
        }

        function Cut(props) {
            function CutHandler(cut) {
                let url = '';
                url += `/info2?page=1&id=${id}&nickname=${nickname}`

                //개추 순 필터가 있다면>
                if (tempOrder) {
                    url += '&order=true';
                }
                //개추 컷이 있다면
                if (cut > 0) {
                    url += `&cut=${cut}`;
                }
                navigate(url);
            }
            return (
                <div>
                    <select id='cut' onChange={({target: {value}}) => CutHandler(value)}>
                        <option value='0'>0</option>
                        <option value='50'>50</option>
                        <option value='100'>100</option>
                        <option value='150'>150</option>
                        <option value='200'>200</option>
                        <option value='250'>250</option>
                    </select>
                    <label htmlFor='cut'>개추컷</label>
                </div>
            );
        }

        return (
            <div>
                <Order checked={tempOrder} />
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
                    {common.paging(page, perPage, count, 9, pageHandler)}
                </div>
            </div>
        );
    }

    return (
        <div className='Info2'>
            Info2<br/>
            {id==='a'?'유동':`아이디: ${id}`}<br/>
            닉네임: {nickname}
            <hr/>
            <button>{result}</button>
            <Test />
        </div>
    );
}

export default Info2;