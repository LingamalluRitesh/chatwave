const https = require('https');
const { execSync } = require('child_process');

function fetchGitHub(endpoint) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: endpoint,
      headers: { 'User-Agent': 'NodeJS-Client' }
    };
    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ error: e.message, raw: data });
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('==============================================');
  console.log('🔍 FULL REPOSITORY & BRANCH INSPECTION REPORT');
  console.log('==============================================');

  // 1. Local & Remote Git Branches
  const localBranches = execSync('git branch -a', { encoding: 'utf8' }).trim();
  console.log('\n[1] Git Branches (Local & Remote Tracking):');
  console.log(localBranches);

  // 2. Git Tags
  const tags = execSync('git tag -l', { encoding: 'utf8' }).trim();
  console.log('\n[2] Git Tags:');
  console.log(tags || 'No tags found.');

  // 3. GitHub API - Remote Branches
  const ghBranches = await fetchGitHub('/repos/LingamalluRitesh/chatwave/branches');
  console.log('\n[3] GitHub Remote Branches (via GitHub API):');
  if (Array.isArray(ghBranches)) {
    console.log(`Found ${ghBranches.length} branch(es) on GitHub:`);
    ghBranches.forEach(b => console.log(`  - Branch: "${b.name}" (Latest commit: ${b.commit.sha.substring(0, 7)})`));
  } else {
    console.log(ghBranches);
  }

  // 4. GitHub API - Pull Requests (State = All)
  const ghPulls = await fetchGitHub('/repos/LingamalluRitesh/chatwave/pulls?state=all');
  console.log('\n[4] GitHub Pull Requests (State = all):');
  if (Array.isArray(ghPulls)) {
    console.log(`Found ${ghPulls.length} PR(s) on GitHub:`);
    if (ghPulls.length === 0) {
      console.log('  (No Pull Requests ever created on this repository)');
    } else {
      ghPulls.forEach(p => {
        console.log(`  - #${p.number}: "${p.title}" [${p.state}] by @${p.user.login} -> merged: ${!!p.merged_at}`);
      });
    }
  } else {
    console.log(ghPulls);
  }

  // 5. GitHub API - Issues
  const ghIssues = await fetchGitHub('/repos/LingamalluRitesh/chatwave/issues?state=all');
  console.log('\n[5] GitHub Issues (State = all):');
  if (Array.isArray(ghIssues)) {
    // Filter out PRs which GitHub API returns under issues
    const pureIssues = ghIssues.filter(i => !i.pull_request);
    console.log(`Found ${pureIssues.length} Issue(s) on GitHub:`);
    if (pureIssues.length === 0) {
      console.log('  (No Issues created)');
    } else {
      pureIssues.forEach(i => console.log(`  - #${i.number}: "${i.title}" [${i.state}]`));
    }
  }

  console.log('\n==============================================');
}

run();
