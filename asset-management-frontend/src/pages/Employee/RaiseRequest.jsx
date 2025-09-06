import { useEffect, useState } from "react";
import AssetAllocationService from "../../services/AssetAllocationService";
import AssetService from "../../services/AssetService";
import AuthService from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import "./RaiseRequest.css";

export default function RaiseRequest() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [assetName, setAssetName] = useState("");
  const [assets, setAssets] = useState([]);
  const [allocationDate, setAllocationDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser && currentUser.employeeId) {
      setUser(currentUser);
      AssetService.getAllAssets()
        .then(res => setAssets(res))
        .catch(() => setMessage("Failed to fetch assets"));
    } else {
      setMessage("User not logged in. Please login to raise request.");
    }
  }, []);

  const handleAssetChange = (e) => {
    const value = e.target.value;
    setAssetName(value);
    const matched = assets
      .filter(a => a.aname.toLowerCase().includes(value.toLowerCase()))
      .map(a => a.aname);
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
    const asset = assets.find(a => a.aname.toLowerCase().trim() === assetName.toLowerCase().trim());

    if (!asset) {
      setMessage("Please select a valid asset from suggestions");
      return;
    }
    if (!allocationDate || !returnDate) {
      setMessage("Please select allocation and return dates");
      return;
    }

    const payload = {
      eid,
      aid: asset.aid,
      allocationDate: new Date(allocationDate),
      returnDate: new Date(returnDate)
    };

    AssetAllocationService.allocateAsset(payload)
      .then(() => {
        setMessage("Asset request submitted successfully");
        setTimeout(() => navigate("/dashboard/user/allocations"), 3000);
      })
      .catch(err => {
        const errMsg = err.response?.data?.message || "Failed to raise request";
        setMessage(errMsg);
      });
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

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label">Allocation Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={allocationDate}
                  onChange={e => setAllocationDate(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Return Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={returnDate}
                  onChange={e => setReturnDate(e.target.value)}
                />
              </div>
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
