import React, { useState } from "react";
import API from "../api";

function AddJob({ onJobAdded }) {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("Applied");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await API.post("job-apps/", {
      company,
      position,
      status,
      applied_date: new Date().toISOString().slice(0, 10),
    });

    onJobAdded(res.data);

    setCompany("");
    setPosition("");
    setStatus("Applied");
  };

  return (
    <form onSubmit={handleSubmit}>
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
          Add Job
        </button>
      </div>
    </form>
  );
}

export default AddJob;

