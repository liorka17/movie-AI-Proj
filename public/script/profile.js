document.addEventListener("DOMContentLoaded", () => {
    const deleteForm = document.getElementById("deleteForm");
    
    if (deleteForm) {
        deleteForm.addEventListener("submit", (event) => {
            const confirmation = confirm("⚠️ האם אתה בטוח שברצונך למחוק את חשבונך? פעולה זו בלתי הפיכה!");
            if (!confirmation) {
                event.preventDefault(); // מבטל את שליחת הבקשה אם המשתמש ביטל
            }
        });
    }
});
