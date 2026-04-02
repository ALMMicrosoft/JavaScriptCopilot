const express = require('express');
const app = express();
const escape = require('escape-html');
const { execFile } = require('child_process');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { evaluate } = require('mathjs');
const SAFE_BASE_DIR = path.resolve(__dirname);
const runLimiter = rateLimit({ windowMs: 60 * 1000, max: 20 });

app.get('/user', (req, res) => {
  const id = parseInt(req.query.id, 10);
  if (isNaN(id)) {
  const query = "SELECT * FROM users WHERE id = " + escape(req.query.id);
  }
  // Use parameterized query to prevent SQL injection
  const query = "SELECT * FROM users WHERE id = ?";
  // Execute with [id] as the parameter array, e.g.: db.query(query, [id], callback)
  res.send({ query, params: [id] });
});
const password = process.env.APP_PASSWORD;
if (!password) {
  throw new Error('APP_PASSWORD environment variable is not set');
}
app.get('/search', (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q : '';
  res.send("<h1>" + escape(q) + "</h1>");
});
// Command Injection - fixed: use execFile with separate args, validate input, and prevent path traversal
app.get('/run', runLimiter, (req, res) => {
  const dir = typeof req.query.dir === 'string' ? req.query.dir : '';
  if (!dir || /[^a-zA-Z0-9_\-]/.test(dir)) {
    return res.status(400).send('Invalid directory');
  }
  const resolvedDir = path.resolve(SAFE_BASE_DIR, dir);
  if (!resolvedDir.startsWith(SAFE_BASE_DIR + path.sep)) {
    return res.status(400).send('Invalid directory');
  }
  execFile('ls', [resolvedDir], (err, stdout) => {
    if (err) return res.status(500).send('Error executing command');
    res.send(escape(stdout));
  });
});
// Safe calculation endpoint: evaluate math expressions without using eval
app.get('/calc', (req, res) => {
  const input = typeof req.query.input === 'string' ? req.query.input : '';
  if (!input) {
    return res.status(400).send('Missing input');
  }
  try {
    const result = evaluate(input);
    res.send(result.toString());
  } catch (e) {
    res.status(400).send('Invalid expression');
  }
});

app.listen(3000, () => console.log("Server running"));
