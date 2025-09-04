import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AssetService from "../../services/AssetService";
import "./BrowseAssets.css";

export default function BrowseAssets() {
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    AssetService.getAllAssets()
      .then((res) => {
        setAssets(res);
        setFilteredAssets(res);
        const cats = [...new Set(res.map(a => a.category?.categoryName))].filter(Boolean);
        setCategories(cats);
      })
      .catch(() => setError("Failed to fetch assets"));
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    const matched = assets.filter(a => a.aname.toLowerCase().includes(value.toLowerCase())).map(a => a.aname);
    setSuggestions(matched.slice(0, 5));

    filterAssets(value, selectedCategory);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    filterAssets(search, category);
  };

  const filterAssets = (searchValue, category) => {
    let filtered = assets;
    if (category) filtered = filtered.filter(a => a.category?.categoryName === category);
    if (searchValue) filtered = filtered.filter(a => a.aname.toLowerCase().includes(searchValue.toLowerCase()));
    setFilteredAssets(filtered);
  };

  const handleSuggestionClick = (name) => {
    setSearch(name);
    setSuggestions([]);
    filterAssets(name, selectedCategory);
  };

  return (
    <div className="container browse-assets-container mt-5">
      <h2>Browse Assets</h2>

      <div className="row search-category-row mb-3">
        <div className="col-md-4">
          <select className="form-select" value={selectedCategory} onChange={handleCategoryChange}>
            <option value="">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="col-md-4 position-relative">
          <input
            type="text"
            className="form-control"
            placeholder="Search Asset by Name"
            value={search}
            onChange={handleSearchChange}
          />
          {suggestions.length > 0 && (
            <ul className="list-group suggestions-list">
              {suggestions.map((s, idx) => (
                <li key={idx} className="list-group-item list-group-item-action" onClick={() => handleSuggestionClick(s)}>
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="row">
        {filteredAssets.map(a => (
          <div key={a.aid} className="col-md-4 mb-3">
            <div className="card asset-card shadow-sm">
              <img src={a.imageUrl || "/placeholder.png"} className="card-img-top asset-img" alt={a.aname} />
              <div className="card-body">
                <h5 className="card-title">{a.aname}</h5>
                <p className="card-text">
                  Status: {a.status} <br />
                  Price: ₹{a.assetValue || "N/A"}
                </p>
                <Link to={`/dashboard/user/assets/${a.aid}`} className="btn btn-primary w-100">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
