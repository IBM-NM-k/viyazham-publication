import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";

import "./BookCard.css";

function BookCard({ book }) {
  // =========================================================
  // AUTHOR NAME
  // Supports both:
  // author: "Author Name"
  // and:
  // author: { name: "Author Name" }
  // =========================================================

  const authorName =
    typeof book?.author === "string"
      ? book.author
      : book?.author?.name ||
        book?.author?.fullName ||
        book?.author?.displayName ||
        "Unknown Author";

  // =========================================================
  // PAGE COUNT
  // =========================================================

  const pageCount =
    book?.pages !== undefined &&
    book?.pages !== null &&
    book?.pages !== ""
      ? book.pages
      : "—";

  return (
    <Link
      to={`/books/${book.id}`}
      className="book-card"
      aria-label={`View ${book.title || "book"}`}
    >
      {/* =====================================================
          BOOK COVER
          ===================================================== */}

      <div className="book-card-cover">
        {book?.coverImageUrl || book?.coverUrl ? (
          <img
            src={book.coverImageUrl || book.coverUrl}
            alt={`${book.title || "Book"} cover`}
          />
        ) : (
          <div className="book-card-cover-fallback">
            <BookOpen size={42} />
            <span>{book?.title || "Untitled Book"}</span>
          </div>
        )}
      </div>

      {/* =====================================================
          BOOK INFORMATION
          ===================================================== */}

      <div className="book-card-info">

        {/* CATEGORY */}

        <span className="book-card-category">
          {book?.category || "Book"}
        </span>

        {/* TITLE */}

        <h3 className="book-card-title">
          {book?.title || "Untitled Book"}
        </h3>

        {/* AUTHOR */}

        <p className="book-card-author">
          By {authorName}
        </p>

        {/* ===================================================
            BOTTOM
            ONLY PAGES + ARROW
            =================================================== */}

        <div className="book-card-bottom">

          <div className="book-card-pages">
            <BookOpen size={15} />

            <span>
              {pageCount}{" "}
              {pageCount === 1 ? "Page" : "Pages"}
            </span>
          </div>

          <span
            className="book-card-arrow"
            aria-hidden="true"
          >
            <ArrowRight size={18} />
          </span>

        </div>
      </div>
    </Link>
  );
}

export default BookCard;