// סקריפט זה דואג להעלים הודעות הצלחה לאחר 3 שניות מרגע טעינת הדף

document.addEventListener("DOMContentLoaded", () => {
    // הודעת הצלחה נעלמת אחרי 3 שניות
    setTimeout(() => {
        const successMessage = document.querySelector(".success-message"); // מאתר את האלמנט של הודעת ההצלחה
        if (successMessage) { // אם נמצאה הודעת הצלחה
            successMessage.style.display = "none"; // מסתיר את ההודעה
        }
    }, 3000);
});
