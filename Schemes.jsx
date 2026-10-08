import React, { useEffect, useMemo, useState } from "react";
import { api } from "./api.js";
import { t } from "./i18n.js";

function getCategoryOptions(lang) {
  return [
    { id: "all", label: t(lang, "scheme_all"), icon: "🌐" },
    { id: "students", label: t(lang, "scheme_students"), icon: "🎓" },
    { id: "women", label: t(lang, "scheme_women"), icon: "👩" },
    { id: "farmers", label: t(lang, "scheme_farmers"), icon: "🌾" },
    { id: "health", label: t(lang, "scheme_health"), icon: "🏥" },
    { id: "housing", label: t(lang, "scheme_housing"), icon: "🏠" },
    { id: "jobs", label: t(lang, "scheme_jobs"), icon: "💼" },
    { id: "finance", label: t(lang, "scheme_finance"), icon: "💰" },
    { id: "business", label: t(lang, "scheme_business"), icon: "🚀" },
    { id: "senior", label: t(lang, "scheme_senior"), icon: "👵" },
    { id: "disability", label: t(lang, "scheme_disability"), icon: "♿" },
    { id: "insurance", label: t(lang, "scheme_insurance"), icon: "🛡" },
    { id: "scholarships", label: t(lang, "scheme_scholarships"), icon: "📚" },
    { id: "banking", label: t(lang, "scheme_banking"), icon: "🏦" },
    { id: "street_vendors", label: t(lang, "scheme_street_vendors"), icon: "🛒" },
    { id: "utilities", label: t(lang, "scheme_utilities"), icon: "🚰" },
    { id: "energy", label: t(lang, "scheme_energy"), icon: "⚡" },
    { id: "rural", label: t(lang, "scheme_rural"), icon: "🏡" },
  ];
}

function getFilterGroups(lang) {
  return {
    governmentLevels: [t(lang, "scheme_gov_central"), t(lang, "scheme_gov_tamil"), t(lang, "scheme_gov_other")],
    ageGroups: [t(lang, "scheme_age_under18"), t(lang, "scheme_age_18_25"), t(lang, "scheme_age_26_40"), t(lang, "scheme_age_41_60"), t(lang, "scheme_age_60_plus")],
    genders: [t(lang, "scheme_gender_male"), t(lang, "scheme_gender_female"), t(lang, "scheme_gender_all")],
    incomes: [t(lang, "scheme_income_below_1l"), t(lang, "scheme_income_1_3l"), t(lang, "scheme_income_3_5l"), t(lang, "scheme_income_5_8l"), t(lang, "scheme_income_above_8l")],
    socialCategories: [t(lang, "scheme_social_general"), t(lang, "scheme_social_obc"), t(lang, "scheme_social_sc"), t(lang, "scheme_social_st"), t(lang, "scheme_social_ews")],
    occupations: [t(lang, "scheme_occ_student"), t(lang, "scheme_occ_farmer"), t(lang, "scheme_occ_employee"), t(lang, "scheme_occ_unemployed"), t(lang, "scheme_occ_self_employed"), t(lang, "scheme_occ_business"), t(lang, "scheme_occ_homemaker"), t(lang, "scheme_occ_senior")],
  };
}

const PAGE_SIZE = 10;

function formatSchemeCount(value) {
  const count = Number(value || 0);
  if (count >= 1000) return `${(count / 1000).toFixed(count % 1000 === 0 ? 0 : 1).replace(/\.0$/, "")}K+`;
  return count.toLocaleString();
}

function normalize(value = "") {
  return String(value).toLowerCase().trim();
}

