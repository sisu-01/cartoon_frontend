import React, {useEffect, useState} from 'react';

function Cartoon() {
    const [cartoonList, setCartoonList] = useState();

    async function getCartoon() {
        await fetch('http://localhost:4000/cartoon/0')
        .then(response => response.json())
        .then(data => {
            setCartoonList(data.result);
        })
    }

    useEffect(() => {
        getCartoon();
    }, []);

    function getLoop() {
        const newArr = [];
        for(const key in cartoonList) {
            const i = cartoonList[key];
            newArr.push(
                <tr key={key}>
                    <td>{i['id']}</td>
                    <td>{i['title']}</td>
                    <td>{i['writer_nickname']}</td>
                    <td>{i['date']}</td>
                    <td>{i['recommend']}</td>
                </tr>
            )
        }
        return newArr;
    }

    return (
        <div className='Cartoon'>
            <table>
                <thead>
                    <tr>
                        <th>id</th>
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