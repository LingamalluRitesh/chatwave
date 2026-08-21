const https = require('https');

const options = {
  hostname: 'api.github.com',
  path: '/repos/LingamalluRitesh/chatwave/pulls?state=all',
  headers: {
    'User-Agent': 'NodeJS-Client'
  }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const prs = JSON.parse(data);
      if (Array.isArray(prs)) {
        console.log('=== PULL REQUESTS IN LINGAMALLURITESH/CHATWAVE ===');
        console.log('Total Pull Requests:', prs.length);
        const openPRs = prs.filter(p => p.state === 'open');
        const closedPRs = prs.filter(p => p.state === 'closed');
        console.log('Open PRs:', openPRs.length);
        console.log('Closed/Merged PRs:', closedPRs.length);
        if (prs.length === 0) {
          console.log('No Pull Requests created yet.');
        } else {
          prs.forEach(p => {
            console.log(`#${p.number} [${p.state.toUpperCase()}] ${p.title} by @${p.user.login} (${p.created_at})`);
          });
        }
      } else {
        console.log('API response:', prs);
      }
    } catch (e) {
      console.log('Error parsing:', e.message, data);
    }
  });
}).on('error', err => console.log('HTTP Error:', err.message));
