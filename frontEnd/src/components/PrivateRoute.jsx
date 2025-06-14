import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ rolesAllowed, children }) => {
  const { CurrentUser } = useSelector((state) => state.user);

  console.log("🔐 [PrivateRoute] CurrentUser:", CurrentUser);
  const role = CurrentUser?.role || CurrentUser?.user?.role;
  console.log("🧠 [PrivateRoute] Rôle détecté:", role);
  console.log("🎯 [PrivateRoute] Roles autorisés pour cette route:", rolesAllowed);

  if (!CurrentUser) {
    console.warn("⛔ Aucun utilisateur connecté. Redirection vers /login.");
    return <Navigate to="/login" />;
  }

  if (rolesAllowed && !rolesAllowed.includes(role)) {
    console.warn(`🚫 Accès refusé pour le rôle : ${role}`);
    return <div>🚫 Accès refusé</div>;
  }

  console.log("✅ Accès autorisé !");
  return children ? children : <Outlet />;
};

export default PrivateRoute;
