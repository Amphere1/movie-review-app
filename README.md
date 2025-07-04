# 🎬 Movie Review App

A full-stack web application for discovering, organizing, and reviewing movies. Built with React.js frontend and Node.js/Express backend, featuring user authentication, movie search using TMDB API, and personal movie list management.

![Movie Review App](https://img.shields.io/badge/React-19.1.0-blue) ![Node.js](https://img.shields.io/badge/Node.js->=16.0.0-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green) ![Vercel](https://img.shields.io/badge/Deployed-Vercel-black)

## 🌟 Features

### User Authentication
- **User Registration & Login** - Secure JWT-based authentication
- **Password Encryption** - Using bcrypt for secure password hashing
- **Protected Routes** - Authenticated access to user-specific features

### Movie Discovery
- **Movie Search** - Search movies using The Movie Database (TMDB) API
- **Advanced Filters** - Filter by genre, release year, and categories
- **Movie Details** - View comprehensive movie information including ratings and posters

### Personal Movie Management
- **Watch Later List** - Save movies to watch later
- **Watched Movies** - Track movies you've already seen
- **Favorites** - Mark your favorite movies
- **Personal Ratings** - Rate movies from 1-5 stars
- **Reviews & Tags** - Add personal reviews and custom tags
- **Sorting Options** - Sort by date added, title, rating, or watch date

### Modern UI/UX
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Dark Theme** - Modern dark UI with smooth transitions
- **Interactive Cards** - Expandable movie cards with detailed information
- **Real-time Search** - Debounced search with instant results

## 🛠️ Tech Stack

### Frontend
- **React.js 19.1.0** - Modern React with hooks and functional components
- **React Router 7.6.0** - Client-side routing and navigation
- **Tailwind CSS 4.1.7** - Utility-first CSS framework
- **Axios 1.9.0** - HTTP client for API requests
- **Vite 6.3.5** - Fast build tool and development server
- **Lucide React** - Beautiful SVG icons

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js 5.1.0** - Web application framework
- **MongoDB with Mongoose 8.15.0** - NoSQL database with ODM
- **Passport.js** - Authentication middleware
- **JWT (jsonwebtoken 9.0.2)** - Secure token-based authentication
- **bcrypt 6.0.0** - Password hashing
- **CORS 2.8.5** - Cross-origin resource sharing

### External APIs
- **TMDB API** - The Movie Database for movie data
- **MongoDB Atlas** - Cloud database service

### Deployment
- **Vercel** - Frontend and backend deployment
- **Environment Variables** - Secure configuration management

## 📁 Project Structure

```
movie-review-app/
├── frontend/                    # React.js frontend application
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   │   ├── Login.jsx       # User login form
│   │   │   ├── Register.jsx    # User registration form
│   │   │   ├── Navigation.jsx  # Navigation bar
│   │   │   ├── SearchForm.jsx  # Movie search interface
│   │   │   ├── MovieCard.jsx   # Individual movie display
│   │   │   ├── MovieList.jsx   # Movie list container
│   │   │   └── Logout.jsx      # Logout functionality
│   │   ├── services/           # API service layer
│   │   │   └── api.js          # Centralized API configuration
│   │   ├── config.js           # Frontend configuration
│   │   ├── App.jsx             # Main application component
│   │   └── main.jsx            # Application entry point
│   ├── package.json            # Frontend dependencies
│   ├── vite.config.js          # Vite configuration
│   └── vercel.json             # Vercel deployment config
│
├── backend/                     # Node.js backend application
│   ├── routes/                 # API route handlers
│   │   ├── auth.js             # Authentication routes
│   │   ├── movieList.js        # Movie list management routes
│   │   └── index.js            # Additional routes
│   ├── models/                 # MongoDB data models
│   │   ├── userModel.js        # User schema and model
│   │   └── movieListModel.js   # Movie list schema and model
│   ├── middleware/             # Custom middleware
│   │   ├── auth.js             # JWT authentication middleware
│   │   └── tokenValidator.js   # Token validation utilities
│   ├── config/                 # Configuration files
│   │   └── passport.js         # Passport.js configuration
│   ├── services/               # External service integrations
│   │   └── tmdbService.js      # TMDB API integration
│   ├── app.js                  # Express application setup
│   ├── package.json            # Backend dependencies
│   └── vercel.json             # Vercel deployment config
│
└── README.md                   # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (>=16.0.0)
- npm or yarn
- MongoDB Atlas account
- TMDB API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd movie-review-app
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create `.env` file in backend directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   SECRET_KEY=your_jwt_secret_key
   TMDB_API_KEY=your_tmdb_api_key
   PORT=5000
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

   Create `.env` file in frontend directory:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_TMDB_API_KEY=your_tmdb_api_key
   ```

### Development

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server runs on `http://localhost:5000`

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Application runs on `http://localhost:5173`

### Production Build

1. **Backend Deployment**
   ```bash
   cd backend
   npm start
   ```

2. **Frontend Build**
   ```bash
   cd frontend
   npm run build
   npm run preview
   ```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
SECRET_KEY=your_secure_jwt_secret_key
TMDB_API_KEY=your_tmdb_api_key
PORT=5000
NODE_ENV=production
```

#### Frontend (.env)
```env
VITE_API_URL=https://your-backend-domain.vercel.app
VITE_TMDB_API_KEY=your_tmdb_api_key
```

### CORS Configuration
The backend is configured to accept requests from:
- `localhost:3000` (React development)
- `localhost:5173` (Vite development)
- `*.vercel.app` (Production deployments)

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification

### Movie Lists
- `GET /api/movielist` - Get user's movie list
- `POST /api/movielist/add` - Add movie to list
- `PATCH /api/movielist/:movieId` - Update movie in list
- `DELETE /api/movielist/:movieId` - Remove movie from list
- `GET /api/movielist/category/:category` - Get movies by category

### Movie Search
- `GET /api/search` - Search movies (requires authentication)
- `GET /api/search/genres` - Get movie genres

### Health Check
- `GET /health` - Server health status

## 🔐 Authentication Flow

1. User registers/logs in with email and password
2. Server validates credentials and returns JWT token
3. Frontend stores token in localStorage
4. All subsequent API requests include token in Authorization header
5. Backend middleware validates token on protected routes

## 🎨 UI Components

### Navigation
- Responsive navigation bar with mobile menu
- User authentication status display
- Quick access to different movie categories

### Movie Search
- Real-time search with debouncing
- Advanced filtering options
- Grid layout for search results

### Movie Cards
- Expandable cards with movie details
- Quick action buttons for list management
- Personal rating and review system

### Movie Lists
- Category-based organization (To Watch, Watched, Favorites)
- Sorting and filtering options
- Personal metadata display

## 🚀 Deployment

This application is deployed on Vercel with the following configuration:

### Frontend Deployment
- Automatic deployment from Git repository
- Environment variables configured in Vercel dashboard
- Build command: `npm run build`

### Backend Deployment
- Serverless functions on Vercel
- MongoDB Atlas for database hosting
- Environment variables securely managed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for movie data
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide](https://lucide.dev/) for icons
- [Vercel](https://vercel.com/) for hosting

## 📞 Support

If you have any questions or need help with setup, please open an issue in the repository.

---

**Built with ❤️ using React, Node.js, and MongoDB**
