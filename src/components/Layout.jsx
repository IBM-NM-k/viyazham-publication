import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import { ArrowLeft } from "lucide-react";

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show Back button on Home page
  const showBackButton = location.pathname !== "/";

  return (
    <>
      <Header />

      {showBackButton && (
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            margin: "18px 5%",
            padding: "9px 15px",
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            border: "1px solid #7B1E3C",
            borderRadius: "9px",
            background: "#fffdf8",
            color: "#7B1E3C",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          <ArrowLeft size={17} />
          Back
        </button>
      )}

      <Outlet />
    </>
  );
}

export default Layout;