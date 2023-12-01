import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import * as common from '../util/common';

function Cartoon() {
    const [cartoonList, setCartoonList] = useState();
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page') || 0;

    function getCartoon() {
        fetch(`http://localhost:4000/cartoon?page=${page}`)
        .then(response => response.json())
        .then(data => {
            if(data['ok']){
                setCartoonList(data['list']);
            }else{
                setCartoonList();
            }
        })
    }

    useEffect(() => {
        getCartoon();
    }, []);

    function getLoop() {
        const newArr = [];
        if(cartoonList){
            for(const key in cartoonList) {
                const i = cartoonList[key];
                const date = common.dateFormat(i['date']);
                newArr.push(
                    <tr key={key}>
                        <td><a href={`https://gall.dcinside.com/board/view/?id=cartoon&no=${i['id']}`} target='blank'>{i['title']}</a></td>
                        <td><Link to={`/info?id=${i['writer_id']}&nickname=${i['writer_nickname']}`}>{i['writer_nickname']}</Link></td>
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
                    {getLoop()}
                </tbody>
            </table>
        </div>
    );
}

export default Cartoon;