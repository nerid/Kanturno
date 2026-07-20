import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Admin } from './pages/Admin';
import { TV } from './pages/TV';

function App() {
  return (
    <BrowserRouter>
      <div className="bg-background min-h-screen text-cream font-mono relative">
        <div className="texture-overlay"></div>
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/tv" element={<TV />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
