const axios = require("axios"); // מייבא את אקסיוס לצורך ביצוע בקשות HTTP

// משתני הסביבה עבור מפתחות ה-איי.פי.אי והשירותים החיצוניים
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // מפתח איי.פי.אי לשירות ג'מיני
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent"; // כתובת ה-איי.פי.אי של ג'מיני
const TMDB_API_KEY = process.env.TMDB_API_KEY; // מפתח איי.פי.אי לשירות טי.אמ.די.בי
const TMDB_API_URL = "https://api.themoviedb.org/3/movie/"; // כתובת ה-איי.פי.אי של טי.אמ.די.בי לקבלת מידע על סרטים


// פונקציה זו מקבלת רשימת סרטים שהמשתמש דירג ושולחת בקשה ל-ג'מיני לקבלת המלצות על סרטים דומים
// לאחר קבלת ההמלצות, הפונקציה שולפת את פרטי הסרטים מה-טי.אמ.די.בי כולל תמונות

exports.getRecommendations = async (ratedMovies) => {
    try {
        if (!GEMINI_API_KEY || !TMDB_API_KEY) { // בודק אם מפתחות ה-איי.פי.אי זמינים, אחרת מחזיר מערך ריק
            console.error("❌ מפתחות API חסרים");
            return [];
        }

        const prompt = ` // יוצר טקסט בקשה ל-Gemini AI עם רשימת הסרטים שהמשתמש דירג
            אני רוצה שתמליץ לי על 20 סרטים דומים לסרטים הבאים בהתבסס על הדירוגים שלהם: ${ratedMovies.join(", ")}.
            החזר JSON תקף עם **ID הסרט** מ-TMDB, שם הסרט והתיאור.
            
            פורמט תקין לדוגמה:
            {
                "movies": [
                    {"id": "123", "title": "שם הסרט", "overview": "תקציר קצר"}
                ]
            }
        `;

        // שליחת בקשה ל-ג'מיני עם הפרומפט שיצרנו
        const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        });

        console.log("🔹 תשובת Gemini API:", response.data); // מציג את התשובה שהתקבלה מה-איי.פי.אי בקונסול

        // בדיקה שהתשובה שהתקבלה אינה ריקה
        const textResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!textResponse || textResponse.trim() === "") { // אם אין תשובה, מחזיר מערך ריק
            console.error("❌ empty gemini res");
            return [];
        }

        const cleanedResponse = textResponse.replace(/```json|```/g, "").trim();// מסיר קטעי טקסט מיותרים מהתשובה לפני המרתה ל-ג'ייסון

        // ניסיון להמיר את התשובה למבנה JSON תקין
        let parsedResponse;
        try {
            parsedResponse = JSON.parse(cleanedResponse);
        } catch (error) { // אם יש שגיאה בהמרת ה-ג'ייסון, מדפיס שגיאה ומחזיר מערך ריק
            console.error("❌ Error parsing JSON", error.message);
            console.error("🔹 Response received ", cleanedResponse);
            return [];
        }

        // בדיקה שהתשובה מכילה מערך של סרטים
        if (!parsedResponse.movies || !Array.isArray(parsedResponse.movies)) { // אם לא קיבלנו מערך תקין, מחזירים מערך ריק
            console.error("❌ Invalid JSON format");
            return [];
        }

        // לולאה שמבצעת בקשה לכל סרט כדי לשלוף את תמונת הפוסטר שלו מה-טי.אמ.די.בי
        const moviesWithImages = await Promise.all(parsedResponse.movies.slice(0, 20).map(async (movie) => {
            try {
                const tmdbResponse = await axios.get(`${TMDB_API_URL}${movie.id}?api_key=${TMDB_API_KEY}&language=he`); // שולח בקשה ל-טי.אמ.די.בי לקבלת פרטי הסרט
                return {
                    id: movie.id, // מזהה הסרט
                    title: movie.title, // שם הסרט
                    overview: movie.overview, // תקציר הסרט
                    poster: `https://image.tmdb.org/t/p/w500${tmdbResponse.data.poster_path}` // כתובת תמונת הפוסטר
                };
            } catch (err) { // אם יש שגיאה בשליפת התמונה, מחזירים תמונה ברירת מחדל
                console.error(`❌ Error fetching image-${movie.title}:`, err.message);
                return { ...movie, poster: "/assets/default_poster.jpg" };
            }
        }));

        return moviesWithImages; // מחזיר את רשימת הסרטים עם הפרטים והתמונות

    } catch (error) { // במקרה של כישלון כללי בפנייה ל-ג'מיני או ל-טי.אמ.די.בי, מחזירים מערך ריק
        console.error("❌ Error calling Gemini or TMDB API:", error.message);
        return [];
    }
};
