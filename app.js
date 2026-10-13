let examsData = [];

// פונקציה לטעינת הנתונים מקובץ ה-JSON
async function loadExams() {
    try {
        const response = await fetch('./catalog.json');
        examsData = await response.json();
        renderExams(examsData);
    } catch (error) {
        console.error('שגיאה בטעינת הנתונים:', error);
        document.getElementById('results').innerHTML = '<p>שגיאה בטעינת מסד הנתונים. ודא שקובץ ה-JSON קיים ותקין.</p>';
    }
}

// פונקציה לרינדור הכרטיסיות במסך
function renderExams(exams) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (exams.length === 0) {
        resultsContainer.innerHTML = '<p>לא נמצאו מבחנים התואמים את החיפוש.</p>';
        return;
    }

    exams.forEach(exam => {
        const card = document.createElement('div');
        card.className = 'exam-card';

        // בניית התגיות
        const allTags = [...exam.topics, ...exam.keywords];
        const tagsHtml = allTags.map(tag => `<span class="tag">${tag}</span>`).join('');

        // כפתורי הורדה
        const solutionBtn = exam.solutionUrl 
            ? `<a href="${exam.solutionUrl}" target="_blank" class="btn-solution">פתרון</a>` 
            : `<a href="#" class="btn-disabled" onclick="return false;">אין פתרון</a>`;

        card.innerHTML = `
            <h3>${exam.course}</h3>
            <p><strong>שנה:</strong> ${exam.year} | <strong>סמסטר:</strong> ${exam.semester}' | <strong>מועד:</strong> ${exam.moed}'</p>
            <div class="tags">
                ${tagsHtml}
            </div>
            <div class="links">
                <a href="${exam.examUrl}" target="_blank" class="btn-exam">שאלון</a>
                ${solutionBtn}
            </div>
        `;
        resultsContainer.appendChild(card);
    });
}

// פונקציית הסינון
function filterExams() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const yearFilter = document.getElementById('yearFilter').value;
    const semesterFilter = document.getElementById('semesterFilter').value;

    const filtered = examsData.filter(exam => {
        // בדיקת חיפוש טקסטואלי (בנושאים, מילות מפתח או שם הקורס)
        const searchableText = [exam.course, ...exam.topics, ...exam.keywords].join(' ').toLowerCase();
        const matchesSearch = searchableText.includes(searchTerm);

        // בדיקת מסננים
        const matchesYear = yearFilter === "" || exam.year.toString() === yearFilter;
        const matchesSemester = semesterFilter === "" || exam.semester === semesterFilter;

        return matchesSearch && matchesYear && matchesSemester;
    });

    renderExams(filtered);
}

// הוספת מאזינים (Event Listeners) לשדות הסינון
document.getElementById('searchInput').addEventListener('input', filterExams);
document.getElementById('yearFilter').addEventListener('change', filterExams);
document.getElementById('semesterFilter').addEventListener('change', filterExams);

// טעינה ראשונית של הנתונים כשהעמוד עולה
window.addEventListener('DOMContentLoaded', loadExams);
