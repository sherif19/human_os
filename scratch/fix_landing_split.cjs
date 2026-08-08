const fs = require('fs');
const path = require('path');

const transPath = path.join(__dirname, '..', 'src', 'lib', 'translations.ts');
const landingPath = path.join(__dirname, '..', 'src', 'pages', 'LandingPage.tsx');
const brandingPath = path.join(__dirname, '..', 'src', 'pages', 'BrandingSettings.jsx');

// 1. Update translations.ts
let trans = fs.readFileSync(transPath, 'utf8');
trans = trans.replace('"branding.quizSection": "Diagnostic Quiz & Archetypes",', '"branding.quizSection": "Diagnostic Quiz & Archetypes",\n    "initiating_neural_scan": "Initiating neural scan...",');
trans = trans.replace('"branding.quizSection": "اختبار التشخيص والأنماط",', '"branding.quizSection": "اختبار التشخيص والأنماط",\n    "initiating_neural_scan": "بدء الفحص العصبي...",');
fs.writeFileSync(transPath, trans, 'utf8');
console.log("Updated translations.ts");

// 2. Update BrandingSettings.jsx dictionary keys
let branding = fs.readFileSync(brandingPath, 'utf8');
branding = branding.replace(
  "keys: ['hero_title', 'hero_subtitle', 'hero_badge', 'hero_sub', 'get_started', 'view_demo', 'sign_in_now']",
  "keys: ['hero_title', 'hero_subtitle', 'hero_badge', 'hero_sub', 'get_started', 'view_demo', 'sign_in_now', 'initiating_neural_scan']"
);
fs.writeFileSync(brandingPath, branding, 'utf8');
console.log("Updated BrandingSettings.jsx");

// 3. Update LandingPage.tsx
let landing = fs.readFileSync(landingPath, 'utf8');

// Replace the split title logic in button tab
const oldTabTitle = `<span>{language === 'ar' ? scen.titleAr.split(' ')[0] : scen.titleEn.split(' ').pop()}</span>`;
const newTabTitle = `<span>{language === 'ar' ? (scen.title || '').split(' ')[0] : (scen.title || '').split(' ').pop()}</span>`;

// Replace prompt selection
const oldPromptSelect = `                             {simSelectedPrompt !== null \n                               ? (language === 'ar' ? simScenarios[simSelectedPrompt].promptAr : simScenarios[simSelectedPrompt].promptEn)\n                               : (language === 'ar' ? 'بدء الفحص العصبى...' : 'Initiating neural scan...')\n                             }`;
const newPromptSelect = `                             {simSelectedPrompt !== null \n                               ? simScenarios[simSelectedPrompt].prompt\n                               : t('initiating_neural_scan')\n                             }`;

let norm = landing.replace(/\r\n/g, '\n');
const normOldTab = oldTabTitle.replace(/\r\n/g, '\n');
const normNewTab = newTabTitle.replace(/\r\n/g, '\n');
const normOldPrompt = oldPromptSelect.replace(/\r\n/g, '\n');
const normNewPrompt = newPromptSelect.replace(/\r\n/g, '\n');

if (norm.includes(normOldTab)) {
  norm = norm.replace(normOldTab, normNewTab);
  console.log("Replaced tab title split logic.");
} else {
  console.log("FAILED to replace tab title split logic.");
}

if (norm.includes(normOldPrompt)) {
  norm = norm.replace(normOldPrompt, normNewPrompt);
  console.log("Replaced prompt display selection.");
} else {
  console.log("FAILED to replace prompt display selection.");
}

const finalLanding = landing.includes('\r\n') ? norm.replace(/\n/g, '\r\n') : norm;
fs.writeFileSync(landingPath, finalLanding, 'utf8');
console.log("Finished updating LandingPage.tsx");
