
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
        newArr.push(<button key='first' onClick={handler} value={1}>&lt;&lt;</button>);
        newArr.push(<button key='prev' onClick={handler} value={startPage-1}>&lt;</button>);
    } else {
        newArr.push(<button key='disabled_first' disabled>&lt;&lt;</button>);
        newArr.push(<button key='disabled_prev' disabled>&lt;</button>);
    }
    for (let i = startPage; i <= endPage; i++) {
        if (page === i) {
            newArr.push(<button key={i} disabled>{i}</button>);
        } else {
            newArr.push(<button key={i} onClick={handler} value={i}>{i}</button>);
        }
    }
    if (pageGroup < totalGroup) {
        newArr.push(<button key='next' onClick={handler} value={endPage+1}>&gt;</button>);
        newArr.push(<button key='last' onClick={handler} value={totalPage}>&gt;&gt;</button>);
    } else {
        newArr.push(<button key='disabled_next' disabled>&gt;</button>);
        newArr.push(<button key='disabled_last' disabled>&gt;&gt;</button>);
    }
    return newArr;
}

export default Paging;