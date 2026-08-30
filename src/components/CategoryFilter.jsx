import "./CategoryFilter.css";

// Renders "All" plus one pill per category. The parent (Explore page) owns
// which category is currently selected and passes it down as `active`.
function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="category-filter">
      <button
        className={active === "all" ? "category-pill active" : "category-pill"}
        onClick={() => onChange("all")}
      >
        All
      </button>

      {categories.map((category) => (
        <button
          key={category}
          className={active === category ? "category-pill active" : "category-pill"}
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
