import React, { useState } from "react";
import { api } from "./api.js";
import { t } from "./i18n.js";

export default function TrackApplication({ lang = "en" }) {
  const [ticketId, setTicketId] = useState("");
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleTrack(e) {
    e.preventDefault();
    if (!ticketId.trim()) return;
    setLoading(true);
    setError(null);
    setTicket(null);
    try {
      const data = await api.trackGrievance(ticketId.trim());
      setTicket(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page track-page">
      <div className="page-header">
        <h2>{t(lang, "track_title")}</h2>
        <p>{t(lang, "track_subtitle")}</p>
      </div>

      <form className="track-form" onSubmit={handleTrack}>
        <input
          value={ticketId}
          onChange={(e) => setTicketId(e.target.value)}
          placeholder={t(lang, "track_placeholder")}
        />
        <button type="submit" disabled={loading}>
          {loading ? t(lang, "track_looking_up") : t(lang, "track_button")}
        </button>
      </form>

      {error && <p className="chat-error">{error}</p>}

      {ticket && (
        <div className="ticket-detail-card">
          <h3>{ticket.ticket_id}</h3>
          <p>
            <strong>{t(lang, "track_status")}</strong> <span className={`status-badge ${ticket.status.toLowerCase()}`}>{ticket.status}</span>
          </p>
          <p>
            <strong>{t(lang, "track_department")}</strong> {ticket.department}
          </p>
          <p>
            <strong>{t(lang, "track_priority")}</strong> {ticket.priority}
          </p>
          <p>
            <strong>{t(lang, "track_summary")}</strong> {ticket.summary}
          </p>
          <p>
            <strong>{t(lang, "track_filed")}</strong> {new Date(ticket.created_at).toLocaleString()}
          </p>
        </div>
      )}

      <p className="muted note">{t(lang, "track_note")}</p>
    </div>
  );
}
