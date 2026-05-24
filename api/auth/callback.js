// OAuth callback: exchange the GitHub `code` for an access token,
// then hand it back to Decap CMS via the postMessage handshake the
// CMS popup expects.
module.exports = async (req, res) => {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;
  const host = process.env.OAUTH_GIT_HOSTNAME || 'https://github.com';
  if (!clientId || !clientSecret) {
    res.statusCode = 500;
    res.end('OAUTH_GITHUB_CLIENT_ID / OAUTH_GITHUB_CLIENT_SECRET not set');
    return;
  }
  const code = (req.query && req.query.code) || '';
  if (!code) {
    res.statusCode = 400;
    res.end('Missing ?code');
    return;
  }

  let payload;
  let status = 'error';
  try {
    const r = await fetch(`${host}/login/oauth/access_token`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const data = await r.json();
    if (data.access_token) {
      status = 'success';
      payload = { token: data.access_token, provider: 'github' };
    } else {
      payload = data;
    }
  } catch (err) {
    payload = { message: String(err && err.message || err) };
  }

  const msg = `authorization:github:${status}:${JSON.stringify(payload)}`;
  const msgJson = JSON.stringify(msg);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(`<!doctype html>
<title>Sangci CMS — auth</title>
<script>
(function () {
  var message = ${msgJson};
  function receive(e) {
    if (!e.data || !/^authorizing:github$/.test(e.data)) return;
    if (window.opener) window.opener.postMessage(message, e.origin);
  }
  window.addEventListener('message', receive, false);
  if (window.opener) window.opener.postMessage('authorizing:github', '*');
})();
</script>
<body style="font-family:sans-serif;padding:2rem">
  <p>Auth ${status}. This window should close automatically.</p>
</body>`);
};
