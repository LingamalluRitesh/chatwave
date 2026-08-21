const fs = require('fs');
const path = require('path');

const gameFiles = [
  'src/components/MiniApps/ChessGame.js',
  'src/components/MiniApps/TicTacToeGame.js',
  'src/components/MiniApps/WordleGame.js',
  'src/components/MiniApps/Game2048.js',
  'src/components/MiniApps/TriviaQuizGame.js'
];

gameFiles.forEach(rel => {
  const full = path.join(__dirname, '..', rel);
  let content = fs.readFileSync(full, 'utf8');
  content = content.replace(/render\s*\([^)]*\)\s*\{/g, 'render($&) {\n      if (typeof document === "undefined") return;');
  content = content.replace(/render\(render\(/g, 'render(');
  fs.writeFileSync(full, content, 'utf8');
});

console.log('Added document guards to MiniApps.');
