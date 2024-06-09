import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from "./components/Main.jsx";
import About from "./components/About.jsx";
// import Charts from "./components/Chart.jsx";
import NavBar from "./components/NavBar.jsx";
import './App.css'
import './index.css'
import rosyheaderimage from './assets/rosy_header_logo.png';

function App() {
    return (
        <BrowserRouter>
            <div>
                {/* Top banner */}
                <div className="flex justify-start">
                    <div className="svg-container">
                        <img src={rosyheaderimage} alt="Rosy Economix" />
                    </div>
                    <header className="top-0 z-50">
                        <NavBar />
                    </header>
                </div>
                <div className="text-black mt-56 pl-4 bg-white min-h-screen w-full">
                    <Routes>
                        <Route path="/" element={<Main />} />
                        {/*<Route path="/charts" element={<Charts />} />*/}
                        <Route path="/about" element={<About />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;