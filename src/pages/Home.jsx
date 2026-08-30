import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  PenLine,
  Library,
  Quote,
} from "lucide-react";

import "./Home.css";

function Home() {
  return (
    <div className="home-page">

      {/* ================= HERO ================= */}
      <section className="hero-section">
        <div className="hero-background-glow glow-one"></div>
        <div className="hero-background-glow glow-two"></div>

        <div className="hero-container">

          <div className="hero-content">

            <div className="hero-label">
              <Sparkles size={15} />
              <span>VIYAZHAM PUBLICATION</span>
            </div>

            <h1>
              Stories that
              <span> stay with you.</span>
            </h1>

            <p className="hero-description">
              Discover meaningful Tamil books, inspiring writers and
              unforgettable stories — all in one beautiful reading space.
            </p>

            <div className="hero-buttons">

              <Link to="/books" className="primary-button">
                <BookOpen size={19} />
                Explore Books
                <ArrowRight size={18} />
              </Link>

              <Link to="/authors" className="secondary-button">
                Meet Our Authors
              </Link>

            </div>

            <div className="hero-stats">

              <div>
                <strong>01</strong>
                <span>Growing Library</span>
              </div>

              <div>
                <strong>∞</strong>
                <span>Stories to Discover</span>
              </div>

              <div>
                <strong>01</strong>
                <span>Growing Community</span>
              </div>

            </div>

          </div>


          {/* ================= BOOK VISUAL ================= */}

          <div className="hero-book-area">

            <div className="floating-note note-one">
              <BookOpen size={17} />
              <span>Discover something new</span>
            </div>

            <div className="floating-note note-two">
              <Sparkles size={17} />
              <span>Stories worth keeping</span>
            </div>

            <div className="book-glow"></div>

            <div className="book-3d">

              <div className="book-spine"></div>

              <div className="book-front">

                <div className="book-top-label">
                  VIYAZHAM
                </div>

                <div className="book-decoration">
                  ✦
                </div>

                <div className="book-title">
                  BOOK
                </div>

                <div className="book-subtitle">
                  Stories & Ideas
                </div>

                <div className="book-line"></div>

                <div className="book-publisher">
                  VIYAZHAM PUBLICATION
                </div>

              </div>

            </div>

            <div className="book-shadow"></div>

          </div>

        </div>
      </section>


      {/* ================= INTRO ================= */}

      <section className="intro-section">

        <div className="section-container">

          <div className="intro-label">
            <span>01</span>
            DISCOVER
          </div>

          <div className="intro-grid">

            <h2>
              A place for
              <em> stories,</em>
              ideas and voices.
            </h2>

            <div>

              <p>
                Viyazham Publication brings together books created by
                passionate writers and makes them easier for readers to
                discover.
              </p>

              <Link to="/books" className="text-link">
                Explore the collection
                <ArrowRight size={17} />
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* ================= FEATURED BOOK ================= */}

      <section className="featured-section">

        <div className="section-container">

          <div className="section-heading">

            <div>
              <span className="eyebrow">
                FEATURED READING
              </span>

              <h2>
                Discover a new story.
              </h2>
            </div>

            <Link to="/books" className="view-all-link">
              View all books
              <ArrowRight size={17} />
            </Link>

          </div>


          <div className="featured-card">

            <div className="featured-cover">

              <div className="mini-book">

                <div className="mini-book-top">
                  VIYAZHAM
                </div>

                <div className="mini-book-symbol">
                  ✦
                </div>

                <div className="mini-book-title">
                  BOOK
                </div>

                <div className="mini-book-author">
                  VIYAZHAM PUBLICATION
                </div>

              </div>

            </div>


            <div className="featured-info">

              <span className="featured-tag">
                FEATURED READING
              </span>

              <h3>
                Your next favourite book
              </h3>

              <p className="featured-description">
                Explore our growing collection of books from Tamil
                writers and independent creators. Discover new voices,
                ideas and stories.
              </p>

              <div className="book-meta">

                <span>
                  <BookOpen size={16} />
                  Tamil Collection
                </span>

                <span>
                  <Library size={16} />
                  Growing Library
                </span>

              </div>

              <Link
                to="/books"
                className="read-button"
              >
                Explore Books
                <ArrowRight size={18} />
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* ================= QUOTE ================= */}

      <section className="quote-section">

        <div className="quote-inner">

          <Quote className="quote-icon" size={42} />

          <blockquote>
            “Every book begins as an idea,
            but becomes a story when someone
            chooses to read it.”
          </blockquote>

          <span>
            — Viyazham Publication
          </span>

        </div>

      </section>


      {/* ================= VALUES ================= */}

      <section className="values-section">

        <div className="section-container">

          <div className="values-heading">

            <span className="eyebrow">
              WHY VIYAZHAM
            </span>

            <h2>
              More than a place
              <br />
              to publish.
            </h2>

          </div>


          <div className="values-grid">

            <article className="value-card">

              <div className="value-icon">
                <BookOpen size={22} />
              </div>

              <span>01</span>

              <h3>
                Discover
              </h3>

              <p>
                Find stories from emerging writers and explore books
                you may not discover elsewhere.
              </p>

            </article>


            <article className="value-card">

              <div className="value-icon">
                <PenLine size={22} />
              </div>

              <span>02</span>

              <h3>
                Give a Voice
              </h3>

              <p>
                We create a space where writers can share their ideas,
                experiences and stories with readers.
              </p>

            </article>


            <article className="value-card">

              <div className="value-icon">
                <Library size={22} />
              </div>

              <span>03</span>

              <h3>
                Build a Library
              </h3>

              <p>
                Our collection grows with every new book, creating a
                digital library for future readers.
              </p>

            </article>

          </div>

        </div>

      </section>


      {/* ================= FINAL CTA ================= */}

      <section className="final-cta">

        <div className="final-cta-pattern"></div>

        <div className="final-cta-content">

          <span className="eyebrow">
            YOUR NEXT STORY IS HERE
          </span>

          <h2>
            Take a moment.
            <br />
            <em>Read something meaningful.</em>
          </h2>

          <p>
            Explore our growing collection of books and discover
            your next favourite story.
          </p>

          <Link
            to="/books"
            className="cta-button"
          >
            Explore Books
            <ArrowRight size={19} />
          </Link>

        </div>

      </section>

    </div>
  );
}

export default Home;