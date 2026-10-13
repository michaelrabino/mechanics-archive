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

        card.innerHTML = `
            <div class="card-header">
                <div class="question-badge">שאלה ${q.questionNum}</div>
                <div class="meta-info">${q.course} | ${q.year} סמסטר ${q.semester}' מועד ${q.moed}</div>
            </div>
            
            <div class="tags">${tagsHtml}</div>
            
            <div class="question-content">
                ${q.questionHtml}
            </div>

            <button class="btn-toggle-sol" onclick="toggleSolution('${q.id}')" id="btn-${q.id}">הצג פתרון מלא</button>
            
            <div class="solution-content" id="sol-${q.id}" style="display: none;">
                ${q.solutionHtml}
            </div>
        `;
        resultsContainer.appendChild(card);
    });

    // קריאה ל-MathJax לרנדר את הנוסחאות שהרגע הזרקנו למסך
    if (window.MathJax) {
        MathJax.typesetPromise().catch((err) => console.log('MathJax error: ', err));
    }
}

// פונקציה לפתיחה וסגירה של הפתרון
window.toggleSolution = function(id) {
    const solDiv = document.getElementById(`sol-${id}`);
    const btn = document.getElementById(`btn-${id}`);
    
    if (solDiv.style.display === 'none') {
        solDiv.style.display = 'block';
        btn.textContent = 'הסתר פתרון';
    } else {
        solDiv.style.display = 'none';
        btn.textContent = 'הצג פתרון מלא';
    }
};

function filterQuestions() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const yearFilter = document.getElementById('yearFilter').value;
    const semesterFilter = document.getElementById('semesterFilter').value;

    const filtered = questionsData.filter(q => {
        // חיפוש בתוכן השאלה בנוסף למילות המפתח
        const searchableText = [q.course, ...q.topics, ...q.keywords, q.questionHtml].join(' ').toLowerCase();
        const matchesSearch = searchableText.includes(searchTerm);
        
        const matchesYear = yearFilter === "" || q.year.toString() === yearFilter;
        const matchesSemester = semesterFilter === "" || q.semester === semesterFilter;

        return matchesSearch && matchesYear && matchesSemester;
    });

    renderQuestions(filtered);
}

document.getElementById('searchBtn').addEventListener('click', filterQuestions);
document.getElementById('searchInput').addEventListener('keypress', e => { if (e.key === 'Enter') filterQuestions(); });
document.getElementById('yearFilter').addEventListener('change', filterQuestions);
document.getElementById('semesterFilter').addEventListener('change', filterQuestions);

window.addEventListener('DOMContentLoaded', loadExams);
