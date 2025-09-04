import { useEffect, useState } from "react";
import api from "../../services/api";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const loadCategories = () => {
    api.get("/api/categories/getall")
      .then(res => setCategories(res.data))
      .catch(() => setError("Failed to load categories"));
  };

  useEffect(() => loadCategories(), []);

  const handleAddCategory = () => {
    if (!newCategory) return;
    api.post("/api/categories/add", { categoryName: newCategory })
      .then(() => {
        setNewCategory("");
        loadCategories();
      })
      .catch(() => setError("Failed to add category"));
  };

  return (
    <div className="container mt-5">
      <h2>Manage Categories</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3 d-flex">
        <input
          type="text"
          className="form-control me-2"
          placeholder="New Category Name"
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
        />
        <button className="btn btn-success" onClick={handleAddCategory}>Add</button>
      </div>

      <ul className="list-group">
        {categories.map(c => (
          <li key={c.categoryId} className="list-group-item">{c.categoryName}</li>
        ))}
      </ul>
    </div>
  );
}
