import { useEffect, useState } from "react";
import categoryService from "../../services/categoryService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ManageCategories.css";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newCategory, setNewCategory] = useState({
    categoryName: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    categoryService
      .getAllCategories()
      .then((data) => setCategories(data || []))
      .catch(() => toast.error("❌ Failed to load categories"));
  };

  const resetForm = () => {
    setEditingId(null);
    setNewCategory({
      categoryName: "",
      description: "",
      isActive: true,
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCategory((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      categoryService
        .updateCategory(editingId, newCategory)
        .then(() => {
          toast.success("✅ Category updated");
          resetForm();
          loadCategories();
        })
        .catch(() => toast.error("❌ Failed to update category"));
    } else {
      categoryService
        .createCategory(newCategory)
        .then(() => {
          toast.success("✅ Category added");
          resetForm();
          loadCategories();
        })
        .catch(() => toast.error("❌ Failed to add category"));
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat.categoryId);
    setNewCategory({
      categoryName: cat.categoryName,
      description: cat.description || "",
      isActive: cat.isActive,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this category?")) {
      categoryService
        .deleteCategory(id)
        .then(() => {
          toast.success("🗑️ Category deleted");
          loadCategories();
        })
        .catch(() => toast.error("❌ Failed to delete category"));
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Manage Categories</h2>

      {/* Form Section */}
      <div className="card p-4 shadow-sm mb-4">
        <h5 className="card-title mb-3 text-white bg-primary p-2 rounded">
          {editingId ? "Edit Category" : "Add New Category"}
        </h5>

        <form onSubmit={handleSubmit} className="row g-2 align-items-center">
          <div className="col-12 col-md-4">
            <input
              type="text"
              name="categoryName"
              className="form-control"
              placeholder="Category Name"
              value={newCategory.categoryName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12 col-md-4">
            <input
              type="text"
              name="description"
              className="form-control"
              placeholder="Description"
              value={newCategory.description}
              onChange={handleChange}
            />
          </div>

          <div className="col-12 col-md-2 d-flex align-items-center">
            <div className="form-check">
              <input
                type="checkbox"
                name="isActive"
                className="form-check-input"
                id="isActive"
                checked={newCategory.isActive}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="isActive">
                Active
              </label>
            </div>
          </div>

          <div className="col-12 col-md-2">
            <button className="btn btn-success w-100">
              {editingId ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>

      {/* Category List */}
      <ul className="list-group shadow-sm rounded">
        {categories.map((c) => (
          <li
            key={c.categoryId}
            className="list-group-item d-flex flex-wrap align-items-center justify-content-between"
          >
            <div>
              <strong>{c.categoryName}</strong> – {c.description}
              <span
                className={`badge ms-2 ${
                  c.isActive ? "bg-success" : "bg-secondary"
                }`}
              >
                {c.isActive ? "Active" : "Inactive"}
              </span>
              {typeof c.assetCount !== "undefined" && (
                <span className="badge bg-info ms-2">
                  Assets: {c.assetCount}
                </span>
              )}
            </div>

            <div className="d-flex gap-2 flex-wrap justify-content-start">
              <button
                className="btn btn-warning btn-sm"
                onClick={() => handleEdit(c)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(c.categoryId)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}
