const bcrypt = require("bcryptjs"); // מייבא את bcryptjs לצורך הצפנת סיסמאות
const jwt = require("jsonwebtoken"); // מייבא את jsonwebtoken לצורך יצירת אסימוני זיהוי (JWT)
const User = require('../models/user'); // מייבא את מודל המשתמשים ממסד הנתונים


// פונקציה זו מבצעת רישום משתמש חדש, מצפינה את הסיסמה, שומרת את המשתמש ויוצרת עבורו אסימון זיהוי (JWT).
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body; // קולט את הנתונים שנשלחו מהטופס

        let user = await User.findOne({ email }); // מחפש אם המשתמש כבר קיים במסד הנתונים
        if (user) { // אם המשתמש כבר רשום
            return res.status(400).render("register", { error: "User already exists", user: null }); // מציג הודעת שגיאה
        }

        const hashedPassword = await bcrypt.hash(password, 10); // מצפין את הסיסמה עם רמת הצפנה 10

        user = new User({ username, email, password: hashedPassword });//שומר את המשתמש במסד הנתונים
        await user.save(); // שומר את המשתמש במסד הנתונים

        //  יוצר אסימון זיהוי (JWT) לאחר שהמשתמש נשמר כדי לקבל את ה-איידי הנכון
        const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: "1h" });

        user.token = token; //  מעדכן את המשתמש עם האסימון הנכון
        await user.save(); // שומר את השינוי במסד הנתונים

        res.cookie("token", token, { httpOnly: true }); //  שומר את האסימון בעוגיה באופן מיידי

        console.log("✅ User registered and authenticated:", user); // מדפיס ללוג שהרישום הצליח

        //  בדיקה אם הבקשה מגיעה מ-Postman או API אחר
        if (req.headers["postman-token"]) {
            return res.status(201).json({
                message: "User registered successfully",
                user: {
                    username: user.username,
                    email: user.email,
                },
                token
            });
        }
        // אם הבקשה מגיעה מדפדפן, מבצע הפניה לדף הבית
        res.redirect("/");
    } catch (error) { 
        console.error("❌ Error in register:", error); // מציג שגיאה במקרה של כישלון
        res.status(500).render("register", { error: "Server error", user: null }); // מציג הודעת שגיאה למשתמש
    }
};


// פונקציה זו מטפלת בתהליך ההתחברות של המשתמש. היא בודקת אם כתובת האימייל והסיסמה תקינים
// ואם כן, היא יוצרת אסימון זיהוי (ג'יידבליוטי) ושומרת אותו בעוגיה
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body; // מקבל את האימייל והסיסמה מגוף הבקשה

        const user = await User.findOne({ email }); // מחפש את המשתמש במסד הנתונים לפי האימייל
        if (!user) { // אם המשתמש לא נמצא
            return res.render("login", { errorMessage: "❌ כתובת אימייל או סיסמה אינם נכונים" }); // מחזיר הודעת שגיאה
        }

        const isMatch = await bcrypt.compare(password, user.password); // משווה את הסיסמה שהוזנה לסיסמה המוצפנת במסד הנתונים
        if (!isMatch) { // אם הסיסמה שגויה
            return res.render("login", { errorMessage: "❌ כתובת אימייל או סיסמה אינם נכונים" }); // מחזיר הודעת שגיאה
        }
    
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });// יצירת טוקן

        res.cookie("token", token, { httpOnly: true, secure: false }); // שומר את האסימון בעוגיה

        //  הפניה לעמוד הבית
        res.redirect("/"); // מעביר את המשתמש לדף הבית לאחר התחברות מוצלחת

    } catch (error) { 
        console.error("❌ Login Error:", error); // מציג שגיאה במקרה של בעיה בתהליך ההתחברות
        res.render("login", { errorMessage: "❌ Server error - please try again later" }); // מציג שגיאת שרת למשתמש
    }
};


// פונקציה זו מטפלת בהתנתקות המשתמש.  מוחקת את העוגיה המכילה את הטוקן ומפנה לעמוד הבית
exports.logout = (req, res) => {
    res.clearCookie("token"); // מוחק את העוגיה שמכילה את הטוקן
    res.redirect("/"); // מפנה את המשתמש לדף הבית לאחר ההתנתקות
};

exports.deleteUser = async (req, res) => {
    try {
        console.log("🔹 מחיקת משתמש - התחלה:", req.user);

        if (!req.user) {
            return res.status(401).json({ error: "❌ לא מורשה" });
        }

        // מחיקת המשתמש ממסד הנתונים
        await User.findByIdAndDelete(req.user.userId);

        // מחיקת ה-Token מהעוגיות כדי לנתק את המשתמש
        res.clearCookie("token");

        console.log("✅ משתמש נמחק בהצלחה");

        // זיהוי סוג הבקשה - אם זה API (Postman) נחזיר JSON, אחרת נבצע הפניה
        if (req.headers["content-type"] === "application/json" || req.xhr) {
            return res.json({ success: true, message: "✅ החשבון נמחק בהצלחה" });
        } else {
            return res.redirect('/register'); // הפניית המשתמש לדף ההרשמה לאחר מחיקה
        }
    } catch (error) {
        console.error("❌ שגיאה במחיקת המשתמש:", error);
        return res.status(500).json({ error: "❌ שגיאת שרת" });
    }
};
