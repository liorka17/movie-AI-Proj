const express = require("express"); // מייבא את אקספרס לצורך ניתוב
const router = express.Router(); // יוצר אובייקט ניתוב
const recommendationController = require("../controllers/recommendationController"); // מייבא את בקרת ההמלצות
const authMiddleware = require("../middleware/authMiddleware"); // מוודא שהמשתמש מחובר לפני גישה להמלצות

const {} = require('../controllers/recommendationController'); // שורת קוד ריקה שלא עושה כלום

// נתיב זה מטפל בבקשות לקבלת המלצות לסרטים (`/recommendations`), רק עבור משתמשים מחוברים
router.get("/", authMiddleware, recommendationController.getRecommendations); // מאזין לבקשות גט ומעביר אותן לבקר ההמלצות

module.exports = router; // מייצא את הנתיב לשימוש בקובצי ניתוב אחרים
