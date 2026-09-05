import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  BookOpen,
  LogOut,
  Sparkles,
  ArrowRight,
  MessageCircle,
  X,
  ChevronRight,
} from "lucide-react";

import { getAllBooks } from "../services/booksService";
import { supabase } from "../services/supabaseClient";

import "./UserDashboard.css";

const CATEGORY_COLORS = [
  { bg: "#7B1E3C", text: "#ffffff" },
  { bg: "#C9932F", text: "#171717" },
  { bg: "#3F6142", text: "#ffffff" },
  { bg: "#2B4C7E", text: "#ffffff" },
  { bg: "#B5651D", text: "#ffffff" },
];

const whatsappNumbers = [
  {
    name: "Viyazham Publication",
    number: "919962241090",
    display: "+91 99622 41090",
  },
  {
    name: "Viyazham Publication",
    number: "919514364459",
    display: "+91 95143 64459",
  },
];

function getCategoryColor(category = "") {
  const text = String(category);

  let hash = 0;

  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }

  return CATEGORY_COLORS[
    Math.abs(hash) % CATEGORY_COLORS.length
  ];
}

function getPrice(book) {
  if (
    book?.price === undefined ||
    book?.price === null ||
    book?.price === ""
  ) {
    return "Price unavailable";
  }

  const numericPrice = Number(book.price);

  if (Number.isNaN(numericPrice)) {
    return String(book.price);
  }

  return `₹${numericPrice.toLocaleString("en-IN")}`;
}

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

