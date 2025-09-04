import { useEffect, useState } from "react";
import ServiceRequestService from "../../services/ServiceRequestService";
import AssetAllocationService from "../../services/AssetAllocationService";
import AuthService from "../../services/AuthService";
import "./ServiceRequest.css"

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
    AssetAllocationService.getAllAllocations()
      .then(res => {
        const myAssets = res.filter(a => a.employee?.eid === parseInt(eid)).map(a => a.asset);
        setAllocatedAssets(myAssets);
      });
  }, [eid]);

  const handleAssetChange = (e) => {
    const value = e.target.value;
    setAssetName(value);
    const matched = allocatedAssets.filter(a => a.aname.toLowerCase().includes(value.toLowerCase())).map(a => a.aname);
    setSuggestions(matched.slice(0, 5));
  };

  const handleSuggestionClick = (name) => {
    setAssetName(name);
    setSuggestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const asset = allocatedAssets.find(a => a.aname.toLowerCase() === assetName.toLowerCase());
    if (!asset) return setMessage("You can only request service for assets allocated to you");

    ServiceRequestService.createServiceRequest({
      eid: parseInt(eid),
      aid: asset.aid,
      description,
      issueType,
      status: "PENDING",
    })
      .then(() => setMessage("Service request submitted successfully"))
      .catch(err => {
        console.error(err.response?.data);
        setMessage("Failed to submit request");
      });
  };

  return (
    <div className="container service-request-container mt-5">
      <div className="card">
        <h2>Raise Service Request</h2>
        {message && <div className="alert alert-info">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3 position-relative">
            <input type="text" className="form-control" placeholder="Asset Name" value={assetName} onChange={handleAssetChange} />
            {suggestions.length > 0 && (
              <ul className="list-group position-absolute w-100" style={{ zIndex: 1000 }}>
                {suggestions.map((s, idx) => (
                  <li key={idx} className="list-group-item list-group-item-action" onClick={() => handleSuggestionClick(s)}>
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <textarea className="form-control mb-2 mt-5" placeholder="Description of Issue" value={description} onChange={e => setDescription(e.target.value)} />
          <select className="form-select mb-2" value={issueType} onChange={e => setIssueType(e.target.value)}>
            <option value="MALFUNCTION">MALFUNCTION</option>
            <option value="REPAIR">REPAIR</option>
          </select>

          <button className="btn btn-primary mt-2 w-100">Submit</button>
        </form>
      </div>
    </div>

  );
}
