export default function AuditRequests() {
  return (
    <div className="container mt-5">
      <h2>Audit Requests</h2>
      <button className="btn btn-warning mb-3">Send Audit Request</button>
      <p>Admins can send audit requests and view status here.</p>
      {/* TODO: Table of requests with status (Pending / Verified / Rejected) */}
    </div>
  );
}
