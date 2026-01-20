const express = require("express");
const nodemailer = require("nodemailer");
const cryptoJS = require("crypto-js");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const app = express();
const PORT = 3000;
const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
  console.error("❌ SECRET_KEY is missing in .env file!");
  process.exit(1);
}

// **Middleware**
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../frontend"))); // Serve static files

// **Serve HTML Pages**
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "../frontend/password-generator.html")));
app.get("/profile", (req, res) => res.sendFile(path.join(__dirname, "../frontend/profile.html")));
app.get("/indexprofile", (req, res) => res.sendFile(path.join(__dirname, "../frontend/indexprofile.html")));

// **MySQL Connection**
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL Connection Failed:", err);
    return;
  }
  console.log("✅ MySQL Connected");
});

// **Nodemailer Setup**
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// **OTP Storage**
const otpStore = {};
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// **Encrypt & Decrypt Functions**
function encryptPassword(password) {
  return cryptoJS.AES.encrypt(password, SECRET_KEY).toString();
}

function decryptPassword(encryptedPassword) {
  try {
    const bytes = cryptoJS.AES.decrypt(encryptedPassword, SECRET_KEY);
    const decrypted = bytes.toString(cryptoJS.enc.Utf8);
    return decrypted || "(Decryption Failed)";
  } catch (err) {
    console.error("❌ Decryption Error:", err.message);
    return "(Decryption Error)";
  }
}

// **Send OTP API**
app.post("/send-otp", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email is required" });

  const otp = generateOTP();
  otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "OTP for Registration",
    text: `Your OTP for registration is: ${otp}. It will expire in 5 minutes.`,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) return res.status(500).json({ success: false, message: "Failed to send OTP" });
    console.log(`✅ OTP sent to ${email}: ${otp}`);
    res.json({ success: true, message: "OTP sent successfully" });
  });
});

// **Verify OTP API & Redirect**
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!otpStore[email] || otpStore[email].otp !== otp || otpStore[email].expiresAt < Date.now()) {
    return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
  }

  delete otpStore[email]; // OTP is one-time use

  // Check if user exists
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err.message });

    if (results.length > 0) {
      // Existing user - check if they have saved passwords
      const userId = results[0].id;

      db.query("SELECT COUNT(*) as passwordCount FROM passwords WHERE user_id = ?", [userId], (err, passwordResults) => {
        if (err) return res.status(500).json({ success: false, error: err.message });

        const passwordCount = passwordResults[0].passwordCount;

        if (passwordCount > 0) {
          // User has saved passwords - redirect to password manager
          res.json({ success: true, redirect: "indexprofile.html", email: email });
        } else {
          // User exists but has no passwords - redirect to password generator
          res.json({ success: true, redirect: "password-generator.html", email: email });
        }
      });
    } else {
      // New user - create user and redirect to password generator
      db.query("INSERT INTO users (email) VALUES (?)", [email], (err, insertResult) => {
        if (err) return res.status(500).json({ success: false, error: err.message });

        res.json({ success: true, redirect: "password-generator.html", email: email });
      });
    }
  });
});

// **Save Password API**
app.post("/save-password", (req, res) => {
  const { email, website, password } = req.body;
  if (!email || !website || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const encryptedPassword = encryptPassword(password);

  db.query("SELECT id FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err.message });

    if (results.length === 0) {
      // New user: Insert into users table first
      db.query("INSERT INTO users (email) VALUES (?)", [email], (err, insertResult) => {
        if (err) return res.status(500).json({ success: false, error: err.message });

        const userId = insertResult.insertId;
        insertPassword(userId);
      });
    } else {
      // Existing user: Directly insert password
      const userId = results[0].id;
      insertPassword(userId);
    }
  });

  function insertPassword(userId) {
    db.query(
      "INSERT INTO passwords (user_id, website, password) VALUES (?, ?, ?)",
      [userId, website, encryptedPassword],
      (err) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, message: "Password saved successfully" });
      }
    );
  }
});

// **Retrieve Saved Passwords API**
app.post("/get-passwords", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  const query = `
      SELECT passwords.id, passwords.website, passwords.password, users.id AS user_id
      FROM passwords
      JOIN users ON passwords.user_id = users.id
      WHERE users.email = ?`;

  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Error fetching passwords:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }

    if (results.length === 0) {
      return res.json({ success: true, passwords: [] });
    }

    const formattedResults = results.map((item) => ({
      id: item.id,
      user_id: item.user_id,
      website: item.website.startsWith("http") ? item.website : `https://${item.website}`,
      password: decryptPassword(item.password),
    }));

    res.json({ success: true, passwords: formattedResults });
  });
});


// **Delete Saved Password API**
app.post("/delete-password", async (req, res) => {
  const { userId, passwordId } = req.body;

  if (!userId || !passwordId) {
    return res.status(400).json({ success: false, message: "Missing user ID or password ID" });
  }

  try {
    const query = `
          DELETE FROM passwords 
          WHERE id = ? AND user_id = ?`;

    db.query(query, [passwordId, userId], (err, result) => {
      if (err) {
        console.error("Error deleting password:", err);
        return res.status(500).json({ success: false, message: "Server error" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Password not found" });
      }
      res.json({ success: true, message: "Password deleted successfully" });
    });

  } catch (err) {
    console.error("Error deleting password:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// **Start Server**
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
