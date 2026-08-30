import {
  Search,
  UserRound,
  BookOpen,
  Mail,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";


// Simple inline WhatsApp glyph (lucide-react has no official brand icon)
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


function Header() {

  const navigate = useNavigate();


  // =====================================================
  // NAVIGATION STYLE
  // =====================================================

  const navStyle = ({ isActive }) => ({
    textDecoration: "none",

    color: isActive
      ? "#111"
      : "#555",

    fontWeight: isActive
      ? "600"
      : "400",

    transition: "0.2s",
  });


  return (
    <>

      {/* =================================================
          TOP CONTACT BAR
      ================================================= */}

      <div
        style={{
          background: "#171717",
          color: "#f2ede4",
          padding: "8px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "24px",
          fontSize: "13px",
          flexWrap: "wrap",
        }}
      >

        <a
          href="https://wa.me/919962241090"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "#f2ede4",
            textDecoration: "none",
          }}
        >
          <WhatsAppIcon />
          +91 99622 41090
        </a>

        <a
          href="https://wa.me/919514364459"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "#f2ede4",
            textDecoration: "none",
          }}
        >
          <WhatsAppIcon />
          +91 95143 64459
        </a>

        <a
          href="mailto:jupitar2602@gmail.com"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "#f2ede4",
            textDecoration: "none",
          }}
        >
          <Mail size={15} />
          jupitar2602@gmail.com
        </a>

      </div>


      <header
        style={{
          height: "90px",

          borderBottom:
            "1px solid #e5e1db",

          background: "#faf7f2",

          display: "flex",

          alignItems: "center",

          justifyContent:
            "space-between",

          padding: "0 40px",
        }}
      >


        {/* =================================================
            LOGO
        ================================================= */}

        <NavLink
          to="/"
          style={{
            textDecoration: "none",

            color: "#171717",

            display: "flex",

            alignItems: "center",

            gap: "14px",
          }}
        >

          {/* LOGO ICON */}

          <div
            style={{
              width: "54px",

              height: "54px",

              borderRadius: "50%",

              background: "#171717",

              display: "flex",

              alignItems: "center",

              justifyContent: "center",
            }}
          >

            <BookOpen
              color="white"
              size={27}
            />

          </div>


          {/* LOGO TEXT */}

          <div>

            <div
              style={{
                fontSize: "23px",

                fontWeight: "700",

                letterSpacing: "0.5px",
              }}
            >
              VIYAZHAM
            </div>


            <div
              style={{
                fontSize: "13px",

                letterSpacing: "3px",

                color: "#777",

                marginTop: "2px",
              }}
            >
              PUBLICATION
            </div>

          </div>

        </NavLink>



        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav
          style={{
            display: "flex",

            gap: "24px",

            alignItems: "center",

            fontSize: "16px",
          }}
        >

          {/* HOME */}

          <NavLink
            to="/"
            style={navStyle}
          >
            Home
          </NavLink>


          {/* BOOKS
              IMPORTANT:
              This goes to the SAME Explore page
          */}

          <NavLink
            to="/books"
            style={navStyle}
          >
            Books
          </NavLink>


          {/* AUTHORS */}

          <NavLink
            to="/authors"
            style={navStyle}
          >
            Author
          </NavLink>


          {/* ABOUT */}

          <NavLink
            to="/about"
            style={navStyle}
          >
            About
          </NavLink>

        </nav>



        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div
          style={{
            display: "flex",

            alignItems: "center",

            gap: "20px",
          }}
        >


          {/* =================================================
              SEARCH BUTTON
          ================================================= */}

          <button
            onClick={() =>
              navigate("/books")
            }
            style={{
              border: "none",

              background:
                "transparent",

              cursor: "pointer",

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              padding: "8px",
            }}

            aria-label="Search books"

            title="Search Books"
          >

            <Search size={24} />

          </button>



          {/* =================================================
              LOGIN → USER LOGIN
          ================================================= */}

          <button
            onClick={() =>
              navigate("/login")
            }

            style={{
              border: "none",

              background: "#171717",

              color: "white",

              borderRadius: "30px",

              padding:
                "13px 20px",

              fontSize: "15px",

              fontWeight: "600",

              cursor: "pointer",

              display: "flex",

              alignItems: "center",

              gap: "8px",
            }}
          >

            <UserRound size={18} />

            Login

          </button>

        </div>

      </header>

    </>

  );
}


export default Header;
