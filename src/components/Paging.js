import Pagination from 'react-bootstrap/Pagination';

/**
 * @param {Number} page 현재 페이지
 * @param {Number} perPage 한 페이지에 표시될 게시글 수
 * @param {Number} count 전체 게시글 수
 * @param {Number} pageBtn 페이징 버튼 수
 * @param {function} handler 클릭 핸들러
 */
function Paging(props) {
    console.log('paging');
    const { page, perPage, count, pageBtn, handler } = props;
    const pageGroup = Math.ceil(page / pageBtn);//현재 그룹
    const totalPage = Math.ceil(count / perPage);//전체 페이지 개수
    const totalGroup = Math.ceil(totalPage / pageBtn);//전체 그룹 개수

    const startPage = pageGroup * pageBtn - pageBtn + 1;
    let tempEnd = pageGroup * pageBtn;
    if(tempEnd > totalPage) tempEnd = totalPage;
    const endPage = tempEnd;

    const newArr = [];
    if (pageGroup > 1) {
        newArr.push(<Pagination.First key='first' onClick={() => handler(1)} />);
        newArr.push(<Pagination.Prev key='prev' onClick={() => handler(startPage-1)} />);
    } else {
        newArr.push(<Pagination.First key='disabled_first' disabled />);
        newArr.push(<Pagination.Prev key='disabled_prev' disabled />);
    }
    for (let i = startPage; i <= endPage; i++) {
        if (page === i) {
            newArr.push(<Pagination.Item key={i} active>{i}</Pagination.Item>);
        } else {
            newArr.push(<Pagination.Item key={i} onClick={() => handler(i)}>{i}</Pagination.Item>);
        }
    }
    if (pageGroup < totalGroup) {
        newArr.push(<Pagination.Next key='next' onClick={() => handler(endPage+1)} />);
        newArr.push(<Pagination.Last key='last' onClick={() => handler(totalPage)} />);
    } else {
        newArr.push(<Pagination.Next key='disabled_next' disabled />);
        newArr.push(<Pagination.Last key='disabled_last' disabled />);
    }
    return (
        <Pagination size='sm' className='justify-content-center'>{newArr}</Pagination>
    );
}

export default Paging;