const express = require("express"); // מייבא את אקספרס לצורך ניתוב
const router = express.Router(); // יוצר אובייקט ניתוב

const { getGallery, getMovieDetails, searchMovies, SearchPage, getSiteStats } = require('../controllers/videoController'); // מייבא את פונקציות בקרת הווידאו

// נתיב לטעינת גלריית הסרטים
router.get('/gallery', getGallery); 

// נתיב להצגת פרטי סרט ספציפי לפי מזהה
router.get('/movie/:id', getMovieDetails); 

// נתיב להצגת דף החיפוש
router.get('/search', SearchPage); 

// נתיב לביצוע חיפוש סרטים מה-איי.פי.אי
router.get('/search/movies', searchMovies); 

// נתיב לקבלת סטטיסטיקות כלליות על הסרטים
router.get("/stats", getSiteStats); 

module.exports = router; // מייצא את הנתיבים לשימוש בקובצי ניתוב אחרים
