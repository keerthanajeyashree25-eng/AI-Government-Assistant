import React, { useState } from "react";
import { api } from "./api.js";
import { t } from "./i18n.js";

const FIELDS = [
  { key: "is_student", labelKey: "eligibility_field_student", type: "bool" },
  { key: "annual_family_income", labelKey: "eligibility_field_income", type: "number" },
  { key: "min_marks_percent", labelKey: "eligibility_field_marks", type: "number" },
  { key: "residence_type", labelKey: "eligibility_field_residence", type: "select", options: ["urban", "rural"] },
  { key: "owns_pucca_house", labelKey: "eligibility_field_pucca", type: "bool" },
  { key: "has_disability_certificate", labelKey: "eligibility_field_disability", type: "bool" },
];

function parseValue(field, raw) {
  if (raw === "") return undefined;
  if (field.type === "bool") return raw === "true";
  if (field.type === "number") return Number(raw);
  return raw;
}

export default function Eligibility({ lang = "en" }) {
  const [values, setValues] = useState({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleCheck(e) {
    e.preventDefault();
    const profile = {};
    for (const f of FIELDS) {
      const parsed = parseValue(f, values[f.key] ?? "");
      if (parsed !== undefined) profile[f.key] = parsed;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await api.checkEligibility(profile);
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page eligibility-page">
      <div className="page-header">
        <h2>{t(lang, "eligibility_title")}</h2>
        <p>{t(lang, "eligibility_subtitle")}</p>
      </div>

      <div className="eligibility-grid">
        <form className="eligibility-form" onSubmit={handleCheck}>
          {FIELDS.map((f) => (
            <label key={f.key} className="form-field">
              {t(lang, f.labelKey)}
              {f.type === "bool" ? (
                <select
                  value={values[f.key] ?? ""}
                  onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                >
                  <option value="">{t(lang, "eligibility_not_sure")}</option>
                  <option value="true">{t(lang, "eligibility_yes")}</option>
                  <option value="false">{t(lang, "eligibility_no")}</option>
                </select>
              ) : f.type === "select" ? (
                <select
                  value={values[f.key] ?? ""}
                  onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                >
                  <option value="">{t(lang, "eligibility_not_sure")}</option>
                  {f.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="number"
                  value={values[f.key] ?? ""}
                  onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                />
              )}
            </label>
          ))}
          <button type="submit" disabled={loading}>
            {loading ? t(lang, "eligibility_checking") : t(lang, "eligibility_check_button")}
          </button>
          {error && <p className="chat-error">{error}</p>}
        </form>

        <div className="eligibility-results">
          {!results && <p className="muted">{t(lang, "eligibility_fill")}</p>}
          {results &&
            results.map((r) => (
              <div key={r.scheme_id} className={`eligibility-result-card ${r.result.toLowerCase()}`}>
                <h4>{r.scheme_name}</h4>
                <span className={`result-badge ${r.result.toLowerCase()}`}>
                  {r.result.replace("_", " ")}
                </span>
                <ul>
                  {r.checks.map((c, i) => (
                    <li key={i} className={`check-${c.status.toLowerCase()}`}>
                      {c.status === "PASS" ? "✅" : c.status === "FAIL" ? "❌" : "❔"} {c.label}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </div>
      <p className="disclaimer">{t(lang, "eligibility_disclaimer")}</p>
    </div>
  );
}
