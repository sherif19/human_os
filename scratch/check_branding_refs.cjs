const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'pages', 'LandingPage.tsx');
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
let matches = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Search for branding followed by a dot, without a question mark before the dot
  const regex = /(?<!\?)\bbranding\.\w+/g;
  let match;
  while ((match = regex.exec(line)) !== null) {
    matches.push({ lineNum: i + 1, content: line.trim(), match: match[0] });
  }
}

if (matches.length > 0) {
  console.log("FOUND UNSAFE BRANDING ACCESSES:");
  console.log(JSON.stringify(matches, null, 2));
} else {
  console.log("No unsafe branding accesses found.");
}
