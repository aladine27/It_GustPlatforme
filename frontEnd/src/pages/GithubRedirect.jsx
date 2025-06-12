// GithubRedirect.jsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const GithubRedirect = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get("token");
    const userEncoded = searchParams.get("user");

    if (token && userEncoded) {
      try {
        const user = JSON.parse(atob(userEncoded));

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        dispatch({
          type: "auth/githubCallback/fulfilled",
          payload: { data: user }
        });

        toast.success("Connexion GitHub réussie !");
        navigate("/dashboard");
      } catch (err) {
        toast.error("Erreur de décodage utilisateur");
        navigate("/login");
      }
    } else {
      toast.error("Paramètres manquants");
      navigate("/login");
    }
  }, [searchParams, dispatch, navigate]);

  return <p>Redirection en cours...</p>;
};

export default GithubRedirect;