function parseIntent(rawQuery) {
  const text = normalize(rawQuery);
  const intent = {
    category: "all",
    age: null,
    gender: null,
    income: null,
    occupation: null,
    location: null,
  };

  if (!text) return intent;

  if (/(scholarship|student|college|education|school)/.test(text)) intent.category = "students";
  if (/(women|female|girl|mother|pregnant|woman)/.test(text)) intent.category = "women";
  if (/(farmer|agri|kisan|crop|farm|agriculture)/.test(text)) intent.category = "farmers";
  if (/(health|medical|hospital|insurance|treatment)/.test(text)) intent.category = "health";
  if (/(housing|home|house|pmay|rural housing)/.test(text)) intent.category = "housing";
  if (/(job|employment|unemployed|youth|skill|work)/.test(text)) intent.category = "jobs";
  if (/(loan|finance|financial|assistance|support|money)/.test(text)) intent.category = "finance";
  if (/(business|startup|enterprise|mudra|self employed)/.test(text)) intent.category = "business";
  if (/(senior|elder|pension)/.test(text)) intent.category = "senior";
  if (/(disabled|disability|handicap)/.test(text)) intent.category = "disability";
  if (/(insurance|accidental|life cover|bima)/.test(text)) intent.category = "insurance";
  if (/(bank|jan dhan|banking|account)/.test(text)) intent.category = "banking";
  if (/(vendor|street|hawker)/.test(text)) intent.category = "street_vendors";
  if (/(water|sanitation|toilet|clean|jal|swachh)/.test(text)) intent.category = "utilities";
  if (/(energy|solar|electricity|bijli|power)/.test(text)) intent.category = "energy";
  if (/(rural|village|gram|development)/.test(text)) intent.category = "rural";

  if (/(under 18|below 18|minor)/.test(text)) intent.age = "Under 18";
  else if (/(18.*25|18-25|20 year|21 year|22 year)/.test(text)) intent.age = "18–25";
  else if (/(26.*40|30 year|35 year)/.test(text)) intent.age = "26–40";
  else if (/(41.*60|45 year|50 year)/.test(text)) intent.age = "41–60";
  else if (/(60\+|60 plus|senior)/.test(text)) intent.age = "60+";

  if (/(female|women|girl|she|mother)/.test(text)) intent.gender = "Female";
  else if (/(male|man|boy|he)/.test(text)) intent.gender = "Male";

  if (/(2 lakh|200000|below 1 lakh|less than 1 lakh|1 lakh)/.test(text)) intent.income = "Below ₹1 lakh";
  if (/(2 lakh|1.*3 lakh|2.*3 lakh)/.test(text)) intent.income = "₹1–3 lakh";
  if (/(3.*5 lakh|4 lakh|5 lakh)/.test(text)) intent.income = "₹3–5 lakh";
  if (/(5.*8 lakh|6 lakh|7 lakh)/.test(text)) intent.income = "₹5–8 lakh";
  if (/(8 lakh|above 8 lakh|more than 8 lakh)/.test(text)) intent.income = "Above ₹8 lakh";

  if (/(student|college|school|education)/.test(text)) intent.occupation = "Student";
  if (/(farmer|kisan|agriculture)/.test(text)) intent.occupation = "Farmer";
  if (/(employee|job|working professional|service)/.test(text)) intent.occupation = "Employee";
  if (/(unemployed|jobless)/.test(text)) intent.occupation = "Unemployed";
  if (/(self employed|business owner|startup|entrepreneur)/.test(text)) intent.occupation = "Self-employed";
  if (/(business|shop|enterprise)/.test(text)) intent.occupation = "Business";
  if (/(homemaker|housewife)/.test(text)) intent.occupation = "Homemaker";
  if (/(senior citizen|retired|old age)/.test(text)) intent.occupation = "Senior Citizen";

  if (/(tamil nadu|tn|chennai|madurai|coimbatore)/.test(text)) intent.location = "Tamil Nadu";

  return intent;
}

function getSchemeLevel(scheme, lang = "en") {
  const state = (scheme.state || "ALL").toString();
  if (state === "ALL" || state === "India") return t(lang, "scheme_gov_central");
  if (/tamil/i.test(state) || state === "Tamil Nadu") return t(lang, "scheme_gov_tamil");
  return t(lang, "scheme_gov_other");
}

const TA_SCHEME_MAP = {
  "myScheme Portal": {
    name: "மைஸ்கீம் போர்டல்",
    department: "இந்திய அரசு",
    description: "வகை, பயனாளர் விவரம், வயது, வருமானம், இருப்பிடம் மற்றும் தகுதி அடிப்படையில் மத்திய மற்றும் மாநில/யூ.டி. அரசுத் திட்டங்களை கண்டறிய அதிகாரப்பூர்வ போர்டல்.",
    benefits: "சேவைகளைத் தேடவும், வடிகட்டவும், உங்கள் விவரங்களுக்கு ஏற்ற திட்டங்களைக் கண்டறியவும்.",
  },
  "National Merit Scholarship for Higher Education": {
    name: "தேசிய திறமை உதவித்தொகை",
    department: "கல்வி அமைச்சகம்",
    description: "சமூக பொருளாதார ரீதியாக பலமாக இல்லாத மாணவர்களுக்கு உயர்கல்வி பயிலும் மாணவர்களுக்கு நிதி உதவி.",
    benefits: "கல்வி மற்றும் பராமரிப்பு செலவுகளுக்காக ஆண்டு ஒன்றுக்கு ₹12,000 வரை.",
  },
  "PM-KISAN": {
    name: "பி.எம்.-கிசான்",
    department: "விவசாயம் மற்றும் விவசாயிகள் நல அமைச்சகம்",
    description: "தகுதிவாய்ந்த விவசாய குடும்பங்களுக்கு நேரடி நிதி உதவி வழங்கும் வருமான ஆதரவு திட்டம்.",
    benefits: "வருடத்திற்கு ₹6,000, மூன்று சமமான தவணைகளில் நேரடி நிதி பரிமாற்றம்.",
  },
  "Ayushman Bharat - PM-JAY": {
    name: "ஆயுஷ்மான் பாரத் - பி.எம்.-ஜே.ஏ.ஒய்",
    department: "சுகாதாரம் மற்றும் குடும்ப நல அமைச்சகம்",
    description: "தகுதியுள்ள குடும்பங்களுக்கு அங்கீகரிக்கப்பட்ட மருத்துவமனைகளில் பணமில்லா சிகிச்சை வழங்கும் தேசிய சுகாதார காப்பீட்டுத் திட்டம்.",
    benefits: "இரண்டாம் மற்றும் மூன்றாம் நிலை சிகிச்சைகளுக்கு குடும்பத்திற்கு ஆண்டுக்கு ₹5 இலட்சம் வரை.",
  },
  "Pradhan Mantri Awas Yojana - Urban and Rural": {
    name: "பிரதான் மந்திரி வீடு திட்டம் - நகர மற்றும் கிராம",
    department: "வீட்டு வசதி மற்றும் நகர்ப்புற விவகாரங்கள் / கிராம வளர்ச்சி அமைச்சகம்",
    description: "தகுதியுள்ள நகர மற்றும் கிராம குடும்பங்களுக்கு புதிய அல்லது மேம்படுத்தப்பட்ட வீடு கட்டுவதற்கான உதவி.",
    benefits: "வீட்டு கட்டுமானம் அல்லது மேம்பாட்டிற்கான நிதி உதவி.",
  },
  "UJALA Scheme": {
    name: "உஜாலா திட்டம்",
    department: "மின்சாரம் அமைச்சகம்",
    description: "LED விளக்குகளை ஊக்குவித்து, வீட்டு மின் நுகர்வைக் குறைத்து, மின் திறனை மேம்படுத்தும் திட்டம்.",
    benefits: "LED விளக்குகள், மின் கட்டணத்தைக் குறைத்தல், வீட்டு மின் பயன்பாட்டைக் குறைத்தல்.",
  },
};

