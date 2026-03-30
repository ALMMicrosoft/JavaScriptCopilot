const express = require('express');
const app = express();
const escape = require('escape-html');

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
// Command Injection
app.get('/run', (req, res) => {
  exec("ls " + req.query.dir);
  res.send("Executed");
});
