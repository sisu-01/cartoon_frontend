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
        const [page, setPage] = useState();
        const [cartoonList, setCartoonList] = useState();
        const [perPage, setPerPage] = useState();
        const [count, setCount] = useState();
        const tempPage = Number(searchParams.get('page')) || 0;
        const navigate = useNavigate();
        
        //필터
        const [orderByRecommend, setOrderByRecommend] = useState(false);
        const [cut, setCut] = useState(0);

        async function getInfo() {
            console.log('getInfo2');
            let url = '';
            url += `http://172.30.1.70:4000/info${window.location.search}`;
            //개추 순 필터가 있다면>
            if (orderByRecommend) {
                url += '&개추순=true';
            }
            //개추 컷이 있다면
            if (cut > 0) {
                url += `&cut=${null}`;
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
    
        useEffect(()=> {
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
            if (orderByRecommend) {
                url += '&개추순=true';
            }
            //개추 컷이 있다면
            if (cut > 0) {
                url += `&cut=${null}`;
            }
            navigate(url);
        };

        function Order(props) {
            return (
                <div>
                    <input type='checkbox' id='order' checked={props.checked} onChange={({ target: { checked } }) => props.onChange(checked)} />
                    <label htmlFor='order'>개추순으로 정렬</label>
                </div>
            );
        }

        return (
            <div>
                <Order checked={orderByRecommend} onChange={setOrderByRecommend} />
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

export default Info2;