const TA_DEPARTMENT_MAP = {
  "Government of India": "இந்திய அரசு",
  "Ministry of Education": "கல்வி அமைச்சகம்",
  "Ministry of Agriculture & Farmers Welfare": "விவசாயம் மற்றும் விவசாயிகள் நல அமைச்சகம்",
  "Ministry of Health and Family Welfare": "சுகாதாரம் மற்றும் குடும்ப நல அமைச்சகம்",
  "Ministry of Housing & Urban Affairs / Rural Development": "வீட்டு வசதி மற்றும் நகர்ப்புற விவகாரங்கள் / கிராம வளர்ச்சி அமைச்சகம்",
  "Ministry of Power": "மின்சாரம் அமைச்சகம்",
};

const TA_DOC_MAP = {
  "Aadhaar Card": "ஆதார் அட்டை",
  "Income Certificate": "வருமானச் சான்று",
  "Bonafide Certificate": "படிப்பு சான்று",
  "Bank Passbook": "வங்கி பாஸ்புக்",
  "Latest Marksheet": "சமீபத்திய மதிப்பெண் பட்டியல்",
  "Bank Account Details": "வங்கி கணக்கு விவரங்கள்",
  "Land Ownership / Khatauni": "நில உரிமை / கதவுயிட்",
  "Farmer ID / Record": "விவசாய அடையாளம் / பதிவுகள்",
  "Ration Card / SECC Details": "ரேஷன் அட்டை / SECC விவரங்கள்",
  "Identity Proof": "அடையாளச் சான்று",
  "Hospital Referral or Admission Record": "மருத்துவமனை பரிந்துரை அல்லது சேர்க்கை பதிவு",
};

const TA_GEN_MAP = {
  "Find schemes matching your age, income, category, gender, and location profile": "உங்கள் வயது, வருமானம், வகை, பாலினம் மற்றும் இருப்பிட விவரங்களின் அடிப்படையில் திட்டங்களை கண்டறியவும்",
  "Must be a currently enrolled student": "நீங்கள் தற்போது படித்து வருபவர் ஆக இருக்க வேண்டும்",
  "Annual family income must not exceed ₹2,50,000": "வருடாந்திர குடும்ப வருமானம் ₹2,50,000 ஐ விட அதிகமாக இருக்கக் கூடாது",
  "Must have scored at least 60% in the previous qualifying exam": "முந்தைய தகுதி தேர்வில் குறைந்தபட்சம் 60% மதிப்பெண் பெற்றிருக்க வேண்டும்",
  "Applicant should be an eligible landholding farmer family": "விண்ணப்பதாரர் தகுதிவாய்ந்த நிலம் வைத்துள்ள விவசாய குடும்பத்தைச் சேர்ந்தவர் ஆக இருக்க வேண்டும்",
  "Income-based eligibility is assessed by state and record verification": "வருமான அடிப்படையிலான தகுதி மாநிலம் மற்றும் பதிவுச் சரிபார்ப்பின் மூலம் மதிப்பிடப்படும்",
  "Eligible families are identified under SECC / state criteria": "தகுதிவாய்ந்த குடும்பங்கள் SECC / மாநில அளவுகோல்களின்படி கண்டறியப்படுகின்றன",
  "Households without a valid Ayushman card can apply through the state portal": "சரியான ஆயுஷ்மான் அட்டை இல்லாத குடும்பங்கள் மாநில போர்டல் வாயிலாக விண்ணப்பிக்கலாம்",
};

