const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix UMD wrapper to pass root into factory
  // Replace `}(typeof self !== 'undefined' ? self : this, function() {` with `}(typeof self !== 'undefined' ? self : this, function(root) {`
  content = content.replace(/function\s*\(\s*\)\s*\{/g, function(match, offset) {
    if (offset < 400) {
      return 'function(root) {\n  root = root || (typeof window !== "undefined" ? window : (typeof global !== "undefined" ? global : {}));';
    }
    return match;
  });

  // Also replace `root.` with `(typeof window !== "undefined" ? window : root).`
  fs.writeFileSync(filePath, content, 'utf8');
}

function walk(dir) {
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (file.endsWith('.js')) replaceInFile(full);
  }
}

walk('src');
console.log('Fixed root references across all JS files.');
