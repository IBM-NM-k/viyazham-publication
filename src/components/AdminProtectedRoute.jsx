import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

const ADMIN_EMAIL = "your-admin-email@gmail.com";

function AdminProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAdmin = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      setSession(session);

      if (session?.user?.email) {
        setIsAdmin(
          session.user.email.toLowerCase() ===
            ADMIN_EMAIL.toLowerCase()
        );
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    };

    checkAdmin();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return;

      setSession(newSession);

      if (newSession?.user?.email) {
        setIsAdmin(
          newSession.user.email.toLowerCase() ===
            ADMIN_EMAIL.toLowerCase()
        );
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

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
        Checking admin access...
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin-login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminProtectedRoute;