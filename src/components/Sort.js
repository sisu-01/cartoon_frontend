import Form from 'react-bootstrap/Form';

/**
 * 개추 순으로 정렬 체크박스다~
 * @param {boolean} checked 체크박스 선택 유무
 * @param {function} handler 체크박스 클릭 핸들러
 */
function Sort(props) {
    return (
        <Form.Check
            type='switch'
            id={`sortt`}
            checked={props.checked}
            onChange={({ target: { checked } }) => props.handler(checked)}
            label={`개추순으로 정렬`}
        />
    );
}

export default Sort