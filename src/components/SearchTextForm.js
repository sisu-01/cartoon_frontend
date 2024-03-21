import React, { useState } from 'react';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

function SearchTextForm(props) {
    const [tempText, setTempText] = useState(props.default);

    //작가 검색 시간 체크
    let searchTimer;
    const searchIntervalTime = 500; // 0.5초
    function clearTime() {
        clearTimeout(searchTimer);
    }
    function setTime() {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {props.SearchHandler(tempText)}, searchIntervalTime);
    }

    return (
        <InputGroup className='my-3'>
            <InputGroup.Text id='searchTextForm'>{props.label}</InputGroup.Text>
            <Form.Control
                value={tempText}
                aria-label='search'
                aria-describedby='search-text-form'
                onChange={(e) => setTempText(e.target.value)}
                onKeyDown={() => clearTime()}
                onKeyUp={() => setTime()}
            />
        </InputGroup>
    );
}

export default SearchTextForm;