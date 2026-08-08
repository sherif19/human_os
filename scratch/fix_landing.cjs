const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'pages', 'LandingPage.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings
const normalized = content.replace(/\r\n/g, '\n');

const markerStart = '                     -20%';
const markerEnd = '{branding?.plan && branding?.plan?.visible !== false ? (';

const idxStart = normalized.indexOf(markerStart);
const idxEnd = normalized.indexOf(markerEnd);

if (idxStart !== -1 && idxEnd !== -1) {
  // We want to replace the text between the end of the span and the beginning of the plan mapping
  // Let's print what's currently in between
  const substringToReplace = normalized.substring(idxStart, idxEnd);
  
  const replacement = `                     -20%\n                   </span>\n                  </button>\n               </div>\n            </div>\n            \n            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">\n                `;
  
  const updated = normalized.replace(substringToReplace, replacement);
  const finalContent = content.includes('\r\n') ? updated.replace(/\n/g, '\r\n') : updated;
  fs.writeFileSync(filePath, finalContent, 'utf8');
  console.log("SUCCESS: LandingPage.tsx pricing section repaired successfully using markers.");
} else {
  console.log("ERROR: Markers not found.", { idxStart, idxEnd });
}
