import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import POS from './pages/POS';

function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/products' element={<Products/>} />
        <Route path='/pos' element={<POS/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
