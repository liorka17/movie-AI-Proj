// סקריפט זה מבצע חיפוש דינמי של סרטים בזמן שהמשתמש מקליד, ומציג את התוצאות בעמוד

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput"); // מזהה את שדה החיפוש
    const searchResults = document.getElementById("searchResults"); // מזהה את אלמנט התוצאות

    searchInput.addEventListener("input", async () => { // מאזין להקלדה בשדה החיפוש
        const query = searchInput.value.trim(); // מסיר רווחים מהחיפוש
        if (query.length < 2) { // אם החיפוש קצר משני תווים, לא מבצע חיפוש
            searchResults.innerHTML = "";
            return;
        }

        try {
            const response = await fetch(`/video/search/movies?query=${encodeURIComponent(query)}`); // מבצע בקשת חיפוש מהשרת
            const data = await response.json(); // ממיר את התשובה ל-JSON

            searchResults.innerHTML = ""; // מנקה את התוצאות הקודמות

            if (data.results.length === 0) { // אם לא נמצאו תוצאות
                searchResults.innerHTML = "<p>❌ לא נמצאו סרטים תואמים</p>"; // מציג הודעה שאין תוצאות
                return;
            }

            data.results.forEach(movie => { // עובר על רשימת הסרטים שהתקבלו
                const movieCard = document.createElement("div"); // יוצר אלמנט חדש לסרט
                movieCard.classList.add("movie-card"); // מוסיף מחלקת עיצוב

                movieCard.innerHTML = ` 
                    <div class="movie-image">
                        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                    </div>
                    <div class="movie-info">
                        <h3>${movie.title}</h3>
                        <p>⭐ דירוג: ${movie.vote_average.toFixed(1)}</p>
                        <a href="/video/movie/${movie.id}" class="btn">📽️ פרטים נוספים</a>
                    </div>
                `;

                searchResults.appendChild(movieCard); // מוסיף את הסרט לתוצאות החיפוש
            });

        } catch (error) { 
            console.error("❌ שגיאה בחיפוש סרטים", error); // מציג שגיאה במקרה של כשל בבקשה
        }
    });
});
