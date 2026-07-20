import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Admin } from './pages/Admin';
import { TV } from './pages/TV';

function App() {
  return (
    <BrowserRouter>
      <div className="bg-background min-h-screen text-cream font-mono texture-overlay">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/tv" element={<TV />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
