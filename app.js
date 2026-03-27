const express = require('express');
const { exec } = require('child_process');
const app = express();

// SQL Injection
app.get('/user', (req, res) => {
  const query = "SELECT * FROM users WHERE id = " + req.query.id;
  res.send(query);
});
