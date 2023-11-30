import {Route, Routes} from 'react-router-dom';
import Cartoon from './routes/Cartoon';
import Home from './routes/Home';
import React from 'react';

function App() {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/cartoon' element={<Cartoon />} />
        </Routes>
    );
}

export default App;