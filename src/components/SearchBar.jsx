import { Search } from "lucide-react";
import "./SearchBar.css";

// Controlled search input. The parent (Explore page) owns the actual
// search string in state — this component just renders the input and
// reports changes upward via onChange.
function SearchBar({ value, onChange, placeholder = "Search books or authors..." }) {
  return (
    <div className="search-bar">
      <Search size={18} className="search-bar-icon" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search books"
      />
    </div>
  );
}

export default SearchBar;
