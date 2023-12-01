import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import * as common from '../util/common';

function Cartoon() {
    const [page, setPage] = useState();
    const [cartoonList, setCartoonList] = useState();
    const [perPage, setPerPage] = useState();
    const [count, setCount] = useState();
    const [searchParams] = useSearchParams();
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
    //page, perPage, count, pageBtn;
    function renderPageButton() {
        console.log('renderPageButton');
        const pageBtn = 9;

        const pageGroup = Math.ceil(page / pageBtn);//현재 그룹
        const totalPage = Math.ceil(count / perPage);//전체 페이지 개수
        const totalGroup = Math.ceil(totalPage / pageBtn);//전체 그룹 개수

        const startPage = pageGroup * pageBtn - pageBtn + 1;
        let tempEnd = pageGroup * pageBtn;
        if(tempEnd > totalPage) tempEnd = totalPage;
        const endPage = tempEnd;

        const newArr = [];
        if (pageGroup > 1) {
            newArr.push(<button key='first' onClick={pageHandler} value={1}>&lt;&lt;</button>);
            newArr.push(<button key='prev' onClick={pageHandler} value={startPage-1}>&lt;</button>);
        } else {
            newArr.push(<button key='disabled_first' disabled>&lt;&lt;</button>);
            newArr.push(<button key='disabled_prev' disabled>&lt;</button>);
        }
        for (let i = startPage; i <= endPage; i++) {
            if (page === i) {
                newArr.push(<button key={i} disabled>{i}</button>);
            } else {
                newArr.push(<button key={i} onClick={pageHandler} value={i}>{i}</button>);
            }
        }
        if (pageGroup < totalGroup) {
            newArr.push(<button key='next' onClick={pageHandler} value={endPage+1}>&gt;</button>);
            newArr.push(<button key='last' onClick={pageHandler} value={totalPage}>&gt;&gt;</button>);
        } else {
            newArr.push(<button key='disabled_next' disabled>&gt;</button>);
            newArr.push(<button key='disabled_last' disabled>&gt;&gt;</button>);
        }
        return newArr;
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
                {renderPageButton()}
            </div>
        </div>
    );
}

export default Cartoon;