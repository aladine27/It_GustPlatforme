import './App.css';
import Login from './pages/Login';
import Home from './pages/Home';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Employe from './pages/Employe';
import Evenement from './pages/Evenement';
import Projet from './pages/Projet';


import RecrutementIndex from './pages/Recrutement/RecrutementIndex';


import Profile from './pages/Profile';
import ResetPassword from './pages/ResetPassword';
import ExportPage from './components/ExportModal';
import { ToastContainer } from 'react-toastify';
import GithubRedirect from './pages/GithubRedirect';
import GoogleRedirect from './pages/GoogleRedirect';
import PrivateRoute from './components/PrivateRoute';
import { useSelector } from 'react-redux';
import AdminDashboard from './pages/AdminDashboard';

import "react-toastify/dist/ReactToastify.css";
import Conge from './pages/Conge/Conge';
import CongeIndex from './pages/Conge/CongeIndex';
import CongeEmploye from './pages/Conge/CongeEmploye';
import CongeHistory from './pages/Conge/CongeHistory';
import DocumentIndex from './pages/Documents/DocumentIndex';
import DocumentPersonnalisationPage from './pages/Documents/DocumentPersonnalisationPage';
import ProjectSprintIndex from './pages/Tache/ProjectSprintIndex';
function App() {
  const { CurrentUser } = useSelector((state) => state.user);
  const role = CurrentUser?.role || CurrentUser?.user?.role;
  
 

  // Redirection dynamique initiale selon le rôle
  const getInitialRedirect = () => {
    switch (role) {
      case 'Admin':
        return 'employe';
      case 'Manager':
        return 'projet';
      case 'Rh':
        return 'evenement';
      case 'Employe':
        return 'tache';
      default:
        return 'profile';
    }
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
       
          <Route path="/login" element={<Login />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/google-redirect" element={<GoogleRedirect />} />
          <Route path="/" element={<Home />} />
          <Route path="/auth/github-redirect" element={<GithubRedirect />} />

          <Route
            path="/dashboard"
            element={<PrivateRoute><Dashboard /></PrivateRoute>}
          >
            <Route index element={<Navigate to={getInitialRedirect()} replace />} />

            {/* Employé (Admin only) */}
            <Route element={<PrivateRoute rolesAllowed={["Admin"]} />}>
              <Route path="adminDashboard" element={<AdminDashboard />} /> 
              <Route path="employe" element={<Employe />} />
            </Route>

            {/* Projet + Tache : Admin + Manager + Employe */}
            <Route element={<PrivateRoute rolesAllowed={["Admin", "Manager", "Employe"]} />}>
              <Route path="projet" element={<Projet />} />
              <Route path="tache" element={<ProjectSprintIndex />} />
              <Route path="tache/:projectId" element={<ProjectSprintIndex />} />
            </Route>

            {/* Recrutement : Admin + Rh */}
            <Route element={<PrivateRoute rolesAllowed={["Admin", "Rh"]} />}>
              <Route path="recrutement" element={<RecrutementIndex />} />
            </Route>

            {/* Événement, Document, Congé, Frais : Admin + Rh + Manager + Employe */}
            <Route element={<PrivateRoute rolesAllowed={["Admin", "Rh", "Manager", "Employe"]} />}>
              <Route path="evenement" element={<Evenement />} />
              <Route path="document" element={<DocumentIndex />} />
              <Route path="document/personnaliser/:id" element={<DocumentPersonnalisationPage />}/>
              <Route path="congeIndex" element={<Conge />} />
              <Route path="conge" element={<CongeIndex />} />
              <Route path="employee/Conge" element={<CongeEmploye />} />
              <Route path="conge/history" element={<CongeHistory />} />
              <Route path="sprints" element={<ProjectSprintIndex />} />
            </Route>

           
            <Route path="profile" element={<Profile />} />

           
            <Route path="export/:entity" element={<ExportPage />} />
          </Route>

        </Routes>
      </BrowserRouter>

      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default App;
