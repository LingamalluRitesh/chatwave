const { execSync } = require('child_process');

const branches = [
  'origin/main',
  'origin/feature/crypto-and-security-test-suites',
  'origin/feature/proprietary-license-and-env-template',
  'origin/feature/system-architecture-and-api-specification',
  'origin/feature/webrtc-and-whiteboard-test-suites'
];

console.log('===============================================================');
console.log('📊 DETAILED BRANCH-BY-BRANCH REPORT FOR LINGAMALLURITESH/CHATWAVE');
console.log('===============================================================\n');

branches.forEach((b, i) => {
  const shortName = b.replace('origin/', '');
  const count = execSync(`git rev-list --count ${b}`, { encoding: 'utf8' }).trim();
  const latestLog = execSync(`git log -n 1 --format="%h | %an | %ad | %s" --date=relative ${b}`, { encoding: 'utf8' }).trim();
  
  // Check if branch commits are already in main
  const unmergedCount = execSync(`git rev-list --count origin/main..${b}`, { encoding: 'utf8' }).trim();

  console.log(`[Branch #${i + 1}] ${shortName}`);
  console.log(`  • Total Commits on Branch: ${count}`);
  console.log(`  • Latest Commit: ${latestLog}`);
  console.log(`  • Commits Ahead of main: ${unmergedCount} ${unmergedCount === '0' ? '(✅ Fully merged/included in main)' : '(⏳ Unmerged into main)'}`);
  console.log('---------------------------------------------------------------');
});
