import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  return (
    <main className="not-found">
      <p className="not-found-label">404</p>
      <h1>Page not found</h1>
      <p className="not-found-message">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to="/" className="primary-btn" style={{ textDecoration: "none" }}>
        Back to Home
      </Link>
    </main>
  );
}

export default NotFound;
