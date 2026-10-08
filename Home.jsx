import React, { useState } from "react";
import { t } from "./i18n.js";

const QUICK_ACTIONS = [
  { id: "chat", icon: "🎤", keyTitle: "home_ask_by_voice", keySub: "home_ask_by_voice_sub" },
  { id: "schemes", icon: "🔍", keyTitle: "home_find_schemes", keySub: "home_find_schemes_sub" },
  { id: "eligibility", icon: "🛡️", keyTitle: "home_check_eligibility", keySub: "home_check_eligibility_sub" },
  { id: "documents", icon: "📄", keyTitle: "home_analyze_document", keySub: "home_analyze_document_sub" },
  { id: "grievance", icon: "📢", keyTitle: "home_file_grievance", keySub: "home_file_grievance_sub" },
  { id: "track", icon: "📍", keyTitle: "home_track_application", keySub: "home_track_application_sub" },
];

const CATEGORY_ITEMS = [
  "home_service_students",
  "home_service_women",
  "home_service_farmers",
  "home_service_housing",
  "home_service_jobs",
  "home_service_business",
];

const SERVICE_ITEMS = [
  { icon: "🎓", labelKey: "home_service_students", subtitleKey: "home_service_students_sub" },
  { icon: "👩", labelKey: "home_service_women", subtitleKey: "home_service_women_sub" },
  { icon: "🌾", labelKey: "home_service_farmers", subtitleKey: "home_service_farmers_sub" },
  { icon: "🏥", labelKey: "home_service_health", subtitleKey: "home_service_health_sub" },
  { icon: "🏠", labelKey: "home_service_housing", subtitleKey: "home_service_housing_sub" },
  { icon: "💼", labelKey: "home_service_jobs", subtitleKey: "home_service_jobs_sub" },
  { icon: "💰", labelKey: "home_service_finance", subtitleKey: "home_service_finance_sub" },
  { icon: "🧑‍💼", labelKey: "home_service_business", subtitleKey: "home_service_business_sub" },
  { icon: "👵", labelKey: "home_service_senior", subtitleKey: "home_service_senior_sub" },
  { icon: "♿", labelKey: "home_service_disability", subtitleKey: "home_service_disability_sub" },
  { icon: "🛡️", labelKey: "home_service_insurance", subtitleKey: "home_service_insurance_sub" },
  { icon: "📚", labelKey: "home_service_scholarships", subtitleKey: "home_service_scholarships_sub" },
  { icon: "🏦", labelKey: "home_service_banking", subtitleKey: "home_service_banking_sub" },
  { icon: "🛒", labelKey: "home_service_street_vendors", subtitleKey: "home_service_street_vendors_sub" },
  { icon: "🚰", labelKey: "home_service_utilities", subtitleKey: "home_service_utilities_sub" },
  { icon: "⚡", labelKey: "home_service_energy", subtitleKey: "home_service_energy_sub" },
  { icon: "🏡", labelKey: "home_service_rural", subtitleKey: "home_service_rural_sub" },
];

