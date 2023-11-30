import React from 'react';
import {Link} from 'react-router-dom';

function Header() {
    return (
        <header>
            <Link to="/">home</Link>&nbsp;&nbsp;|&nbsp;&nbsp;
            <Link to="/cartoon">cartoon</Link>
            <hr/>
        </header>
    );
};

export default Header;