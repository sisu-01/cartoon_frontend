import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as common from '../util/common';

function Info() {
    const [page, setPage] = useState();
    const [cartoonList, setCartoonList] = useState();
    const [perPage, setPerPage] = useState();
    const [count, setCount] = useState();
    const [searchParams] = useSearchParams();
    const tempPage = Number(searchParams.get('page')) || 0;
    const id = searchParams.get('id');
    const nickname = searchParams.get('nickname');
    const navigate = useNavigate();

    async function getInfo() {
        console.log('getInfo');
        fetch(`http://172.30.1.70:4000/info?page=${tempPage}&id=${id}&nickname=${nickname}`)
        .then(response => response.json())
        .then(data => {
            if(data['ok']){
                setCartoonList(data['list']);
                setPage(data['page']);
                setPerPage(data['perPage']);
                setCount(data['count']);
            }else{
                setCartoonList();
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
        const value = e.target.value;
        navigate(`/info?page=${value}&id=${id}&nickname=${nickname}`);
    };

    return (
        <div className='Info'>
            Info<br/>
            {id==='a'?'유동':`아이디: ${id}`}<br/>
            닉네임: {nickname}
            <hr/>
            <div>
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
        </div>
    );
}

export default Info;