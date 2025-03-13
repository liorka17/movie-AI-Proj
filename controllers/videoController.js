const tmdbService = require("../services/tmdbbApiService"); // מייבא את השירות לתקשורת עם TMDB API
const axios = require('axios'); // מייבא את אקסיוס לביצוע בקשות HTTP

// פונקציה זו טוענת את גלריית הסרטים, שולפת את רשימת הסרטים הפופולריים מה-איי.פי.אי ומעבירה אותם לתצוגה
exports.getGallery = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // מקבל את מספר העמוד מהבקשה, ברירת מחדל: עמוד 1
        const movies = await tmdbService.getPopularMovies(page); // שולף את רשימת הסרטים הפופולריים מה-איי.פי.אי

        res.render("gallery", { movies, page }); // מציג את עמוד הגלריה עם רשימת הסרטים והעמוד הנוכחי
    } catch (error) { 
        console.error("❌ Error loading gallery:", error); // מציג שגיאה במקרה של כישלון בטעינת הסרטים
        res.status(500).render("gallery", { movies: [], page: 1 }); // מציג עמוד ריק במקרה של שגיאה
    }
};




// פונקציה זו שולפת את פרטי הסרט מה-איי.פי.אי של טי.מי.די.בי, כולל הטריילר, ומציגה אותם בעמוד ייעודי

exports.getMovieDetails = async (req, res) => {
    try {
        const movieId = req.params.id; // מקבל את מזהה הסרט מהנתיב (URL)
        const movie = await tmdbService.getMovieById(movieId); // שולף את פרטי הסרט מה-איי.פי.אי
        const trailer = await tmdbService.getMovieTrailer(movieId); // שולף את הטריילר של הסרט מה-איי.פי.אי

        res.render("movieDetails", {
            movie, // מעביר את פרטי הסרט לתבנית
            trailer, // מעביר את הטריילר לתבנית
            user: req.user, // מעביר את פרטי המשתמש (אם מחובר) לתבנית
            success: req.query.success || false // ✅ מעביר את success מה-URL לתוך התבנית כדי להציג הודעות למשתמש
        });
    } catch (error) { 
        console.error("❌ Error fetching movie details:", error); // מדפיס הודעת שגיאה במקרה של כישלון
        res.status(500).send("שגיאה בטעינת פרטי הסרט"); // מחזיר הודעת שגיאה למשתמש במקרה של בעיה בטעינת הסרט
    }
};


// פונקציה זו מציגה את עמוד החיפוש למשתמש
exports.SearchPage = (req, res) => {
    res.render("search"); // מציג את תבנית עמוד החיפוש
};


// פונקציה זו מבצעת חיפוש סרטים ב-איי.פי.אי של טי.אמ.די.בי על פי מונח חיפוש שהוזן על ידי המשתמש

exports.searchMovies = async (req, res) => {
    try {
        const query = req.query.query; // מקבל את מונח החיפוש מתוך הפרמטרים ב-URL
        if (!query) { // בודק אם לא הוזן מונח חיפוש
            return res.status(400).json({ message: "❌ חייב להזין מונח חיפוש" }); // מחזיר הודעת שגיאה
        }

        const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, { // מבצע קריאה ל-איי.פי.אי של טי.אמ.די.בי
            params: {
                api_key: process.env.TMDB_API_KEY, // משתמש במפתח ה-איי.פי.אי מתוך משתני הסביבה
                query: query, // שולח את מונח החיפוש לבקשה
                language: "he-IL" // מחזיר את התוצאות בעברית
            }
        });

        res.json(response.data); // מחזיר את תוצאות החיפוש כתגובה בפורמט ג'ייסון
    } catch (error) { 
        console.error("❌ שגיאה בחיפוש סרטים:", error); // מדפיס הודעת שגיאה במקרה של כשל
        res.status(500).json({ message: "שגיאת שרת." }); // מחזיר הודעת שגיאה למשתמש
    }
};


// פונקציה זו שולפת סטטיסטיקות כלליות על סרטים מה-API של TMDB, כולל כמות הסרטים הפופולריים, הסרט הכי נצפה השבוע, והז'אנר הפופולרי ביותר

exports.getSiteStats = async () => {
    try {
        const TMDB_API_KEY = process.env.TMDB_API_KEY; // מקבל את מפתח ה-איי.פי.אי מתוך משתני הסביבה

        // 🔹 קבלת כמות הסרטים הפופולריים
        const moviesResponse = await axios.get(
            `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=he-IL&page=1`
        );
        const totalMovies = moviesResponse.data.total_results || 0; // סופרת את כמות הסרטים הפופולריים

        // 🔹 הסרט הכי נצפה השבוע
        const trendingResponse = await axios.get(
            `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}&language=he-IL`
        );
        const topTrendingMovie = trendingResponse.data.results[0] || null; // מקבל את הסרט הנצפה ביותר השבוע

        // 🔹 הז'אנר הפופולרי ביותר
        const genresResponse = await axios.get(
            `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=he-IL`
        );
        const genres = genresResponse.data.genres; // מקבל רשימת ז'אנרים
        const genreCounts = {}; // אובייקט לספירת הז'אנרים הנפוצים

        moviesResponse.data.results.forEach(movie => { // עובר על כל הסרטים הפופולריים
            movie.genre_ids.forEach(genreId => { // עובר על כל הז'אנרים של כל סרט
                genreCounts[genreId] = (genreCounts[genreId] || 0) + 1; // סופר את כמות ההופעות של כל ז'אנר
            });
        });

        // מוצא את הז'אנר שמופיע הכי הרבה פעמים
        const mostPopularGenreId = Object.keys(genreCounts).reduce((a, b) => genreCounts[a] > genreCounts[b] ? a : b);
        const mostPopularGenre = genres.find(g => g.id == mostPopularGenreId)?.name || "לא ידוע"; // מחפש את שם הז'אנר ברשימת הז'אנרים

        return {
            totalMovies, // כמות הסרטים הפופולריים
            topTrendingMovie, // הסרט הכי נצפה השבוע
            mostPopularGenre // הז'אנר הפופולרי ביותר
        };

    } catch (error) { 
        console.error("❌ שגיאה בקבלת סטטיסטיקות:", error.message); // מציג שגיאה במקרה של בעיה בשליפת הנתונים
        return { totalMovies: 0, topTrendingMovie: null, mostPopularGenre: "לא ידוע" }; // מחזיר ערכים ריקים במקרה של שגיאה
    }
};


