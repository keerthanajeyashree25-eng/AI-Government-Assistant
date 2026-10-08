import React from "react";
import { t } from "./i18n.js";

const NAV_ITEMS = [
  { id: "home", icon: "🏠", key: "nav_home" },
  { id: "chat", icon: "💬", key: "nav_chat" },
  { id: "schemes", icon: "📋", key: "nav_schemes" },
  { id: "directory", icon: "🏛️", key: "nav_directory" },
  { id: "eligibility", icon: "✅", key: "nav_eligibility" },
  { id: "documents", icon: "📄", key: "nav_documents" },
  { id: "track", icon: "📍", key: "nav_track" },
  { id: "grievance", icon: "📢", key: "nav_grievance" },
];

export default function Sidebar({ activePage, onNavigate, onExit, lang }) {
  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">🇮🇳</div>
        <div>
          <div className="brand-name">{t(lang, "appName")}</div>
          <div className="brand-tagline">{t(lang, "tagline")}</div>
        </div>
      </div>

      <ul className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <li key={item.id}>
            <button
              className={`nav-item ${activePage === item.id ? "active" : ""}`}
              onClick={() => onNavigate(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{t(lang, item.key)}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        <div className="avatar">KJ</div>
        <div>
          <div className="footer-name">{t(lang, "citizen")}</div>
          <div className="footer-sub">{t(lang, "signed_in_locally")}</div>
        </div>
      </div>

      <button type="button" className="sidebar-exit-btn" onClick={onExit}>
        {t(lang, "exit")}
      </button>
    </nav>
  );
}
