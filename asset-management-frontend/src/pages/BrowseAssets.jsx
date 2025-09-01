import { useState } from "react";
import { Link } from "react-router-dom";

export default function BrowseAssets() {
  // dummy assets
  const [assets] = useState([
    { id: 1, name: "Dell Laptop", category: "Laptop", price: 60000, status: "Available" },
    { id: 2, name: "Office Chair", category: "Furniture", price: 5000, status: "Available" },
    { id: 3, name: "MacBook Pro", category: "Laptop", price: 120000, status: "In Use" },
    { id: 4, name: "iPhone 15", category: "Gadgets", price: 80000, status: "Available" },
  ]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  
  const filteredAssets = assets.filter(asset =>
    (filter === "All" || asset.category === filter) &&
    asset.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h2>Browse Assets</h2>

      {/* Search + Filter */}
      <div className="row my-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search assets..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-control"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Laptop">Laptop</option>
            <option value="Furniture">Furniture</option>
            <option value="Car">Car</option>
            <option value="Gadgets">Gadgets</option>
          </select>
        </div>
      </div>

      {/* Asset Cards */}
      <div className="row">
        {filteredAssets.length > 0 ? (
          filteredAssets.map(asset => (
            <div key={asset.id} className="col-md-4 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{asset.name}</h5>
                  <p className="card-text">
                    <strong>Category:</strong> {asset.category} <br />
                    <strong>Price:</strong> ₹{asset.price} <br />
                    <strong>Status:</strong>{" "}
                    <span className={asset.status === "Available" ? "text-success" : "text-danger"}>
                      {asset.status}
                    </span>
                  </p>
                  {/* Link to details page */}
                  <Link to={`/assets/details/${asset.id}`} className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No assets found.</p>
        )}
      </div>
    </div>
  );
}
