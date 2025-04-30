// backend/routes/users.js
const express = require('express');
const router = express.Router();

// GET semua users
router.get('/', (req, res) => {
  const db = req.db;
  db.query('SELECT * FROM users', (err, result) => {
    if (err) return res.status(500).json({ message: 'Gagal ambil data' });
    res.json(result);
  });
});

// POST user baru
router.post('/', (req, res) => {
  const db = req.db;
  const { username, password, email, role, no_telfon } = req.body;
  db.query(
    'INSERT INTO users (username, password, email, role, no_telfon) VALUES (?, ?, ?, ?, ?)',
    [username, password, email, role, no_telfon],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Gagal tambah user' });
      res.json({ id: result.insertId });
    }
  );
});

// PUT update user
router.put('/:id', (req, res) => {
  const db = req.db;
  const { username, password, email, role, no_telfon } = req.body;
  const { id } = req.params;
  db.query(
    'UPDATE users SET username=?, password=?, email=?, role=?, no_telfon=? WHERE id=?',
    [username, password, email, role, no_telfon, id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Gagal update user' });
      res.json({ message: 'User diupdate' });
    }
  );
});

// DELETE user
router.delete('/:id', (req, res) => {
  const db = req.db;
  const { id } = req.params;
  db.query('DELETE FROM users WHERE id=?', [id], (err) => {
    if (err) return res.status(500).json({ message: 'Gagal hapus user' });
    res.json({ message: 'User dihapus' });
  });
});

module.exports = router;
