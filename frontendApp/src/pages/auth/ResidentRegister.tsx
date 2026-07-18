import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ResidentRegister() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/resident/login", { replace: true });
  }, [navigate]);

  return null;
}
