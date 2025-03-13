const express = require("express"); // מייבא את אקספרס לצורך ניתוב
const router = express.Router(); // יוצר אובייקט ניתוב
const { HomePage, RegisterPage, LoginPage } = require("../controllers/viewController"); // מייבא את בקרת התצוגות

// נתיב להצגת דף הבית
router.get("/", HomePage); 

// נתיב להצגת דף ההרשמה
router.get("/register", RegisterPage); 

// נתיב להצגת דף ההתחברות
router.get("/login", LoginPage); 

module.exports = router; // מייצא את הנתיבים לשימוש בקובצי ניתוב אחרים
