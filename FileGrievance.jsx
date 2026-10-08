import React, { useState } from "react";
import { api } from "./api.js";
import { t } from "./i18n.js";

const CATEGORIES = [
  { value: "scholarship_payment", label: "Scholarship / Financial Aid" },
  { value: "housing_benefit", label: "Housing Benefit" },
  { value: "pension_delay", label: "Pension Delay" },
  { value: "document_issue", label: "Document Issue" },
  { value: "other", label: "Other" },
];

export default function FileGrievance({ onNavigate, lang = "en" }) {
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [summary, setSummary] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!summary.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.fileGrievance(category, summary.trim(), priority);
      setTicket(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (ticket) {
    return (
      <div className="page grievance-page">
        <div className="ticket-confirmation">
          <div className="ticket-icon">✅</div>
          <h2>{t(lang, "grievance_filed")}</h2>
          <p>
            {t(lang, "grievance_tracking_id")} <strong>{ticket.ticket_id}</strong>
          </p>
          <p>{t(lang, "grievance_routed")} {ticket.department}</p>
          <p>{t(lang, "grievance_status")} {ticket.status}</p>
          <button onClick={() => onNavigate("track")}>{t(lang, "grievance_track_button")}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page grievance-page">
      <div className="page-header">
        <h2>{t(lang, "grievance_title")}</h2>
        <p>{t(lang, "grievance_subtitle")}</p>
      </div>

      <form className="grievance-form" onSubmit={handleSubmit}>
        <label className="form-field">
          {t(lang, "grievance_category")}
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <label className="form-field">
          {t(lang, "grievance_priority")}
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </label>

        <label className="form-field">
          {t(lang, "grievance_description")}
          <textarea
            rows={5}
            maxLength={500}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder={t(lang, "grievance_placeholder")}
          />
          <span className="char-count">{summary.length}/500</span>
        </label>

        {error && <p className="chat-error">{error}</p>}

        <button type="submit" disabled={loading || !summary.trim()}>
          {loading ? t(lang, "grievance_submitting") : t(lang, "grievance_submit")}
        </button>
      </form>
    </div>
  );
}
