# 🔐 OTP Login & Password Manager System

A modern, secure OTP-based authentication system with an integrated password manager featuring an ultra-modern dark theme UI with neon accents and advanced animations.

![Ultra-Modern Dark Theme](https://img.shields.io/badge/Design-Ultra--Modern%20Dark%20Theme-00d4ff?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

## ✨ Features

### 🔒 Authentication
- **OTP-Based Login**: Secure email-based one-time password authentication
- **User Session Management**: Persistent login with localStorage
- **Auto-Redirect Logic**: Smart routing based on user state
  - New users → Password Generator
  - Users with saved passwords → Password Manager
  - Users without passwords → Password Generator

### 🔑 Password Management
- **Password Generator**: Customizable password generation with:
  - Adjustable length (4-20 characters)
  - Uppercase/lowercase letters
  - Numbers and symbols
  - Mandatory string inclusion
- **Secure Storage**: AES-256 encryption for all passwords
- **User Isolation**: Each user sees only their own passwords
- **CRUD Operations**: Create, read, and delete saved passwords
- **Copy to Clipboard**: One-click password copying

### 🎨 Modern UI/UX
- **Ultra-Modern Dark Theme**: Deep navy background with neon accents
- **Glassmorphism Effects**: Translucent cards with backdrop blur
- **Neon Glows**: Cyan, purple, and pink accent colors
- **Advanced Animations**:
  - Floating particle background
  - Pulsing gradient overlays
  - Button ripple effects
  - 3D lift on hover
  - Smooth transitions
- **Fully Responsive**: Optimized for desktop, tablet, and mobile
- **Modern Typography**: Poppins font family

## 🚀 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **Nodemailer** - Email service for OTP
- **crypto-js** - AES-256 encryption
- **dotenv** - Environment variable management
- **cors** - Cross-origin resource sharing

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling with advanced animations
- **Vanilla JavaScript** - Client-side logic
- **Modern CSS Features**:
  - CSS Variables
  - Backdrop filters
  - CSS Grid & Flexbox
  - Keyframe animations
  - Cubic-bezier transitions

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **MySQL** (v5.7 or higher)
- **Gmail Account** (for SMTP)

## ⚙️ Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd otp-login-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup

Create the MySQL database and tables:

```sql
CREATE DATABASE users_db;
USE users_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE passwords (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    website VARCHAR(255) NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

Or use the provided schema:
```bash
mysql -u root -p < database/schema.sql
```

### 4. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=users_db

# Email Configuration (Gmail SMTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Encryption Secret Key
SECRET_KEY=your_secret_encryption_key_here
```

**Important**: For Gmail, you need to use an [App Password](https://support.google.com/accounts/answer/185833):
1. Enable 2-Factor Authentication on your Google Account
2. Go to Google Account → Security → App Passwords
3. Generate a new app password for "Mail"
4. Use this password in `EMAIL_PASS`

### 5. Start the Server

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

The server will run on `http://localhost:3000`

## 📁 Project Structure

```
otp-login-system/
├── backend/
│   └── server.js              # Express server & API endpoints
├── database/
│   └── schema.sql             # MySQL database schema
├── frontend/
│   ├── index.html             # OTP login page
│   ├── password-generator.html # Password generator
│   ├── indexprofile.html      # Password manager
│   ├── profile.html           # Profile access page
│   ├── script.js              # Login logic
│   ├── password-generator.js  # Password generation logic
│   ├── indexprofile.js        # Password manager logic
│   ├── profile.js             # Profile logic
│   └── styles.css             # Ultra-modern dark theme
├── .env                       # Environment variables
├── package.json               # Dependencies
└── README.md                  # Documentation
```

## 🔌 API Endpoints

### Authentication

#### Send OTP
```http
POST /send-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

#### Verify OTP
```http
POST /verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "redirect": "indexprofile.html",
  "email": "user@example.com"
}
```

### Password Management

#### Save Password
```http
POST /save-password
Content-Type: application/json

{
  "email": "user@example.com",
  "website": "google.com",
  "password": "SecurePass123!"
}
```

#### Get Passwords
```http
POST /get-passwords
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "passwords": [
    {
      "id": 1,
      "user_id": 1,
      "website": "https://google.com",
      "password": "DecryptedPassword123"
    }
  ]
}
```

#### Delete Password
```http
POST /delete-password
Content-Type: application/json

{
  "userId": 1,
  "passwordId": 1
}
```

## 🎨 Design Features

### Color Palette
- **Background**: Deep navy (`#0a0e27`)
- **Accents**: 
  - Cyan (`#00d4ff`)
  - Purple (`#b537f2`)
  - Pink (`#ff2e97`)
  - Orange (`#ff6b35`)
  - Green (`#00ff88`)

### Animations
- Floating particle background
- Pulsing radial gradients
- Button ripple effects
- 3D lift on hover
- Neon glow effects
- Smooth cubic-bezier transitions

### Typography
- **Font**: Poppins (300-800 weights)
- **Title**: Gradient text with animated glow
- **Labels**: Medium weight with letter spacing

## 🔒 Security Features

- **AES-256 Encryption**: All passwords encrypted before storage
- **OTP Expiration**: OTPs expire after 5 minutes
- **One-Time Use**: OTPs are deleted after verification
- **User Isolation**: Foreign key constraints ensure data separation
- **Session Management**: Secure localStorage-based sessions
- **HTTPS Ready**: Designed for production deployment

## 📱 Responsive Design

- **Desktop**: Full animations and effects
- **Tablet** (≤768px): Adjusted spacing and font sizes
- **Mobile** (≤480px): Optimized layout and touch targets

## 🧪 Testing

### Test User Flow

1. **New User**:
   - Enter email → Receive OTP → Verify
   - Redirected to password generator
   - Generate and save password
   - Redirected to password manager

2. **Returning User with Passwords**:
   - Enter email → Receive OTP → Verify
   - Directly redirected to password manager
   - View saved passwords

3. **Multiple Users**:
   - Login as User A → Save passwords → Logout
   - Login as User B → Verify isolation
   - User B cannot see User A's passwords

## 🛠️ Troubleshooting

### Common Issues

**OTP not received:**
- Check Gmail app password is correct
- Verify 2FA is enabled on Google Account
- Check spam folder
- Ensure EMAIL_USER and EMAIL_PASS are set correctly

**Database connection failed:**
- Verify MySQL is running
- Check DB credentials in `.env`
- Ensure database `users_db` exists

**Passwords not saving:**
- Check SECRET_KEY is set in `.env`
- Verify user is logged in (check localStorage)
- Check browser console for errors

## 📝 Future Enhancements

- [ ] Password strength indicator
- [ ] Two-factor authentication options
- [ ] Password sharing functionality
- [ ] Browser extension
- [ ] Mobile app (React Native)
- [ ] Biometric authentication
- [ ] Password breach checker
- [ ] Export/import passwords

## 👨‍💻 Development

### Running in Development
```bash
npm run dev
```

### Building for Production
```bash
npm start
```

### Environment Variables
Ensure all variables in `.env` are set before deployment.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Contact

For questions or support, please contact the development team.

---

**Made with ❤️ using Node.js, Express, and MySQL**

**Design**: Ultra-Modern Dark Theme with Neon Accents ✨
