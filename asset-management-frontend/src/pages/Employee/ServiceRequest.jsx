import { useEffect, useState } from "react";
import "./ServiceRequest.css";
import authService from "../../services/AuthService";
import allocationService from "../../services/allocationService";
import serviceRequestService from "../../services/serviceRequestService";


export default function ServiceRequest() {
  const user = authService.getCurrentUser();
  const [eid] = useState(user?.employeeId || "");

  const [assetName, setAssetName] = useState("");
  const [allocatedAssets, setAllocatedAssets] = useState([]);
  const [description, setDescription] = useState("");
  const [issueType, setIssueType] = useState("MALFUNCTION");
  const [requestType, setRequestType] = useState("REPAIR");
  const [priority, setPriority] = useState("MEDIUM");
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!eid) return;
    allocationService.getAllocationsByEmployee(eid)
      .then((res) => {
        const myAssets = res.map((a) => a.asset);
        setAllocatedAssets(myAssets);
      })
      .catch(() => setMessage("Failed to load allocated assets"));
  }, [eid]);

  const handleAssetChange = (e) => {
    const value = e.target.value;
    setAssetName(value);
    const matched = allocatedAssets
      .filter((a) => a.assetName.toLowerCase().includes(value.toLowerCase()))
      .map((a) => a.assetName);
    setSuggestions(matched.slice(0, 5));
  };

  const handleSuggestionClick = (name) => {
    setAssetName(name);
    setSuggestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const asset = allocatedAssets.find(
      (a) => a.assetName.toLowerCase() === assetName.toLowerCase()
    );

    if (!asset) return setMessage("You can only request service for assets allocated to you");

    serviceRequestService.createServiceRequest({
      employeeId: parseInt(eid),
      assetId: asset.assetId,
      requestType,
      issueType,
      description,
      priority,
      status: "PENDING",
    })
      .then(() => setMessage("Service request submitted successfully"))
      .catch(() => setMessage("Failed to submit request"));
  };

  return (
    <div className="container service-request-container mt-5">
      <div className="card p-4 shadow">
        <h2 className="card-title mb-3">Raise Service Request</h2>
        {message && <div className="alert alert-info">{message}</div>}

        <form onSubmit={handleSubmit}>
          {/* Asset search */}
          <div className="mb-4 position-relative">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Asset Name"
              value={assetName}
              onChange={handleAssetChange}
              required
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

          {/* Request Type */}
          <div className="mb-3">
            <label className="form-label">Request Type</label>
            <select
              className="form-select"
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
            >
              <option value="REPAIR">Repair</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="REPLACEMENT">Replacement</option>
              <option value="RETURN">Return</option>
            </select>
          </div>

          {/* Issue Type */}
          <div className="mb-3">
            <label className="form-label">Issue Type</label>
            <select
              className="form-select"
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
            >
              <option value="MALFUNCTION">Malfunction</option>
              <option value="REPAIR">Repair</option>
              <option value="INSTALLATION">Installation</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              placeholder="Enter the issue description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>

          {/* Priority */}
          <div className="mb-3">
            <label className="form-label">Priority</label>
            <select
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          <button className="btn btn-primary w-100 mt-2">Submit Request</button>
        </form>
      </div>
    </div>
  );
}
