import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, BookOpen, Eye, EyeOff } from "lucide-react";
import { supabase } from "../services/supabaseClient";

function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setMessage("Your password has been updated successfully.");

    setPassword("");
    setConfirmPassword("");

    setTimeout(() => {
      navigate("/login");
    }, 2000);

    setLoading(false);
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
        {/* LOGO */}
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
            Reset Password
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

        <form onSubmit={handleResetPassword}>
          {/* NEW PASSWORD */}
          <label>New Password</label>

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
              placeholder="Enter new password"
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
              onClick={() => setShowPassword(!showPassword)}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                padding: "5px",
                display: "flex",
              }}
            >
              {showPassword ? (
                <EyeOff size={19} color="#777" />
              ) : (
                <Eye size={19} color="#777" />
              )}
            </button>
          </div>

          {/* CONFIRM PASSWORD */}
          <label>Confirm Password</label>

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
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              placeholder="Confirm new password"
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
                setShowConfirmPassword(!showConfirmPassword)
              }
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                padding: "5px",
                display: "flex",
              }}
            >
              {showConfirmPassword ? (
                <EyeOff size={19} color="#777" />
              ) : (
                <Eye size={19} color="#777" />
              )}
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <p
              style={{
                color: "#c0392b",
                fontSize: "14px",
                marginBottom: "15px",
              }}
            >
              {error}
            </p>
          )}

          {/* SUCCESS */}
          {message && (
            <p
              style={{
                color: "#278a52",
                fontSize: "14px",
                marginBottom: "15px",
              }}
            >
              {message}
            </p>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              border: "none",
              background: loading ? "#777" : "#171717",
              color: "white",
              padding: "15px",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        {/* BACK TO LOGIN */}
        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "#555",
            fontSize: "14px",
          }}
        >
          Remember your password?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{
              color: "#171717",
              fontWeight: "600",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;