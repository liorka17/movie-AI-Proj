const express = require("express"); // מייבא את express לצורך ניתוב
const router = express.Router(); // יוצר אובייקט ניתוב
const ratingController = require("../controllers/ratingController"); // מייבא את בקרת הדירוגים

// נתיב זה מטפל בשליחת דירוג חדש לסרט (`/rating/submit`)
router.post("/submit", ratingController.submitRating); // מאזין לבקשות פוסט ושולח אותן לטיפול בפונקציה המתאימה

module.exports = router; // מייצא את הנתיב לשימוש בקובצי ניתוב אחרים
