import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  Lock,
  Mail,
  BookOpen,
  Eye,
  EyeOff,
  Sparkles,
  Feather,
  Globe2,
  ArrowRight,
  Stars,
  Library,
} from "lucide-react";
import { supabase } from "../services/supabaseClient";

function UserAuth() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================================================
  // GOOGLE LOGIN
  // =========================================================

  const handleGoogleLogin = async () => {
    try {
      setError("");
      setMessage("");
      setGoogleLoading(true);

      /*
       * IMPORTANT:
       * Your website is using /viyazham-publication/
       * as the GitHub Pages base path.
       */

      const redirectUrl =
        `${window.location.origin}/viyazham-publication/user-updates`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        throw error;
      }

      /*
       * Supabase normally redirects the browser to Google here.
       * Therefore we don't set googleLoading(false) on success.
       */

    } catch (err) {
      console.error("Google login error:", err);

      setError(
        err?.message ||
          "Unable to continue with Google. Please try again."
      );

      setGoogleLoading(false);
    }
  };

  // =========================================================
  // EMAIL LOGIN / SIGNUP
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    const cleanEmail = email.trim().toLowerCase();

    // -----------------------------
    // BASIC VALIDATION
    // -----------------------------

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (isSignup) {
      if (!name.trim()) {
        setError("Please enter your name.");
        return;
      }

      if (password.length < 6) {
        setError(
          "Password must contain at least 6 characters."
        );
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    try {
      setLoading(true);

      // =====================================================
      // SIGN UP
      // =====================================================

      if (isSignup) {
        const { data, error } =
          await supabase.auth.signUp({
            email: cleanEmail,
            password,
            options: {
              data: {
                name: name.trim(),
              },
              emailRedirectTo:
                `${window.location.origin}/viyazham-publication/user-updates`,
            },
          });

        if (error) {
          throw error;
        }

        /*
         * If email confirmation is enabled in Supabase,
         * session will be null until the user confirms email.
         */

        if (data?.user && !data?.session) {
          setMessage(
            "Your account has been created. Please check your email and confirm your account."
          );
        } else {
          setMessage("Account created successfully!");

          setTimeout(() => {
            navigate("/user-updates");
          }, 800);
        }

        return;
      }

      // =====================================================
      // LOGIN
      // =====================================================

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

      if (error) {
        throw error;
      }

      if (data?.session) {
        navigate("/user-updates");
      } else {
        setError(
          "Login was not completed. Please try again."
        );
      }

    } catch (err) {
      console.error(
        "Authentication error:",
        err
      );

      let friendlyMessage =
        err?.message ||
        "Something went wrong. Please try again.";

      const lowerMessage =
        err?.message?.toLowerCase() || "";

      if (
        lowerMessage.includes("invalid login") ||
        lowerMessage.includes("invalid credentials")
      ) {
        friendlyMessage =
          "Invalid email or password. Please check your details.";
      }

      if (
        lowerMessage.includes("email not confirmed")
      ) {
        friendlyMessage =
          "Please confirm your email before logging in.";
      }

      if (
        lowerMessage.includes("already registered")
      ) {
        friendlyMessage =
          "This email is already registered. Please sign in instead.";
      }

      setError(friendlyMessage);

    } finally {
      /*
       * THIS IS IMPORTANT.
       * It prevents the Sign In button from being
       * permanently stuck on "Signing in..."
       */

      setLoading(false);
    }
  };

  // =========================================================
  // FORGOT PASSWORD
  // =========================================================

  const handleForgotPassword = async () => {
    setError("");
    setMessage("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError(
        "Please enter your email address first."
      );
      return;
    }

    try {
      setForgotLoading(true);

      const { error } =
        await supabase.auth.resetPasswordForEmail(
          cleanEmail,
          {
            redirectTo:
              `${window.location.origin}/viyazham-publication/reset-password`,
          }
        );

      if (error) {
        throw error;
      }

      setMessage(
        "Password reset instructions have been sent to your email."
      );

    } catch (err) {
      console.error(
        "Password reset error:",
        err
      );

      setError(
        err?.message ||
          "Unable to send password reset instructions."
      );

    } finally {
      setForgotLoading(false);
    }
  };

  // =========================================================
  // SWITCH LOGIN / SIGNUP
  // =========================================================

  const switchMode = () => {
    setIsSignup((previous) => !previous);

    setError("");
    setMessage("");

    setPassword("");
    setConfirmPassword("");
  };

  // =========================================================
  // STYLES
  // =========================================================

  const pageStyle = {
    minHeight: "calc(100vh - 90px)",
    position: "relative",
    overflow: "hidden",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    padding: "55px 20px",

    background:
      "radial-gradient(circle at 15% 20%, rgba(188,145,75,0.14), transparent 28%), radial-gradient(circle at 85% 80%, rgba(115,82,45,0.12), transparent 30%), #f8f4ed",
  };

  const cardStyle = {
    position: "relative",
    zIndex: 5,

    width: "100%",
    maxWidth: "500px",

    background:
      "linear-gradient(145deg, rgba(255,255,255,0.99), rgba(252,248,241,0.98))",

    border:
      "1px solid rgba(116,87,48,0.17)",

    borderRadius: "28px",

    padding: "46px",

    boxShadow:
      "0 30px 80px rgba(61,43,23,0.16), 0 8px 25px rgba(61,43,23,0.08)",

    backdropFilter: "blur(10px)",
  };

  const inputWrapperStyle = {
    display: "flex",
    alignItems: "center",

    width: "100%",
    minHeight: "56px",

    border:
      "1px solid #ddd5ca",

    borderRadius: "14px",

    background: "#fffdf9",

    overflow: "hidden",

    transition: "all 0.2s ease",
  };

  const inputStyle = {
    width: "100%",

    border: "none",
    outline: "none",

    background: "transparent",

    padding: "15px 10px",

    fontSize: "15px",

    color: "#30291f",
  };

  const iconStyle = {
    marginLeft: "15px",
    color: "#8b765b",
    flexShrink: 0,
  };

  const labelStyle = {
    display: "block",

    marginBottom: "8px",

    fontSize: "14px",

    fontWeight: "600",

    color: "#493b2b",
  };

  const primaryButtonStyle = {
    width: "100%",
    minHeight: "56px",

    border: "none",

    borderRadius: "14px",

    background:
      "linear-gradient(135deg, #2d241b 0%, #51402e 100%)",

    color: "white",

    fontSize: "16px",

    fontWeight: "700",

    cursor: loading
      ? "not-allowed"
      : "pointer",

    boxShadow:
      "0 12px 28px rgba(45,36,27,0.22)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "10px",

    transition: "all 0.2s ease",

    opacity: loading ? 0.75 : 1,
  };

  return (
    <div style={pageStyle}>

      {/* =====================================================
          BACKGROUND BOOK DECORATION
      ===================================================== */}

      <div
        style={{
          position: "absolute",
          top: "40px",
          left: "7%",

          opacity: 0.12,

          transform: "rotate(-15deg)",
        }}
      >
        <BookOpen
          size={160}
          strokeWidth={1}
        />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "15px",
          right: "7%",

          opacity: 0.10,

          transform: "rotate(12deg)",
        }}
      >
        <Library
          size={175}
          strokeWidth={1}
        />
      </div>

      {/* Sparkles */}

      <div
        style={{
          position: "absolute",
          top: "16%",
          right: "16%",

          color: "#a17c4b",
          opacity: 0.45,
        }}
      >
        <Sparkles size={28} />
      </div>

      <div
        style={{
          position: "absolute",
          top: "34%",
          left: "15%",

          color: "#a17c4b",
          opacity: 0.35,
        }}
      >
        <Stars size={22} />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "18%",
          left: "18%",

          color: "#a17c4b",
          opacity: 0.35,
        }}
      >
        <Sparkles size={20} />
      </div>

      {/* =====================================================
          LOGIN CARD
      ===================================================== */}

      <div style={cardStyle}>

        {/* TOP BOOK ICON */}

        <div
          style={{
            position: "absolute",

            top: "-32px",

            left: "50%",

            transform:
              "translateX(-50%)",

            width: "66px",
            height: "66px",

            borderRadius: "21px",

            background:
              "linear-gradient(135deg, #321f13, #735536)",

            display: "flex",

            alignItems: "center",
            justifyContent: "center",

            boxShadow:
              "0 12px 30px rgba(45,36,27,0.25)",

            border:
              "4px solid #f8f4ed",
          }}
        >
          <BookOpen
            size={30}
            color="white"
            strokeWidth={1.8}
          />
        </div>

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          style={{
            textAlign: "center",

            marginTop: "6px",

            marginBottom: "30px",
          }}
        >

          {/* Publication label */}

          <div
            style={{
              display: "inline-flex",

              alignItems: "center",

              justifyContent: "center",

              gap: "7px",

              marginBottom: "10px",

              color: "#9b7948",

              fontFamily:
                "Georgia, 'Times New Roman', serif",

              fontSize: "12px",

              fontWeight: "700",

              letterSpacing: "2px",

              textTransform: "uppercase",
            }}
          >
            <Feather size={15} />

            VIYAZHAM PUBLICATION

            <Feather size={15} />
          </div>

          <h1
            style={{
              margin: 0,

              fontFamily:
                "Georgia, 'Times New Roman', serif",

              fontSize: "34px",

              color: "#2d241b",

              lineHeight: "1.2",

              fontWeight: "700",
            }}
          >
            {isSignup
              ? "Begin Your Story"
              : "Welcome Back"}
          </h1>

          <p
            style={{
              margin:
                "10px 0 0",

              color: "#806f5b",

              fontFamily:
                "Georgia, 'Times New Roman', serif",

              fontSize: "15px",
            }}
          >
            {isSignup
              ? "Create your literary journey with us"
              : "Continue your literary journey"}
          </p>
        </div>

        {/* =================================================
            GOOGLE BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={handleGoogleLogin}

          disabled={googleLoading}

          style={{
            width: "100%",

            minHeight: "55px",

            border:
              "1px solid #ddd5ca",

            borderRadius: "14px",

            background: "#fffefa",

            color: "#40372d",

            fontSize: "15px",

            fontWeight: "650",

            cursor: googleLoading
              ? "not-allowed"
              : "pointer",

            display: "flex",

            alignItems: "center",

            justifyContent: "center",

            gap: "11px",

            opacity:
              googleLoading ? 0.7 : 1,

            transition: "all 0.2s ease",
          }}
        >
          <Globe2
            size={20}
            color="#80613b"
          />

          {googleLoading
            ? "Connecting..."
            : "Continue with Google"}
        </button>

        {/* =================================================
            DIVIDER
        ================================================= */}

        <div
          style={{
            display: "flex",

            alignItems: "center",

            gap: "14px",

            margin:
              "25px 0",

            color: "#a08d76",

            fontSize: "13px",
          }}
        >
          <div
            style={{
              flex: 1,

              height: "1px",

              background: "#ded5c9",
            }}
          />

          <span
            style={{
              fontFamily:
                "Georgia, 'Times New Roman', serif",
            }}
          >
            OR
          </span>

          <div
            style={{
              flex: 1,

              height: "1px",

              background: "#ded5c9",
            }}
          />
        </div>

        {/* =================================================
            NAME - SIGNUP ONLY
        ================================================= */}

        {isSignup && (
          <div
            style={{
              marginBottom: "18px",
            }}
          >
            <label style={labelStyle}>
              Your Name
            </label>

            <div style={inputWrapperStyle}>
              <UserRound
                size={19}
                style={iconStyle}
              />

              <input
                type="text"

                value={name}

                onChange={(e) =>
                  setName(e.target.value)
                }

                placeholder="Enter your name"

                style={inputStyle}

                autoComplete="name"
              />
            </div>
          </div>
        )}

        {/* =================================================
            EMAIL
        ================================================= */}

        <div
          style={{
            marginBottom: "18px",
          }}
        >
          <label style={labelStyle}>
            Email Address
          </label>

          <div style={inputWrapperStyle}>

            <Mail
              size={19}
              style={iconStyle}
            />

            <input
              type="email"

              value={email}

              onChange={(e) =>
                setEmail(e.target.value)
              }

              placeholder="Enter your email"

              style={inputStyle}

              autoComplete="email"
            />
          </div>
        </div>

        {/* =================================================
            PASSWORD
        ================================================= */}

        <div
          style={{
            marginBottom: "10px",
          }}
        >
          <label style={labelStyle}>
            Password
          </label>

          <div style={inputWrapperStyle}>

            <Lock
              size={19}
              style={iconStyle}
            />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }

              value={password}

              onChange={(e) =>
                setPassword(e.target.value)
              }

              placeholder="Enter your password"

              style={inputStyle}

              autoComplete={
                isSignup
                  ? "new-password"
                  : "current-password"
              }
            />

            <button
              type="button"

              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }

              style={{
                border: "none",

                background:
                  "transparent",

                cursor: "pointer",

                padding: "14px",

                color: "#8b7b68",

                display: "flex",
              }}
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>

          </div>
        </div>

        {/* =================================================
            CONFIRM PASSWORD
        ================================================= */}

        {isSignup && (
          <div
            style={{
              marginTop: "18px",

              marginBottom: "10px",
            }}
          >
            <label style={labelStyle}>
              Confirm Password
            </label>

            <div style={inputWrapperStyle}>

              <Lock
                size={19}
                style={iconStyle}
              />

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }

                value={confirmPassword}

                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }

                placeholder="Confirm your password"

                style={inputStyle}

                autoComplete="new-password"
              />

              <button
                type="button"

                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }

                style={{
                  border: "none",

                  background:
                    "transparent",

                  cursor: "pointer",

                  padding: "14px",

                  color: "#8b7b68",

                  display: "flex",
                }}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>
          </div>
        )}

        {/* =================================================
            FORGOT PASSWORD
        ================================================= */}

        {!isSignup && (
          <div
            style={{
              display: "flex",

              justifyContent:
                "flex-end",

              marginBottom: "22px",
            }}
          >
            <button
              type="button"

              onClick={
                handleForgotPassword
              }

              disabled={forgotLoading}

              style={{
                border: "none",

                background:
                  "transparent",

                color: "#73552f",

                textDecoration:
                  "underline",

                cursor: forgotLoading
                  ? "not-allowed"
                  : "pointer",

                fontSize: "14px",

                padding: "3px",
              }}
            >
              {forgotLoading
                ? "Sending..."
                : "Forgot password?"}
            </button>
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div
            style={{
              padding:
                "13px 15px",

              borderRadius: "12px",

              marginBottom: "18px",

              background:
                "#fff2f0",

              border:
                "1px solid #f0c9c3",

              color: "#a63d32",

              fontSize: "13px",

              lineHeight: "1.5",
            }}
          >
            {error}
          </div>
        )}

        {/* =================================================
            SUCCESS
        ================================================= */}

        {message && (
          <div
            style={{
              padding:
                "13px 15px",

              borderRadius: "12px",

              marginBottom: "18px",

              background:
                "#f3f8f1",

              border:
                "1px solid #cbdcc4",

              color: "#47633e",

              fontSize: "13px",

              lineHeight: "1.5",
            }}
          >
            {message}
          </div>
        )}

        {/* =================================================
            SIGN IN / CREATE ACCOUNT
        ================================================= */}

        <button
          type="submit"

          onClick={handleSubmit}

          disabled={loading}

          style={primaryButtonStyle}
        >
          {loading ? (
            <>
              <span
                style={{
                  width: "18px",

                  height: "18px",

                  border:
                    "2px solid rgba(255,255,255,0.35)",

                  borderTopColor:
                    "white",

                  borderRadius: "50%",

                  animation:
                    "viyazhamSpin 0.8s linear infinite",
                }}
              />

              {isSignup
                ? "Creating account..."
                : "Signing in..."}
            </>
          ) : (
            <>
              {isSignup
                ? "Create My Account"
                : "Sign In"}

              <ArrowRight
                size={18}
              />
            </>
          )}
        </button>

        {/* =================================================
            SWITCH LOGIN / SIGNUP
        ================================================= */}

        <div
          style={{
            textAlign: "center",

            marginTop: "25px",

            color: "#806f5b",

            fontSize: "14px",
          }}
        >
          {isSignup
            ? "Already have an account?"
            : "New to Viyazham?"}

          <button
            type="button"

            onClick={switchMode}

            style={{
              border: "none",

              background:
                "transparent",

              color: "#5e4225",

              fontWeight: "700",

              textDecoration:
                "underline",

              cursor: "pointer",

              marginLeft: "6px",

              fontSize: "14px",
            }}
          >
            {isSignup
              ? "Sign in"
              : "Create an account"}
          </button>
        </div>

        {/* =================================================
            BOTTOM DECORATION
        ================================================= */}

        <div
          style={{
            display: "flex",

            alignItems: "center",

            justifyContent:
              "center",

            gap: "9px",

            marginTop: "28px",

            color: "#b39a79",
          }}
        >
          <div
            style={{
              width: "35px",

              height: "1px",

              background:
                "#d9cbbb",
            }}
          />

          <Sparkles size={14} />

          <span
            style={{
              fontFamily:
                "Georgia, 'Times New Roman', serif",

              fontSize: "10px",

              letterSpacing:
                "1.5px",

              whiteSpace:
                "nowrap",
            }}
          >
            EVERY BOOK HAS A STORY
          </span>

          <Sparkles size={14} />

          <div
            style={{
              width: "35px",

              height: "1px",

              background:
                "#d9cbbb",
            }}
          />
        </div>
      </div>

      {/* =====================================================
          ANIMATION + RESPONSIVE CSS
      ===================================================== */}

      <style>
        {`
          @keyframes viyazhamSpin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          input::placeholder {
            color: #a29586;
          }

          button:hover:not(:disabled) {
            transform: translateY(-1px);
          }

          @media (max-width: 600px) {
            .viyazham-login-card {
              padding: 30px 22px;
            }
          }
        `}
      </style>
    </div>
  );
}

export default UserAuth;