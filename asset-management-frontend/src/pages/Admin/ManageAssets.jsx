import { useEffect, useState } from "react";
import AssetService from "../../services/AssetService";
import api from "../../services/api";

export default function ManageAssets() {
  const [assets, setAssets] = useState([]);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);

  const [newAsset, setNewAsset] = useState({
    aname: "",
    status: "AVAILABLE",
    categoryId: "",
    model: "",
    assetValue: "",
    manufacturingDate: "",
    expiryDate: "",
  });

  const loadAssets = () => {
    AssetService.getAllAssets()
      .then(res => setAssets(res))
      .catch(() => setError("Failed to load assets"));
  };

  const loadCategories = () => {
    api.get("/api/categories/getall")
      .then(res => setCategories(res.data))
      .catch(() => setError("Failed to load categories"));
  };

  useEffect(() => {
    loadAssets();
    loadCategories();
  }, []);

  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to delete this asset?")) {
      AssetService.deleteAsset(id).then(loadAssets);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAsset(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    AssetService.addAsset(newAsset)
      .then(() => {
        loadAssets();
        setNewAsset({
          aname: "",
          status: "AVAILABLE",
          categoryId: "",
          model: "",
          assetValue: "",
          manufacturingDate: "",
          expiryDate: "",
        });
      })
      .catch(() => setError("Failed to add asset"));
  };

  return (
    <div className="container mt-5">
      <h2>Manage Assets</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleAdd} className="mb-4 border p-3 shadow-sm">
        <h5>Add New Asset</h5>
        <div className="mb-2">
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
        <div className="mb-2">
          <select
            name="categoryId"
            className="form-select"
            value={newAsset.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <input
            type="text"
            name="model"
            className="form-control"
            placeholder="Model"
            value={newAsset.model}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <input
            type="number"
            name="assetValue"
            className="form-control"
            placeholder="Asset Value"
            value={newAsset.assetValue}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <input
            type="date"
            name="manufacturingDate"
            className="form-control"
            value={newAsset.manufacturingDate}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <input
            type="date"
            name="expiryDate"
            className="form-control"
            value={newAsset.expiryDate}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-success">Add Asset</button>
      </form>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Status</th><th>Category</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assets.map(a => (
            <tr key={a.aid}>
              <td>{a.aid}</td>
              <td>{a.aname}</td>
              <td>{a.status}</td>
              <td>{a.category?.categoryName}</td>
              <td>
                <button className="btn btn-danger btn-sm me-2" onClick={() => handleDelete(a.aid)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
