import { useState } from 'react'
import './App.css'
import Login from './pages/Login'
import Home from './pages/Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Employe from './pages/Employe'
import Evenement from './pages/Evenement'
import Projet from './pages/Projet'
import Tache from './pages/Tache'
import Document from './pages/Document'
import Conge from './pages/Conge'
import Recrutement from './pages/Recrutement'
import Frais from './pages/Frais'
import Profile from './pages/Profile'
import ResetPassword from './pages/ResetPassword'
import ExportPage from './components/ExportModal'
import { ToastContainer } from 'react-toastify'
import GithubRedirect from './pages/GithubRedirect'

function App() {
 

  return (
    <>
     <BrowserRouter>
      <Routes>
        
        <Route path="/login" element={<Login />} /> 
        <Route path="/resetPassword" element={<ResetPassword/>}/>
        <Route path="/" element={<Home />} />
        <Route path="/auth/github-redirect" element={<GithubRedirect />} />
        <Route path="/Dashboard" element={<Dashboard />} >
            <Route path="Employe" element={<Employe />} />
            <Route path="Evenement" element={<Evenement />} />
            <Route path="Projet" element={<Projet />} />
            <Route path="Tache" element={<Tache />} />
            <Route path="Document" element={<Document />} />
            <Route path="Conge" element={<Conge />} />
            <Route path="Recrutement" element={<Recrutement />} />
            <Route path="Frais" element={<Frais />} />
            <Route path="Profile" element={<Profile />} />
            <Route path="export/:entity" element={<ExportPage />} />
          
        </Route> 
        
        <Route/>
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={2000} />
        
    </>
  )
}

export default App
