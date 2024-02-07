import Form from 'react-bootstrap/Form';

/**
 * 개추 컷 이상 출력~
 * @param {number} value select 선택 값
 * @param {function} handler 클릭 핸들러
 */
function Cut(props) {
    return (
        <>
            <Form.Select
                id='recommend_cut'
                size='sm'
                onChange={({target: {value}}) => props.handler(value)}
                value={props.value}
            >
                <option value>0</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={250}>250</option>
                <option value={500}>500</option>
                <option value={1000}>1000</option>
            </Form.Select>
            <label htmlFor='recommend_cut'>최초 개수 몇 개 이상 따흐흑</label>
        </>
    );
}

export default Cut;