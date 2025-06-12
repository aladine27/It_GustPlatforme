import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const GoogleRedirect = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get("token");
    const userEncoded = searchParams.get("user");

    console.log("Redirect params:", { token, userEncoded });

    if (token && userEncoded) {
      try {
        const user = JSON.parse(atob(decodeURIComponent(userEncoded)));

        // ✅ Stockage correct du token et de l'utilisateur
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        dispatch({
          type: "auth/googleCallback/fulfilled",
          payload: { data: user, token }, // tu peux passer le token ici aussi si tu veux
        });

        toast.success("Connexion Google réussie !");
        navigate("/dashboard");
      } catch (err) {
        console.error("Failed to decode user data:", err);
        toast.error("Erreur de décodage utilisateur");
        navigate("/login");
      }
    } else {
      console.warn("Missing token or user info");
      toast.error("Paramètres manquants");
      navigate("/login");
    }
  }, [searchParams, dispatch, navigate]);

  return <p>Redirection en cours...</p>;
};

export default GoogleRedirect;
