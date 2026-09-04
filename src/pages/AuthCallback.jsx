import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

const ADMIN_EMAIL = "vizhadmin@gmail.com";

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const finishLogin = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        navigate("/login", { replace: true });
        return;
      }

      const email = session.user.email?.trim().toLowerCase();

      if (email === ADMIN_EMAIL.toLowerCase()) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/userdashboard", { replace: true });
      }
    };

    finishLogin();
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#faf7f2",
        color: "#3b2418",
        fontSize: "20px",
        fontFamily: "Georgia, serif",
      }}
    >
      Signing you in...
    </div>
  );
}

export default AuthCallback;