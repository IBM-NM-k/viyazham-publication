import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

const ADMIN_EMAIL = "vizhadmin@gmail.com";

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

      const email =
        session?.user?.email?.trim().toLowerCase();

      setIsAdmin(
        email === ADMIN_EMAIL.toLowerCase()
      );

      setLoading(false);
    };

    checkAdmin();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {

        if (!mounted) return;

        setSession(newSession);

        const email =
          newSession?.user?.email?.trim().toLowerCase();

        setIsAdmin(
          email === ADMIN_EMAIL.toLowerCase()
        );

        setLoading(false);
      }
    );

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


  // Not logged in
  if (!session) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }


  // Logged in but not admin
  if (!isAdmin) {

    return (
      <Navigate
        to="/userdashboard"
        replace
      />
    );

  }


  // Admin
  return children;
}

export default AdminProtectedRoute;