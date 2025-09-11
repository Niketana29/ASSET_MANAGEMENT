import { useEffect, useState } from "react";
import allocationService from "../../services/allocationService";
import assetService from "../../services/assetService";
import serviceRequestService from "../../services/serviceRequestService";

import { useNavigate } from "react-router-dom";
import "./RaiseRequest.css";
import authService from "../../services/AuthService";

export default function RaiseRequest() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [assetName, setAssetName] = useState("");
  const [assets, setAssets] = useState([]);
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Define "simple" assets
  const simpleAssets = ["printer", "mouse", "keyboard", "headphones", "stationery", "pen drive", "calculator"];

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser && currentUser.employeeId) {
      setUser(currentUser);
      assetService
        .getAvailableAssets()
        .then((res) => setAssets(res))
        .catch(() => setMessage("Failed to fetch assets"));
    } else {
      setMessage("User not logged in. Please login to raise request.");
    }
  }, []);

  const handleAssetChange = (e) => {
    const value = e.target.value;
    setAssetName(value);
    const matched = assets
      .filter((a) => a.aname.toLowerCase().includes(value.toLowerCase()))
      .map((a) => a.aname);
    setSuggestions(matched.slice(0, 5));
  };

  const handleSuggestionClick = (name) => {
    setAssetName(name);
    setSuggestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user || !user.employeeId) {
      setMessage("Invalid user. Please login again.");
      return;
    }

    const eid = user.employeeId;
    const asset = assets.find(
      (a) => a.aname.toLowerCase().trim() === assetName.toLowerCase().trim()
    );

    if (!asset) {
      setMessage("Please select a valid asset from suggestions");
      return;
    }

    // Check if asset is "simple"
    const isSimple = simpleAssets.some((s) =>
      asset.aname.toLowerCase().includes(s)
    );

    if (isSimple) {
      // Auto approve allocation
      allocationService
        .allocateAsset(asset.aid, eid, "Auto-approved request")
        .then(() => {
          setMessage("Asset allocated successfully (auto-approved).");
          setTimeout(() => navigate("/dashboard/user/allocations"), 3000);
        })
        .catch((err) => {
          const errMsg = err.response?.data?.message || "Failed to allocate asset";
          setMessage(errMsg);
        });
    } else {
      // Create service request (pending approval)
      const requestData = {
        employeeId: eid,
        assetId: asset.aid,
        requestType: "NEW_ASSET",
        priority: "HIGH",
        status: "PENDING",
        adminComments: "",
      };

      serviceRequestService
        .createServiceRequest(requestData)
        .then(() => {
          setMessage(
            "Request submitted successfully. Waiting for admin approval."
          );
          setTimeout(() => navigate("/dashboard/user/requests"), 3000);
        })
        .catch((err) => {
          const errMsg =
            err.response?.data?.message || "Failed to create service request";
          setMessage(errMsg);
        });
    }
  };

  return (
    <div className="container raise-request-container mt-5">
      <div className="card">
        <h2 className="card-title">Raise Asset Request</h2>
        {message && <div className="alert alert-info">{message}</div>}

        {user ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4 position-relative">
              <input
                type="text"
                className="form-control"
                placeholder="Asset Name"
                value={assetName}
                onChange={handleAssetChange}
              />
              {suggestions.length > 0 && (
                <ul className="list-group suggestions-list">
                  {suggestions.map((s, idx) => (
                    <li
                      key={idx}
                      className="list-group-item list-group-item-action"
                      onClick={() => handleSuggestionClick(s)}
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button className="btn btn-primary w-100">Submit Request</button>
          </form>
        ) : (
          <p className="text-center">Please login to raise an asset request.</p>
        )}
      </div>
    </div>
  );
}
