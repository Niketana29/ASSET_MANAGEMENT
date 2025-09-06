import { useEffect, useState } from "react";
import AssetService from "../../services/AssetService";
import CategoryService from "../../services/CategoryService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ManageAssets.css"; // Create a CSS file for custom styles

export default function ManageAssets() {
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [newAsset, setNewAsset] = useState({
    assetNo: "",
    aname: "",
    status: "AVAILABLE",
    categoryId: "",
    model: "",
    assetValue: "",
    manufacturingDate: "",
    expiryDate: "",
  });

  useEffect(() => {
    loadAssets();
    loadCategories();
  }, []);

  const loadAssets = () => {
    AssetService.getAllAssets()
      .then((data) => setAssets(data || []))
      .catch(() => toast.error("❌ Failed to load assets"));
  };

  const loadCategories = () => {
    CategoryService.getAllCategories()
      .then((data) => setCategories(data || []))
      .catch(() => toast.error("❌ Failed to load categories"));
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this asset?")) {
      AssetService.deleteAsset(id)
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
      assetNo: "",
      aname: "",
      status: "AVAILABLE",
      categoryId: "",
      model: "",
      assetValue: "",
      manufacturingDate: "",
      expiryDate: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      AssetService.updateAsset({ ...newAsset, aid: editingId })
        .then(() => {
          toast.success("✅ Asset updated");
          resetForm();
          loadAssets();
        })
        .catch(() => toast.error("❌ Failed to update asset"));
    } else {
      AssetService.addAsset(newAsset)
        .then(() => {
          toast.success("✅ Asset added");
          resetForm();
          loadAssets();
        })
        .catch(() => toast.error("❌ Failed to add asset"));
    }
  };

  const handleEdit = (asset) => {
    setEditingId(asset.aid);
    setNewAsset({
      assetNo: asset.assetNo,
      aname: asset.aname,
      status: asset.status,
      categoryId: asset.category?.categoryId || "",
      model: asset.model,
      assetValue: asset.assetValue,
      manufacturingDate: asset.manufacturingDate,
      expiryDate: asset.expiryDate,
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
              name="assetNo"
              className="form-control"
              placeholder="Asset Number"
              value={newAsset.assetNo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <input
              type="text"
              name="aname"
              className="form-control"
              placeholder="Asset Name"
              value={newAsset.aname}
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
            <select
              name="status"
              className="form-select"
              value={newAsset.status}
              onChange={handleChange}
            >
              <option value="AVAILABLE">Available</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="UNDER_SERVICE">Under Service</option>
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
              <th>Status</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((a) => (
              <tr key={a.aid}>
                <td>{a.aid}</td>
                <td>{a.aname}</td>
                <td>
                  <span
                    className={`badge ${a.status === "AVAILABLE"
                        ? "bg-success"
                        : a.status === "ASSIGNED"
                          ? "bg-warning text-dark"
                          : "bg-danger"
                      }`}
                  >
                    {a.status.replace("_", " ")}
                  </span>
                </td>
                <td>{a.category?.categoryName}</td>
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
                      onClick={() => handleDelete(a.aid)}
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