function translateTextToTamil(text) {
  if (!text || typeof text !== "string") return text;

  const map = [
    ["Pradhan Mantri", "பிரதான் மந்திரி"],
    ["PM-KISAN", "பி.எம்.-கிசான்"],
    ["Yojana", "யோஜனா"],
    ["Scheme", "திட்டம்"],
    ["schemes", "திட்டங்கள்"],
    ["Scholarship", "உதவித்தொகை"],
    ["Scholarships", "உதவித்தொகைகள்"],
    ["Education", "கல்வி"],
    ["Education Loan", "கல்விக் கடன்"],
    ["Loan", "கடன்"],
    ["Health", "சுகாதாரம்"],
    ["Housing", "வீட்டு வசதி"],
    ["Women", "பெண்கள்"],
    ["Women and Child Development", "பெண்கள் மற்றும் குழந்தைகள் மேம்பாடு"],
    ["Child Development", "குழந்தைகள் மேம்பாடு"],
    ["Agriculture", "விவசாயம்"],
    ["Farmers", "விவசாயிகள்"],
    ["Farmer", "விவசாயி"],
    ["Support", "ஆதரவு"],
    ["Assistance", "உதவி"],
    ["Benefits", "நன்மைகள்"],
    ["Benefit", "நன்மை"],
    ["National", "தேசிய"],
    ["Portal", "போர்டல்"],
    ["Program", "திட்டம்"],
    ["Programme", "திட்டம்"],
    ["Government", "அரசு"],
    ["Ministry", "அமைச்சகம்"],
    ["of", ""],
    ["and", "மற்றும்"],
    ["for", "க்கு"],
    ["Eligible", "தகுதியான"],
    ["Eligibility", "தகுதி"],
    ["Rural", "கிராம"],
    ["Urban", "நகர"],
    ["Development", "வளர்ச்சி"],
    ["Insurance", "காப்பீடு"],
    ["Financial", "நிதியியல்"],
    ["Aid", "உதவி"],
    ["Card", "அட்டை"],
    ["Application", "விண்ணப்பம்"],
    ["Apply", "விண்ணப்பிக்க"],
    ["Youth", "இளைஞர்"],
    ["Employment", "வேலைவாய்ப்பு"],
    ["Skill", "திறன்"],
    ["Training", "பயிற்சி"],
    ["Credit", "கடன்"],
    ["Support", "ஆதரவு"],
    ["Ration", "ரேஷன்"],
    ["Power", "மின்சாரம்"],
    ["Energy", "மின் ஆற்றல்"],
    ["LED", "எல்.இ.டி."],
    ["Household", "வீட்டு"],
    ["Utility", "சேவை"],
    ["Services", "சேவைகள்"],
    ["Service", "சேவை"],
    ["Aadhaar", "ஆதார்"],
    ["Bharat", "பாரத்"],
    ["PM", "பி.எம்."],
    ["JAY", "ஜே.ஏ.ஒய்"],
    ["PMJJBY", "பி.எம்.ஜே.ஜே.பி.ஒய்"],
    ["Mudra", "முத்ரா"],
    ["Startup", "ஸ்டார்ட்அப்"],
    ["Village", "கிராமம்"],
    ["Cities", "நகரங்கள்"],
    ["Urban", "நகர"],
    ["Rural", "கிராம"],
    ["District", "மாவட்டம்"],
    ["State", "மாநிலம்"],
    ["Young", "இளைஞர்"],
    ["Student", "மாணவர்"],
    ["Students", "மாணவர்கள்"],
    ["Healthcare", "சுகாதாரப் பராமரிப்பு"],
    ["Medical", "மருத்துவ"],
    ["Family", "குடும்ப"],
    ["Welfare", "நலன்"],
  ];

  let result = text;
  map.forEach(([english, tamil]) => {
    if (!english) return;
    const regex = new RegExp(`\\b${english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    result = result.replace(regex, tamil);
  });

  return result;
}

function translateSchemeText(scheme, lang) {
  if (lang !== "ta" || !scheme) return scheme;

  const fallback = TA_SCHEME_MAP[scheme.name] || {};
  const translated = { ...scheme };

  translated.name = fallback.name || translateTextToTamil(scheme.name);
  translated.department = TA_DEPARTMENT_MAP[scheme.department] || fallback.department || translateTextToTamil(scheme.department);
  translated.description = fallback.description || translateTextToTamil(scheme.description);
  translated.benefits = fallback.benefits || translateTextToTamil(scheme.benefits);

  if (Array.isArray(scheme.documents_required)) {
    translated.documents_required = scheme.documents_required.map((item) => TA_DOC_MAP[item] || translateTextToTamil(item));
  }

  if (Array.isArray(scheme.eligibility_criteria)) {
    translated.eligibility_criteria = scheme.eligibility_criteria.map((criterion) => {
      if (!criterion || typeof criterion !== "object") return criterion;
      const translatedLabel = TA_GEN_MAP[criterion.label] || translateTextToTamil(criterion.label);
      return { ...criterion, label: translatedLabel };
    });
  }

  if (typeof scheme.application_procedure === "string") {
    translated.application_procedure = scheme.application_procedure
      .replace(/Apply online via the National Scholarship Portal \(NSP\) with required documents\. Applications are verified by the institution before final approval\./, "தேவையான ஆவணங்களுடன் தேசிய உதவித்தொகை போர்டல் (NSP) மூலம் ஆன்லைனில் விண்ணப்பிக்கவும். இறுதி ஒப்புதலுக்கு முன் நிறுவனத்தால் சரிபார்க்கப்படும்.")
      .replace(/Register on the PM-KISAN portal or through the state agriculture department and verify land records and Aadhaar linkage\./, "பி.எம்.-கிசான் போர்டலில் அல்லது மாநில விவசாயத் துறையின் மூலம் பதிவு செய்து, நிலப் பதிவுகள் மற்றும் ஆதார் இணைப்பைச் சரிபார்க்கவும்.")
      .replace(/Check eligibility via the official portal or state health authority and create a beneficiary card through empanelled centers\./, "அதிகாரப்பூர்வ போர்டல் அல்லது மாநில சுகாதார அதிகாரத்தின் மூலம் தகுதியைச் சரிபார்த்து, அங்கீகரிக்கப்பட்ட மையங்கள் வாயிலாக பயனாளர் அட்டையை உருவாக்கவும்.");

    if (translated.application_procedure === scheme.application_procedure) {
      translated.application_procedure = translateTextToTamil(scheme.application_procedure);
    }
  }

  return translated;
}

function matchesFilterValues(selectedValues, value) {
  if (!selectedValues || selectedValues.length === 0) return true;
  return selectedValues.includes(value);
}

function isSchemeSearchMatch(scheme, queryText) {
  if (!queryText) return true;
  const haystack = [
    scheme.name,
    scheme.department,
    scheme.description,
    scheme.benefits,
    (scheme.tags || []).join(" "),
    (scheme.eligibility || []).join(" "),
    (scheme.documents || []).join(" "),
  ].join(" ").toLowerCase();
  return haystack.includes(queryText.toLowerCase());
}

export default function Schemes({ lang = "en" }) {
  const [allSchemes, setAllSchemes] = useState([]);
  const [query, setQuery] = useState("");
  const localizedSchemes = useMemo(() => allSchemes.map((scheme) => translateSchemeText(scheme, lang)), [allSchemes, lang]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("relevance");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState({
    governmentLevels: [],
    ageGroups: [],
    genders: [],
    incomes: [],
    socialCategories: [],
    occupations: [],
  });

  async function loadSchemes(searchText = "") {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listSchemes(searchText || undefined);
      setAllSchemes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setAllSchemes([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSchemes();
  }, []);

  const intent = useMemo(() => parseIntent(query), [query]);

  const filteredSchemes = useMemo(() => {
    let results = [...localizedSchemes];

    if (selectedCategory !== "all") {
      results = results.filter((scheme) => {
        const tags = [
          scheme.category,
          scheme.name,
          scheme.department,
          scheme.description,
          scheme.benefits,
          ...((scheme.tags || []).map((tag) => String(tag))),
        ]
          .join(" ")
          .toLowerCase();

        const categoryMatchMap = {
          students: ["student", "education", "scholarship", "college", "school", "higher education"],
          women: ["women", "female", "girl", "maternity", "pregnant", "child welfare"],
          farmers: ["farmer", "kisan", "agriculture", "crop", "farm", "rural"],
          health: ["health", "medical", "hospital", "ayushman", "disease", "telemedicine"],
          housing: ["housing", "home", "pmay", "house"],
          jobs: ["job", "employment", "skill", "youth", "apprenticeship", "unemployed"],
          finance: ["financial", "assistance", "support", "loan", "grant", "aid"],
          business: ["business", "startup", "enterprise", "mudra", "msme"],
          senior: ["senior", "elder", "pension"],
          disability: ["disability", "disabled", "divyang", "assistive"],
          insurance: ["insurance", "bima", "accident", "cover"],
          scholarships: ["scholarship", "education", "student"],
          banking: ["bank", "jan dhan", "saving", "account"],
          street_vendors: ["vendor", "street", "hawker"],
          utilities: ["water", "sanitation", "toilet", "swachh", "jal"],
          energy: ["energy", "solar", "electricity", "bijli"],
          rural: ["rural", "village", "gram", "development"],
        };

        const matchWords = categoryMatchMap[selectedCategory] || [];
        return matchWords.some((word) => tags.includes(word));
      });
    }

    results = results.filter((scheme) => {
      const text = query.trim();
      const matchesQuery = !text || isSchemeSearchMatch(scheme, text);
      const matchesGov = matchesFilterValues(selectedFilters.governmentLevels, getSchemeLevel(scheme));
      const matchesAge = selectedFilters.ageGroups.length === 0 || (scheme.age_criteria || []).some((criteria) => selectedFilters.ageGroups.includes(criteria.range || criteria.label || ""));
      const matchesGender = selectedFilters.genders.length === 0 || (selectedFilters.genders.includes("All") ? true : (scheme.eligibility_criteria || []).some((criteria) => /gender|female|male/i.test(String(criteria.label || ""))));
      const matchesIncome = selectedFilters.incomes.length === 0 || true;
      const matchesSocial = selectedFilters.socialCategories.length === 0 || true;
      const matchesOccupation = selectedFilters.occupations.length === 0 || true;

      return matchesQuery && matchesGov && matchesAge && matchesGender && matchesIncome && matchesSocial && matchesOccupation;
    });

    if (intent.category && intent.category !== "all") {
      results = results.filter((scheme) => {
        const haystack = [scheme.name, scheme.description, scheme.benefits, scheme.department, scheme.category].join(" ").toLowerCase();
        return haystack.includes(intent.category) || [scheme.name, scheme.description, scheme.benefits].join(" ").toLowerCase().includes(intent.category);
      });
    }

    if (sortBy === "category") {
      results.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "recent") {
      results.sort((a, b) => (b.source_date || "").localeCompare(a.source_date || ""));
    } else if (sortBy === "government") {
      results.sort((a, b) => getSchemeLevel(a).localeCompare(getSchemeLevel(b)));
    }

    return results;
  }, [localizedSchemes, query, selectedCategory, selectedFilters, sortBy, intent.category]);

  const recommendedSchemes = useMemo(() => {
    if (!filteredSchemes.length) return [];
    return filteredSchemes.slice(0, 12);
  }, [filteredSchemes]);

  const totalSchemeCount = useMemo(() => localizedSchemes.length || 309, [localizedSchemes.length]);
  const totalPages = Math.max(1, Math.ceil(filteredSchemes.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedSchemes = filteredSchemes.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => {
    if (!expandedId) return;
    document.getElementById(`scheme-card-${expandedId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [expandedId, safePage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedCategory, selectedFilters, sortBy]);

  const handleCheckboxToggle = (group, value) => {
    setSelectedFilters((prev) => {
      const current = prev[group] || [];
      const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
      return { ...prev, [group]: next };
    });
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedFilters({
      governmentLevels: [],
      ageGroups: [],
      genders: [],
      incomes: [],
      socialCategories: [],
      occupations: [],
    });
    setSortBy("relevance");
    setCurrentPage(1);
    setQuery("");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const parsed = parseIntent(query);
    if (parsed.category !== "all") setSelectedCategory(parsed.category);
    if (parsed.location) {
      setSelectedFilters((prev) => ({
        ...prev,
        governmentLevels: [...new Set([...prev.governmentLevels, parsed.location === "Tamil Nadu" ? t(lang, "scheme_gov_tamil") : t(lang, "scheme_gov_central")])],
      }));
    }
    loadSchemes(query);
  };

  const openRecommendedScheme = (scheme) => {
    const schemeIndex = filteredSchemes.findIndex((item) => item.id === scheme.id);
    if (schemeIndex < 0) return;
    setCurrentPage(Math.floor(schemeIndex / PAGE_SIZE) + 1);
    setExpandedId(scheme.id);
  };

  const categoryOptions = getCategoryOptions(lang);
  const filterGroups = getFilterGroups(lang);

  return (
    <div className="page schemes-page">
      <div className="page-header schemes-header">
        <div>
          <h2>{t(lang, "scheme_screen_title")}</h2>
          <p>{t(lang, "scheme_screen_subtitle")}</p>
        </div>
      </div>

      <div className="scheme-count-box">
        <div className="count-primary">{formatSchemeCount(totalSchemeCount)}+ {t(lang, "scheme_count_label")}</div>
        <div className="count-secondary">{t(lang, "scheme_count_sub")}</div>
        <div className="count-source">{t(lang, "scheme_source_label")}</div>
      </div>

      <div className="scheme-summary-row">
        <div className="summary-pill">
          <span className="summary-label">{t(lang, "scheme_found_label")}</span>
          <strong>{formatSchemeCount(filteredSchemes.length)}</strong>
        </div>
        <div className="summary-pill">
          <span className="summary-label">{t(lang, "scheme_recommended_label")}</span>
          <strong>{recommendedSchemes.length}</strong>
        </div>
        <div className="summary-pill">
          <span className="summary-label">{t(lang, "scheme_matching_label")}</span>
          <strong>{formatSchemeCount(Math.max(0, filteredSchemes.length - recommendedSchemes.length))}</strong>
        </div>
      </div>

      <form className="schemes-search" onSubmit={handleSearch}>
        <div className="search-icon">🔍</div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t(lang, "scheme_search_placeholder")}
        />
        <button type="submit">{t(lang, "scheme_search_button")}</button>
      </form>

      <div className="category-filter-strip">
        {categoryOptions.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`category-pill ${selectedCategory === category.id ? "active" : ""}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span>{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>

      <div className="filter-panel">
        <div className="filter-grid">
          <div className="filter-group">
            <h4>{t(lang, "scheme_filter_government")}</h4>
            {filterGroups.governmentLevels.map((item) => (
              <label key={item} className="check-row">
                <input type="checkbox" checked={selectedFilters.governmentLevels.includes(item)} onChange={() => handleCheckboxToggle("governmentLevels", item)} />
                <span>{item}</span>
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>{t(lang, "scheme_filter_age")}</h4>
            {filterGroups.ageGroups.map((item) => (
              <label key={item} className="check-row">
                <input type="checkbox" checked={selectedFilters.ageGroups.includes(item)} onChange={() => handleCheckboxToggle("ageGroups", item)} />
                <span>{item}</span>
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>{t(lang, "scheme_filter_gender")}</h4>
            {filterGroups.genders.map((item) => (
              <label key={item} className="check-row">
                <input type="checkbox" checked={selectedFilters.genders.includes(item)} onChange={() => handleCheckboxToggle("genders", item)} />
                <span>{item}</span>
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>{t(lang, "scheme_filter_income")}</h4>
            {filterGroups.incomes.map((item) => (
              <label key={item} className="check-row">
                <input type="checkbox" checked={selectedFilters.incomes.includes(item)} onChange={() => handleCheckboxToggle("incomes", item)} />
                <span>{item}</span>
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>{t(lang, "scheme_filter_social")}</h4>
            {filterGroups.socialCategories.map((item) => (
              <label key={item} className="check-row">
                <input type="checkbox" checked={selectedFilters.socialCategories.includes(item)} onChange={() => handleCheckboxToggle("socialCategories", item)} />
                <span>{item}</span>
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>{t(lang, "scheme_filter_occupation")}</h4>
            {filterGroups.occupations.map((item) => (
              <label key={item} className="check-row">
                <input type="checkbox" checked={selectedFilters.occupations.includes(item)} onChange={() => handleCheckboxToggle("occupations", item)} />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="filter-actions">
          <button type="button" className="primary-filter-btn">{t(lang, "scheme_apply_filters")}</button>
          <button type="button" className="secondary-filter-btn" onClick={clearFilters}>{t(lang, "scheme_clear_filters")}</button>
        </div>
      </div>

      <div className="sort-row">
        <div className="results-meta">{formatSchemeCount(filteredSchemes.length)} {t(lang, "scheme_found_suffix")}</div>
        <div className="sort-box">
          <label htmlFor="sort-schemes">{t(lang, "scheme_sort_by")}:</label>
          <select id="sort-schemes" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="relevance">{t(lang, "scheme_sort_relevance")}</option>
            <option value="category">{t(lang, "scheme_sort_category")}</option>
            <option value="recent">{t(lang, "scheme_sort_recent")}</option>
            <option value="government">{t(lang, "scheme_sort_government")}</option>
          </select>
        </div>
      </div>

      <div className="personalized-section">
        <div className="section-title">🎯 {t(lang, "scheme_recommended_title")}</div>
        <div className="section-subtitle">{t(lang, "scheme_recommended_subtitle")}</div>
        {recommendedSchemes.length ? (
          <div className="mini-grid">
            {recommendedSchemes.map((scheme) => (
              <button
                key={scheme.id}
                type="button"
                className="mini-card"
                aria-label={`${scheme.name}: ${t(lang, "scheme_view_details")}`}
                onClick={() => openRecommendedScheme(scheme)}
              >
                <div className="mini-card-top">
                  <span className="badge-match">🟢 {t(lang, "scheme_potential_match")}</span>
                </div>
                <h4>{scheme.name}</h4>
                <p>{scheme.department}</p>
                <small>{t(lang, "scheme_matched_because")} {scheme.category || t(lang, "scheme_profile")}</small>
              </button>
            ))}
          </div>
        ) : (
          <div className="empty-state">{t(lang, "scheme_no_personalized_matches")}</div>
        )}
      </div>

      {loading ? (
        <div className="loading-list">
          {[1, 2, 3].map((item) => (
            <div key={item} className="scheme-card skeleton-card" />
          ))}
        </div>
      ) : error ? (
        <div className="error-panel">{error}</div>
      ) : filteredSchemes.length === 0 ? (
        <div className="empty-state large">
          <div>🔍 {t(lang, "scheme_no_exact_match")}</div>
          <small>{t(lang, "scheme_no_match_hint")}</small>
          <div className="empty-actions">
            <button type="button" className="secondary-filter-btn" onClick={clearFilters}>{t(lang, "scheme_browse_all")}</button>
          </div>
        </div>
      ) : (
        <div className="scheme-list">
          {paginatedSchemes.map((scheme) => {
            const isExpanded = expandedId === scheme.id;
            const schemeLevel = getSchemeLevel(scheme, lang);
            const schemeState = (scheme.state || "ALL").toString();
            const docText = Array.isArray(scheme.documents_required) ? scheme.documents_required.join(", ") : "Aadhaar / applicable ID";
            const eligibilityText = Array.isArray(scheme.eligibility_criteria)
              ? scheme.eligibility_criteria.map((item) => item.label || item.field).slice(0, 2).join("; ")
              : "Scholarship, income, age and document eligibility may apply.";

            return (
              <div key={scheme.id} id={`scheme-card-${scheme.id}`} className="scheme-card">
                        <div className="scheme-card-header">
                  <div className="scheme-main-info">
                    <div className="scheme-card-icon">🎓</div>
                    <div>
                      <h3>{scheme.name}</h3>
                      <div className="scheme-dept">{scheme.department}</div>
                    </div>
                  </div>
                  <div className="scheme-chip-group">
                    <span className="scheme-level-chip">{schemeLevel}</span>
                    {scheme.match_score !== undefined && scheme.match_score !== null && (
                      <span className="match-badge">{Math.round(scheme.match_score * 100)}% {t(lang, "scheme_match_suffix")}</span>
                    )}
                  </div>
                </div>

                <div className="scheme-meta-row">
                  <span>{schemeLevel}</span>
                  <span>•</span>
                  <span>{schemeState === "ALL" ? t(lang, "scheme_available_india") : schemeState}</span>
                </div>

                <p className="scheme-description">{scheme.description}</p>

                <div className="scheme-detail-block">
                  <strong>💰 {t(lang, "scheme_benefit_label")}:</strong> {scheme.benefits || t(lang, "scheme_benefit_default")}
                </div>
                <div className="scheme-detail-block">
                  <strong>👥 {t(lang, "scheme_eligibility_label")}:</strong> {eligibilityText}
                </div>
                <div className="scheme-detail-block">
                  <strong>📍 {t(lang, "scheme_available_label")}:</strong> {schemeState === "ALL" ? t(lang, "scheme_available_india") : schemeState}
                </div>

                <button className="link-btn" type="button" onClick={() => setExpandedId(isExpanded ? null : scheme.id)}>
                  {isExpanded ? t(lang, "scheme_hide_details") : t(lang, "scheme_view_details")}
                </button>

                {isExpanded && (
                  <div className="scheme-details-panel">
                    <div className="details-grid">
                      <div>
                        <h4>📜 {t(lang, "scheme_detail_scheme_name")}</h4>
                        <p>{scheme.name}</p>
                      </div>
                      <div>
                        <h4>🏛 {t(lang, "scheme_detail_department")}</h4>
                        <p>{scheme.department}</p>
                      </div>
                      <div>
                        <h4>🇮🇳 {t(lang, "scheme_filter_government")}</h4>
                        <p>{schemeLevel}</p>
                      </div>
                      <div>
                        <h4>📍 {t(lang, "scheme_detail_location")}</h4>
                        <p>{schemeState === "ALL" ? t(lang, "scheme_available_india") : schemeState}</p>
                      </div>
                    </div>

                    <div className="details-section">
                      <h4>📖 {t(lang, "scheme_detail_about")}</h4>
                      <p>{scheme.description}</p>
                    </div>

                    <div className="details-section">
                      <h4>💰 {t(lang, "scheme_detail_benefits")}</h4>
                      <p>{scheme.benefits || t(lang, "scheme_benefit_default")}</p>
                    </div>

                    <div className="details-section">
                      <h4>✅ {t(lang, "scheme_detail_eligibility")}</h4>
                      <ul>
                        {(scheme.eligibility_criteria || []).map((criterion, index) => (
                          <li key={`${scheme.id}-criterion-${index}`}>
                            <strong>{criterion.field || t(lang, "scheme_detail_requirement")}</strong>: {criterion.label || t(lang, "scheme_detail_check_portal")}
                          </li>
                        ))}
                        {(!scheme.eligibility_criteria || scheme.eligibility_criteria.length === 0) && (
                          <li>{t(lang, "scheme_detail_criteria_hint")}</li>
                        )}
                      </ul>
                    </div>

                    <div className="details-section">
                      <h4>📄 {t(lang, "scheme_detail_documents")}</h4>
                      <ul>
                        {Array.isArray(scheme.documents_required) && scheme.documents_required.length > 0 ? (
                          scheme.documents_required.map((doc, index) => <li key={`${scheme.id}-doc-${index}`}>{doc}</li>)
                        ) : (
                          <li>{t(lang, "scheme_detail_document_default")}</li>
                        )}
                      </ul>
                    </div>

                    <div className="details-section">
                      <h4>📝 {t(lang, "scheme_detail_how_to_apply")}</h4>
                      <ol>
                        {(scheme.application_procedure || t(lang, "scheme_detail_apply_default")).split(/\.|\n/).filter(Boolean).slice(0, 4).map((step, index) => (
                          <li key={`${scheme.id}-step-${index}`}>{step.trim()}</li>
                        ))}
                      </ol>
                    </div>

                    <div className="details-section">
                      <h4>🔗 {t(lang, "scheme_detail_official_website")}</h4>
                      <a href={scheme.official_source || "#"} target="_blank" rel="noreferrer" className="official-link">
                        {t(lang, "scheme_detail_visit_official")}
                      </a>
                    </div>

                    <div className="details-section metadata-row">
                      <span>{t(lang, "scheme_detail_source")}: {scheme.department || t(lang, "scheme_government_of_india")}</span>
                      <span>{t(lang, "scheme_detail_last_verified")}: {scheme.source_date || t(lang, "scheme_detail_not_specified")}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!loading && filteredSchemes.length > 0 && (
        <div className="pagination-wrap">
          <button type="button" className="page-btn" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={safePage === 1}>
            ← {t(lang, "scheme_prev")}
          </button>
          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, index) => index + 1).slice(0, 7).map((page) => (
              <button
                key={page}
                type="button"
                className={`page-number ${page === safePage ? "active" : ""}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            {totalPages > 7 && <span className="page-ellipsis">…</span>}
            {totalPages > 7 && (
              <button type="button" className={`page-number ${totalPages === safePage ? "active" : ""}`} onClick={() => setCurrentPage(totalPages)}>
                {totalPages}
              </button>
            )}
          </div>
          <button type="button" className="page-btn" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>
            {t(lang, "scheme_next")} →
          </button>
        </div>
      )}

      <div className="scheme-disclaimer">
        ℹ️ {t(lang, "scheme_disclaimer")}
      </div>
    </div>
  );
}
