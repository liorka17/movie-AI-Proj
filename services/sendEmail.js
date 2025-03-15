const sgMail = require("@sendgrid/mail"); // מייבא את המודול SendGrid Mail לצורך שליחת אימיילים
require("dotenv").config(); // מייבא את dotenv כדי לטעון משתני סביבה מקובץ .env

// הגדרת מפתח ה-API מתוך משתני הסביבה
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * שליחת אימייל עם עיצוב בעברית
 * @param {string} to - כתובת הנמען
 * @param {string} subject - נושא המייל
 * @param {string} text - גוף ההודעה בטקסט רגיל (למקרים של לקוחות שלא תומכים ב-HTML)
 * @param {string} html - גוף ההודעה ב-HTML
 */
const sendEmail = async (to, subject, text, html) => {
    try {
        const msg = {
            to, // כתובת הנמען
            from: process.env.SENDER_EMAIL, // כתובת השולח שאושרה ב-SendGrid (חובה כדי שהמייל יישלח)
            subject, // נושא ההודעה
            text, // גוף ההודעה בפורמט טקסט רגיל
            html, // גוף ההודעה בפורמט HTML
        };

        await sgMail.send(msg); // שליחת המייל בפועל
        console.log(`✅ Email sent to ${to}`); // הדפסת אישור שהמייל נשלח בהצלחה
    } catch (error) {
        // הדפסת הודעת שגיאה אם השליחה נכשלה
        console.error("❌ Error sending email:", error.response ? error.response.body : error.message);
    }
};

// פונקציה לשליחת אימייל "ברוך הבא" בעברית
const sendWelcomeEmail = async (to, username) => {
    const subject = "🎬 ברוך הבא ל-Movie AI!"; // נושא המייל
    const text = `שלום ${username},\nתודה שנרשמת למערכת ההמלצות שלנו! 🎥\nהתחל לגלות סרטים מדהימים עכשיו!`; // טקסט רגיל

    // יצירת גוף ההודעה בפורמט HTML
    const html = `
        <div style="direction: rtl; text-align: center; font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
            <div style="background-color: #222; color: #fff; padding: 10px; border-radius: 5px;">
                <h2 style="margin: 0;">🎬 ברוך הבא ל-Movie AI!</h2>
            </div>
            <p style="font-size: 18px; color: #333;">שלום <strong>${username}</strong>,</p>
            <p style="font-size: 16px; color: #555;">תודה שנרשמת למערכת ההמלצות שלנו! 🎥</p>
            <p style="font-size: 16px; color: #555;">עכשיו תוכל לקבל המלצות לסרטים שיתאימו בדיוק לטעם שלך.</p>
            <a href="https://movieai.onrender.com" style="display: inline-block; padding: 10px 20px; background-color: #ff5733; color: #fff; text-decoration: none; border-radius: 5px; font-size: 18px;">🎞️ התחיל לגלות סרטים</a>
            <p style="color: #777;">צוות Movie AI 🍿</p>
        </div>
    `;

    await sendEmail(to, subject, text, html); // קריאה לפונקציה sendEmail כדי לשלוח את המייל בפועל
};

module.exports = sendWelcomeEmail; // ייצוא הפונקציה כדי שיהיה ניתן להשתמש בה בקבצים אחרים
