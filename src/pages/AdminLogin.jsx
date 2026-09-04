
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  Lock,
  BookOpen,
  Eye,
  EyeOff,
} from "lucide-react";
import { supabase } from "../services/supabaseClient";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Please enter your email and password");
      return;
    }

    setLoading(true);

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

      if (error) {
        setError("Invalid admin email or password");
        return;
      }

      if (!data?.user) {
        setError("Unable to authenticate admin");
        return;
      }

      /*
       * IMPORTANT:
       * For now this checks the email of the admin account.
       *
       * Replace this email with the actual admin email
       * that you create in Supabase Authentication.
       */
      const ADMIN_EMAIL = "vizhadmin@gmail.com";
      if (data.user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        await supabase.auth.signOut();

        setError("You are not authorized to access the admin area");
        return;
      }

      /*
       * Keep this localStorage value because your existing
       * Admin pages may already use it.
       */
      localStorage.setItem("adminLoggedIn", "true");

      navigate("/admin");
    } catch (err) {
      console.error("Admin login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 90px)",
        background: "#faf7f2",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "white",
          border: "1px solid #e5e1db",
          borderRadius: "20px",
          padding: "40px",
          boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "#171717",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 15px",
            }}
          >
            <BookOpen color="white" size={28} />
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              color: "#171717",
            }}
          >
            Admin Login
          </h1>

          <p
            style={{
              color: "#777",
              marginTop: "8px",
            }}
          >
            Viyazham Publication
          </p>
        </div>

        {/* FORM */}

        <form onSubmit={handleLogin}>
          {/* EMAIL */}

          <label
            style={{
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Admin Email
          </label>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "0 12px",
              marginTop: "8px",
              marginBottom: "20px",
            }}
          >
            <UserRound size={19} color="#777" />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              autoComplete="email"
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                padding: "14px 10px",
                fontSize: "15px",
              }}
            />
          </div>

          {/* PASSWORD */}

          <label
            style={{
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Password
          </label>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "0 12px",
              marginTop: "8px",
              marginBottom: "20px",
            }}
          >
            <Lock size={19} color="#777" />

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              autoComplete="current-password"
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                padding: "14px 10px",
                fontSize: "15px",
              }}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: "#777",
                display: "flex",
                alignItems: "center",
              }}
            >
              {showPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>

          {/* ERROR */}

          {error && (
            <div
              style={{
                color: "#c0392b",
                background: "#fff3f2",
                border: "1px solid #f2c7c3",
                padding: "11px 12px",
                borderRadius: "8px",
                fontSize: "13px",
                marginBottom: "15px",
              }}
            >
              {error}
            </div>
          )}

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              border: "none",
              background: "#171717",
              color: "white",
              padding: "15px",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {/* FOOTER */}

        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "#999",
            fontSize: "13px",
          }}
        >
          🔒 Admin access only
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;

