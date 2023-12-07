import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import * as common from '../utils/common';

function Cartoon() {
    const [page, setPage] = useState();
    const [cartoonList, setCartoonList] = useState();
    const [perPage, setPerPage] = useState();
    const [count, setCount] = useState();
    const [searchParams] = useSearchParams();
    localStorage.setItem('prev', window.location.search);
    const tempPage = Number(searchParams.get('page')) || 0;
    const navigate = useNavigate();

    function getCartoon() {
        console.log('getCartoon');
        fetch(`http://localhost:4000/cartoon?page=${tempPage}`)
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

    useEffect(() => {
        getCartoon();
    }, [searchParams]);

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
    function pageHandler(e) {
        console.log('pageHandler');
        const value = e.target.value;
        navigate(`/cartoon?page=${value}`);
    };
    return (
        <div className='Cartoon'>
            <div>
                <ol>
                    <li>recommend &lt;= n;</li>
                    <li>ordery by recommend; or order by id;</li>
                </ol>
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
                {common.paging(page, perPage, count, 9, pageHandler)}
            </div>
        </div>
    );
}

export default Cartoon;