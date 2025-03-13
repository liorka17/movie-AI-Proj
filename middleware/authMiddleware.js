const jwt = require('jsonwebtoken'); // מייבא את ג'ייסון-טוקן לפענוח ואימות טוקנים
const User = require('../models/user'); // מייבא את מודל המשתמשים ממסד הנתונים
require('dotenv').config(); // טוען את משתני הסביבה מקובץ .env

// מידלוור זה מאמת את המשתמש על ידי בדיקת הטוקן, פענוחו ושליפת המשתמש מהמסד
// אם המשתמש מאומת, המידע שלו נוסף לבקשה ומועבר להמשך עיבוד
module.exports = async (req, res, next) => {
    try {
        const token = req.cookies.token; // בדיקה האם יש טוקן בקוקיז
        if (!token) { // אם אין טוקן, המשתמש מועבר לדף ההתחברות
            console.log("❌ No token found.");
            return res.redirect('/login');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // פענוח ה- JWT
        if (!decoded || !decoded.userId) { // אם הפענוח נכשל או שאין מזהה משתמש בטוקן
            console.log("❌ Invalid JWT.");
            return res.redirect('/login');
        }

        const user = await User.findById(decoded.userId); // שליפת המשתמש מהמסד
        if (!user) { // אם המשתמש לא נמצא במסד הנתונים
            console.log("❌ User not found in database.");
            return res.redirect('/login');
        }

        req.user = user; // הוספת המשתמש לאובייקט הבקשה לשימוש בשלבים הבאים של הבקשה
        console.log("🔍 Loaded user from DB:", user);
        res.locals.user = user; // מאפשר להשתמש במידע על המשתמש ישירות בתוך תבניות EJS
        console.log("✅ Authenticated User:", user.username);
        next(); // ממשיך לבקשה הבאה
    } catch (error) { 
        console.error("❌ Authentication error:", error.message); // מציג שגיאה במקרה של בעיה באימות
        return res.redirect('/login'); // מפנה את המשתמש לדף ההתחברות במקרה של כשל באימות
    }
};
