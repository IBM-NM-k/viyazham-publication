import BookCard from "./BookCard";
import EmptyState from "./EmptyState";
import "./BookGrid.css";

// Renders a responsive grid of BookCards.
// If the list is empty, shows a message instead of an empty grid.
function BookGrid({ books, emptyMessage = "No books found." }) {
  if (!books || books.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="book-grid">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}

export default BookGrid;
