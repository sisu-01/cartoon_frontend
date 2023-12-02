import React from 'react';
import {Route, Routes} from 'react-router-dom';

import Home from './routes/Home';
import Cartoon from './routes/Cartoon';
import Writer from './routes/Writer';
import Info from './routes/Info';
import Info2 from './routes/Info2';


function App() {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/cartoon' element={<Cartoon />} />
            <Route path='/writer' element={<Writer />} />
            <Route path='/info' element={<Info />} />
            <Route path='/info2' element={<Info2 />} />
        </Routes>
    );
}

export default App;