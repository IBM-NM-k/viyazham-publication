import { BookOpen, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./BookGrid.css";

function getAuthorName(book) {
  if (!book?.author) {
    return "Unknown Author";
  }

  if (typeof book.author === "string") {
    return book.author;
  }

  if (typeof book.author === "object") {
    return (
      book.author.name ||
      book.author.fullName ||
      book.author.displayName ||
      "Unknown Author"
    );
  }

  return "Unknown Author";
}


function BookGrid({ books, emptyMessage }) {
  const navigate = useNavigate();

  if (!books || books.length === 0) {
    return (
      <div className="book-grid-empty">
        <div className="book-grid-empty-icon">
          <BookOpen size={30} />
        </div>

        <h3>No books found</h3>

        <p>
          {emptyMessage ||
            "New books will appear here once they are published."}
        </p>
      </div>
    );
  }

  const handleBookClick = (book) => {
    navigate(`/books/${book.id}`);
  };

  return (
    <div className="book-grid">
      {books.map((book, index) => {
        const cover =
          book.coverImageUrl ||
          book.coverUrl ||
          "";

        const author = getAuthorName(book);

        return (
          <article
            className="book-card"
            key={book.id}
            style={{
              "--card-delay": `${index * 70}ms`,
            }}
          >
            {/* ================= COVER ================= */}

            <button
              type="button"
              className="book-card-cover-button"
              onClick={() => handleBookClick(book)}
              aria-label={`View ${book.title || "book"}`}
            >
              <div className="book-card-cover">

                {cover ? (
                  <img
                    src={cover}
                    alt={`${book.title || "Book"} cover`}
                  />
                ) : (
                  <div className="book-card-cover-fallback">
                    <BookOpen size={42} />
                    <span>
                      {book.title || "Untitled Book"}
                    </span>
                  </div>
                )}

                
                {/* hover overlay */}

                <span className="book-card-view">
                  View Book
                  <ArrowUpRight size={15} />
                </span>

              </div>
            </button>

            {/* ================= INFORMATION ================= */}

            <div className="book-card-info">

              <span className="book-card-category">
                {book.category || "BOOK"}
              </span>

              <h3 className="book-card-title">
                {book.title || "Untitled Book"}
              </h3>

              <p className="book-card-author">
                By {author}
              </p>

              <div className="book-card-bottom">

                <div className="book-card-meta">

                  <span>
                    <BookOpen size={14} />

                    {book.pages
                      ? `${book.pages} Pages`
                      : "Book"}
                  </span>

                  
                </div>

                <button
                  type="button"
                  className="book-card-arrow"
                  onClick={() => handleBookClick(book)}
                  aria-label={`Open ${book.title || "book"}`}
                >
                  <ArrowUpRight size={18} />
                </button>

              </div>

            </div>
          </article>
        );
      })}
    </div>
  );
}

export default BookGrid;