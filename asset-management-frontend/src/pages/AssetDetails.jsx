import { useParams } from "react-router-dom";

export default function AssetDetails() {
  const { id } = useParams();

  // later fetch from backend by ID
  return (
    <div className="container mt-5">
      <h2>Asset Details</h2>
      <p>Showing details for asset with ID: {id}</p>
      {/* Replace with backend API call later */}
    </div>
  );
}
