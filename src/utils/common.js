/**
 * String 날짜 형식을 예쁘게 만들어줘요~
 * @param {String} date 대충 날짜 형식 보내라잉
 * @param {String} type default, short
 * @returns {String} 예쁜 날짜
 */
export function dateFormat(date, type='default'){
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

    if (type === 'short') {
        return [year, month].join('.');
    } else {
        return [year, month, day].join('.')+' ('+days[d.getDay()]+'요일)';
    }
}

/**
 * 날짜가 14일 이내인지 아닌지 알아보아요~
 * @param {String} date 날짜 형식의 문자열
 * @returns {Boolean} 현재 날짜로부터 15일 이내면 true, 아니면 false
 */
export function isDateWithin14Days(date) {
    const cartoonDate = new Date(date);
    cartoonDate.setHours(0, 0, 0, 0);
    
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const timeDiff = cartoonDate.getTime() - currentDate.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);
    console.log(daysDiff);
    return daysDiff >= -14;
}

/**
 * 나만의 네비게이터 ㅎㅎ
 * @param {String} url history에 추가할 url
 * @param {function} callback 목록 불러올 api
 */
export function navigate(url, callback) {
    window.history.pushState(null, null, url);
    callback();
}

/**
 * 
 * @param {useRef} page 페이지
 * @param {useRef} sort 개추순
 * @param {useRef} cut 개추컷
 * @param {function} callback 목록 api
 */
export function popNavigate({page = 1,sort = false,cut = false,callback = null}) {
    const popParams = new URLSearchParams(window.location.search);
    page.current = Number(popParams.get('page')) || 1;
    if (sort) {
        sort.current = popParams.get('sort') === 'true' || false;
    }
    if (cut) {
        cut.current = popParams.get('cut') || false;
    }
    callback();
}