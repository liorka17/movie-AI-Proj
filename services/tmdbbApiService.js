const axios = require("axios"); // מייבא את אקסיוס לביצוע בקשות HTTP

const TMDB_API_KEY = process.env.TMDB_API_KEY; // מפתח ה-איי.פי.אי של טי.אמ.די.בי (חייב להיות מוגדר בקובץ `.env`)
const TMDB_BASE_URL = "https://api.themoviedb.org/3"; // כתובת הבסיס של ה-API של TMDB

// פונקציה לקבלת רשימת הסרטים הפופולריים מה-איי.פי.אי של טי.אמ.די.בי
exports.getPopularMovies = async (page = 1) => { // מקבלת מספר עמוד (ברירת מחדל: 1) ומחזירה את רשימת הסרטים
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, { // מבצע בקשת גט ל-טי.אמ.די.בי כדי לקבל סרטים פופולריים
            params: {
                api_key: TMDB_API_KEY, // שולח את מפתח ה-אייפ.י.אי לזיהוי המערכת שלנו
                language: "he-IL", // מבקש את המידע בשפה העברית
                page // מציין מאיזה עמוד להביא את הנתונים
            }
        });

        return response.data.results; // מחזיר את רשימת הסרטים מתוך התשובה שהתקבלה מה-איי.פי.אי
    } catch (error) { // במקרה של שגיאה, מדפיס הודעת שגיאה ומחזיר מערך ריק
        console.error("❌ Error fetching popular movies:", error);
        return [];
    }
};

// פונקציה זו מקבלת מזהה סרט (מובי איי די) ומחזירה את פרטיו מה-איי.פי.אי של טי.אמ.די.בי
exports.getMovieById = async (movieId) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, { // שולח בקשת גט ל-טי.אמ.די.בי לקבלת פרטי הסרט
            params: {
                api_key: TMDB_API_KEY, // שולח את מפתח ה-איי.פי.אי לזיהוי המערכת שלנו
                language: "he-IL" // מבקש את המידע בשפה העברית
            }
        });

        return response.data; // מחזיר את הנתונים של הסרט מתוך התשובה שהתקבלה מה-איי.פי.אי
    } catch (error) { // במקרה של שגיאה, מדפיס הודעת שגיאה ומחזיר נול
        console.error("❌ Error fetching movie details:", error);
        return null;
    }
};


// פונקציה זו מקבלת מזהה סרט (מובי איידי) ומחזירה את קישור הטריילר שלו מיוטיוב (אם קיים)
exports.getMovieTrailer = async (movieId) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/videos`, { // שולח בקשת גט ל-טי.אמ.די.בי לקבלת רשימת הסרטונים של הסרט
            params: {
                api_key: TMDB_API_KEY // שולח את מפתח ה-איי.פי.אי לזיהוי המערכת שלנו
            }
        });

        // מחפש את הטריילר הראשון מסוג "Trailer" שמקורו ביוטיוב
        const trailer = response.data.results.find(video => video.type === "Trailer" && video.site === "YouTube");

        return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null; // אם נמצא טריילר מחזיר את הקישור, אחרת מחזיר נול
    } catch (error) { // במקרה של שגיאה, מדפיס הודעת שגיאה ומחזיר נול
        console.error("❌ Error fetching movie trailer:", error);
        return null;
    }
};
