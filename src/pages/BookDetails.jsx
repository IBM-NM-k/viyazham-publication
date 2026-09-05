import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowRight, BookOpen, Download, Eye } from "lucide-react";

import { getBookById } from "../services/booksService";
import Loader from "../components/Loader";

import "./BookDetails.css";

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

function BookDetails() {
  const { bookId } = useParams();

  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    setIsLoading(true);
    setNotFound(false);

    getBookById(bookId)
      .then((result) => {
        if (!isCurrent) return;

        if (result) {
          setBook(result);
        } else {
          setNotFound(true);
        }

        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load book:", error);

        if (!isCurrent) return;

        setNotFound(true);
        setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [bookId]);

  if (isLoading) {
    return <Loader label="Loading book..." />;
  }

  if (notFound) {
    return <Navigate to="/not-found" replace />;
  }

  if (!book) {
    return <Navigate to="/not-found" replace />;
  }

  const authorName = getAuthorName(book);

  const coverImage =
    book.coverImageUrl ||
    book.coverUrl ||
    "";

  const category =
    book.category ||
    "Book";

  const language =
    book.language ||
    "Not specified";

  const pages =
    book.pages ||
    "—";

  const hasPrice =
    book.price !== undefined &&
    book.price !== null &&
    book.price !== "";

  return (
    <main className="book-details-page">

      {/* =========================================
          DECORATIVE BACKGROUND
          ========================================= */}

      <div className="book-details-decoration book-details-decoration-one" />
      <div className="book-details-decoration book-details-decoration-two" />

      <div className="book-details-container">

        {/* =========================================
            BOOK COVER
            ========================================= */}

        <section className="book-details-cover-section">

          <div className="book-details-cover-shadow" />

          <div className="book-details-cover">

            {coverImage ? (
              <img
                src={coverImage}
                alt={`${book.title} cover`}
              />
            ) : (
              <div className="book-details-cover-fallback">
                <BookOpen size={65} />
                <span>{book.title}</span>
              </div>
            )}

          </div>

          <div className="book-details-cover-caption">
            <span>VIYAZHAM PUBLICATION</span>
          </div>

        </section>


        {/* =========================================
            BOOK INFORMATION
            ========================================= */}

        <section className="book-details-info">

          {/* Category */}

          <div className="book-details-category-row">

            <span className="book-details-category">
              {category}
            </span>

            <span className="book-details-edition">
              BOOK DETAILS
            </span>

          </div>


          {/* Title */}

          <h1>
            {book.title || "Untitled Book"}
          </h1>


          {/* Author */}

          <p className="book-details-author">
            By <span>{authorName}</span>
          </p>


          {/* Decorative line */}

          <div className="book-details-line">
            <span />
            <span />
            <span />
          </div>


          {/* Description */}

          <p className="book-details-description">
            {book.description ||
              "Discover this meaningful book from Viyazham Publication."}
          </p>


          {/* =========================================
              BOOK META
              ========================================= */}

          <div className="book-details-meta">

            <div className="book-meta-item">

              <span className="book-meta-label">
                LANGUAGE
              </span>

              <strong className="book-meta-language">
                {language}
              </strong>

            </div>


            <div className="book-meta-item">

              <span className="book-meta-label">
                PAGES
              </span>

              <strong className="book-meta-pages">
                {pages}
              </strong>

            </div>


            {hasPrice && (
              <div className="book-meta-item">

                <span className="book-meta-label">
                  COST
                </span>

                <strong className="book-details-price">
                  ₹{Number(book.price).toLocaleString("en-IN")}
                </strong>

              </div>
            )}

          </div>


          {/* =========================================
              ACTIONS
              ========================================= */}

          <div className="book-details-actions">

            <Link
              to={`/books/${book.id}/read`}
              className="book-details-read-btn"
            >
              <BookOpen size={17} />
              <span>Read Now</span>
              <ArrowRight size={16} />
            </Link>


            {book.allowDownload && book.pdfUrl && (
              <a
                href={book.pdfUrl}
                download
                className="book-details-download-btn"
              >
                <Download size={16} />
                <span>Download</span>
              </a>
            )}

          </div>


          {/* =========================================
              SMALL TRUST MESSAGE
              ========================================= */}

          <div className="book-details-footer">

            <div className="book-details-footer-icon">
              <Eye size={15} />
            </div>

            <p>
              Explore the book and enjoy reading with
              Viyazham Publication.
            </p>

          </div>

        </section>

      </div>

    </main>
  );
}

export default BookDetails;