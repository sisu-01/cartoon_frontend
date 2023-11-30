import React from 'react';
import {Link} from 'react-router-dom';

function Header() {
    return (
        <header>
            <Link to="/">home</Link>&nbsp;&nbsp;|&nbsp;&nbsp;
            <Link to="/cartoon">cartoon</Link>&nbsp;&nbsp;|&nbsp;&nbsp;
            <Link to="/writer">writer</Link>
            <hr/>
        </header>
    );
};

export default Header;