import { useEffect, useState } from "react";
import ServiceRequestService from "../../services/ServiceRequestService";
import AssetAllocationService from "../../services/AssetAllocationService";
import AuthService from "../../services/AuthService";
import "./ServiceRequest.css";

export default function ServiceRequest() {
  const user = AuthService.getCurrentUser();
  const [eid] = useState(user?.employeeId || "");

  const [assetName, setAssetName] = useState("");
  const [allocatedAssets, setAllocatedAssets] = useState([]);
  const [description, setDescription] = useState("");
  const [issueType, setIssueType] = useState("MALFUNCTION");
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!eid) return;
    AssetAllocationService.getAllocationsByEmployee(eid)
      .then(res => {
        const myAssets = res.map(a => a.asset);
        setAllocatedAssets(myAssets);
      })
      .catch(() => setMessage("Failed to load allocated assets"));
  }, [eid]);

  const handleAssetChange = (e) => {
    const value = e.target.value;
    setAssetName(value);
    const matched = allocatedAssets
      .filter(a => a.assetName.toLowerCase().includes(value.toLowerCase()))
      .map(a => a.assetName);
    setSuggestions(matched.slice(0, 5));
  };

  const handleSuggestionClick = (name) => {
    setAssetName(name);
    setSuggestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const asset = allocatedAssets.find(
      a => a.assetName.toLowerCase() === assetName.toLowerCase()
    );

    if (!asset) return setMessage("You can only request service for assets allocated to you");

    ServiceRequestService.createServiceRequest({
      eid: parseInt(eid),
      aid: asset.aid,
      description,
      issueType,
      status: "PENDING",
    })
      .then(() => setMessage("Service request submitted successfully"))
      .catch(() => setMessage("Failed to submit request"));
  };

  return (
    <div className="container service-request-container mt-5">
      <div className="card">
        <h2 className="card-title">Raise Service Request</h2>
        {message && <div className="alert alert-info">{message}</div>}

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

          <div className="mb-3">
            <label className="form-label">Description of Issue</label>
            <textarea
              className="form-control"
              placeholder="Enter the issue description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Issue Type</label>
            <select
              className="form-select"
              value={issueType}
              onChange={e => setIssueType(e.target.value)}
            >
              <option value="MALFUNCTION">MALFUNCTION</option>
              <option value="REPAIR">REPAIR</option>
            </select>
          </div>

          <button className="btn btn-primary w-100 mt-2">Submit Request</button>
        </form>
      </div>
    </div>
  );
}
