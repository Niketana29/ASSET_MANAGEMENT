import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import assetService from "../../services/assetService"; 
import "./AssetDetails.css";

export default function AssetDetails() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    assetService
      .getAssetById(id)
      .then((res) => {
        if (res) setAsset(res);
        else setError("Asset not found");
      })
      .catch(() => setError("Failed to fetch asset details"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center mt-5">Loading asset details...</p>;
  if (error) return <div className="alert alert-danger text-center mt-5">{error}</div>;

  return (
    <div className="container asset-details-container mt-5">
      <h2 className="page-title text-center">Asset Details</h2>

      {asset && (
        <div className="card asset-details-card mx-auto shadow-sm">
          <ul className="list-group list-group-flush">
            <li className="list-group-item"><b>ID:</b> {asset.aid}</li>
            <li className="list-group-item"><b>Name:</b> {asset.aname}</li>
            <li className="list-group-item">
              <b>Status:</b>{" "}
              <span className={`status-badge status-${asset.status?.toLowerCase()}`}>
                {asset.status}
              </span>
            </li>
            <li className="list-group-item"><b>Category:</b> {asset.category?.categoryName || "N/A"}</li>
            <li className="list-group-item"><b>Price:</b> ₹{asset.assetValue || "N/A"}</li>
            <li className="list-group-item"><b>Model:</b> {asset.model || "N/A"}</li>
            <li className="list-group-item"><b>Manufactured On:</b> {asset.manufacturingDate || "N/A"}</li>
            <li className="list-group-item"><b>Expiry Date:</b> {asset.expiryDate || "N/A"}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
