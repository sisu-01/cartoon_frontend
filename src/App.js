import React from 'react';
import {Route, Routes} from 'react-router-dom';

import Home from './routes/Home';
import Cartoon from './routes/Cartoon';
import Writer from './routes/Writer';


function App() {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/cartoon' element={<Cartoon />} />
            <Route path='/writer' element={<Writer />} />
        </Routes>
    );
}

export default App;