import "./EmptyState.css";

// Shown whenever a list has nothing to display — zero search results,
// no books in a category, etc. Keeps the "nothing here" moment intentional
// instead of just rendering a blank grid.
function EmptyState({ message = "Nothing here yet." }) {
  return (
    <div className="empty-state">
      <p>{message}</p>
    </div>
  );
}

export default EmptyState;
