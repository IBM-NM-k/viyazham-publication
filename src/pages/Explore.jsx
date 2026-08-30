import { useEffect, useState } from "react";
import { searchBooks, getCategories } from "../services/booksService";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import BookGrid from "../components/BookGrid";
import Loader from "../components/Loader";
import { LogIn, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Explore.css";

function Explore() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  // Load categories
  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  // Search books
  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);

    searchBooks({ query, category }).then((results) => {
      if (isCurrent) {
        setBooks(results);
        setIsLoading(false);
      }
    });

    return () => {
      isCurrent = false;
    };
  }, [query, category]);

  return (
    <main className="explore">

      {/* ================= HEADER ================= */}
      <div className="explore-header">
        <div className="section-label">Our Collection</div>

        <h1>Explore Books</h1>

        <p>
          Discover books published by Viyazham Publication.
        </p>
      </div>


      {/* ================= SEARCH & CATEGORY ================= */}
      <div className="explore-controls">

        <SearchBar
          value={query}
          onChange={setQuery}
        />

        <CategoryFilter
          categories={categories}
          active={category}
          onChange={setCategory}
        />

      </div>


      {/* ================= LOGIN / BUY INFORMATION ================= */}
      <section className="purchase-info">

        <div className="purchase-info-icon">
          <ShoppingBag size={24} />
        </div>

        <div className="purchase-info-content">

          <h3>
            Want to buy a book?
          </h3>

          <p>
            Please log in to your account before purchasing a book.
            After logging in, you can select <strong>Buy Now</strong>
            to place your order.
          </p>

        </div>

        <button
          className="purchase-login-btn"
          onClick={() => navigate("/login")}
        >
          <LogIn size={18} />
          Login to Buy
        </button>

      </section>


      {/* ================= BOOKS ================= */}
      {isLoading ? (
        <Loader label="Loading books..." />
      ) : (
        <BookGrid
          books={books}
          emptyMessage="No books match your search. Try a different title or category."
        />
      )}

    </main>
  );
}

export default Explore;