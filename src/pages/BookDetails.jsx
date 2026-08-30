import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { getBookById } from "../services/booksService";
import Loader from "../components/Loader";
import "./BookDetails.css";

function BookDetails() {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);
    setNotFound(false);

    getBookById(bookId).then((result) => {
      if (!isCurrent) return;
      if (result) {
        setBook(result);
      } else {
        setNotFound(true);
      }
      setIsLoading(false);
    });

    return () => {
      isCurrent = false;
    };
  }, [bookId]);

  if (isLoading) {
    return <Loader label="Loading book..." />;
  }

  // Reuses the existing 404 page rather than duplicating "not found" UI.
  if (notFound) {
    return <Navigate to="/not-found" replace />;
  }

  return (
    <main className="book-details">
      <div className="book-details-cover">
        {book.coverImageUrl ? (
          <img src={book.coverImageUrl} alt={`${book.title} cover`} />
        ) : (
          <div className="book-details-cover-fallback">{book.title}</div>
        )}
      </div>

      <div className="book-details-info">
        <span className="book-details-category">{book.category}</span>
        <h1>{book.title}</h1>
        <p className="book-details-author">By {book.author.name}</p>
        <p className="book-details-description">{book.description}</p>

        <dl className="book-details-meta">
          <div>
            <dt>Language</dt>
            <dd>{book.language}</dd>
          </div>
          <div>
            <dt>Pages</dt>
            <dd>{book.pages}</dd>
          </div>
          {book.price != null && (
            <div>
              <dt>Cost</dt>
              <dd className="book-details-price">₹{book.price}</dd>
            </div>
          )}
        </dl>

        <div className="book-details-actions">
          <Link to={`/books/${book.id}/read`} className="primary-btn">
            Read Now
          </Link>

          {book.allowDownload && (
            <a
              href={book.pdfUrl}
              download
              className="secondary-btn"
              style={{ textDecoration: "none" }}
            >
              Download
            </a>
          )}
        </div>
      </div>
    </main>
  );
}

export default BookDetails;
