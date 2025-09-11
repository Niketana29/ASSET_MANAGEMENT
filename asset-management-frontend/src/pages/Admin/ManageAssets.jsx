import { useEffect, useState } from "react";
import assetService from "../../services/assetService";
import categoryService from "../../services/categoryService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ManageAssets.css";

export default function ManageAssets() {
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [newAsset, setNewAsset] = useState({
    assetName: "",
    categoryId: "",
    model: "",
    assetValue: "",
    manufacturingDate: "",
    expiryDate: "",
    status: "AVAILABLE",
    description: "",
    serialNumber: "",
    location: ""
  });

  useEffect(() => {
    loadAssets();
    loadCategories();
  }, []);

  const loadAssets = () => {
    assetService.getAllAssets()
      .then((data) => setAssets(data || []))
      .catch(() => toast.error("❌ Failed to load assets"));
  };

  const loadCategories = () => {
    categoryService.getAllCategories()
      .then((data) => setCategories(data || []))
      .catch(() => toast.error("❌ Failed to load categories"));
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this asset?")) {
      assetService.deleteAsset(id)
        .then(() => {
          toast.success("🗑️ Asset deleted");
          loadAssets();
        })
        .catch(() => toast.error("❌ Failed to delete asset"));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAsset((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setNewAsset({
      assetName: "",
      categoryId: "",
      model: "",
      assetValue: "",
      manufacturingDate: "",
      expiryDate: "",
      status: "AVAILABLE",
      description: "",
      serialNumber: "",
      location: ""
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      assetService.updateAsset(editingId, newAsset)
        .then(() => {
          toast.success("✅ Asset updated");
          resetForm();
          loadAssets();
        })
        .catch(() => toast.error("❌ Failed to update asset"));
    } else {
      assetService.createAsset(newAsset)
        .then(() => {
          toast.success("✅ Asset added");
          resetForm();
          loadAssets();
        })
        .catch(() => toast.error("❌ Failed to add asset"));
    }
  };

  const handleEdit = (asset) => {
    setEditingId(asset.assetId);
    setNewAsset({
      assetName: asset.assetName,
      categoryId: asset.categoryId || "",
      model: asset.model || "",
      assetValue: asset.assetValue || "",
      manufacturingDate: asset.manufacturingDate || "",
      expiryDate: asset.expiryDate || "",
      status: asset.status || "AVAILABLE",
      description: asset.description || "",
      serialNumber: asset.serialNumber || "",
      location: asset.location || ""
    });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Manage Assets</h2>

      {/* Form Section */}
      <div className="card p-4 shadow-sm mb-5">
        <h5 className="card-title mb-3 text-white bg-primary p-2 rounded">
          {editingId ? "Edit Asset" : "Add New Asset"}
        </h5>
        <form onSubmit={handleSubmit} className="row g-2">
          <div className="col-12 col-md-6 col-lg-3">
            <input
              type="text"
              name="assetName"
              className="form-control"
              placeholder="Asset Name"
              value={newAsset.assetName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <select
              name="categoryId"
              className="form-select"
              value={newAsset.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.categoryId} value={c.categoryId}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <input
              type="text"
              name="model"
              className="form-control"
              placeholder="Model"
              value={newAsset.model}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <input
              type="number"
              name="assetValue"
              className="form-control"
              placeholder="Asset Value"
              value={newAsset.assetValue}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <input
              type="date"
              name="manufacturingDate"
              className="form-control"
              value={newAsset.manufacturingDate}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <input
              type="date"
              name="expiryDate"
              className="form-control"
              value={newAsset.expiryDate}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <input
              type="text"
              name="serialNumber"
              className="form-control"
              placeholder="Serial Number"
              value={newAsset.serialNumber}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <select
              name="status"
              className="form-select"
              value={newAsset.status}
              onChange={handleChange}
            >
              <option value="AVAILABLE">Available</option>
              <option value="ALLOCATED">Allocated</option>
              <option value="UNDER_MAINTENANCE">Under Maintenance</option>
              <option value="RETIRED">Retired</option>
            </select>
          </div>
          <div className="col-12 mt-2">
            <button className="btn btn-success me-2 w-100 w-md-auto">
              {editingId ? "Update Asset" : "Add Asset"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary w-100 w-md-auto mt-2 mt-md-0"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table Section */}
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover table-striped align-middle w-100">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Status</th>
              <th>Serial</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((a) => (
              <tr key={a.assetId}>
                <td>{a.assetId}</td>
                <td>{a.assetName}</td>
                <td>{a.categoryName}</td>
                <td>
                  <span
                    className={`badge ${a.status === "AVAILABLE"
                        ? "bg-success"
                        : a.status === "ALLOCATED"
                          ? "bg-warning text-dark"
                          : a.status === "UNDER_MAINTENANCE"
                            ? "bg-info text-dark"
                            : "bg-secondary"
                      }`}
                  >
                    {a.status.replace("_", " ")}
                  </span>
                </td>
                <td>{a.serialNumber}</td>
                <td className="text-nowrap">
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleEdit(a)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(a.assetId)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}
