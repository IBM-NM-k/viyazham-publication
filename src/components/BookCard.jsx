import { Link } from "react-router-dom";
import "./BookCard.css";

// Renders one book as a clickable card linking to its details page.
// Used by BookGrid, and can also be used standalone (e.g. Home's featured section).
function BookCard({ book }) {
  return (
    <Link to={`/books/${book.id}`} className="book-card">
      <div className="book-card-cover">
        {book.coverImageUrl ? (
          <img src={book.coverImageUrl} alt={`${book.title} cover`} />
        ) : (
          <div className="book-card-cover-fallback">
            <span>{book.title}</span>
          </div>
        )}
      </div>

      <div className="book-card-info">
        <span className="book-card-category">{book.category}</span>
        <h3 className="book-card-title">{book.title}</h3>
        <p className="book-card-author">{book.author.name}</p>
      </div>
    </Link>
  );
}

export default BookCard;
