import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';

/**
 * 개추 순으로 정렬 체크박스다~
 * @param {boolean} checked 체크박스 선택 유무
 * @param {function} handler 체크박스 클릭 핸들러
 */
function Sort(props) {
    const [tempCheck, setTempCheck] = useState(props.checked || false);

    function checkHandler() {
        const newCheck = !tempCheck;
        setTempCheck(newCheck);
        props.handler(newCheck);
    }

    return (
        <Form.Check
            type='switch'
            id={`sortt`}
            checked={tempCheck}
            onChange={checkHandler}
            label={`개추순으로 정렬`}
        />
    );
}

export default Sort