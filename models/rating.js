const mongoose = require("mongoose"); // מייבא את מונגוס לניהול בסיס הנתונים

// סכימה זו מייצגת דירוג סרטים, כאשר כל דירוג משויך למשתמש ולסרט מסוים
const RatingSchema = new mongoose.Schema({
    movieId: { type: String, required: true }, // מזהה הסרט שאותו מדרגים
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // מזהה המשתמש שנתן את הדירוג (מצביע למודל המשתמשים)
    rating: { type: Number, required: true, min: 1, max: 5 } // הערך של הדירוג (בין 1 ל-5)
});

module.exports = mongoose.model("Rating", RatingSchema); // מייצא את המודל לשימוש בקבצים אחרים
