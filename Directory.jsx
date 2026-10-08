import React, { useMemo, useState } from "react";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "identity", label: "Identity" },
  { id: "travel", label: "Travel & Immigration" },
  { id: "tax", label: "Tax & Finance" },
  { id: "transport", label: "Transport" },
  { id: "education", label: "Education" },
  { id: "welfare", label: "Social Welfare" },
  { id: "health", label: "Health" },
  { id: "housing", label: "Housing" },
  { id: "business", label: "Business" },
  { id: "agriculture", label: "Agriculture" },
  { id: "women", label: "Women & Child" },
  { id: "senior", label: "Senior Citizens" },
  { id: "disability", label: "Disability" },
  { id: "certificates", label: "Certificates" },
  { id: "other", label: "Other Services" },
];

const SERVICES = [
  {
    id: 1,
    name: "Aadhaar Services",
    category: "identity",
    icon: "🪪",
    description: "New Aadhaar enrollment, demographic updates, biometric updates, and PVC card ordering.",
    status: "Portal Active",
    statusColor: "green",
    governmentLevel: "Central",
    department: "Unique Identification Authority of India (UIDAI)",
    officialUrl: "https://uidai.gov.in",
    details: {
      about: "Aadhaar services help residents update identity details, verify demographic information, and manage enrollment-related procedures.",
      actions: ["Enrollment", "Address update", "Mobile update", "DOB correction", "PVC card order"],
      documents: ["Proof of Identity", "Proof of Address", "Photograph", "Mobile number", "Supporting document if applicable"],
      steps: [
        "Check requirements and eligibility",
        "Prepare required documents",
        "Visit official portal or enrollment centre",
        "Submit document proof and request",
        "Complete verification and biometric check",
        "Track status and receive update"
      ],
      fees: "Fee may vary depending on the service type.",
      processingTime: "Varies by service and location.",
      eligibility: "Available to resident Indian citizens and eligible applicants as per official requirements.",
      notes: "Please verify the latest details on the official Aadhaar portal before applying.",
    }
  },
  {
    id: 2,
    name: "PAN Card Services",
    category: "tax",
    icon: "💳",
    description: "Apply for a new PAN card, reprint PAN, data correction and applicable e-PAN services.",
    status: "Portal Active",
    statusColor: "green",
    governmentLevel: "Central",
    department: "Income Tax Department",
    officialUrl: "https://incometax.gov.in",
    details: {
      about: "PAN services support issuance, reprinting, corrections, and status checks for tax and identity registration requirements.",
      actions: ["New PAN application", "Correction request", "Reprint PAN", "e-PAN access"],
      documents: ["Proof of Identity", "Proof of Address", "Date of birth proof", "Photograph", "Supporting supporting documents"],
      steps: ["Review eligibility and application form", "Upload required documents", "Submit online request", "Pay applicable fees if any", "Verify status and download PAN"],
      fees: "Fees depend on the service requested and current official rules.",
      processingTime: "Usually within a few working days depending on verification status.",
      eligibility: "Applicable to Indian residents and eligible applicants as specified by the tax authority.",
      notes: "Please verify the latest details on the official portal before submitting application.",
    }
  },
  {
    id: 3,
    name: "Passport Seva",
    category: "travel",
    icon: "✈️",
    description: "Fresh passport, reissue or renewal, Tatkaal, Police Clearance Certificate and appointment services.",
    status: "Portal Active",
    statusColor: "green",
    governmentLevel: "Central",
    department: "Ministry of External Affairs",
    officialUrl: "https://passportindia.gov.in",
    details: {
      about: "Passport services cover application, scheduling, renewal, and police clearance requirements for Indian citizens.",
      actions: ["New passport", "Renewal", "Reissue", "Tatkaal service", "Police clearance"],
      documents: ["Proof of identity", "Proof of address", "Passport-sized photograph", "Birth certificate or equivalent", "Any applicable supporting documents"],
      steps: ["Check eligibility", "Create account and fill application", "Schedule appointment", "Submit application and documents", "Attend verification", "Track application status"],
      fees: "Fees vary based on booklet type and service category.",
      processingTime: "Typically several working days to a few weeks depending on appointment and verification.",
      eligibility: "Indian citizens meeting passport application criteria.",
      notes: "Visit the official portal for current appointment and document requirements.",
    }
  },
  {
    id: 4,
    name: "Driving Licence (Sarathi)",
    category: "transport",
    icon: "🚗",
    description: "Learner's Licence, Permanent Driving Licence, renewal, address change and duplicate licence.",
    status: "Portal Active",
    statusColor: "green",
    governmentLevel: "State",
    department: "State Transport Department",
    officialUrl: "https://parivahan.gov.in",
    details: {
      about: "Driving licence procedures include learner's licence, permanent licence issuance, renewals, and address changes.",
      actions: ["LLR application", "Driving test booking", "Licence renewal", "Address change", "Duplicate licence"],
      documents: ["Age proof", "Address proof", "Medical certificate where required", "Photograph", "Application form"],
      steps: ["Check eligibility", "Fill application", "Book test/appointment", "Submit documents", "Complete verification", "Collect licence"],
      fees: "Fee varies by vehicle category and service type.",
      processingTime: "Depends on appointment availability and verification workflow.",
      eligibility: "As per state transport rules and applicant age category.",
      notes: "Review the latest official transport portal for current forms and fees.",
    }
  },
  {
    id: 5,
    name: "Income Tax & ITR Filing",
    category: "tax",
    icon: "💰",
    description: "ITR guidance, tax information, AIS/TIS, refund status and applicable rebate information.",
    status: "Portal Active",
    statusColor: "green",
    governmentLevel: "Central",
    department: "Income Tax Department",
    officialUrl: "https://incometax.gov.in",
    details: {
      about: "Tax filing and rebate information includes returns, refunds, tax credit guidance, and status tracking.",
      actions: ["ITR filing", "Form selection", "Refund tracking", "AIS/TIS review", "Rebate guidance"],
      documents: ["PAN", "Aadhaar", "Salary slips or income proof", "Bank details", "Tax documents"],
      steps: ["Assess filing category", "Collect required tax records", "Complete return filing", "Validate and submit", "Track refund or acknowledgment"],
      fees: "No fee for standard filing under official channels; fees may vary for professional assistance.",
      processingTime: "Depends on filing type, verification and return processing.",
      eligibility: "Applicable for taxpayers subject to current official filing rules.",
      notes: "Use the official portal to confirm current forms, due dates and status updates.",
    }
  },
  {
    id: 6,
    name: "Scholarships & Student Aid",
    category: "education",
    icon: "🎓",
    description: "National Scholarship Portal and applicable central/state scholarship information.",
    status: "Portal Active",
    statusColor: "green",
    governmentLevel: "Central",
    department: "Ministry of Education / State Education Departments",
    officialUrl: "https://scholarships.gov.in",
    details: {
      about: "Scholarship programs support education costs for eligible students across central and state schemes.",
      actions: ["Application", "Verification", "Award tracking", "Document upload"],
      documents: ["Academic records", "Income certificate", "Identity proof", "Bank details", "Caste or category proof if applicable"],
      steps: ["Check eligibility", "Register on the portal", "Upload documents", "Submit application", "Track status and award release"],
      fees: "Usually no application fee; some programs may have nominal processing charges depending on scheme rules.",
      processingTime: "Varies by scholarship and state/campus verification.",
      eligibility: "Based on class, income, category and academic requirements specified by the scholarship program.",
      notes: "Please verify the latest scholarship notices and deadlines on the official portal.",
    }
  },
  {
    id: 7,
    name: "Welfare & Citizen Schemes",
    category: "welfare",
    icon: "🤝",
    description: "Health, agriculture, housing, small-business, women, senior citizen and social welfare services.",
    status: "Portal Active",
    statusColor: "green",
    governmentLevel: "Central / State",
    department: "Various ministries and departments",
    officialUrl: "https://india.gov.in",
    details: {
      about: "This category includes diversified welfare schemes covering livelihoods, social assistance and public support services.",
      actions: ["Scheme search", "Eligibility check", "Application", "Status tracking"],
      documents: ["Identity proof", "Address proof", "Income certificate if required", "Category proof if applicable", "Bank details"],
      steps: ["Identify relevant scheme", "Check eligibility", "Gather documents", "Apply through official portal", "Track status and approval"],
      fees: "Fees depend on the applicable scheme and government instructions.",
      processingTime: "Varies by scheme and department.",
      eligibility: "Eligibility depends on scheme-specific criteria such as income, category, age or location.",
      notes: "Check official scheme instructions before filing documents or making payments.",
    }
  },
  {
    id: 8,
    name: "Document Readiness & OCR",
    category: "other",
    icon: "📄",
    description: "AI-assisted document scanning, OCR and document-readiness checking before submission.",
    status: "Demo Mode",
    statusColor: "blue",
    governmentLevel: "Digital Service",
    department: "AI Government Assistant",
    officialUrl: "https://india.gov.in",
    details: {
      about: "Document readiness tools help review uploaded papers before applying to official services.",
      actions: ["Scan document", "OCR extraction", "Readiness check", "Checklist review"],
      documents: ["Uploaded document copy", "Applicant identification if required", "Supporting scans"],
      steps: ["Upload the document", "Review extracted fields", "Check readiness", "Use AI guidance to prepare next steps"],
      fees: "No official government fee; demo only.",
      processingTime: "Instant review in demo mode.",
      eligibility: "For assistive digital use only.",
      notes: "This is a pre-submission assistance tool and does not replace official portal verification.",
    }
  }
];

