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
    console.log("Current user:", currentUser);
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

    /*if (submitting) return;
    setSubmitting(true);*/

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
      allocationDate,
      returnDate
    };

    AssetAllocationService.allocateAsset(payload)
      .then(() => {
        setMessage("Asset request submitted successfully");
        setTimeout(() => navigate("/dashboard/user/allocations"), 3000);
      })
      .catch(err => {
        console.error(err.response?.data);
        const errMsg = err.response?.data?.message || "Failed to raise request";
        setMessage(errMsg);
      });
  };

  return (
    <div className="container raise-request-container mt-5">
      <div className="card">
        <h2>Raise Asset Request</h2>
        {message && <div className="alert alert-info">{message}</div>}

        {user ? (
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

            <input
              type="date"
              className="form-control mb-2 mt-5"
              value={allocationDate}
              onChange={e => setAllocationDate(e.target.value)}
            />
            <input
              type="date"
              className="form-control mb-2"
              value={returnDate}
              onChange={e => setReturnDate(e.target.value)}
            />

            <button className="btn btn-primary mt-2 w-100">Submit</button>
          </form>
        ) : (
          <p>Please login to raise an asset request.</p>
        )}
      </div>
    </div>
  );
}
