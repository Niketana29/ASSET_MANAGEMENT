import { useEffect, useState } from "react";
import CategoryService from "../../services/CategoryService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ManageCategories.css"; // Custom CSS

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => loadCategories(), []);

  const loadCategories = () => {
    CategoryService.getAllCategories()
      .then(setCategories)
      .catch(() => toast.error("❌ Failed to load categories"));
  };

  const resetForm = () => {
    setNewCategory("");
    setRequiresApproval(false);
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!newCategory) return;

    const payload = { categoryName: newCategory, requiresApproval };
    if (editingId) payload.categoryId = editingId;

    const action = editingId
      ? CategoryService.updateCategory(payload)
      : CategoryService.addCategory(payload);

    action
      .then(() => {
        toast.success(editingId ? "✅ Category updated" : "✅ Category added");
        resetForm();
        loadCategories();
      })
      .catch(() => toast.error("❌ Operation failed"));
  };

  const handleEdit = (category) => {
    setEditingId(category.categoryId);
    setNewCategory(category.categoryName);
    setRequiresApproval(category.requiresApproval);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this category?")) {
      CategoryService.deleteCategory(id)
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

        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-5">
            <input
              type="text"
              className="form-control"
              placeholder="Category Name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
          </div>

          <div className="col-12 col-md-7 d-flex flex-column flex-md-row align-items-start align-md-center gap-2">
            <div className="form-check me-2">
              <input
                type="checkbox"
                className="form-check-input"
                id="requiresApproval"
                checked={requiresApproval}
                onChange={(e) => setRequiresApproval(e.target.checked)}
              />
              <label
                className="form-check-label"
                htmlFor="requiresApproval"
              >
                Requires Approval
              </label>
            </div>

            <button className="btn btn-success form-btn" onClick={handleSubmit}>
              {editingId ? "Update" : "Add"}
            </button>

            {editingId && (
              <button className="btn btn-secondary form-btn" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category List */}
      <ul className="list-group shadow-sm rounded">
        {categories.map((c) => (
          <li
            key={c.categoryId}
            className="list-group-item d-flex flex-wrap align-items-center justify-content-between"
          >
            <div className="d-flex align-items-center flex-wrap gap-2 mb-2 mb-md-0">
              <span>{c.categoryName}</span>
              <span
                className={`badge ${c.requiresApproval ? "bg-warning text-dark" : "bg-secondary"}`}
              >
                {c.requiresApproval ? "Requires Approval" : "No Approval"}
              </span>
            </div>

            <div className="d-flex gap-2 flex-wrap justify-content-start">
              <button
                className="btn btn-warning btn-sm list-btn"
                onClick={() => handleEdit(c)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger btn-sm list-btn"
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
