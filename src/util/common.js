export function dateFormat(date){
    let d = new Date(date);
    let year = d.getFullYear();
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let hour = '' + d.getHours();
    let min = '' + d.getMinutes();
    if (month.length < 2)
        month = '0'+month;
    if (day.length < 2)
        day = '0'+day;
    if (hour.length < 2)
        hour = '0'+hour;
    if (min.length < 2)
        min = '0'+min;
    const days = ['일','월','화','수','목','금','토',];
    return [year, month, day].join('.')+' ('+days[d.getDay()]+'요일)';
}

export function paging(page, perPage, count, pageBtn, fnc) {
    console.log('paging');
    const pageGroup = Math.ceil(page / pageBtn);//현재 그룹
    const totalPage = Math.ceil(count / perPage);//전체 페이지 개수
    const totalGroup = Math.ceil(totalPage / pageBtn);//전체 그룹 개수

    const startPage = pageGroup * pageBtn - pageBtn + 1;
    let tempEnd = pageGroup * pageBtn;
    if(tempEnd > totalPage) tempEnd = totalPage;
    const endPage = tempEnd;

    const newArr = [];
    if (pageGroup > 1) {
        newArr.push(<button key='first' onClick={fnc} value={1}>&lt;&lt;</button>);
        newArr.push(<button key='prev' onClick={fnc} value={startPage-1}>&lt;</button>);
    } else {
        newArr.push(<button key='disabled_first' disabled>&lt;&lt;</button>);
        newArr.push(<button key='disabled_prev' disabled>&lt;</button>);
    }
    for (let i = startPage; i <= endPage; i++) {
        if (page === i) {
            newArr.push(<button key={i} disabled>{i}</button>);
        } else {
            newArr.push(<button key={i} onClick={fnc} value={i}>{i}</button>);
        }
    }
    if (pageGroup < totalGroup) {
        newArr.push(<button key='next' onClick={fnc} value={endPage+1}>&gt;</button>);
        newArr.push(<button key='last' onClick={fnc} value={totalPage}>&gt;&gt;</button>);
    } else {
        newArr.push(<button key='disabled_next' disabled>&gt;</button>);
        newArr.push(<button key='disabled_last' disabled>&gt;&gt;</button>);
    }
    return newArr;
}