// OAuth init: redirect the user to GitHub's authorize page.
// Decap CMS opens this endpoint in a popup, completes auth at GitHub,
// then is sent back to /api/auth/callback below.
const crypto = require('crypto');

module.exports = (req, res) => {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const host = process.env.OAUTH_GIT_HOSTNAME || 'https://github.com';
  if (!clientId) {
    res.statusCode = 500;
    res.end('OAUTH_GITHUB_CLIENT_ID is not set in Vercel env vars');
    return;
  }
  const state = crypto.randomBytes(16).toString('hex');
  const url = `${host}/login/oauth/authorize`
    + `?client_id=${clientId}`
    + `&scope=repo,user`
    + `&state=${state}`;
  res.setHeader('Set-Cookie',
    `oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`);
  res.writeHead(302, { Location: url });
  res.end();
};
