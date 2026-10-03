import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

const ADMIN_EMAIL = "vizhadmin@gmail.com";

function AuthCallback() {
  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {
    const finishGoogleLogin = async () => {
      if (hasRun.current) return;
      hasRun.current = true;

      try {
        console.log("========== GOOGLE AUTH CALLBACK ==========");

        const url = new URL(window.location.href);
        const params = url.searchParams;

        const oauthError = params.get("error");
        const oauthErrorDescription = params.get("error_description");

        if (oauthError) {
          console.error("Google OAuth Error:", oauthError);
          navigate("/login", {
            replace: true,
            state: { error: oauthErrorDescription || "Google login was cancelled or failed." },
          });
          return;
        }

        const code = params.get("code");
        console.log("Google authorization code received:", Boolean(code));

        if (!code) {
          navigate("/login", {
            replace: true,
            state: { error: "Google login could not be completed. Authorization code was missing." },
          });
          return;
        }

        console.log("Exchanging Google authorization code for session...");

        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          console.error("Supabase session exchange error:", exchangeError);
          navigate("/login", {
            replace: true,
            state: { error: exchangeError.message || "Google login session could not be created." },
          });
          return;
        }

        let session = data?.session;

        if (!session) {
          const { data: sessionData } = await supabase.auth.getSession();
          session = sessionData?.session;
        }

        if (!session?.user) {
          navigate("/login", {
            replace: true,
            state: { error: "Google login completed, but the user session was not found." },
          });
          return;
        }

        const email = session.user.email?.trim().toLowerCase();
        console.log("Google authenticated email:", email);

        window.history.replaceState({}, document.title, "/auth/callback");

        if (email === ADMIN_EMAIL.toLowerCase()) {
          console.log("Admin Google login successful.");
          navigate("/admin", { replace: true });
          return;
        }

        console.log("Normal Google user login successful.");
        navigate("/userdashboard", { replace: true });
      } catch (error) {
        console.error("Unexpected Google authentication error:", error);
        navigate("/login", {
          replace: true,
          state: { error: error?.message || "Something went wrong during Google login." },
        });
      }
    };

    finishGoogleLogin();
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
        textAlign: "center",
        padding: "20px",
            }}
    >
      Signing you in with Google...
    </div>
  );
}

export default AuthCallback;