const fs = require('fs');
const path = require('path');

let totalLines = 0;
let fileCount = 0;
const fileStats = [];

function scan(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    if (ent.name === '.git' || ent.name === 'node_modules') continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      scan(full);
    } else if (/\.(js|html|css|json|md|gradle|xml|java)$/i.test(ent.name)) {
      const content = fs.readFileSync(full, 'utf8');
      const lines = content.split('\n').length;
      totalLines += lines;
      fileCount++;
      fileStats.push({ file: path.relative('.', full), lines });
    }
  }
}

scan('.');
console.log('Total files scanned:', fileCount);
console.log('Total Lines of Code (LOC):', totalLines);
