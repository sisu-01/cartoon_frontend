/**
 * 개추 순으로 정렬 체크박스다~
 * @param {boolean} checked 체크박스 선택 유무
 * @param {function} handler 체크박스 클릭 핸들러
 */
function Sort(props) {
    return (
        <div>
            <input type='checkbox' id='sort' checked={props.checked} onChange={({ target: { checked } }) => props.handler(checked)} />
            <label htmlFor='sort'>개추순으로 정렬</label>
        </div>
    );
}

export default Sort