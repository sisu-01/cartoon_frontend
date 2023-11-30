import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

function Info() {
    const [cartoonList, setCartoonList] = useState();
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page') || 0;
    const id = searchParams.get('id');
    const nickname = searchParams.get('nickname');

    async function getInfo() {
        await fetch(`http://localhost:4000/info?page=${page}&id=${id}&nickname=${nickname}`)
        .then(response => response.json())
        .then(data => {
            setCartoonList(data.result);
        })
    }

    useEffect(()=> {
        getInfo();
    }, []);

    function getLoop() {
        const newArr = [];
        for(const key in cartoonList) {
            const i = cartoonList[key];
            newArr.push(
                <tr key={key}>
                    <td>{i['title']}</td>
                    <td>{i['date']}</td>
                    <td>{i['recommend']}</td>
                </tr>
            )
        }
        return newArr;
    }

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
                    {getLoop()}
                </tbody>
                </table>
            </div>
        </div>
    );
}

export default Info;