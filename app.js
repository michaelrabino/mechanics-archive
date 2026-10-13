let questionsData = [];

async function loadExams() {
    try {
        const response = await fetch('./catalog.json');
        questionsData = await response.json();
        renderQuestions(questionsData);
    } catch (error) {
        console.error('שגיאה בטעינת הנתונים:', error);
        document.getElementById('results').innerHTML = '<p>שגיאה בטעינת מסד הנתונים.</p>';
    }
}

function renderQuestions(questions) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (questions.length === 0) {
        resultsContainer.innerHTML = '<p>לא נמצאו שאלות התואמות את החיפוש.</p>';
        return;
    }

    questions.forEach(q => {
        const card = document.createElement('div');
        card.className = 'exam-card';

        const allTags = [...q.topics, ...q.keywords];
        const tagsHtml = allTags.map(tag => `<span class="tag">${tag}</span>`).join('');

        const solutionBtn = q.solutionUrl 
            ? `<a href="${q.solutionUrl}" target="_blank" class="btn-solution">לפתרון</a>` 
            : `<a href="#" class="btn-disabled" onclick="return false;">אין פתרון</a>`;

        card.innerHTML = `
            <div class="question-badge">שאלה ${q.questionNum}</div>
            <h3>${q.course}</h3>
            <p><strong>שנה:</strong> ${q.year} | <strong>סמסטר:</strong> ${q.semester}' | <strong>מועד:</strong> ${q.moed}</p>
            <div class="tags">
                ${tagsHtml}
            </div>
            <div class="links">
                <a href="${q.questionUrl}" target="_blank" class="btn-exam">לשאלה</a>
                ${solutionBtn}
            </div>
        `;
        resultsContainer.appendChild(card);
    });
}

function filterQuestions() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const yearFilter = document.getElementById('yearFilter').value;
    const semesterFilter = document.getElementById('semesterFilter').value;

    const filtered = questionsData.filter(q => {
        const searchableText = [q.course, ...q.topics, ...q.keywords].join(' ').toLowerCase();
        const matchesSearch = searchableText.includes(searchTerm);
        const matchesYear = yearFilter === "" || q.year.toString() === yearFilter;
        const matchesSemester = semesterFilter === "" || q.semester === semesterFilter;

        return matchesSearch && matchesYear && matchesSemester;
    });

    renderQuestions(filtered);
}

// הפעלת החיפוש בלחיצה על הכפתור
document.getElementById('searchBtn').addEventListener('click', filterQuestions);

// הפעלת החיפוש גם בלחיצה על Enter במקלדת
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        filterQuestions();
    }
});

// סינון אוטומטי בעת שינוי תיבות הבחירה (סמסטר/שנה)
document.getElementById('yearFilter').addEventListener('change', filterQuestions);
document.getElementById('semesterFilter').addEventListener('change', filterQuestions);

window.addEventListener('DOMContentLoaded', loadExams);
