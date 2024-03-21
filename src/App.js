import React from 'react';
import {Route, Routes} from 'react-router-dom';

import AlertModal from './components/AlertModal';
import Home from './routes/Home';
import Cartoon from './routes/Cartoon';
import Writer from './routes/Writer';
import Info from './routes/Info';
import Series from './routes/Series';
import List from './routes/List';

function App() {
    return (
        <div>
            <AlertModal/>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/cartoon' element={<Cartoon />} />
                <Route path='/writer' element={<Writer />} />
                <Route path='/info' element={<Info />} />
                <Route path='/series' element={<Series />} />
                <Route path='/list' element={<List />} />
            </Routes>
        </div>
    );
}

export default App;