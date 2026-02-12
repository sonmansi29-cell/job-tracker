import React, { useState } from "react";
import API from "../api";

function EditJob({ job, onCancel, onUpdated }) {
  const [company, setCompany] = useState(job.company);
  const [position, setPosition] = useState(job.position);
  const [status, setStatus] = useState(job.status);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const res = await API.put(`job-apps/${job.id}/`, {
      company,
      position,
      status,
      applied_date: job.applied_date,
    });

    onUpdated(res.data);
  };

  return (
    <form onSubmit={handleUpdate}>
      <div className="form-row">
        <input
          type="text"
          placeholder="Company Name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="form-input"
          required
        />
        <input
          type="text"
          placeholder="Job Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="form-input"
          required
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="form-select"
        >
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button type="submit" className="btn-primary">
          Save
        </button>
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default EditJob;

