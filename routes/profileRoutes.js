const express = require("express"); // מייבא את express לצורך ניתוב
const router = express.Router(); // יוצר אובייקט ניתוב
const{getProfile}=require("../controllers/profileController");
const authMiddleware = require("../middleware/authMiddleware");
// נתיב זה מטפל בבקשות לעמוד הפרופיל של המשתמש (`/profile`).
router.get("/", getProfile); // מפנה את הבקשה לפונקציה המטפלת בפרופיל המשתמש

module.exports = router; // מייצא את הנתיב לשימוש בקובצי ניתוב אחרים