const ELIGIBLE_SCHEMES = [
  {
    titleKey: "home_scheme_nsp", deptKey: "home_scheme_nsp_dept", matchKey: "home_scheme_potential_match", noteKey: "home_scheme_nsp_note",
    officialUrl: "https://scholarships.gov.in",
    details: {
      en: ["Scholarship support for eligible students pursuing higher education.", "Financial assistance for tuition and maintenance, subject to the selected scholarship rules.", "Eligibility depends on the scholarship, course, academic record, and family income.", "Register on the National Scholarship Portal, choose an applicable scholarship, and submit the required documents for institution verification."],
      ta: ["உயர்கல்வி பயிலும் தகுதியான மாணவர்களுக்கு உதவித்தொகை ஆதரவு.", "தேர்ந்தெடுக்கப்பட்ட உதவித்தொகை விதிகளுக்கு உட்பட்டு கல்விக் கட்டணம் மற்றும் பராமரிப்புக்கான நிதி உதவி.", "தகுதி உதவித்தொகை, படிப்பு, கல்விப் பதிவுகள் மற்றும் குடும்ப வருமானத்தைப் பொறுத்தது.", "தேசிய உதவித்தொகை போர்டலில் பதிவு செய்து, பொருத்தமான உதவித்தொகையைத் தேர்ந்தெடுத்து, நிறுவனச் சரிபார்ப்பிற்குத் தேவையான ஆவணங்களைச் சமர்ப்பிக்கவும்."],
      hi: ["उच्च शिक्षा प्राप्त कर रहे पात्र विद्यार्थियों के लिए छात्रवृत्ति सहायता।", "चुनी गई छात्रवृत्ति के नियमों के अनुसार ट्यूशन और रखरखाव के लिए वित्तीय सहायता।", "पात्रता छात्रवृत्ति, पाठ्यक्रम, शैक्षणिक रिकॉर्ड और पारिवारिक आय पर निर्भर करती है।", "राष्ट्रीय छात्रवृत्ति पोर्टल पर पंजीकरण करें, उपयुक्त छात्रवृत्ति चुनें और संस्थान सत्यापन के लिए आवश्यक दस्तावेज़ जमा करें।"],
    },
  },
  {
    titleKey: "home_scheme_pm_matri", deptKey: "home_scheme_pm_matri_dept", matchKey: "home_scheme_potential_match", noteKey: "home_scheme_pm_matri_note",
    officialUrl: "https://wcd.nic.in",
    details: {
      en: ["Cash assistance for eligible pregnant and lactating women to support maternal and child health.", "Maternity assistance is transferred directly to eligible beneficiaries under scheme rules.", "Applicants must meet the current scheme conditions for pregnancy, registration, and benefit history.", "Register through an Anganwadi centre, health facility, or state welfare portal and provide the required records."],
      ta: ["தாய்மார் மற்றும் குழந்தை நலனை ஆதரிக்க தகுதியான கர்ப்பிணி மற்றும் பாலூட்டும் பெண்களுக்கு நிதி உதவி.", "திட்ட விதிகளின்படி தகுதியான பயனாளிகளுக்கு மகப்பேறு உதவி நேரடியாக வழங்கப்படும்.", "கர்ப்பம், பதிவு மற்றும் முந்தைய நன்மைகள் தொடர்பான தற்போதைய திட்ட நிபந்தனைகளைப் பூர்த்தி செய்ய வேண்டும்.", "அங்கன்வாடி மையம், சுகாதார நிலையம் அல்லது மாநில நலப் போர்டல் மூலம் பதிவு செய்து தேவையான பதிவுகளை வழங்கவும்."],
      hi: ["मातृ और शिशु स्वास्थ्य में सहायता के लिए पात्र गर्भवती और स्तनपान कराने वाली महिलाओं को नकद सहायता।", "योजना के नियमों के अनुसार पात्र लाभार्थियों को मातृत्व सहायता सीधे दी जाती है।", "आवेदकों को गर्भावस्था, पंजीकरण और पहले मिले लाभों से जुड़ी वर्तमान शर्तें पूरी करनी होंगी।", "आंगनवाड़ी केंद्र, स्वास्थ्य केंद्र या राज्य कल्याण पोर्टल के माध्यम से पंजीकरण करें और आवश्यक रिकॉर्ड दें।"],
    },
  },
  {
    titleKey: "home_scheme_pm_kisan", deptKey: "home_scheme_pm_kisan_dept", matchKey: "home_scheme_potential_match", noteKey: "home_scheme_pm_kisan_note",
    officialUrl: "https://pmkisan.gov.in",
    details: {
      en: ["Income support for eligible landholding farmer families.", "₹6,000 per year, paid in three installments through direct benefit transfer.", "Eligibility and land records are verified under the current PM-KISAN guidelines.", "Register on the PM-KISAN portal or through the state agriculture department, then verify Aadhaar and land details."],
      ta: ["தகுதியான நிலம் வைத்துள்ள விவசாயக் குடும்பங்களுக்கான வருமான ஆதரவு.", "ஆண்டுக்கு ₹6,000, நேரடி நிதி பரிமாற்றம் மூலம் மூன்று தவணைகளாக வழங்கப்படும்.", "தற்போதைய பி.எம்.-கிசான் வழிகாட்டுதலின்படி தகுதியும் நிலப் பதிவுகளும் சரிபார்க்கப்படும்.", "பி.எம்.-கிசான் போர்டல் அல்லது மாநில விவசாயத் துறை மூலம் பதிவு செய்து, ஆதார் மற்றும் நில விவரங்களைச் சரிபார்க்கவும்."],
      hi: ["पात्र भूमिधारक किसान परिवारों के लिए आय सहायता।", "₹6,000 प्रति वर्ष, प्रत्यक्ष लाभ अंतरण के माध्यम से तीन किस्तों में।", "वर्तमान पीएम-किसान दिशानिर्देशों के अनुसार पात्रता और भूमि रिकॉर्ड का सत्यापन किया जाता है।", "पीएम-किसान पोर्टल या राज्य कृषि विभाग के माध्यम से पंजीकरण करें और आधार तथा भूमि विवरण सत्यापित करें।"],
    },
  },
  {
    titleKey: "home_scheme_pm_aay", deptKey: "home_scheme_pm_aay_dept", matchKey: "home_scheme_potential_match", noteKey: "home_scheme_pm_aay_note",
    officialUrl: "https://pmaymis.gov.in",
    details: {
      en: ["Housing support for eligible urban and rural families to build or improve a permanent home.", "Financial assistance or applicable home-loan support varies by PMAY component and eligibility.", "Applicants generally must meet income criteria and not own a pucca house, subject to current scheme rules.", "Apply through the relevant PMAY portal or local municipal body or Gram Panchayat with the required documents."],
      ta: ["தகுதியான நகர்ப்புற மற்றும் கிராமப்புற குடும்பங்கள் நிரந்தர வீட்டைக் கட்ட அல்லது மேம்படுத்துவதற்கான வீட்டு ஆதரவு.", "பி.எம்.ஏ.ஒய் திட்டப் பிரிவு மற்றும் தகுதியைப் பொறுத்து நிதி உதவி அல்லது வீட்டுக் கடன் ஆதரவு மாறுபடும்.", "தற்போதைய திட்ட விதிகளுக்கு உட்பட்டு வருமானத் தகுதி மற்றும் சொந்தமாக உறுதியான வீடு இல்லாதது பொதுவாக அவசியம்.", "தேவையான ஆவணங்களுடன் பொருத்தமான பி.எம்.ஏ.ஒய் போர்டல் அல்லது உள்ளாட்சி அமைப்பு அல்லது கிராம பஞ்சாயத்து மூலம் விண்ணப்பிக்கவும்."],
      hi: ["पात्र शहरी और ग्रामीण परिवारों को पक्का घर बनाने या सुधारने के लिए आवास सहायता।", "वित्तीय सहायता या लागू गृह-ऋण सहायता पीएमएवाई घटक और पात्रता के अनुसार अलग-अलग होती है।", "वर्तमान योजना नियमों के अनुसार आय मानदंड और पक्का घर न होना सामान्यतः आवश्यक है।", "आवश्यक दस्तावेज़ों के साथ संबंधित पीएमएवाई पोर्टल, स्थानीय नगर निकाय या ग्राम पंचायत के माध्यम से आवेदन करें।"],
    },
  },
];

