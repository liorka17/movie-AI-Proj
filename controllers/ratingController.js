const Rating = require("../models/rating"); // מייבא את מודל הדירוגים מתוך תיקיית מודלס

// פונקציה זו מקבלת דירוג של משתמש לסרט, מעדכנת דירוג קיים או יוצרת חדש במקרה הצורך.
exports.submitRating = async (req, res) => {
    try {
        console.log("🔹 POST /rating/submit called"); // מדפיס לקונסול שהתקבלה בקשה לשליחת דירוג
        console.log(" data received ", req.body); // מציג את הנתונים שהתקבלו מהבקשה
        console.log("user is login", req.user); // מציג את פרטי המשתמש המחובר

        const { movieId, rating } = req.body; // שולף את מזהה הסרט והדירוג מגוף הבקשה
        const userId = req.user?.userId; // מקבל את מזהה המשתמש המחובר

        if (!movieId || !userId || !rating) { // בודק אם חסר שדה חובה
            console.error(" Missing required fields:", { movieId, userId, rating }); // מציג שגיאה בקונסול
            return res.status(400).send(" Missing required fields"); // מחזיר תגובה עם שגיאה למשתמש
        }

        let existingRating = await Rating.findOne({ movieId, userId }); // מחפש אם כבר קיים דירוג של המשתמש לסרט

        if (existingRating) { // אם קיים דירוג קודם
            existingRating.rating = rating; // מעדכן את הדירוג
            await existingRating.save(); // שומר את השינוי במסד הנתונים
        } else { 
            const newRating = new Rating({ movieId, userId, rating }); // יוצר דירוג חדש
            await newRating.save(); // שומר את הדירוג החדש במסד הנתונים
        }

        //  מוסיף הודעת הצלחה וניווט חזרה לעמוד הסרט
        res.redirect(`/video/movie/${movieId}?success=true`); // מחזיר את המשתמש לעמוד הסרט עם הודעת הצלחה
    } catch (error) { 
        console.error(" Error saving rating:", error); // מציג הודעת שגיאה בקונסול במקרה של כישלון
        res.status(500).send("Error saving rating"); // מחזיר שגיאת שרת למשתמש
    }
};
