// קובץ זה אחראי על חיבור למסד הנתונים מונגו-דיבי באמצעות מונגוס, עם ניסיון התחברות חוזר במקרה של כשל.

const mongoose = require('mongoose'); // מייבא את מונגוס כדי לאפשר עבודה עם מסד הנתונים מונגו-דיבי
require('dotenv').config(); // טוען את משתני הסביבה מקובץ .אי.אנ.בי כדי להשתמש בהם בקוד

const connectDB = async () => { // פונקציה אסינכרונית שמתחברת למסד הנתונים
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI); // מבצע חיבור למסד הנתונים עם הכתובת שמוגדרת בקובץ הסביבה
        console.log(`✅ MongoDB connected: ${conn.connection.host}`); // מדפיס לקונסול שהחיבור הצליח ומציג את כתובת השרת של מסד הנתונים
    } catch (error) { 
        console.error("❌ MongoDB connection failed:", error.message); // מדפיס לקונסול הודעת שגיאה במקרה שהחיבור נכשל
        
        setTimeout(connectDB, 5000);// אם החיבור נכשל, מנסה שוב להתחבר אחרי 5 שניות
    }
};
module.exports = connectDB; // מייצא את הפונקציה כדי שיהיה אפשר להשתמש בה בקבצים אחרים
