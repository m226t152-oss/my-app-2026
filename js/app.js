// --- データ管理 (LocalStorage) ---

let vocabulary = JSON.parse(localStorage.getItem('vocabulary')) || [];
let logs = JSON.parse(localStorage.getItem('logs')) || [];

function saveData() {
    localStorage.setItem('vocabulary', JSON.stringify(vocabulary));
    localStorage.setItem('logs', JSON.stringify(logs));
}

function addLog(message) {
    const timestamp = new Date().toLocaleString('ja-JP');
    logs.unshift({ timestamp, message }); // 新しいログを先頭に
    if (logs.length > 50) logs.pop(); // 最大50件保持
    saveData();
    renderLogs();
}

// --- セクション切り替え ---

function showSection(sectionId) {
    document.querySelectorAll('main section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    
    // 切り替え時の処理
    if (sectionId === 'word-list') renderVocabulary();
    if (sectionId === 'logs') renderLogs();
    if (sectionId === 'quiz') resetQuizUI();
}

// --- 単語登録 ---

document.getElementById('save-word-btn').addEventListener('click', () => {
    const wordInput = document.getElementById('word-input');
    const meaningInput = document.getElementById('meaning-input');
    const english = wordInput.value.trim();
    const japanese = meaningInput.value.trim();

    if (english && japanese) {
        vocabulary.push({ id: Date.now(), english, japanese });
        saveData();
        addLog(`単語を追加しました: ${english}`);
        
        wordInput.value = '';
        meaningInput.value = '';
        alert('登録しました！');
    } else {
        alert('英単語と日本語訳の両方を入力してください。');
    }
});

// --- 単語一覧表示 ---

function renderVocabulary() {
    const listElement = document.getElementById('vocabulary-list');
    listElement.innerHTML = '';

    vocabulary.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="word-info">
                <span class="english">${item.english}</span>
                <span class="japanese">${item.japanese}</span>
            </div>
            <button class="delete-btn" onclick="deleteWord(${item.id})">削除</button>
        `;
        listElement.appendChild(li);
    });
}

function deleteWord(id) {
    const wordToDelete = vocabulary.find(item => item.id === id);
    vocabulary = vocabulary.filter(item => item.id !== id);
    saveData();
    if (wordToDelete) addLog(`単語を削除しました: ${wordToDelete.english}`);
    renderVocabulary();
}

document.getElementById('clear-all-btn').addEventListener('click', () => {
    if (confirm('すべての単語とログを消去しますか？')) {
        vocabulary = [];
        logs = [];
        saveData();
        addLog('すべてのデータを消去しました');
        renderVocabulary();
        renderLogs();
    }
});

// --- クイズ機能 ---

let currentQuizWord = null;

function resetQuizUI() {
    document.getElementById('quiz-instruction').classList.remove('hidden');
    document.getElementById('quiz-card').classList.add('hidden');
    document.getElementById('start-quiz-btn').classList.remove('hidden');
}

document.getElementById('start-quiz-btn').addEventListener('click', startQuiz);

function startQuiz() {
    if (vocabulary.length === 0) {
        alert('クイズを始める前に単語を登録してください。');
        return;
    }
    
    document.getElementById('quiz-instruction').classList.add('hidden');
    document.getElementById('start-quiz-btn').classList.add('hidden');
    document.getElementById('quiz-card').classList.remove('hidden');
    
    nextQuestion();
    addLog('クイズを開始しました');
}

function nextQuestion() {
    const randomIndex = Math.floor(Math.random() * vocabulary.length);
    currentQuizWord = vocabulary[randomIndex];
    
    document.getElementById('quiz-question').textContent = currentQuizWord.english;
    document.getElementById('quiz-answer').textContent = currentQuizWord.japanese;
    document.getElementById('quiz-answer').classList.add('hidden');
    
    document.getElementById('reveal-btn').classList.remove('hidden');
    document.getElementById('next-btn').classList.add('hidden');
}

document.getElementById('reveal-btn').addEventListener('click', () => {
    document.getElementById('quiz-answer').classList.remove('hidden');
    document.getElementById('reveal-btn').classList.add('hidden');
    document.getElementById('next-btn').classList.remove('hidden');
});

document.getElementById('next-btn').addEventListener('click', nextQuestion);

// --- ログ表示 ---

function renderLogs() {
    const logListElement = document.getElementById('log-list');
    logListElement.innerHTML = '';

    logs.forEach(log => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="date">${log.timestamp}</span>
            <span class="message">${log.message}</span>
        `;
        logListElement.appendChild(li);
    });
}

// 初期化
window.onload = () => {
    renderVocabulary();
    renderLogs();
};
