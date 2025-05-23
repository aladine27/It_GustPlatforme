import { useState } from 'react'
import './App.css'
import Login from './pages/Login'
import Home from './pages/Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
function App() {
 

  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
        
    </>
  )
}

export default App
