const express = require('express'); // מייבא את אקספרס לצורך ניתוב
const { register, login, logout } = require('../controllers/userController'); // מייבא את פונקציות ניהול המשתמשים מהבקר
const router = express.Router(); // יוצר אובייקט ניתוב

// נתיבים לטיפול בפעולות משתמשים - הרשמה, התחברות והתנתקות

router.post('/register', register); // נתיב לרישום משתמש חדש
router.post('/login', login); // נתיב להתחברות משתמש קיים
router.get('/logout', logout); // נתיב להתנתקות מהמערכת

module.exports = router; // מייצא את הנתיב לשימוש בקובצי ניתוב אחרים
