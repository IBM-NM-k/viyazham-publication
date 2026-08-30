import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserRound, Lock, BookOpen } from "lucide-react";

function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Temporary admin login
    // We can connect this to a real backend later.
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("adminLoggedIn", "true");
      navigate("/admin");
    } else {
      setError("Invalid username or password");
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
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
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

          <p style={{ color: "#777", marginTop: "8px" }}>
            Viyazham Publication
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <label>Username</label>

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
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                padding: "14px 10px",
                fontSize: "15px",
              }}
            />
          </div>

          <label>Password</label>

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
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                padding: "14px 10px",
                fontSize: "15px",
              }}
            />
          </div>

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

          <button
            type="submit"
            style={{
              width: "100%",
              border: "none",
              background: "#171717",
              color: "white",
              padding: "15px",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "#999",
            fontSize: "13px",
          }}
        >
          Admin access only
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
