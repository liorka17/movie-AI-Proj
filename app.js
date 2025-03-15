const dotenv = require('dotenv'); // מייבא את .אי.אנ.בי כדי לטעון משתני סביבה מקובץ .env
dotenv.config(); // טוען את משתני הסביבה
const express = require('express'); // מייבא את אקספרס לצורך יצירת השרת
const connectDB = require('./config/db'); // מייבא את פונקציית החיבור למסד הנתונים
const morgan = require("morgan"); // מייבא את מורגן לצורך לוגים של בקשות HTTP
const cors = require('cors'); // מייבא את קורס כדי לאפשר תקשורת בין שרתים שונים
const cookieParser = require('cookie-parser'); // מייבא את קוקיפרסר כדי לטפל בעוגיות (cookies)
const jwt = require('jsonwebtoken'); // מייבא את ג'ייסון ווב טוקן לצורך יצירת ואימות אסימונים (JWT)
const recommendationRoutes = require('./routes/recommendationRoutes'); // מייבא את הנתיבים להמלצות
const ratingRoutes = require('./routes/ratingRoutes'); // מייבא את הנתיבים לדירוג סרטים
const profileRoutes = require('./routes/profileRoutes'); // מייבא את הנתיבים לפרופיל המשתמש
const User = require('./models/user'); // מייבא את מודל המשתמשים ממסד הנתונים
const app = express(); // יוצר מופע של אפליקציית אקספרס

connectDB(); // מתחבר למסד הנתונים

app.set('view engine', 'ejs'); // מגדיר את מנוע התצוגה של אקספרס כך שישתמש ב-אי.ג'יי.אס (אמבדד ג'אווה סקריפט) להצגת דפים דינמיים

app.use(morgan("dev")); // משתמש ב-מורגן לרישום לוגים של בקשות הייץ'.טי.טי.פי במצב פיתוח (דאב)
app.use(express.json()); // מידלוור שמאפשר עבודה עם בקשות בפורמט ג'ייסון
app.use(express.urlencoded({ extended: false })); // מידלוור שמאפשר עבודה עם נתונים שנשלחו מטפסים 
app.use(cors()); // מידלוור שמאפשר בקשות ממקורות חיצוניים (קורס), למשל אם ה-פרונטהאנד רץ על דומיין אחר
app.use(cookieParser()); // מידלוור לטיפול בעוגיות (קוקיס)
app.use(express.static("public")); // מגדיר תיקייה סטטית (פאבליק) עבור קבצים כמו סי.אס.אס, תמונות וסקריפטים


/*
 * מידלוור הזה בודק אם קיימת עוגיית ג'יי.דבליו.טי בבקשה.
 * אם הטוקן נמצא ותקף, הוא מפענח אותו, שומר את פרטי המשתמש באובייקט הבקשה (`ראק.יוזר`), 
 * ומגדיר את `ראק.לוקלס.יוזר` כך שהמידע יהיה זמין בתבניות אי.ג'יי.אס
 * אם אין טוקן או שהטוקן אינו תקף, הוא מגדיר את המשתמש כ-נול וממשיך לבקשה הבאה
 */
app.use((req, res, next) => { // מידלוור שמופעל על כל הבקשות כדי לבדוק אם המשתמש מחובר
    const token = req.cookies.token; // מקבל את ה-ג'יי.דבליו.טי (טוקן) מתוך הקוקיס של הבקשה

    if (!token) { // אם אין טוקן, המשתמש אינו מחובר
        console.log("❌ No token found in request."); // מציג הודעה בקונסול
        res.locals.user = null; // מגדיר את המשתמש כ-נול בתבניות אי.ג'יי.אס
        return next(); // ממשיך לבקשה הבאה בשרשרת
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // מנסה לפענח את ה-ג'יי.דבליו.טי עם המפתח הסודי
        console.log("✅ Decoded JWT:", decoded); // מציג את הנתונים שפוענחו מה-ג'יי.דבליו.טי

        // ✅ מוודא שהמשתמש מוגדר כראוי בבקשה
        req.user = { userId: decoded.userId }; // שומר את מזהה המשתמש באובייקט הבקשה
        res.locals.user = req.user; // ✅ מאפשר שימוש במידע על המשתמש בתבניות אי.ג'יי.אס
        console.log("✅ Middleware assigned user:", req.user); // מציג לוג שהמשתמש אותר בהצלחה
    } catch (err) { // במקרה שהטוקן אינו חוקי או שפג תוקפו
        console.error("❌ Invalid Token:", err.message); // מציג הודעת שגיאה בקונסול
        res.locals.user = null; // מגדיר את המשתמש כ-נול כדי שלא יוצג בפרונטנד
    }
    next(); // ממשיך בבקשה הבאה בשרשרת
});

//  הגדרת הנתיבים עבור תיקיית הנתיבים
app.use('/profile', profileRoutes); // נתיב שמטפל בעמוד הפרופיל של המשתמש
app.use('/user', require('./routes/userRoutes')); // נתיב שמטפל בפעולות הקשורות למשתמשים (הרשמה, התחברות, יציאה)
app.use('/video', require('./routes/videoRoutes')); // נתיב שמטפל בפעולות הקשורות לסרטים (חיפוש, הצגת סרטים)
app.use('/rating', require('./routes/ratingRoutes')); // נתיב שמטפל בשליחת דירוגים ושמירתם במסד הנתונים
app.use('/recommendations', require('./routes/recommendationRoutes')); // נתיב שמטפל בקבלת המלצות סרטים מבוססות על הדירוגים של המשתמש
app.use('/', require('./routes/viewRoutes')); // הנתיב הראשי של היישום, מטפל בעמודי התצוגה (דף הבית, התחברות, הרשמה וכו')



module.exports = app; // מייצא את היישום (אפליקציית אקספרס) כדי שניתן יהיה להשתמש בו בקובצי שרת אחרים (כמו בקובץ סרבר)
