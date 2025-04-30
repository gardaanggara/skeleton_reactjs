// SERVER (index.js atau app.js kamu)

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'pemasaran', // pastiin nama database bener yaa
  port: 4306
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to database! 🥰');
  }
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.log('Error during query:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.json({ success: false, message: 'Username tidak ditemukan' });
    }

    const user = results[0];

    if (password === user.password) {
      const now = new Date(); // Waktu sekarang

      // Kalau belum pernah login, isi first_login dan last_login
      if (!user.first_login) {
        db.query(
          'UPDATE users SET first_login = ?, last_login = ? WHERE id = ?',
          [now, now, user.id],
          (err) => {
            if (err) console.error('Error updating first & last login:', err);
          }
        );
      } else {
        // Kalau sudah pernah login, hanya update last_login
        db.query(
          'UPDATE users SET last_login = ? WHERE id = ?',
          [now, user.id],
          (err) => {
            if (err) console.error('Error updating last login:', err);
          }
        );
      }

      return res.json({
        success: true,
        message: 'Login berhasil',
        role: user.role,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          first_login: user.first_login,
          last_login: now
        }
      });
    } else {
      return res.json({ success: false, message: 'Password salah' });
    }
  });
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000 🚀');
});
