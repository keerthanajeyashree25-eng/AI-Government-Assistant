import React, { useState } from "react";
import { api } from "./api.js";
import { t } from "./i18n.js";

export default function DocumentAnalyzer({ lang = "en" }) {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setError(null);
    setAnalysis(null);
    setLoading(true);
    try {
      const data = await api.analyzeDocument(f);
      setAnalysis(data);
    } catch (err) {
      setError(
        err instanceof TypeError && err.message === "Failed to fetch"
          ? "Cannot reach the backend. Check that it is running at http://localhost:8000."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page documents-page">
      <div className="page-header">
        <h2>{t(lang, "document_title")}</h2>
        <p>{t(lang, "document_subtitle")}</p>
      </div>

      <label className="dropzone">
        <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFile} hidden />
        <div className="dropzone-icon">📤</div>
        <div>{t(lang, "document_drop")}</div>
        <div className="muted">{t(lang, "document_support")}</div>
      </label>

      {file && (
        <div className="doc-status">
          <p>
            <strong>{t(lang, "document_selected")}</strong> {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </p>
          {loading && <div className="not-implemented-note">Analyzing document...</div>}
          {error && <div className="chat-error">{error}</div>}
          {analysis && (
            <div className="doc-analysis-card">
              <p><strong>Status:</strong> {analysis.status}</p>
              <p><strong>Summary:</strong> {analysis.summary}</p>
              <p><strong>Document type:</strong> {analysis.extracted_fields?.document_type || "uploaded file"}</p>
              <p><strong>Language:</strong> {analysis.extracted_fields?.language || "unknown"}</p>
              {analysis.extracted_fields?.pages != null && (
                <p><strong>Pages:</strong> {analysis.extracted_fields.pages}</p>
              )}
              {analysis.key_details?.length > 0 && (
                <ul className="document-key-details">
                  {analysis.key_details.map((detail, index) => <li key={index}>{detail}</li>)}
                </ul>
              )}
              <div className="not-implemented-note">{t(lang, "document_note")}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
