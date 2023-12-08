/**
 * String 날짜 형식을 예쁘게 만들어줘요~
 * @param {String} date 대충 날짜 형식 보내라잉
 * @returns {String} 예쁜 날짜
 */
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

/**
 * 나만의 네비게이터 ㅎㅎ
 * @param {String} url history에 추가할 url
 * @param {function} callback 목록 불러올 api
 */
export function navigate(url, callback) {
    window.history.pushState(null, null, url);
    callback();
}