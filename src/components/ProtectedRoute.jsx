import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

function ProtectedRoute({ children }) {
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    let mounted = true;

    // Listen for authentication changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!mounted) return;

      console.log("ProtectedRoute auth event:", event);
      console.log("ProtectedRoute session:", newSession);

      setSession(newSession);
      setLoading(false);
    });

    // Check the current session
    const loadSession = async () => {
      const {
        data: { session: currentSession },
        error,
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        console.error("ProtectedRoute session error:", error);
        setSession(null);
      } else {
        console.log("ProtectedRoute current session:", currentSession);
        setSession(currentSession);
      }

      setLoading(false);
    };

    loadSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // While Supabase is checking the login
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#faf7f2",
          color: "#171717",
          fontSize: "16px",
        }}
      >
        Checking login...
      </div>
    );
  }

  // No authenticated user
  if (!session?.user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // Authenticated user
  return children;
}

export default ProtectedRoute;