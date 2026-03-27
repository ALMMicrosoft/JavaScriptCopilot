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
// Hardcoded Secret
const password = "Admin@123";
