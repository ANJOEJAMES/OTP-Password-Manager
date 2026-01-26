# 🔐 OTP Login & Password Manager System

A modern, secure OTP-based authentication system with an integrated password manager featuring an ultra-modern dark theme UI with glassmorphism effects and smooth animations.

![Ultra-Modern Dark Theme](https://img.shields.io/badge/Design-Ultra--Modern%20Dark%20Theme-00d4ff?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

## ✨ Features

### 🔒 Authentication
- **OTP-Based Login**: Secure email-based one-time password authentication
- **User Session Management**: Persistent login with localStorage
- **Unified Dashboard**: All users redirect to the password manager dashboard after verification

### 🔑 Password Management
- **Integrated Dashboard**: All-in-one password management interface
- **Password Generator**: Built-in generator with customizable options:
  - Adjustable length (4-20 characters)
  - Uppercase/lowercase letters
  - Numbers and symbols
  - Mandatory string inclusion
- **Secure Storage**: AES-256 encryption for all passwords
- **User Isolation**: Each user sees only their own passwords
- **CRUD Operations**: Create, read, and delete saved passwords
- **Copy to Clipboard**: One-click password copying
- **Search Functionality**: Filter passwords by website name

### 🎨 Modern UI/UX
- **Ultra-Modern Dark Theme**: Deep navy background with neon accents
- **Glassmorphism Effects**: Translucent cards with backdrop blur
- **Gradient Accents**: Cyan, purple, and pink color scheme
- **Smooth Animations**:
  - Rotating gradient background
  - Floating hover effects
  - Button lift on hover
  - Modal transitions
  - Smooth scrolling
- **Modular CSS Architecture**: Organized, maintainable stylesheets
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
- **Modular CSS3** - Organized styling with separate files
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
│   ├── css/
│   │   ├── base.css           # Shared styles (variables, buttons, inputs)
│   │   ├── login.css          # Login page styles
│   │   └── dashboard.css      # Dashboard page styles
│   ├── index.html             # OTP login page
│   ├── indexprofile.html      # Password manager dashboard
│   ├── script.js              # Login logic
│   └── indexprofile.js        # Dashboard logic
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

### CSS Architecture
- **base.css**: Variables, reset, common components
- **login.css**: Login page specific styles
- **dashboard.css**: Dashboard, sidebar, table, modal styles

### Animations
- Rotating gradient background
- Floating hover effects
- Button lift animations
- Neon glow effects
- Smooth modal transitions
- Scrollable modal content

### Typography
- **Font**: Poppins (300-800 weights)
- **Gradient Headings**: Animated gradient text
- **Labels**: Medium weight with letter spacing

## 🔒 Security Features

- **AES-256 Encryption**: All passwords encrypted before storage
- **OTP Expiration**: OTPs expire after 5 minutes
- **One-Time Use**: OTPs are deleted after verification
- **User Isolation**: Foreign key constraints ensure data separation
- **Session Management**: Secure localStorage-based sessions
- **SQL Injection Protection**: Parameterized queries
- **HTTPS Ready**: Designed for production deployment

## 📱 Responsive Design

### Breakpoints
- **Desktop** (>1024px): Full sidebar, 3-column stats grid
- **Tablet** (768px-1024px): Narrower sidebar, 2-column stats
- **Mobile** (<768px): Horizontal scrolling sidebar, stacked layout

### Mobile Optimizations
- Horizontal scrolling navigation
- Stacked header components
- Full-width buttons and inputs
- Optimized table layout
- Touch-friendly action buttons

## 🧪 Testing

### Test User Flow

1. **Login Flow**:
   - Visit `http://localhost:3000`
   - Enter email → Click "Send OTP"
   - Check email for OTP code
   - Enter OTP → Click "Verify OTP"
   - Redirected to dashboard

2. **Dashboard Operations**:
   - View saved passwords in table
   - Click "Add Password" to open modal
   - Generate secure password
   - Save password to vault
   - Search passwords by website
   - Copy, view, or delete passwords
   - Click "Logout" to end session

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

**CSS not loading:**
- Hard refresh browser (Ctrl+Shift+R)
- Clear browser cache
- Check that css folder exists in frontend
- Verify CSS file paths in HTML

## 🎯 Application Flow

```
User Access
    ↓
index.html (Login)
    ↓
Enter Email → Send OTP
    ↓
Verify OTP
    ↓
indexprofile.html (Dashboard)
    ↓
┌─────────────────────────┐
│  Password Manager       │
│  - View Passwords       │
│  - Add New Password     │
│  - Search Passwords     │
│  - Copy/Delete Actions  │
│  - Logout               │
└─────────────────────────┘
```

## 📝 Future Enhancements

- [ ] Password strength indicator
- [ ] Password history tracking
- [ ] Bulk password import/export
- [ ] Password sharing functionality
- [ ] Browser extension
- [ ] Mobile app (React Native)
- [ ] Biometric authentication
- [ ] Password breach checker
- [ ] Multi-language support

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

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

For questions or support, please contact the development team.

---

**Made with ❤️ using Node.js, Express, and MySQL**

**Design**: Ultra-Modern Dark Theme with Glassmorphism ✨

**Architecture**: Modular, Secure, Scalable 🚀