const QUICK_PORTALS = [
  { name: "Aadhaar Portal", desc: "Update & Status", kind: "🪪", target: "Aadhaar Services" },
  { name: "PAN Card", desc: "Form 49A & Instant PAN", kind: "💳", target: "PAN Card Services" },
  { name: "Passport Seva", desc: "7-Step Guide", kind: "✈️", target: "Passport Seva" },
  { name: "Driving Licence", desc: "LLR & RTO Test", kind: "🚗", target: "Driving Licence (Sarathi)" },
  { name: "Income Tax", desc: "ITR & Rebate Guidance", kind: "💰", target: "Income Tax & ITR Filing" },
];

export default function Directory() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedService, setSelectedService] = useState(null);

  function handleOpenGuide(portal) {
    const match = SERVICES.find((service) => service.name === portal.target);
    if (match) setSelectedService(match);
  }

  const filteredServices = useMemo(() => {
    const term = query.trim().toLowerCase();
    return SERVICES.filter((service) => {
      const matchesCategory = activeCategory === "all" || service.category === activeCategory;
      const matchesQuery = !term || [service.name, service.description, service.department, service.category].join(" ").toLowerCase().includes(term);
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  return (
    <div className="page directory-page">
      <div className="directory-shell">
        <div className="directory-hero">
          <div className="directory-robot" aria-hidden="true">
            <div className="robot-head">
              <span className="robot-eye left" />
              <span className="robot-eye right" />
              <span className="robot-mouth" />
            </div>
            <div className="robot-body" />
            <div className="robot-wave">Hi!</div>
          </div>

          <div className="directory-header-copy">
            <h1>Central &amp; State Directory</h1>
            <div className="directory-subhead">Government Services Directory</div>
            <p>
              Explore essential procedures for Indian citizens. Select any service to read step-by-step guides,
              required document checklists, official fee details, or ask AI for tailored assistance.
            </p>
          </div>

          <div className="directory-side-note">
            <div>Empowering</div>
            <div>Every Citizen</div>
            <p>Access Government Services Easily, Quickly &amp; Smartly</p>
          </div>
        </div>

        <div className="directory-search-row">
          <div className="directory-search">
            <span className="search-icon">🔍</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by service name or keyword"
            />
            <button type="button">Search</button>
          </div>
        </div>

        <div className="directory-category-bar">
          {CATEGORIES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`directory-chip ${activeCategory === item.id ? "active" : ""}`}
              onClick={() => setActiveCategory(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="directory-grid">
          {filteredServices.map((service) => (
            <article key={service.id} className="directory-card">
              <div className="card-topline">
                <div className="service-icon">{service.icon}</div>
                <div className={`status-pill status-pill--${service.statusColor}`}>
                  {service.status}
                </div>
              </div>

              <h3>{service.name}</h3>
              <p>{service.description}</p>

              <button type="button" className="view-details-btn" onClick={() => setSelectedService(service)}>
                View Details <span>→</span>
              </button>
            </article>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="directory-empty-state">No services match your current search. Try another keyword or category.</div>
        )}

        <div className="directory-portal-section">
          <div className="portal-heading">Dedicated Step-by-Step Portals</div>
          <div className="portal-subtitle">Need in-depth guidance for high-volume citizen services? Use our specialized interactive guides.</div>
          <div className="portal-list">
            {QUICK_PORTALS.map((portal) => (
              <div key={portal.name} className="portal-card">
                <div className="portal-icon">{portal.kind}</div>
                <div className="portal-name">{portal.name}</div>
                <div className="portal-desc">{portal.desc}</div>
                <button type="button" onClick={() => handleOpenGuide(portal)}>Open Guide →</button>
              </div>
            ))}
          </div>
        </div>

        <div className="directory-disclaimer">
          Government service procedures, fees, eligibility and document requirements may change. Please verify the latest information on the official government portal before applying.
        </div>
      </div>

      {selectedService && (
        <div className="directory-modal-backdrop" onClick={() => setSelectedService(null)}>
          <div className="directory-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setSelectedService(null)}>×</button>
            <div className="details-header">
              <div className="details-icon">{selectedService.icon}</div>
              <div>
                <div className="details-badge">{selectedService.category}</div>
                <h2>{selectedService.name}</h2>
              </div>
            </div>

            <div className="details-grid">
              <div><span>Category</span><strong>{selectedService.category}</strong></div>
              <div><span>Government Level</span><strong>{selectedService.governmentLevel}</strong></div>
              <div><span>Department</span><strong>{selectedService.department}</strong></div>
              <div><span>Status</span><strong>{selectedService.status}</strong></div>
            </div>

            <div className="details-section">
              <h3>About the Service</h3>
              <p>{selectedService.details.about}</p>
            </div>

            <div className="details-section">
              <h3>What You Can Do</h3>
              <ul>{selectedService.details.actions.map((action) => <li key={action}>{action}</li>)}</ul>
            </div>

            <div className="details-section">
              <h3>Required Documents</h3>
              <ul>{selectedService.details.documents.map((doc) => <li key={doc}>{doc}</li>)}</ul>
            </div>

            <div className="details-section">
              <h3>Step-by-Step Process</h3>
              <ol>{selectedService.details.steps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span>{step}</li>)}</ol>
            </div>

            <div className="details-section">
              <h3>Fees</h3>
              <p>{selectedService.details.fees}</p>
              <h3>Processing Time</h3>
              <p>{selectedService.details.processingTime}</p>
              <h3>Eligibility / Requirements</h3>
              <p>{selectedService.details.eligibility}</p>
            </div>

            <div className="details-footer">
              <a href={selectedService.officialUrl} target="_blank" rel="noreferrer">Open Official Portal</a>
              <div className="ai-help-box">
                <h4>Need help?</h4>
                <p>Ask the AI Assistant about this service.</p>
                <div className="ai-quick-actions">
                  <button type="button">What documents do I need?</button>
                  <button type="button">How do I apply?</button>
                  <button type="button">How much does it cost?</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
