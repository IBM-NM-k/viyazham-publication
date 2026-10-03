import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

const ADMIN_EMAIL = "vizhadmin@gmail.com";

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const finishLogin = async () => {
      try {
        // Get OAuth code from the URL
        const code = new URLSearchParams(window.location.search).get("code");

        if (!code) {
          console.error("OAuth code not found in URL.");
          navigate("/login", { replace: true });
          return;
        }

        // Exchange OAuth code for Supabase session
        const { data, error } =
          await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          console.error("OAuth session exchange error:", error);
          navigate("/login", { replace: true });
          return;
        }

        const session = data?.session;

        if (!session?.user) {
          console.error("No user session found after OAuth login.");
          navigate("/login", { replace: true });
          return;
        }

        const email = session.user.email?.trim().toLowerCase();

        console.log("Google login successful:", email);

        if (email === ADMIN_EMAIL.toLowerCase()) {
          navigate("/admin", { replace: true });
        } else {
          navigate("/userdashboard", { replace: true });
        }
      } catch (error) {
        console.error("Authentication callback error:", error);
        navigate("/login", { replace: true });
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