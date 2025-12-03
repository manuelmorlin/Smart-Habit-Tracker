# 🌟 Smart Habit Tracker

**A modern application for tracking daily habits with a colorful and intuitive React interface.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel)](https://smart-habit-tracker-orpin.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/manuelmorlin/smart-habit-tracker)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)

---

## 🚀 Try the Live Demo

**Want to explore the app without registration?** Use our demo account!

| | |
|---|---|
| 🌐 **Live App** | [smart-habit-tracker-orpin.vercel.app](https://smart-habit-tracker-orpin.vercel.app) |
| 📧 **Email** | `guest@demo.com` |
| 🔑 **Password** | `GuestDemo2025!` |

> 💡 **Tip:** Click the **"Try Demo Account"** button on the login page for instant access!

*The demo account includes sample habits with completion history to showcase all features including statistics and progress tracking.*

---

## 🎯 Key Features

### 🔐 User Authentication
- **Secure registration** with email validation
- **Login/logout** with session management  
- **User profiles** with editable bio and goals (email not editable)
- **Password encryption** with bcrypt hashing
- **Multi-user support** with complete data isolation
- **Session persistence** with localStorage
- **Token-based authentication** system

### 📊 Interactive Dashboard
- **Three-tab interface**: My Habits, Statistics, and User Profile
- **Habit visualization** with colorful and animated cards
- **Progress bars** showing weekly completion percentage
- **Daily counter** of completed habits with live updates
- **Responsive design** optimized for mobile and desktop
- **Real-time updates** with database synchronization
- **Date display** showing current day
- **Empty state** with call-to-action for new users

### ⚡ Habit Management
- **Quick creation** with intuitive form and validation
- **Complete customization**: 10 predefined colors with color picker
- **Flexible goals**: 1 to 7 times per week (fully customizable frequency)
- **Visual states** for immediate feedback
- **Toggle completion** - mark/unmark habits as done
- **Edit habits** with inline editing and validation
- **Delete habits** with confirmation dialog
- **Reset progress** functionality for all habits
- **Form validation** with real-time error feedback
- **Keyboard navigation** and accessibility support

### 📈 Advanced Statistics  
- **Dedicated statistics tab** with comprehensive metrics
- **Weekly summary cards** showing total habits and averages
- **Per-habit completion tracking** with visual progress bars
- **Color-coded performance indicators** (high/medium/low)
- **Real-time completion percentages** calculated dynamically
- **Dynamic motivational messages** based on progress
- **Weekly tracking** with date ranges
- **Sortable habit list** by performance
- **Goals achieved counter** for successful habits

### 🎨 Modern UI/UX
- **Dark/Light mode** with theme toggle and localStorage persistence
- **Fully responsive design** optimized for mobile, tablet, and desktop
- **Touch-friendly targets** (minimum 44x44px) for mobile interactions
- **Consistent design system** with CSS custom properties
- **Smooth animations** and GPU-accelerated transitions
- **Accessibility features** including ARIA labels and keyboard navigation
- **Optimized performance** with React.memo and lazy loading
- **Form validation** with real-time error feedback
- **Toast notifications** for user feedback
- **Loading states** and skeleton screens
- **Confirmation dialogs** for destructive actions
- **Responsive grid layouts** with mobile-first approach

### 👤 User Profile Management
- **Personal statistics dashboard** with habit metrics
- **Editable profile** with name, bio, and goals
- **Top 3 favorite habits** display based on completion rate
- **Member since** date tracking
- **Profile avatar** with user initials
- **Non-editable email** for security
- **Real-time profile updates** synchronized with backend

---

## 🛠️ Technology Stack

### Frontend
- **React 18.2** - Modern Hooks and Concurrent Features
- **Vite 5.0** - Lightning-fast build tool with HMR
- **Modern CSS3** - Custom properties, flexbox, grid layouts
- **ESLint** - Code quality and consistency
- **Context API** - State management for authentication
- **React Router** - (Ready for multi-page navigation)
- **Fetch API** - Native HTTP client for backend communication

### Backend
- **PHP 8+** - Modern server-side scripting
- **MySQL 8** - Robust relational database
- **REST API** - Complete CRUD operations
- **JWT-ready** - Token-based authentication system
- **CORS enabled** - Cross-origin resource sharing

### Database
- **MySQL schema** - Optimized with indexes
- **Foreign key constraints** - Data integrity
- **Multi-user architecture** - Secure data isolation
- **Prepared statements** - SQL injection protection

### Security
- **Password hashing** - Bcrypt encryption
- **Input validation** - Server and client-side
- **SQL injection protection** - Prepared statements
- **XSS prevention** - Content sanitization

### Deployment
- **Vercel** - Frontend hosting with API rewrites
- **IONOS VPS** - Backend PHP server with local MySQL database
- **Apache** - Web server configuration
- **Environment variables** - Secure configuration for database credentials
- **API rewrites** - Configured in vercel.json to proxy backend requests
- **Production optimizations** - Minified builds and code splitting

### Performance & Optimizations
- **Code Splitting** - Optimized bundle with lazy loading  
- **React.memo** - Prevention of unnecessary re-renders
- **useCallback/useMemo** - Hook optimizations
- **GPU Acceleration** - Hardware-accelerated animations

### Deploy & DevOps
- **Vercel** - Automatic deploy with GitHub integration
- **GitHub Actions** - CI/CD pipeline (future)
- **Progressive Web App** - PWA ready with manifest

---

## 🏃‍♂️ Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm** 8+ or **yarn** 1.22+
- **Git** 2.30+
- **PHP** 8+ (for local backend development)
- **MySQL** 8+ (for local backend development)

### Frontend Only (Demo Mode)
```bash
# Clone the repository
git clone https://github.com/manuelmorlin/smart-habit-tracker.git
cd smart-habit-tracker

# Install frontend dependencies
cd frontend
npm install

# Start development server
npm run dev
```

### Full-Stack Development
```bash
# Frontend setup
cd frontend && npm install && npm run dev

# Backend setup (in a new terminal)
cd backend
php -S localhost:8000

# Database setup
mysql -u root -p < ../database/schema.sql
```

🎉 **App available at:** http://localhost:3000
🔗 **API available at:** http://localhost:8000

### Configuration Notes
- The frontend connects to the backend API configured in `vercel.json`
- For local development with local backend, update `AuthContext.jsx` API_BASE_URL
- Database credentials are in `backend/config/database.php`
- Create a `.env` file in backend for production environment variables

### Available Scripts
```bash
npm run dev      # Development server
npm run build    # Production build  
npm run preview  # Build preview
npm run lint     # Code check
```

---

## 🏗️ Project Architecture

```
smart-habit-tracker/
├── frontend/           # React app (Deployed on Vercel)
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── AddHabitForm.jsx
│   │   │   ├── HabitCard.jsx
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   ├── StatsPanel.jsx
│   │   │   ├── UserProfile.jsx
│   │   │   └── UserProfilePage.jsx
│   │   ├── contexts/      # React contexts
│   │   │   └── AuthContext.jsx    # Authentication state
│   │   ├── pages/         # Main application pages
│   │   │   ├── AuthPage.jsx       # Login/Register
│   │   │   └── Dashboard.jsx      # Main dashboard
│   │   ├── services/      # API service layer
│   │   │   └── habitService.js    # Habit API calls
│   │   ├── styles/        # CSS modules
│   │   │   ├── App.css
│   │   │   ├── Auth.css
│   │   │   └── UserProfile.css
│   │   ├── App.jsx        # Root component
│   │   └── main.jsx       # Entry point
│   ├── public/           # Static assets
│   ├── dist/            # Build output
│   └── package.json     # Dependencies
├── backend/             # PHP API (Deployed on IONOS VPS)
│   ├── api/
│   │   ├── auth/         # Authentication endpoints
│   │   │   ├── login.php
│   │   │   ├── register.php
│   │   │   └── profile.php
│   │   └── habits/       # Habit management endpoints
│   │       ├── get.php
│   │       ├── create.php
│   │       ├── check.php
│   │       ├── delete.php
│   │       ├── manage.php
│   │       ├── reset.php
│   │       └── stats.php
│   ├── config/          # Configuration files
│   │   └── database.php  # DB connection
│   ├── vendor/          # Composer dependencies
│   └── index.php        # API router
├── database/            # MySQL schema and migrations
│   └── schema.sql       # Complete DB structure
├── vercel.json          # Vercel deployment config
├── LICENSE              # MIT License
└── README.md            # This file
```

---

## 🎨 Design System

### Color Palette
```css
--primary: #007bff     /* Main blue */
--success: #28a745     /* Success green */
--warning: #ffc107     /* Warning yellow */
--gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
```

### Typography Scale
```css
--font-size-xs: 0.75rem    /* 12px */
--font-size-base: 1rem     /* 16px */
--font-size-title: 2.5rem  /* 40px */
```

### Spacing System
```css
--spacing-sm: 0.5rem   /* 8px */
--spacing-md: 1rem     /* 16px */  
--spacing-lg: 1.5rem   /* 24px */
--spacing-xl: 2rem     /* 32px */
```

---

## 📱 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x400/667eea/ffffff?text=Dashboard+Screenshot)

### Habit Creation
![Form](https://via.placeholder.com/800x400/28a745/ffffff?text=Add+Habit+Form)

### Statistics  
![Stats](https://via.placeholder.com/800x400/ffc107/000000?text=Statistics+Panel)

---

## � Data Management

### Local vs Production
- **Local development**: Data stored in local MySQL database
- **Production**: Data stored on IONOS VPS MySQL database
- **No automatic sync**: Local and production databases are separate
- **Migration**: Export/import SQL dumps to transfer data between environments

### Database Export/Import
```bash
# Export local database
mysqldump -u root -p smart_habit_tracker > backup.sql

# Import to another environment
mysql -u root -p smart_habit_tracker < backup.sql
```

---

## �🚀 Deployment

### Vercel (Recommended)
1. Fork this repository
2. Connect Vercel account to GitHub
3. Import project on Vercel
4. Automatic deploy on every push!

### Build Configuration
```json
{
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/dist",  
  "installCommand": "cd frontend && npm install"
}
```

### Other Providers
- **Netlify**: Drag & drop the `frontend/dist` folder
- **GitHub Pages**: Via GitHub Actions
- **Railway**: Direct repository connection

---

## 🗺️ Roadmap

### ✅ V2.0 - Backend Integration (COMPLETED!)
- [x] **MySQL database** for real persistence
- [x] **REST API** with secure authentication
- [x] **Multi-user** with personal profiles
- [x] **User registration** and login system
- [x] **Cloud deployment** on production servers
- [x] **Data security** with password encryption
- [x] **Habit toggle** functionality
- [x] **Real-time statistics** and analytics
- [x] **Dark mode** with theme persistence
- [x] **Fully responsive** mobile-first design
- [x] **Enhanced UX** with loading states and toast notifications
- [x] **Edit habits** functionality
- [x] **User profile** management with editable fields

### 🎯 V2.2 - Advanced Features (In Progress)
- [ ] **Streak tracking** for consecutive days
- [ ] **Predefined habit templates** library
- [ ] **Data export** in CSV/JSON format
- [ ] **Habit categories** and tagging system
- [ ] **Calendar view** for habit history
- [ ] **Habit reminders** with notifications

### 🎯 V3.0 - Advanced Features
- [ ] **Push notifications** for reminders
- [ ] **Habit insights** with advanced analytics  
- [ ] **Goal setting** with long-term objectives
- [ ] **Integration** with Google Calendar
- [ ] **Habit categories** and tagging system
- [ ] **Progress charts** and visual analytics
- [ ] **Integration** with Google Calendar

### 🎯 V4.0 - Social Features
- [ ] **Progress sharing** on social media
- [ ] **Challenges** between friends
- [ ] **Weekly leaderboards**
- [ ] **Achievement system** with badges

---

## 📋 API Documentation

### Authentication Endpoints
- `POST /api/auth/register.php` - Register new user with email and password
- `POST /api/auth/login.php` - Authenticate user and return session data
- `GET /api/auth/profile.php?user_id={id}` - Get user profile information
- `PUT /api/auth/profile.php` - Update user profile (name, bio, goals)

### Habit Management Endpoints
- `GET /api/habits/get.php?user_id={id}` - Get all user habits with statistics
- `POST /api/habits/create.php` - Create new habit with customization
- `PUT /api/habits/update.php` - Update existing habit details
- `POST /api/habits/check.php` - Toggle daily habit completion
- `DELETE /api/habits/delete.php` - Delete specific habit
- `POST /api/habits/reset.php` - Reset all habit progress for user
- `GET /api/habits/stats.php?user_id={id}` - Get detailed weekly statistics

### Request/Response Format
All endpoints use JSON format with standardized response structure:
```json
{
  "success": true/false,
  "data": {...},
  "error": "error message if applicable"
}
```

### Database Schema
The application uses three main tables:
- **users** - User accounts with authentication
- **habits** - Habit definitions with customization
- **habit_checks** - Daily completion tracking

For complete schema details, see [`database/schema.sql`](database/schema.sql)

---

## 🔒 Security Features

- **Password hashing** using PHP's `password_hash()` with bcrypt
- **SQL injection protection** via PDO prepared statements
- **XSS prevention** with proper input sanitization
- **CORS configuration** for secure cross-origin requests
- **Session management** with token-based authentication
- **Email validation** on both client and server side
- **Secure password requirements** (minimum 6 characters)
- **User data isolation** - users can only access their own data

---

## 🌐 Browser Compatibility

The application is tested and compatible with:
- **Chrome/Edge** 90+
- **Firefox** 88+
- **Safari** 14+
- **Mobile browsers** (iOS Safari, Chrome Mobile)

**Requirements:**
- JavaScript must be enabled
- Cookies/localStorage enabled for session persistence
- Modern browser with ES6+ support

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

### How to Contribute
1. **Fork** the project
2. **Create branch** (`git checkout -b feature/amazing-feature`)
3. **Commit** (`git commit -m 'Add amazing feature'`)
4. **Push** (`git push origin feature/amazing-feature`)
5. **Pull Request** with detailed description

### Guidelines
- Follow existing ESLint conventions
- Write tests for new features
- Update documentation when necessary
- Use descriptive commit messages

---

## 🐛 Issues and Support

Found a bug or have a feature request?

### Report Bug
- Use the [issue template](https://github.com/manuelmorlin/smart-habit-tracker/issues/new?template=bug_report.md)
- Include screenshots if possible
- Specify browser and OS version

### Feature Request  
- Use the [feature template](https://github.com/manuelmorlin/smart-habit-tracker/issues/new?template=feature_request.md)
- Describe the use case
- Explain the benefit for users

---

## 📄 License

This project is released under **MIT License**.

See the [LICENSE](LICENSE) file for all details.

---

## 👨‍💻 Author

**Manuel Morlin**
- GitHub: [@manuelmorlin](https://github.com/manuelmorlin)
- LinkedIn: [Manuel Morlin](https://www.linkedin.com/in/manuel-morlin-732b83349/)

---

## 🙏 Acknowledgments

- **React Team** for the fantastic library
- **Vite Team** for the incredibly fast build tool  
- **Vercel** for excellent free hosting
- **Open Source Community** for continuous inspiration
- **Beta testers** for feedback and suggestions

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/manuelmorlin/smart-habit-tracker?style=social)
![GitHub forks](https://img.shields.io/github/forks/manuelmorlin/smart-habit-tracker?style=social)
![GitHub issues](https://img.shields.io/github/issues/manuelmorlin/smart-habit-tracker)
![GitHub pull requests](https://img.shields.io/github/issues-pr/manuelmorlin/smart-habit-tracker)

---

**⭐ If you liked the project, leave a star! Help other developers discover it.**

**🔄 Share with the community and help us grow!**