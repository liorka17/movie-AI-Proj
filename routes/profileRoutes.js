const express = require("express"); // מייבא את express לצורך ניתוב
const router = express.Router(); // יוצר אובייקט ניתוב
const profileController = require("../controllers/profileController"); // מייבא את בקרת הפרופיל

// נתיב זה מטפל בבקשות לעמוד הפרופיל של המשתמש (`/profile`).
router.get("/", profileController.getProfile); // מפנה את הבקשה לפונקציה המטפלת בפרופיל המשתמש

module.exports = router; // מייצא את הנתיב לשימוש בקובצי ניתוב אחרים
