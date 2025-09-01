export default function RaiseRequest() {
  return (
    <div className="container mt-5">
      <h2>Raise Asset Request</h2>
      <form>
        <div className="mb-3">
          <label className="form-label">Asset Needed</label>
          <input type="text" className="form-control" placeholder="Enter asset name" />
        </div>
        <div className="mb-3">
          <label className="form-label">Reason</label>
          <textarea className="form-control" placeholder="Why do you need this asset?" />
        </div>
        <button className="btn btn-primary">Submit Request</button>
      </form>
    </div>
  );
}
