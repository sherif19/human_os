const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'lib', 'translations.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings to LF to simplify matches
let normalized = content.replace(/\r\n/g, '\n');

// 1. Move English overrides inside 'en' block
const targetEnStart = `"footer_social_medium": "Medium"\n  },\n\n    "diagnostic_completed": "DIAGNOSTIC COMPLETED"`;
const replacementEnStart = `"footer_social_medium": "Medium",\n    "diagnostic_completed": "DIAGNOSTIC COMPLETED"`;

const targetEnEnd = `"pricing_plan3_price": "99",\n\n\n  ar: {`;
const replacementEnEnd = `"pricing_plan3_price": "99"\n  },\n  ar: {`;

// 2. Fix the double comma in Arabic section
const targetArComma = `"branding.quizSection": "اختبار التشخيص والأنماط",\n,\n\n    "hud_header_status":`;
const replacementArComma = `"branding.quizSection": "اختبار التشخيص والأنماط",\n\n    "hud_header_status":`;

let updated = normalized;

if (updated.includes(targetEnStart)) {
  updated = updated.replace(targetEnStart, replacementEnStart);
  console.log("SUCCESS: Fixed English overrides start.");
} else {
  console.log("ERROR: English overrides start not found.");
}

if (updated.includes(targetEnEnd)) {
  updated = updated.replace(targetEnEnd, replacementEnEnd);
  console.log("SUCCESS: Fixed English overrides end.");
} else {
  console.log("ERROR: English overrides end not found.");
}

if (updated.includes(targetArComma)) {
  updated = updated.replace(targetArComma, replacementArComma);
  console.log("SUCCESS: Fixed Arabic overrides duplicate comma.");
} else {
  console.log("ERROR: Arabic overrides duplicate comma not found.");
}

const finalContent = content.includes('\r\n') ? updated.replace(/\n/g, '\r\n') : updated;
fs.writeFileSync(filePath, finalContent, 'utf8');
console.log("Repair complete.");