function UserDashboard() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);

  // ==========================================
  // AUTH
  // ==========================================

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (!session?.user) {
        navigate("/login", { replace: true });
        return;
      }

      const user = session.user;

      const name =
        user.user_metadata?.name ||
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "User";

      setCurrentUser({
        id: user.id,
        email: user.email,
        name,
      });

      setLoading(false);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;

        if (!session?.user) {
          setCurrentUser(null);
          navigate("/login", { replace: true });
          return;
        }

        const user = session.user;

        const name =
          user.user_metadata?.name ||
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "User";

        setCurrentUser({
          id: user.id,
          email: user.email,
          name,
        });
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  // ==========================================
  // LOAD ALL BOOKS
  // ==========================================

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const allBooks = await getAllBooks();

        const publishedBooks = (allBooks || []).filter(
          (book) =>
            book.status === "published" ||
            !book.status
        );

        // Newest uploaded book first
        const latestBooks = [...publishedBooks].reverse();

        setBooks(latestBooks);
      } catch (error) {
        console.error("Failed to load books:", error);
        setBooks([]);
      }
    };

    loadBooks();
  }, []);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();

      localStorage.removeItem("userLoggedIn");
      localStorage.removeItem("currentUser");

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // ==========================================
  // BUY NOW
  // ==========================================

  const handleBuyNow = (book) => {
    setSelectedBook(book);
  };

  // ==========================================
  // OPEN WHATSAPP
  // ==========================================

  const openWhatsApp = (number) => {
    if (!selectedBook) return;

    const title = selectedBook.title || "Book";
    const author = getAuthorName(selectedBook);
    const price = getPrice(selectedBook);

    const message = `Hello Viyazham Publication,

I would like to buy this book.

Book: ${title}

Author: ${author}

Price: ${price}

Please provide the purchase details.`;

    const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent(
      message
    )}`;

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );

    setSelectedBook(null);
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading || !currentUser) {
    return (
      <div className="vd-loading">
        <div className="vd-loading-orbit">
          <BookOpen size={25} />
        </div>

        <p>Preparing your bookshelf...</p>
      </div>
    );
  }

  // ==========================================
  // BOOK DATA
  // ==========================================

  // Newest uploaded book
  const featuredBook =
    books.length > 0 ? books[0] : null;

  // Newest 8 books
  const recentBooks = books.slice(0, 8);

  return (
    <main className="vd-page">
      <div className="vd-container">

        {/* ==========================================
            TOP BAR
        ========================================== */}

        <header className="vd-topbar">
          <div className="vd-brand">
            <div className="vd-brand-mark">
              <BookOpen size={20} />
            </div>

            <div>
              <strong>VIYAZHAM</strong>
              <span>PUBLICATION</span>
            </div>
          </div>

          <button
            className="vd-logout"
            onClick={handleLogout}
            type="button"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </header>

        {/* ==========================================
            WELCOME
        ========================================== */}

        <section className="vd-welcome">
          <div className="vd-welcome-decoration">
            <Sparkles size={18} />
          </div>

          <div>
            <span className="vd-small-label">
              YOUR PERSONAL LIBRARY
            </span>

            <h1>
              Welcome back,{" "}
              <span>{currentUser.name}</span>
            </h1>

            <p>
              Discover meaningful books, explore new
              stories, and find something worth reading
              today.
            </p>
          </div>
        </section>

        {/* ==========================================
            FEATURED BOOK
        ========================================== */}

        {featuredBook && (
          <section className="vd-featured">
            <div className="vd-featured-glow"></div>

            {/* COVER */}

            <div className="vd-featured-cover-area">
              <button
                className="vd-featured-cover-frame"
                onClick={() =>
                  navigate(
                    `/books/${featuredBook.id}`
                  )
                }
                type="button"
                aria-label={`View ${featuredBook.title}`}
              >
                {featuredBook.coverImageUrl ||
                featuredBook.coverUrl ? (
                  <img
                    src={
                      featuredBook.coverImageUrl ||
                      featuredBook.coverUrl
                    }
                    alt={
                      featuredBook.title ||
                      "Book cover"
                    }
                  />
                ) : (
                  <div className="vd-cover-placeholder">
                    <BookOpen size={55} />
                  </div>
                )}

                <span className="vd-cover-read-badge">
                  <BookOpen size={15} />
                  View Book
                </span>
              </button>
            </div>

            {/* CONTENT */}

            <div className="vd-featured-content">
              <div className="vd-featured-tag">
                <Sparkles size={15} />
                FEATURED BOOK
              </div>

              <h2>
                {featuredBook.title}
              </h2>

              <p className="vd-featured-author">
                by {getAuthorName(featuredBook)}
              </p>

              <span
                className="vd-category-pill"
                style={{
                  backgroundColor:
                    getCategoryColor(
                      featuredBook.category
                    ).bg,
                  color:
                    getCategoryColor(
                      featuredBook.category
                    ).text,
                }}
              >
                {featuredBook.category || "Book"}
              </span>

              <p className="vd-featured-description">
                {featuredBook.description ||
                  "Explore this wonderful book from Viyazham Publication."}
              </p>

              {/* FEATURED FOOTER */}

              <div className="vd-featured-footer">
                <div className="vd-featured-price">
                  {getPrice(featuredBook)}
                </div>

                <div className="vd-featured-actions">

                  {/* VIEW DETAILS */}

                  <button
                    className="vd-secondary-btn"
                    onClick={() =>
                      navigate(
                        `/books/${featuredBook.id}`
                      )
                    }
                    type="button"
                  >
                    View Details
                    <ArrowRight size={17} />
                  </button>

                  {/* BUY */}

                  <button
                    className="vd-primary-btn"
                    onClick={() =>
                      handleBuyNow(featuredBook)
                    }
                    type="button"
                  >
                    <MessageCircle size={17} />
                    Buy Now
                  </button>

                </div>
              </div>
            </div>
          </section>
        )}

        {/* ==========================================
            BOOK COLLECTION
        ========================================== */}

        <section className="vd-books-section">

          <div className="vd-section-header">
            <div>
              <span className="vd-small-label">
                OUR COLLECTION
              </span>

              <h2>
                Recently Added Books
              </h2>

              <p>
                Explore the latest books published by
                Viyazham.
              </p>
            </div>

            <button
              className="vd-view-all"
              onClick={() =>
                navigate("/books")
              }
              type="button"
            >
              View All Books
              <ArrowRight size={17} />
            </button>
          </div>

          {/* EMPTY */}

          {books.length === 0 ? (
            <div className="vd-empty">
              <div className="vd-empty-icon">
                <BookOpen size={35} />
              </div>

              <h3>
                No books available yet
              </h3>

              <p>
                New books will appear here once they
                are published.
              </p>
            </div>
          ) : (

            /* BOOK GRID */

            <div className="vd-book-grid">
              {recentBooks.map((book) => {
                const categoryColor =
                  getCategoryColor(
                    book.category
                  );

                return (
                  <article
                    className="vd-book-card"
                    key={book.id}
                  >

                    {/* ==================================
                        BOOK COVER
                    ================================== */}

                    <button
                      className="vd-book-cover"
                      onClick={() =>
                        navigate(
                          `/books/${book.id}`
                        )
                      }
                      type="button"
                      aria-label={`View ${book.title}`}
                    >
                      <div className="vd-book-cover-inner">

                        {book.coverImageUrl ||
                        book.coverUrl ? (
                          <img
                            src={
                              book.coverImageUrl ||
                              book.coverUrl
                            }
                            alt={
                              book.title ||
                              "Book cover"
                            }
                            loading="lazy"
                          />
                        ) : (
                          <div className="vd-cover-placeholder">
                            <BookOpen size={40} />
                          </div>
                        )}

                        <span className="vd-cover-overlay">
                          <BookOpen size={18} />
                          View Details
                        </span>

                      </div>
                    </button>

                    {/* ==================================
                        BOOK INFORMATION
                    ================================== */}

                    <div className="vd-book-info">

                      <span
                        className="vd-book-category"
                        style={{
                          backgroundColor:
                            categoryColor.bg,
                          color:
                            categoryColor.text,
                        }}
                      >
                        {book.category || "Book"}
                      </span>

                      <h3>
                        {book.title ||
                          "Untitled Book"}
                      </h3>

                      <p className="vd-book-author">
                        {getAuthorName(book)}
                      </p>

                      <p className="vd-book-description">
                        {book.description ||
                          "Discover this book from Viyazham Publication."}
                      </p>

                      {/* BOOK FOOTER */}

                      <div className="vd-book-footer">

                        <strong>
                          {getPrice(book)}
                        </strong>

                        <button
                          className="vd-buy-small"
                          onClick={() =>
                            handleBuyNow(book)
                          }
                          type="button"
                        >
                          <MessageCircle size={15} />
                          Buy
                        </button>

                      </div>
                    </div>

                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* ==========================================
            BROWSE ALL
        ========================================== */}

        {books.length > 0 && (
          <button
            className="vd-browse-all"
            onClick={() =>
              navigate("/books")
            }
            type="button"
          >
            <BookOpen size={18} />
            Browse All Books
            <ArrowRight size={18} />
          </button>
        )}

      </div>

      {/* ==========================================
          WHATSAPP PURCHASE MODAL
      ========================================== */}

      {selectedBook && (
        <div
          className="vd-modal-overlay"
          onClick={() =>
            setSelectedBook(null)
          }
        >
          <div
            className="vd-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* CLOSE */}

            <button
              className="vd-modal-close"
              onClick={() =>
                setSelectedBook(null)
              }
              type="button"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* ICON */}

            <div className="vd-modal-icon">
              <MessageCircle size={27} />
            </div>

            <span className="vd-modal-label">
              PURCHASE
            </span>

            <h2>
              Buy this book
            </h2>

            <p className="vd-modal-subtitle">
              Contact us on WhatsApp to purchase
              this book.
            </p>

            {/* SELECTED BOOK */}

            <div className="vd-selected-book">

              <div className="vd-selected-cover">
                {selectedBook.coverImageUrl ||
                selectedBook.coverUrl ? (
                  <img
                    src={
                      selectedBook.coverImageUrl ||
                      selectedBook.coverUrl
                    }
                    alt={
                      selectedBook.title ||
                      "Book cover"
                    }
                  />
                ) : (
                  <BookOpen size={25} />
                )}
              </div>

              <div className="vd-selected-info">

                <h3>
                  {selectedBook.title}
                </h3>

                <p>
                  {getAuthorName(selectedBook)}
                </p>

                <strong>
                  {getPrice(selectedBook)}
                </strong>

              </div>
            </div>

            {/* WHATSAPP OPTIONS */}

            <div className="vd-whatsapp-options">
              {whatsappNumbers.map((item) => (
                <button
                  className="vd-whatsapp-option"
                  key={item.number}
                  onClick={() =>
                    openWhatsApp(item.number)
                  }
                  type="button"
                >
                  <div className="vd-whatsapp-icon">
                    <MessageCircle size={20} />
                  </div>

                  <div className="vd-whatsapp-info">
                    <strong>
                      {item.name}
                    </strong>

                    <span>
                      {item.display}
                    </span>
                  </div>

                  <ChevronRight size={18} />
                </button>
              ))}
            </div>

            {/* CANCEL */}

            <button
              className="vd-cancel"
              onClick={() =>
                setSelectedBook(null)
              }
              type="button"
            >
              Cancel
            </button>

          </div>
        </div>
      )}

    </main>
  );
}

export default UserDashboard;