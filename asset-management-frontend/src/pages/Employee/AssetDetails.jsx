import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AssetService from "../../services/AssetService";

export default function AssetDetails() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    AssetService.getAllAssets()
      .then((res) => {
        const found = res.find(a => a.aid === parseInt(id));
        if (found) setAsset(found);
        else setError("Asset not found");
      })
      .catch(() => setError("Failed to fetch asset details"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading asset...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-5">
      <h2>Asset Details</h2>
      {asset && (
        <div className="card shadow-sm p-3">
          <img src={asset.imageUrl || "/placeholder.png"} alt={asset.aname} className="img-fluid mb-3" />
          <ul className="list-group">
            <li className="list-group-item"><b>ID:</b> {asset.aid}</li>
            <li className="list-group-item"><b>Name:</b> {asset.aname}</li>
            <li className="list-group-item"><b>Status:</b> {asset.status}</li>
            <li className="list-group-item"><b>Category:</b> {asset.category?.categoryName}</li>
            <li className="list-group-item"><b>Price:</b> ₹{asset.assetValue || "N/A"}</li>
            <li className="list-group-item"><b>Model:</b> {asset.model}</li>
            <li className="list-group-item"><b>Manufactured On:</b> {asset.manufacturingDate}</li>
            <li className="list-group-item"><b>Expiry Date:</b> {asset.expiryDate}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
