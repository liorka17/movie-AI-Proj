require('dotenv').config(); // טוען את משתני הסביבה מקובץ .env

const app = require('./app'); // טוען את קובץ האפליקציה הראשי app.js

const PORT = process.env.PORT || 5000; // קובע את מספר הפורט, כברירת מחדל 5000 אם לא מוגדר בקובץ .אי.אנ.בי

// הפעלת השרת עם טיפול בשגיאות
app.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`); // מדפיס הודעה שהשרת פעיל
}).on('error', (err) => {
    console.error(` Server failed to start: ${err.message}`); // אם יש שגיאה, מדפיס לקונסול
    process.exit(1); // עוצר את השרת במקרה של כישלון
    
});
