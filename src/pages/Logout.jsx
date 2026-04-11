import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Logout = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
    navigate("/", { replace: true });
  }, [navigate, setIsAuthenticated]);

  return null;
};

export default Logout;