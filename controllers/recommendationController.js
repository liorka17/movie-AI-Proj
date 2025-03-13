const geminiAiService = require("../services/geminiAiService"); // מייבא את השירות לקבלת המלצות מ-ג'מיני
const Rating = require("../models/rating"); // מייבא את מודל הדירוגים ממסד הנתונים
const User = require("../models/user"); // מייבא את מודל המשתמשים ממסד הנתונים

// פונקציה זו מקבלת את דירוגי המשתמש ומבקשת המלצות מסרטים מבוססות עליהם מ-ג'מיני.
exports.getRecommendations = async (req, res) => {
    try {
        if (!req.user) { // אם אין משתמש מחובר
            return res.redirect("/login"); // מפנה אותו לדף ההתחברות
        }

        console.log("🔹user login", req.user._id); // מציג את מזהה המשתמש המחובר

        // שולף את הדירוגים של המשתמש לפי ה-איידי הנכון
        const userRatings = await Rating.find({ userId: req.user._id });

        console.log("🔹 Existing ratings", userRatings); // מציג את הדירוגים שנמצאו עבור המשתמש

        if (!userRatings.length) { // אם אין דירוגים קודמים למשתמש
            return res.render("recommendations", { 
                recommendations: [], 
                message: "🔴 לא נמצאו דירוגים קודמים, דרג סרטים כדי לקבל המלצות" 
            });
        }

        // רשימת מזהי הסרטים שהמשתמש דירג
        const ratedMovies = userRatings.map(r => r.movieId);
        
        console.log("🔹 Rated Movie IDs:", ratedMovies); // מציג את מזהי הסרטים שהמשתמש דירג

        const recommendations = await geminiAiService.getRecommendations(ratedMovies); // קבלת המלצות מ-ג'מיני


        console.log("🔹 Received Recommendations:", recommendations); // מציג את ההמלצות שהתקבלו

        res.render("recommendations", { 
            recommendations, 
            message: recommendations.length ? "🎬 הנה הסרטים שמבוססים על הדירוגים שלך" : "⚠️ לא נמצאו המלצות מתאימות" 
        });

    } catch (error) { 
        console.error("❌Error retrieving recommendations", error); // מדפיס שגיאה במקרה של כישלון
        res.status(500).render("recommendations", { 
            recommendations: [], 
            message: "❌ Server error - please try again later" // מציג שגיאה למשתמש במקרה של בעיית שרת
        });
    }
};
