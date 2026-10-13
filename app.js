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

        // שימוש בתגיות details ו-summary ליצירת התפריט הנפתח
        card.innerHTML = `
            <div class="card-header">
                <div class="question-title">שאלה ${q.questionNum} (${q.year}, סמסטר ${q.semester}', מועד ${q.moed})</div>
            </div>
            
            <div class="tags">${tagsHtml}</div>
            
            <div class="question-content">
                ${q.questionHtml}
            </div>

            <details class="solution-dropdown">
                <summary class="solution-summary">הצג פתרון מלא</summary>
                <div class="solution-content">
                    ${q.solutionHtml}
                </div>
            </details>
        `;
        resultsContainer.appendChild(card);
    });

    // רינדור מחודש של נוסחאות המתמטיקה לאחר הזרקת התוכן
    if (window.MathJax) {
        MathJax.typesetPromise().catch((err) => console.log('MathJax error: ', err));
    }
}

function filterQuestions() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const yearFilter = document.getElementById('yearFilter').value;
    const semesterFilter = document.getElementById('semesterFilter').value;

    const filtered = questionsData.filter(q => {
        // חיפוש בתוכן השאלה, נושאים, ומילות מפתח
        const searchableText = [q.course, ...q.topics, ...q.keywords, q.questionHtml].join(' ').toLowerCase();
        const matchesSearch = searchableText.includes(searchTerm);
        
        const matchesYear = yearFilter === "" || q.year.toString() === yearFilter;
        const matchesSemester = semesterFilter === "" || q.semester === semesterFilter;

        return matchesSearch && matchesYear && matchesSemester;
    });

    renderQuestions(filtered);
}

// הפעלת חיפוש
document.getElementById('searchBtn').addEventListener('click', filterQuestions);
document.getElementById('searchInput').addEventListener('keypress', e => { if (e.key === 'Enter') filterQuestions(); });
document.getElementById('yearFilter').addEventListener('change', filterQuestions);
document.getElementById('semesterFilter').addEventListener('change', filterQuestions);

// טעינה ראשונית
window.addEventListener('DOMContentLoaded', loadExams);
