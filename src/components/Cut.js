/**
 * 개추 컷 이상 출력~
 * @param {number} value select 선택 값
 * @param {function} handler 클릭 핸들러
 */
function Cut(props) {
    return (
        <div>
            <select id='cut' onChange={({target: {value}}) => props.handler(value)} value={props.value}>
                <option value>추컷</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={250}>250</option>
                <option value={500}>500</option>
                <option value={1000}>1000</option>
            </select>
            <label htmlFor='cut'>개추컷</label>
        </div>
    );
}

export default Cut;