# Movie AI – AI-Based Movie Recommendation App

## 📌 **Project Description**
Movie AI is a **Node.js + Express.js** application that allows users to **rate movies and receive personalized recommendations**.
The app uses **MongoDB** to store user data and ratings, **EJS** for template rendering, and **TMDB API** to fetch movie information. Additionally, it leverages **Gemini AI API** to provide AI-driven movie recommendations based on user ratings.

---

## 🚀 **Key Features**
- ✅ **User registration and login** (JWT-based session management).
- ✅ **Movie rating system** (1-5 stars) for user feedback.
- ✅ **Personalized AI-based movie recommendations**.
- ✅ **Movie search functionality** using **TMDB API**.
- ✅ **Detailed movie pages** including trailers and descriptions.
- ✅ **EJS with Partials** for modular UI components.
- ✅ **MongoDB database management** using Mongoose.
- ✅ **Secure authentication using bcrypt for password hashing**.
- ✅ **Session persistence with cookies and JWT tokens**.
- ✅ **Responsive UI design for optimal user experience**.

---

## 📂 **Project Structure**

```
📦 Movie-AI
 ┣ 📂 config/           # Database connection configuration
 ┃ ┗ 📜 db.js           # MongoDB connection setup
 ┣ 📂 controllers/      # Route controllers
 ┃ ┣ 📜 profileController.js  # User profile management
 ┃ ┣ 📜 ratingController.js   # Movie rating handling
 ┃ ┣ 📜 recommendationController.js # AI-based recommendations
 ┃ ┣ 📜 userController.js     # User authentication (register/login/logout)
 ┃ ┣ 📜 videoController.js    # Fetching movie details
 ┃ ┗ 📜 viewController.js     # View rendering logic
 ┣ 📂 middleware/       # (Future) Security & authentication middleware
 ┣ 📂 models/           # Database schemas
 ┃ ┣ 📜 user.js         # User schema
 ┃ ┣ 📜 rating.js       # Rating schema
 ┃ ┗ 📜 video.js        # (Future) Movie schema
 ┣ 📂 public/           # Static assets (CSS, JS)
 ┣ 📂 routes/           # API and view routes
 ┃ ┣ 📜 userRoutes.js   # User management routes
 ┃ ┣ 📜 profileRoutes.js # Profile page routes
 ┃ ┣ 📜 ratingRoutes.js  # Movie rating routes
 ┃ ┣ 📜 recommendationRoutes.js # AI recommendations routes
 ┃ ┣ 📜 videoRoutes.js   # Movie search & details routes
 ┃ ┗ 📜 viewRoutes.js    # General page rendering routes
 ┣ 📂 services/         # External API services
 ┃ ┣ 📜 tmdbApiService.js # TMDB API integration
 ┃ ┗ 📜 geminiAiService.js # Gemini AI API integration
 ┣ 📂 views/            # EJS templates (dynamic HTML pages)
 ┃ ┣ 📂 partials/       # Reusable UI components (navbar/footer)
 ┃ ┣ 📜 home.ejs        # Home page
 ┃ ┣ 📜 login.ejs       # Login page
 ┃ ┣ 📜 register.ejs    # Registration page
 ┃ ┣ 📜 profile.ejs     # User profile page
 ┃ ┣ 📜 gallery.ejs     # Movie gallery
 ┃ ┣ 📜 search.ejs      # Movie search results
 ┃ ┗ 📜 recommendations.ejs # AI movie recommendations
 ┣ 📜 .env              # Environment variables
 ┣ 📜 .gitignore        # Ignore files (e.g., node_modules, .env)
 ┣ 📜 package.json      # Project dependencies
 ┣ 📜 app.js            # Express.js setup
 ┗ 📜 server.js         # Server execution entry point
```

---

## ⚙ **Installation & Setup**
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/username/Movie-AI.git
cd Movie-AI
```

### **2️⃣ Install Dependencies**
```sh
npm install
```

### **3️⃣ Create a `.env` File**
Create a `.env` file and add your credentials:
```ini
MONGO_URI=mongodb+srv://your_user:your_password@cluster.mongodb.net/moviedb
TMDB_API_KEY=your_tmdb_api_key
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
PORT=5000
```

### **4️⃣ Start the Server**
```sh
npm run dev  # Start with nodemon (for development)
npm start    # Standard start
```
🔹 The server will run at **http://localhost:5000**

---

## 🔗 **External APIs Used**
- 🎬 **[TMDB API](https://www.themoviedb.org/) - Fetch movie data**
- 🤖 **[Gemini AI](https://ai.google.dev/) - AI-powered recommendations**

---

## 🚀 **EJS Templating & Partials**
The application utilizes **EJS** for rendering dynamic pages, and `Partials` for reusable UI elements.
Example of including a `navbar.ejs` partial in all pages:
```ejs
<%- include('partials/navbar') %>
```

**Example of looping through movies in EJS:**
```ejs
<% movies.forEach(movie => { %>
    <div class="movie-card">
        <h3><%= movie.title %></h3>
    </div>
<% }); %>
```

---

## 🌟 **Future Enhancements**
- ✅ **Improved AI recommendation system** – Enhancing Gemini AI logic.
- ✅ **Advanced UI/UX design** – Implementing modern styling and animations.
- ✅ **User watchlist & favorites** – Allowing users to save movies.
- ✅ **Movie streaming integration** – Linking to streaming platforms.
- ✅ **User comments & reviews** – Adding community engagement features.

---

## 👨‍💻 **Project Owner**
📌 **Name:** Lior   kalendarov
📌 **Email:** liorka17@gmail.com  
📌 **GitHub:** [Lior Kalendarov](https://github.com/liorka17 )


---

🚀 **If you have any questions or suggestions, feel free to reach out!** 💪🔥

