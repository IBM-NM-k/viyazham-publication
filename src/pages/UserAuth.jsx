import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserRound, Lock, Mail, BookOpen } from "lucide-react";

function UserAuth() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);

  // Login fields (shared) — "identifier" is username OR email
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  // Extra signup-only field
  const [name, setName] = useState("");

  const [error, setError] = useState("");

  const getUsers = () => {
    const stored = localStorage.getItem("users");
    return stored ? JSON.parse(stored) : [];
  };

  // =====================================================
  // SIGN UP (users only)
  // =====================================================
  const handleSignup = (e) => {
    e.preventDefault();
    setError("");

    if (!name || !identifier || !password) {
      setError("Please fill in all fields");
      return;
    }

    const users = getUsers();
    const alreadyExists = users.some((u) => u.email === identifier);

    if (alreadyExists) {
      setError("An account with this email already exists");
      return;
    }

    const newUser = { name, email: identifier, password };
    localStorage.setItem("users", JSON.stringify([...users, newUser]));

    localStorage.setItem("userLoggedIn", "true");
    localStorage.setItem(
      "currentUser",
      JSON.stringify({ name, email: identifier })
    );

    navigate("/user-updates");
  };

  // =====================================================
  // LOGIN (checks admin first, then registered users)
  // =====================================================
  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // 1. Check admin default credentials
    if (identifier === "admin" && password === "admin123") {
      localStorage.setItem("adminLoggedIn", "true");
      navigate("/admin/books/add");
      return;
    }

    // 2. Check registered users
    const users = getUsers();
    const matchedUser = users.find(
      (u) => u.email === identifier && u.password === password
    );

    if (matchedUser) {
      localStorage.setItem("userLoggedIn", "true");
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ name: matchedUser.name, email: matchedUser.email })
      );
      navigate("/user-updates");
      return;
    }

    setError("Invalid username/email or password");
  };

  const switchAuthMode = () => {
    setIsSignup(!isSignup);
    setError("");
    setName("");
    setIdentifier("");
    setPassword("");
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
            {isSignup ? "Create Account" : "Login"}
          </h1>

          <p style={{ color: "#777", marginTop: "8px" }}>
            Viyazham Publication
          </p>
        </div>

        <form onSubmit={isSignup ? handleSignup : handleLogin}>
          {isSignup && (
            <>
              <label>Name</label>

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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    padding: "14px 10px",
                    fontSize: "15px",
                  }}
                />
              </div>
            </>
          )}

          <label>{isSignup ? "Email" : "Username or Email"}</label>

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
            <Mail size={19} color="#777" />

            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={isSignup ? "Enter your email" : "Username or email"}
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
              placeholder="Enter your password"
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
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "#555",
            fontSize: "14px",
          }}
        >
          {isSignup ? "Already have an account?" : "New here?"}{" "}
          <span
            onClick={switchAuthMode}
            style={{
              color: "#171717",
              fontWeight: "600",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {isSignup ? "Login" : "Create an account"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default UserAuth;