export default function Home({ lang, onNavigate }) {
  const [query, setQuery] = useState("");
  const [selectedScheme, setSelectedScheme] = useState(null);

  function handleAsk(e) {
    e.preventDefault();
    onNavigate("chat", query.trim() || undefined);
  }

  function handleQuickAction(actionId) {
    if (actionId === "chat") {
      onNavigate("chat", "__voice__");
      return;
    }
    onNavigate(actionId);
  }

  return (
    <div className="page home-page">
      <div className="home-dashboard">
        <div className="hero-banner">
          <div className="hero-robot-wrap">
            <img src="/robot-hero.svg" alt="AI robot assistant" className="hero-robot-image" />
            <div className="bot-wave">{t(lang, "home_hello")}</div>
          </div>

          <div className="hero-content">
            <h1>{t(lang, "home_hero_title")}</h1>
            <p className="hero-tagline">{t(lang, "home_hero_subtitle")}</p>
            <p className="hero-subtitle">{t(lang, "home_hero_description")}</p>
            <form className="hero-search" onSubmit={handleAsk}>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t(lang, "home_search_placeholder")}
              />
              <button type="submit">{t(lang, "home_ask_ai")}</button>
            </form>

            <div className="quick-chips">
              {CATEGORY_ITEMS.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="chip"
                  onClick={() => onNavigate("schemes")}
                >
                  {t(lang, item)}
                </button>
              ))}
            </div>
          </div>

          <div className="hero-side-box">
            <div className="side-title">{t(lang, "home_empowering")}</div>
            <div className="side-title">{t(lang, "home_every_citizen")}</div>
            <p>{t(lang, "home_service_access")}</p>
          </div>
        </div>

        <section className="content-section">
          <div className="section-header row-header">
            <h2>{t(lang, "home_explore_services")}</h2>
            <button type="button" className="text-link">{t(lang, "home_view_all_categories")}</button>
          </div>

          <div className="service-grid">
            {SERVICE_ITEMS.map((item, index) => (
              <button key={`${item.labelKey}-${index}`} type="button" className="service-card" onClick={() => onNavigate("schemes")}>
                <div className="service-icon">{item.icon}</div>
                <div className="service-label">{t(lang, item.labelKey)}</div>
                <div className="service-subtitle">{t(lang, item.subtitleKey)}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="content-section">
          <div className="section-header row-header">
            <h2>{t(lang, "home_eligible_title")}</h2>
            <button type="button" className="text-link">{t(lang, "home_view_all_recommendations")}</button>
          </div>

          <div className="eligible-grid">
            {ELIGIBLE_SCHEMES.map((scheme, index) => (
              <div key={`${scheme.titleKey}-${index}`} className="eligible-card">
                <div className="eligibility-top">
                  <span className="potential-tag">{t(lang, scheme.matchKey)}</span>
                </div>
                <div className="eligible-card-icon">🏛️</div>
                <h3>
                  <button type="button" className="eligible-title-button" onClick={() => setSelectedScheme(scheme)}>
                    {t(lang, scheme.titleKey)}
                  </button>
                </h3>
                <p className="card-dept">{t(lang, scheme.deptKey)}</p>
                <p className="card-note">{t(lang, scheme.noteKey)}</p>
                <button type="button" className="card-link" onClick={() => setSelectedScheme(scheme)}>{t(lang, "home_view_details")}</button>
              </div>
            ))}
          </div>
        </section>

        {selectedScheme && (
          <div className="directory-modal-backdrop" onClick={() => setSelectedScheme(null)}>
            <section
              className="directory-modal home-scheme-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="home-scheme-detail-title"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" type="button" aria-label="Close details" onClick={() => setSelectedScheme(null)}>×</button>
              <div className="details-header">
                <div className="details-icon">🏛️</div>
                <div>
                  <div className="details-badge">{t(lang, selectedScheme.deptKey)}</div>
                  <h2 id="home-scheme-detail-title">{t(lang, selectedScheme.titleKey)}</h2>
                </div>
              </div>
              <div className="details-section">
                <h3>{t(lang, "scheme_detail_about")}</h3>
                <p>{selectedScheme.details[lang]?.[0] || selectedScheme.details.en[0]}</p>
              </div>
              <div className="details-section">
                <h3>{t(lang, "scheme_detail_benefits")}</h3>
                <p>{selectedScheme.details[lang]?.[1] || selectedScheme.details.en[1]}</p>
              </div>
              <div className="details-section">
                <h3>{t(lang, "scheme_detail_eligibility")}</h3>
                <p>{selectedScheme.details[lang]?.[2] || selectedScheme.details.en[2]}</p>
              </div>
              <div className="details-section">
                <h3>{t(lang, "scheme_detail_how_to_apply")}</h3>
                <p>{selectedScheme.details[lang]?.[3] || selectedScheme.details.en[3]}</p>
              </div>
              <div className="details-footer">
                <a href={selectedScheme.officialUrl} target="_blank" rel="noreferrer">
                  {t(lang, "scheme_detail_visit_official")}
                </a>
              </div>
            </section>
          </div>
        )}

        <div className="footer-note">
          <span>ℹ️</span>
          <span>{t(lang, "home_footer_note")}</span>
          <span className="source-text">{t(lang, "home_footer_source")}</span>
        </div>
      </div>
    </div>
  );
}
