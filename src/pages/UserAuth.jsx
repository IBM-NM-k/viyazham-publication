import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserAuth.css";

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

const ADMIN_EMAIL = "vizhadmin@gmail.com";
const USER_DASHBOARD = "/userdashboard";

function UserAuth() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ======================================================
  // GET CURRENT USER AND NAVIGATE
  // ======================================================

  const navigateAfterLogin = async (session) => {
    if (!session?.user) {
      setError("Login successful, but no user session was found.");
      return;
    }

    const loggedInEmail = session.user.email?.trim().toLowerCase();

    if (!loggedInEmail) {
      setError("Login successful, but user email could not be found.");
      return;
    }

    console.log("Authenticated email:", loggedInEmail);

    if (loggedInEmail === ADMIN_EMAIL.toLowerCase()) {
      console.log("Admin detected → /admin");

      navigate("/admin", {
        replace: true,
      });

      return;
    }

    console.log("Normal user → /userdashboard");

    navigate(USER_DASHBOARD, {
      replace: true,
    });
  };

  // ======================================================
  // EMAIL LOGIN / SIGNUP
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      // ==================================================
      // SIGNUP
      // ==================================================

      if (isSignup) {
        if (!name.trim()) {
          setError("Please enter your name.");
          return;
        }

        if (password.length < 6) {
          setError("Password must contain at least 6 characters.");
          return;
        }

        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          return;
        }

        const {
          data,
          error: signupError,
        } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              name: name.trim(),
            },
          },
        });

        if (signupError) {
          throw signupError;
        }

        // If Supabase creates a session immediately,
        // navigate directly to the correct dashboard.
        if (data?.session) {
          await navigateAfterLogin(data.session);
          return;
        }

        // Email confirmation is enabled.
        setMessage(
          "Account created successfully. Please check your email and login to continue."
        );

        setIsSignup(false);
        setPassword("");
        setConfirmPassword("");

        return;
      }

      // ==================================================
      // EMAIL + PASSWORD LOGIN
      // ==================================================

      const {
        data,
        error: loginError,
      } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (loginError) {
        throw loginError;
      }

      console.log("Email login successful.");

      // ==================================================
      // IMPORTANT:
      // Confirm the session from Supabase before navigating.
      // ==================================================

      const {
        data: {
          session: currentSession,
        },
      } = await supabase.auth.getSession();

      const session = currentSession || data?.session;

      await navigateAfterLogin(session);

    } catch (err) {
      console.error("Authentication error:", err);

      setError(
        err?.message ||
          "Unable to login. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // GOOGLE LOGIN
  // ======================================================

  const handleGoogleLogin = async () => {
    try {
      setError("");
      setMessage("");
      setGoogleLoading(true);

      const redirectUrl =
        `${window.location.origin}/viyazham-publication/auth/callback`;

      console.log("Google redirect URL:", redirectUrl);

      const {
        data,
        error: googleError,
      } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
        },
      });

      console.log("Google OAuth response:", data);

      if (googleError) {
        throw googleError;
      }

      // Google will redirect the browser to Google.
      // AuthCallback.jsx handles the final navigation.
    } catch (err) {
      console.error("Google login error:", err);

      setError(
        err?.message ||
          "Unable to continue with Google."
      );

      setGoogleLoading(false);
    }
  };

  // ======================================================
  // FORGOT PASSWORD
  // ======================================================

  const handleForgotPassword = async () => {
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError(
        "Please enter your email address first."
      );
      return;
    }

    try {
      setForgotLoading(true);

      const redirectUrl =
        `${window.location.origin}/viyazham-publication/reset-password`;

      const {
        error: resetError,
      } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: redirectUrl,
        }
      );

      if (resetError) {
        throw resetError;
      }

      setMessage(
        "Password reset link has been sent to your email."
      );
    } catch (err) {
      console.error(
        "Forgot password error:",
        err
      );

      setError(
        err?.message ||
          "Unable to send password reset email."
      );
    } finally {
      setForgotLoading(false);
    }
  };

  // ======================================================
  // SWITCH LOGIN / SIGNUP
  // ======================================================

  const handleSwitchMode = () => {
    setIsSignup(!isSignup);

    setError("");
    setMessage("");

    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="auth-page">

      <div className="auth-decoration auth-decoration-one">
        <Feather size={28} />
      </div>

      <div className="auth-decoration auth-decoration-two">
        <Stars size={32} />
      </div>

      <div className="auth-decoration auth-decoration-three">
        <Sparkles size={26} />
      </div>

      <div className="auth-container">

        {/* ================= LEFT ================= */}

        <div className="auth-left">

          <div className="auth-brand">

            <div className="auth-logo">
              <BookOpen size={30} />
            </div>

            <div>
              <h2>Viyazham Publication</h2>
              <p>Tamil Books • Tamil Authors</p>
            </div>

          </div>

          <div className="auth-left-content">

            <div className="auth-icon-circle">
              <Library size={34} />
            </div>

            <h1>
              Discover the world of
              <span> Tamil Literature</span>
            </h1>

            <p>
              Read, explore and support wonderful
              Tamil books and talented authors.
            </p>

            <div className="auth-features">

              <div className="auth-feature">

                <div className="auth-feature-icon">
                  <BookOpen size={20} />
                </div>

                <div>
                  <strong>Explore Books</strong>
                  <span>
                    Discover published Tamil books
                  </span>
                </div>

              </div>

              <div className="auth-feature">

                <div className="auth-feature-icon">
                  <Feather size={20} />
                </div>

                <div>
                  <strong>Support Authors</strong>
                  <span>
                    Discover talented Tamil writers
                  </span>
                </div>

              </div>

              <div className="auth-feature">

                <div className="auth-feature-icon">
                  <Globe2 size={20} />
                </div>

                <div>
                  <strong>One Tamil Community</strong>
                  <span>
                    Bringing readers and authors together
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ================= RIGHT ================= */}

        <div className="auth-right">

          <div className="auth-header">

            <h1>
              {isSignup
                ? "Create your account"
                : "Welcome back"}
            </h1>

            <p>
              {isSignup
                ? "Join Viyazham Publication and explore Tamil literature."
                : "Login to continue your reading journey."}
            </p>

          </div>

          {/* GOOGLE */}

          <button
            type="button"
            className="google-login-btn"
            onClick={handleGoogleLogin}
            disabled={
              googleLoading || loading
            }
          >

            {googleLoading ? (
              <span className="auth-spinner"></span>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#4285F4"
                  d="M21.35 12.23c0-.79-.07-1.55-.2-2.27H12v4.3h5.23a4.47 4.47 0 0 1-1.94 2.93v2.44h3.14c1.84-1.69 2.92-4.18 2.92-7.4z"
                />

                <path
                  fill="#34A853"
                  d="M12 21.5c2.63 0 4.84-.87 6.45-2.36l-3.14-2.44c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.52A9.74 9.74 0 0 0 12 21.5z"
                />

                <path
                  fill="#FBBC05"
                  d="M6.54 13.59A5.85 5.85 0 0 1 6.23 12c0-.55.11-1.09.31-1.59V7.89H3.3A9.5 9.5 0 0 0 2.25 12c0 1.53.37 2.97 1.05 4.11l3.24-2.52z"
                />

                <path
                  fill="#EA4335"
                  d="M12 6.38c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.83 3.43 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.7 5.39l3.24 2.52C7.31 8.1 9.46 6.38 12 6.38z"
                />
              </svg>
            )}

            <span>
              {googleLoading
                ? "Connecting..."
                : "Continue with Google"}
            </span>

          </button>

          <div className="auth-divider">
            <span>or continue with email</span>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          {message && (
            <div className="auth-message">
              {message}
            </div>
          )}

          {/* EMAIL FORM */}

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            {isSignup && (
              <div className="auth-field">

                <label>Your Name</label>

                <div className="auth-input-wrapper">

                  <UserRound size={19} />

                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    disabled={loading}
                  />

                </div>

              </div>
            )}

            <div className="auth-field">

              <label>Email Address</label>

              <div className="auth-input-wrapper">

                <Mail size={19} />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  disabled={loading}
                />

              </div>

            </div>

            <div className="auth-field">

              <label>Password</label>

              <div className="auth-input-wrapper">

                <Lock size={19} />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

            </div>

            {isSignup && (
              <div className="auth-field">

                <label>Confirm Password</label>

                <div className="auth-input-wrapper">

                  <Lock size={19} />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    disabled={loading}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                </div>

              </div>
            )}

            {!isSignup && (
              <div className="forgot-password-row">

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={
                    forgotLoading ||
                    loading
                  }
                >
                  {forgotLoading
                    ? "Sending..."
                    : "Forgot password?"}
                </button>

              </div>
            )}

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={
                loading ||
                googleLoading
              }
            >

              {loading ? (
                <span className="auth-spinner"></span>
              ) : (
                <>
                  <span>
                    {isSignup
                      ? "Create Account"
                      : "Login"}
                  </span>

                  <ArrowRight size={19} />
                </>
              )}

            </button>

          </form>

          {/* SWITCH */}

          <div className="auth-switch">

            <span>
              {isSignup
                ? "Already have an account?"
                : "Don't have an account?"}
            </span>

            <button
              type="button"
              onClick={handleSwitchMode}
            >
              {isSignup
                ? "Login"
                : "Create Account"}
            </button>

          </div>

          <div className="auth-footer">

            <BookOpen size={15} />

            <span>
              Viyazham Publication
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default UserAuth;