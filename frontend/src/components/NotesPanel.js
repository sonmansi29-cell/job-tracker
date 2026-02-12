import React, { useEffect, useState, useContext } from "react";
import { ToastContext } from "./Toast";

export default function NotesPanel({ open, onClose, storageKey = "jobPrepNotes" }) {
  const [text, setText] = useState("");
  const { addToast } = useContext(ToastContext);

  useEffect(() => {
    if (open) {
      const saved = localStorage.getItem(storageKey) || "";
      setText(saved);
    }
  }, [open, storageKey]);

  const handleSave = () => {
    localStorage.setItem(storageKey, text);
    addToast("Notes saved successfully!", "success");
    onClose();
  };

  const handleClear = () => {
    if (!window.confirm("Clear all notes?")) return;
    setText("");
    localStorage.removeItem(storageKey);
    addToast("Notes cleared.", "info");
  };

  if (!open) return null;

  return (
    <div className="notes-overlay" onClick={onClose}>
      <div className="notes-panel" onClick={(e) => e.stopPropagation()}>
        <div className="notes-header">
          <h3>Job Preparation Notes</h3>
          <button className="notes-close" onClick={onClose}>✕</button>
        </div>

        <textarea
          className="notes-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your preparation notes here — resources, company questions, TODOs..."
        />

        <div className="notes-actions">
          <button className="btn save" onClick={handleSave}>Save</button>
          <button className="btn clear" onClick={handleClear}>Clear</button>
          <a
            className="btn export"
            href={`data:text/plain;charset=utf-8,${encodeURIComponent(text)}`}
            download="job-prep-notes.txt"
          >
            Export
          </a>
        </div>

        <small className="notes-tip">Notes are stored locally in your browser (localStorage).</small>
      </div>
    </div>
  );
}

