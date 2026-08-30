import { useState, useEffect } from "react";
import {
  Search,
  UserRound,
  BookOpen,
  Mail,
  Menu,
  X,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

import "./Header.css";

// =====================================================
// WHATSAPP ICON
// =====================================================

function WhatsAppIcon({ size = 15, color = "white" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />

      <path d="M12.04 2c-5.522 0-10 4.477-10 10 0 1.765.462 3.489 1.34 5.007L2 22l5.117-1.342A9.958 9.958 0 0012.04 22c5.523 0 10-4.477 10-10s-4.477-10-10-10zm0 18.166c-1.632 0-3.233-.44-4.628-1.271l-.332-.197-3.037.797.81-2.96-.216-.304A8.128 8.128 0 013.874 12c0-4.5 3.665-8.166 8.166-8.166 4.5 0 8.166 3.665 8.166 8.166 0 4.501-3.665 8.166-8.166 8.166z" />
    </svg>
  );
}

// =====================================================
// HEADER
// =====================================================

function Header() {
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // =====================================================
  // CLOSE MOBILE MENU
  // =====================================================

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  // Close the mobile menu automatically if the window is resized
  // back up to desktop width, so it never gets stuck open.
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // =====================================================
  // NAVIGATION STYLE
  // =====================================================

  const navStyle = ({ isActive }) => ({
    textDecoration: "none",
    color: isActive ? "#111" : "#555",
    fontWeight: isActive ? "600" : "400",
  });

  return (
    <>
      {/* =================================================
          TOP CONTACT BAR
      ================================================= */}

      <div className="top-contact-bar">

        <div className="contact-items">

          <a
            href="https://wa.me/919962241090"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            <WhatsAppIcon />
            <span>+91 99622 41090</span>
          </a>

          <a
            href="https://wa.me/919514364459"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            <WhatsAppIcon />
            <span>+91 95143 64459</span>
          </a>

          <a
            href="mailto:jupitar2602@gmail.com"
            className="contact-link"
          >
            <Mail size={15} />
            <span>jupitar2602@gmail.com</span>
          </a>

        </div>

      </div>

      {/* =================================================
          MAIN HEADER
      ================================================= */}

      <header className="main-header">

        {/* =================================================
            LOGO
        ================================================= */}

        <NavLink
          to="/"
          className="logo-container"
          onClick={closeMenu}
        >

          <div className="logo-icon">
            <BookOpen color="white" size={27} />
          </div>

          <div className="logo-text">

            <div className="logo-title">
              VIYAZHAM
            </div>

            <div className="logo-subtitle">
              PUBLICATION
            </div>

          </div>

        </NavLink>

        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

        <nav className="desktop-navigation">

          <NavLink to="/" style={navStyle}>
            Home
          </NavLink>

          <NavLink to="/books" style={navStyle}>
            Books
          </NavLink>

          <NavLink to="/authors" style={navStyle}>
            Author
          </NavLink>

          <NavLink to="/about" style={navStyle}>
            About
          </NavLink>

        </nav>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="header-actions">

          {/* SEARCH */}

          <button
            className="search-button"
            onClick={() => navigate("/books")}
            aria-label="Search books"
            title="Search Books"
          >
            <Search size={23} />
          </button>

          {/* LOGIN */}

          <button
            className="login-button"
            onClick={() => navigate("/login")}
          >
            <UserRound size={18} />
            <span>Login</span>
          </button>

        </div>

        {/* =================================================
            MOBILE MENU BUTTON
        ================================================= */}

        <button
          className="mobile-menu-button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <X size={27} />
          ) : (
            <Menu size={27} />
          )}
        </button>

      </header>

      {/* =================================================
          MOBILE NAVIGATION
      ================================================= */}

      {mobileMenuOpen && (
        <div className="mobile-navigation">

          <NavLink
            to="/"
            style={navStyle}
            onClick={closeMenu}
          >
            Home
          </NavLink>

          <NavLink
            to="/books"
            style={navStyle}
            onClick={closeMenu}
          >
            <BookOpen size={18} />
            Books
          </NavLink>

          <NavLink
            to="/authors"
            style={navStyle}
            onClick={closeMenu}
          >
            Author
          </NavLink>

          <NavLink
            to="/about"
            style={navStyle}
            onClick={closeMenu}
          >
            About
          </NavLink>

          <button
            className="mobile-login-button"
            onClick={() => {
              closeMenu();
              navigate("/login");
            }}
          >
            <UserRound size={18} />
            Login
          </button>

        </div>
      )}

    </>
  );
}

export default Header;