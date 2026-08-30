import "./Loader.css";

// Simple loading indicator shown while service layer calls are pending.
// Kept intentionally minimal — swap for a skeleton loader later if desired.
function Loader({ label = "Loading..." }) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <div className="loader-spinner" />
      <span>{label}</span>
    </div>
  );
}

export default Loader;
