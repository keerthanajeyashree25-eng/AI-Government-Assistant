import React, { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Home from "./Home.jsx";
import Chat from "./Chat.jsx";
import Schemes from "./Schemes.jsx";
import Directory from "./Directory.jsx";
import Eligibility from "./Eligibility.jsx";
import DocumentAnalyzer from "./DocumentAnalyzer.jsx";
import TrackApplication from "./TrackApplication.jsx";
import FileGrievance from "./FileGrievance.jsx";
import { LANGUAGES, t } from "./i18n.js";

function LoginPage({ onLogin, lang, setLang }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [authMode, setAuthMode] = useState("signin");

  const copy = {
    en: {
      powered: "⚡ Powered by AI",
      topName: "AI Government Assistant",
      tagline: "Simple • Smart • For You",
      digitalIndia: "Digital India",
      empowering: "Empowering Citizens",
      heroTop: "Your AI partner for",
      heroAccent: "government services",
      description:
        "Find government schemes, check eligibility, track applications, analyze documents, and access citizen support — all in one secure and intelligent platform.",
      stat1: "300+ Schemes",
      stat1Sub: "Government Schemes",
      stat2: "3 Languages",
      stat2Sub: "English • हिन्दी • தமிழ்",
      stat3: "AI Citizen Support",
      stat3Sub: "24/7 Assistance",
      welcome: "Welcome back",
      subtitle: "Sign in to access your government assistant",
      signIn: "Sign in",
      signUp: "Sign up",
      fullName: "Full Name",
      fullNamePlaceholder: "Enter your full name",
      email: "Email",
      emailPlaceholder: "Enter your email address",
      password: "Password",
      passwordPlaceholder: "Enter your password",
      signInAction: "Sign in",
      signUpAction: "Sign up",
      legal: "By continuing you agree to our Terms & Privacy Policy.",
      required: "Please fill in all required fields.",
      invalidEmail: "Please enter a valid email address.",
      shortPassword: "Password must be at least 4 characters long.",
      signupNameRequired: "Please enter your full name.",
    },
    hi: {
      powered: "⚡ एआई द्वारा संचालित",
      topName: "एआई सरकार सहायक",
      tagline: "सरल • स्मार्ट • आपके लिए",
      digitalIndia: "डिजिटल इंडिया",
      empowering: "नागरिकों को सशक्त बनाना",
      heroTop: "आपके लिए",
      heroAccent: "सरकारी सेवाएँ",
      description:
        "सरकारी योजनाएँ खोजें, पात्रता जांचें, आवेदन ट्रैक करें, दस्तावेज़ विश्लेषित करें और नागरिक सहायता प्राप्त करें — सब एक सुरक्षित और स्मार्ट प्लेटफ़ॉर्म पर।",
      stat1: "300+ योजनाएँ",
      stat1Sub: "सरकारी योजनाएँ",
      stat2: "3 भाषाएँ",
      stat2Sub: "English • हिन्दी • தமிழ்",
      stat3: "एआई नागरिक सहायता",
      stat3Sub: "24/7 सहायता",
      welcome: "फिर से स्वागत है",
      subtitle: "अपने सरकारी सहायक तक पहुँचने के लिए साइन इन करें",
      signIn: "साइन इन",
      signUp: "साइन अप",
      fullName: "पूरा नाम",
      fullNamePlaceholder: "अपना पूरा नाम दर्ज करें",
      email: "ईमेल",
      emailPlaceholder: "अपना ईमेल दर्ज करें",
      password: "पासवर्ड",
      passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
      signInAction: "साइन इन",
      signUpAction: "साइन अप",
      legal: "जारी रखकर आप हमारी नियम एवं गोपनीयता नीति से सहमत होते हैं।",
      required: "कृपया सभी आवश्यक फ़ील्ड भरें।",
      invalidEmail: "कृपया सही ईमेल पता दर्ज करें।",
      shortPassword: "पासवर्ड कम से कम 4 अक्षरों का होना चाहिए।",
      signupNameRequired: "कृपया अपना पूरा नाम दर्ज करें।",
    },
    ta: {
      powered: "⚡ AI இயக்கப்படுகிறது",
      topName: "AI அரசாங்க உதவியாளர்",
      tagline: "எளிது • ஸ்மார்ட் • உங்களுக்காக",
      digitalIndia: "டிஜிட்டல் இந்தியா",
      empowering: "சிவில் சேவைகளை வலுப்படுத்துதல்",
      heroTop: "உங்கள் AI உதவியாளர்",
      heroAccent: "அரசு சேவைகளுக்கான",
      description:
        "அரசு திட்டங்களை கண்டறிந்து, தகுதியை சரிபார்த்து, விண்ணப்பங்களைக் கண்காணித்து, ஆவணங்களை பகுப்பாய்வு செய்து, குடிமக்கள் ஆதரவைப் பெறுங்கள் — அனைத்தும் ஒரு பாதுகாப்பான மற்றும் நுண்ணறிவு மிக்க தளத்தில்.",
      stat1: "300+ திட்டங்கள்",
      stat1Sub: "அரசு திட்டங்கள்",
      stat2: "3 மொழிகள்",
      stat2Sub: "English • हिन्दी • தமிழ்",
      stat3: "AI குடிமக்கள் உதவி",
      stat3Sub: "24/7 உதவி",
      welcome: "மீண்டும் வருக",
      subtitle: "உங்கள் அரசாங்க உதவியாளரை அணுக உள்நுழைக",
      signIn: "உள்நுழையவும்",
      signUp: "பதிவு செய்யவும்",
      fullName: "முழுப் பெயர்",
      fullNamePlaceholder: "உங்கள் முழுப் பெயரை உள்ளிடவும்",
      email: "மின்னஞ்சல்",
      emailPlaceholder: "உங்கள் மின்னஞ்சலை உள்ளிடவும்",
      password: "கடவுச்சொல்",
      passwordPlaceholder: "உங்கள் கடவுச்சொல்லை உள்ளிடவும்",
      signInAction: "உள்நுழையவும்",
      signUpAction: "பதிவு செய்யவும்",
      legal: "தொடர்வதன் மூலம் நீங்கள் எங்கள் விதிமுறைகள் மற்றும் தனியுரிமைக் கொள்கையை ஏற்கிறீர்கள்.",
      required: "குழந்தை, அனைத்து தேவையான புலங்களையும் நிரப்பவும்.",
      invalidEmail: "சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்.",
      shortPassword: "கடவுச்சொல் குறைந்தபட்சம் 4 எழுத்துகள் இருக்க வேண்டும்.",
      signupNameRequired: "உங்கள் முழுப் பெயரை உள்ளிடவும்.",
    },
  };

  const text = copy[lang] || copy.en;

  function handleSubmit(e) {
    e.preventDefault();

    if (authMode === "signup" && !fullName.trim()) {
      setError(text.signupNameRequired);
      return;
    }

    if (!email.trim() || !password.trim()) {
      setError(text.required);
      return;
    }

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!validEmail) {
      setError(text.invalidEmail);
      return;
    }

    if (password.length < 4) {
      setError(text.shortPassword);
      return;
    }

    setError("");
    onLogin(email.trim(), authMode, fullName.trim());
  }

  return (
    <div className="login-page">
      <div className="login-landing">
        <div className="login-hero-panel">
          <div className="login-header-row">
            <div className="brand-block">
              <span className="brand-icon">🇮🇳</span>
              <div className="brand-copy">
                <div className="brand-name">
                  <span className="brand-light">AI</span> Government Assistant
                </div>
                <small>{text.tagline}</small>
              </div>
            </div>

            <div className="brand-meta">
              <span>{text.digitalIndia}</span>
              <span className="meta-divider">|</span>
              <span>{text.empowering}</span>
            </div>
          </div>

          <div className="powered-pill">{text.powered}</div>

          <h1>
            {text.heroTop}
            <span>{text.heroAccent}</span>
          </h1>

          <p>{text.description}</p>

          <div className="login-stats">
            <div className="stat-box">
              <span className="stat-icon">📚</span>
              <div>
                <strong>{text.stat1}</strong>
                <small>{text.stat1Sub}</small>
              </div>
            </div>
            <div className="stat-box">
              <span className="stat-icon">⌨</span>
              <div>
                <strong>{text.stat2}</strong>
                <small>{text.stat2Sub}</small>
              </div>
            </div>
            <div className="stat-box">
              <span className="stat-icon">🤖</span>
              <div>
                <strong>{text.stat3}</strong>
                <small>{text.stat3Sub}</small>
              </div>
            </div>
          </div>
        </div>

        <div className="login-auth-panel">
          <div className="auth-card">
            <div className="lang-switch-row">
              <div className="card-header-copy">
                <h2>{text.welcome}</h2>
                <p>{text.subtitle}</p>
              </div>
              <select
                className="login-lang-select"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                aria-label="Select language"
              >
                <option value="en">🇬🇧 English</option>
                <option value="hi">🇮🇳 हिन्दी</option>
                <option value="ta">🇮🇳 தமிழ்</option>
              </select>
            </div>

            <div className="auth-toggle">
              <button
                type="button"
                className={`toggle-btn ${authMode === "signin" ? "active" : ""}`}
                onClick={() => setAuthMode("signin")}
              >
                {text.signIn}
              </button>
              <button
                type="button"
                className={`toggle-btn ${authMode === "signup" ? "active" : ""}`}
                onClick={() => setAuthMode("signup")}
              >
                {text.signUp}
              </button>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              {authMode === "signup" && (
                <label className="form-field">
                  <span>{text.fullName}</span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={text.fullNamePlaceholder}
                  />
                </label>
              )}

              <label className="form-field">
                <span>{text.email}</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={text.emailPlaceholder}
                />
              </label>

              <label className="form-field">
                <span>{text.password}</span>
                <div className="password-field-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={text.passwordPlaceholder}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </label>

              {error && <p className="login-error">{error}</p>}

              <button type="submit" className="primary-btn">
                {authMode === "signup" ? text.signUpAction : text.signInAction}
              </button>
            </form>

            <p className="terms">{text.legal}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExitPage({ onReturn, lang }) {
  return (
    <div className="exit-page">
      <div className="exit-card">
        <div className="exit-icon" aria-hidden="true">👋</div>
        <h2>Thank you</h2>
        <p>You have exited the application successfully.</p>
        <button type="button" className="exit-login-btn" onClick={onReturn}>
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("login");
  const [chatSeed, setChatSeed] = useState(undefined);
  const [lang, setLang] = useState("en");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function handleLogin(email, mode = "signin", fullName = "") {
    setIsLoggedIn(true);
    setPage("home");
    console.log(`${mode === "signup" ? "Signed up" : "Logged in"} as:`, fullName || email);
  }

  function handleExit() {
    setIsLoggedIn(false);
    setPage("exit");
  }

  function handleReturnLogin() {
    setPage("login");
  }

  function navigate(target, seedMessage) {
    if (target === "chat") setChatSeed(seedMessage);
    if (target === "exit") {
      handleExit();
      return;
    }
    setPage(target);
  }

  if (!isLoggedIn && page === "login") {
    return <LoginPage onLogin={handleLogin} lang={lang} setLang={setLang} />;
  }

  if (!isLoggedIn && page === "exit") {
    return <ExitPage onReturn={handleReturnLogin} lang={lang} />;
  }

  return (
    <div className="app-shell">
      <Sidebar activePage={page} onNavigate={navigate} onExit={handleExit} lang={lang} />

      <main className="main-area">
        <div className="top-bar">
          <button type="button" className="exit-btn" onClick={handleExit}>
            {t(lang, "exit")}
          </button>
          <select className="lang-select" value={lang} onChange={(e) => setLang(e.target.value)}>
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        {page === "home" && <Home lang={lang} onNavigate={navigate} />}
        {page === "chat" && <Chat key={chatSeed} initialMessage={chatSeed} lang={lang} />}
        {page === "schemes" && <Schemes lang={lang} />}
        {page === "directory" && <Directory lang={lang} />}
        {page === "eligibility" && <Eligibility lang={lang} />}
        {page === "documents" && <DocumentAnalyzer lang={lang} />}
        {page === "track" && <TrackApplication lang={lang} />}
        {page === "grievance" && <FileGrievance onNavigate={navigate} lang={lang} />}
      </main>
    </div>
  );
}
