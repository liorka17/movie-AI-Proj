const mongoose = require('mongoose'); // מייבא את mongoose לניהול מסד הנתונים

// סכימה זו מייצגת משתמשים במערכת, כולל שם משתמש, אימייל, סיסמה, תמונת פרופיל ותאריך יצירה.
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // שם המשתמש (ייחודי וחובה)
    email: { type: String, required: true, unique: true }, // כתובת אימייל (ייחודית וחובה)
    password: { type: String, required: true }, // סיסמת המשתמש (חובה)
    token: { type: String }, // טוקן זיהוי של המשתמש (JWT)
    createdAt: { type: Date, default: Date.now } // תאריך יצירת המשתמש
});

module.exports = mongoose.model('User', UserSchema); // מייצא את המודל לשימוש בקבצים אחרים
