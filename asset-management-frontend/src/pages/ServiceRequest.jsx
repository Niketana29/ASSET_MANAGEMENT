export default function ServiceRequest() {
  return (
    <div className="container mt-5">
      <h2>Raise Service Request</h2>
      <form>
        <div className="mb-3">
          <label className="form-label">Asset No</label>
          <input type="text" className="form-control" placeholder="Enter Asset ID/No" />
        </div>
        <div className="mb-3">
          <label className="form-label">Issue Type</label>
          <select className="form-control">
            <option value="">-- Select Issue --</option>
            <option value="malfunction">Malfunction</option>
            <option value="repair">Repair</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" placeholder="Describe the issue"></textarea>
        </div>
        <button className="btn btn-danger">Submit Service Request</button>
      </form>
    </div>
  );
}
