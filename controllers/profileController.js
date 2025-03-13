const User = require("../models/user"); // מייבא את מודל המשתמשים מתוך תיקיית מודלס

exports.getProfile = async (req, res) => { // פונקציה אסינכרונית לטיפול בבקשה לקבלת פרופיל משתמש
    console.log("🔹 GET /profile called"); // מדפיס לקונסול שהבקשה לנתיב /פרופיל התקבלה
    console.log("🔹 User from JWT:", req.user); // מציג את פרטי המשתמש שנשלפו מה-JWT

    try {
        if (!req.user) { // בודק אם אין משתמש מחובר
            return res.redirect("/login"); // אם אין משתמש מחובר, מפנה אותו לדף ההתחברות
        }

        const user = await User.findById(req.user.userId).select("username email"); 
        // מחפש את המשתמש במסד הנתונים לפי ה-איידי שלו ושולף רק את השדות יוזרניים ו-אימייל

        if (!user) { // אם המשתמש לא נמצא במסד הנתונים
            return res.status(404).render("profile", { error: "user not found", user: null }); 
            // מחזיר עמוד פרופיל עם הודעת שגיאה למשתמש
        }

        res.render("profile", { user }); // מציג את עמוד הפרופיל עם פרטי המשתמש
    } catch (error) { 
        console.error(" Error loading profile:", error); // במקרה של שגיאה, מדפיס הודעת שגיאה לקונסול
        res.status(500).render("profile", { error: "server erorr ", user: null }); 
        // מציג שגיאת שרת בעמוד הפרופיל
    }
};
