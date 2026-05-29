const i18n = {
    en: {
        title: "Playlist Stats",
        settingsTitle: "Settings",
        limitLabel: "Count how many videos?",
        limitPlaceholder: "Example: 100",
        calcBtn: "Calculate Time",
        loading: "⏳ Processing Data...",
        found: "Videos Processed",
        total: "Total Duration",
        watched: "Watched Time",
        doneBtn: "Done"
    },
    ru: {
        title: "Статистика плейлиста",
        settingsTitle: "Настройки",
        limitLabel: "Сколько видео считать?",
        limitPlaceholder: "Например: 100",
        calcBtn: "Посчитать время",
        loading: "⏳ Сбор данных...",
        found: "Обработано видео",
        total: "Общая длительность",
        watched: "Просмотрено",
        doneBtn: "Готово"
    },
    uk: {
        title: "Статистика плейлиста",
        settingsTitle: "Налаштування",
        limitLabel: "Скільки відео рахувати?",
        limitPlaceholder: "Наприклад: 100",
        calcBtn: "Порахувати час",
        loading: "⏳ Збір даних...",
        found: "Оброблено відео",
        total: "Загальна тривалість",
        watched: "Переглянуто",
        doneBtn: "Готово"
    },
    de: {
        title: "Playlist-Statistiken",
        settingsTitle: "Einstellungen",
        limitLabel: "Wie viele Videos zählen?",
        limitPlaceholder: "Beispiel: 100",
        calcBtn: "Zeit berechnen",
        loading: "⏳ Daten werden gesammelt...",
        found: "Verarbeitete Videos",
        total: "Gesamtdauer",
        watched: "Gesehene Zeit",
        doneBtn: "Fertig"
    }
};

const gearSvg = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84a.481.481 0 0 0-.48.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.488.488 0 0 0-.59.22L2.71 8.25a.49.49 0 0 0 .12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.27.41.48.41h3.84c.21 0 .39-.17.48-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47.01.59-.22l1.92-3.32a.49.49 0 0 0-.12-.61l-2.03-1.58zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" fill="currentColor"/></svg>`;
const closeSvg = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

let currentLang = 'en';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggle_ui") {
        chrome.storage.local.get(['ytPtLang'], (result) => {
            currentLang = result.ytPtLang || 'en';
            createOrToggleUI();
        });
    }
});

function createOrToggleUI() {
    let container = document.getElementById('my-yt-tracker-container');

    if (container) {
        const isHidden = container.style.opacity === '0';
        container.style.opacity = isHidden ? '1' : '0';
        container.style.pointerEvents = isHidden ? 'all' : 'none';
        container.style.transform = isHidden ? 'translateY(0) scale(1)' : 'translateY(-20px) scale(0.95)';

        if (!isHidden) {
            document.getElementById('yt-pt-flipper').style.transform = 'rotateY(0deg)';
        }
        return;
    }

    container = document.createElement('div');
    container.id = 'my-yt-tracker-container';
    container.style.cssText = `
        position: fixed; top: 80px; right: 24px; z-index: 999999;
        width: 340px; perspective: 1200px;
        transition: opacity 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
        opacity: 1; transform: translateY(0) scale(1); pointer-events: all;
    `;

    const flipper = document.createElement('div');
    flipper.id = 'yt-pt-flipper';
    flipper.style.cssText = `
        width: 100%; height: 100%; position: relative;
        transform-style: preserve-3d; transition: transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
        border-radius: 24px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05);
    `;

    const sideBaseStyle = `
        position: absolute; width: 100%; top: 0; left: 0;
        backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px);
        border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.08);
        backface-visibility: hidden; -webkit-backface-visibility: hidden;
        box-sizing: border-box; display: flex; flex-direction: column;
        padding: 24px; background: linear-gradient(145deg, rgba(30,30,30,0.85) 0%, rgba(18,18,18,0.95) 100%);
        color: #ffffff; font-family: 'YouTube Sans', 'Roboto', sans-serif;
    `;

    const front = document.createElement('div');
    front.style.cssText = sideBaseStyle + `z-index: 2; transform: rotateY(0deg);`;

    front.innerHTML = `
        <style>
            .yt-pt-icon-btn { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); color: #aaa; cursor: pointer; width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; }
            #yt-pt-flipper-btn:hover { background: rgba(255,255,255,0.1); color: #fff; transform: rotate(45deg); border-color: rgba(255,255,255,0.2); }
            #yt-pt-close-front:hover { background: rgba(255,50,50,0.15); color: #ff5555; border-color: rgba(255,50,50,0.3); }
            .yt-pt-input { width: 100%; padding: 16px; background: rgba(0, 0, 0, 0.5); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 14px; box-sizing: border-box; outline: none; font-size: 15px; transition: all 0.3s; box-shadow: inset 0 2px 6px rgba(0,0,0,0.4); font-weight: 500; }
            .yt-pt-input:focus { border-color: #ff3333; box-shadow: inset 0 2px 6px rgba(0,0,0,0.4), 0 0 12px rgba(255, 51, 51, 0.2); background: rgba(0,0,0,0.7); }
            .yt-pt-main-btn { width: 100%; padding: 16px; background: linear-gradient(135deg, #FF0000 0%, #B30000 100%); color: white; border: none; border-radius: 14px; cursor: pointer; font-size: 16px; font-weight: 700; transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); box-shadow: 0 6px 20px rgba(255, 0, 0, 0.25); text-shadow: 0 1px 2px rgba(0,0,0,0.3); letter-spacing: 0.5px; margin-top: 8px;}
            .yt-pt-main-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(255, 0, 0, 0.4); filter: brightness(1.1); }
            .yt-pt-main-btn:active { transform: translateY(1px); box-shadow: 0 2px 10px rgba(255, 0, 0, 0.3); }
        </style>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <div style="display: flex; align-items: center; gap: 12px;">
                <button id="yt-pt-flipper-btn" class="yt-pt-icon-btn">${gearSvg}</button>
                <h3 id="yt-pt-title" style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.5px;">${i18n[currentLang].title}</h3>
            </div>
            <button id="yt-pt-close-front" class="yt-pt-icon-btn" style="padding: 8px;">${closeSvg}</button>
        </div>

        <div style="margin-bottom: 20px;">
            <label id="yt-pt-limit-label" style="font-size: 13px; color: #aaa; margin-bottom: 8px; display: block; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">${i18n[currentLang].limitLabel}</label>
            <input type="number" id="yt-pt-limit" class="yt-pt-input" placeholder="${i18n[currentLang].limitPlaceholder}">
        </div>

        <button id="yt-pt-calc" class="yt-pt-main-btn">${i18n[currentLang].calcBtn}</button>
        
        <div id="yt-pt-loading" style="display: none; text-align: center; margin-top: 24px; color: #aaa; font-size: 14px; font-weight: 500; letter-spacing: 0.5px;">
            ${i18n[currentLang].loading}
        </div>
        
        <div id="yt-pt-results" style="display: none; margin-top: 24px; background: rgba(0,0,0,0.4); padding: 20px; border-radius: 16px; font-size: 14px; border: 1px solid rgba(255,255,255,0.06); box-shadow: inset 0 2px 10px rgba(0,0,0,0.2);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 14px;">
                <span id="yt-pt-found-label" style="color: #999; font-weight: 500;">${i18n[currentLang].found}</span>
                <span id="yt-pt-count" style="color: #fff; font-weight: 700; font-size: 16px; background: rgba(255,255,255,0.1); padding: 4px 10px; border-radius: 8px;">0</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 14px;">
                <span id="yt-pt-total-label" style="color: #999; font-weight: 500;">${i18n[currentLang].total}</span>
                <span id="yt-pt-total" style="color: #4CAF50; font-weight: 800; font-size: 17px; text-shadow: 0 0 15px rgba(76, 175, 80, 0.4);">00:00:00</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span id="yt-pt-watched-label" style="color: #999; font-weight: 500;">${i18n[currentLang].watched}</span>
                <span id="yt-pt-watched" style="color: #2196F3; font-weight: 800; font-size: 17px; text-shadow: 0 0 15px rgba(33, 150, 243, 0.4);">00:00:00</span>
            </div>
        </div>
    `;

    const back = document.createElement('div');
    back.style.cssText = sideBaseStyle + `z-index: 1; transform: rotateY(180deg);`;

    back.innerHTML = `
        <style>
            .yt-pt-lang-btn { padding: 16px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.06); color: #888; border-radius: 14px; cursor: pointer; font-size: 15px; font-weight: 700; transition: all 0.3s; text-transform: uppercase; outline: none; letter-spacing: 1px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.2); }
            .yt-pt-lang-btn:hover { background: rgba(255,255,255,0.05); color: #fff; transform: translateY(-2px); border-color: rgba(255,255,255,0.15); }
            .yt-pt-lang-btn.active { background: linear-gradient(135deg, #FF0000, #CC0000); color: #fff; box-shadow: 0 4px 15px rgba(255,0,0,0.3); border-color: transparent; }
            .yt-pt-done-btn { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); color: #fff; cursor: pointer; padding: 8px 16px; border-radius: 10px; font-size: 14px; font-weight: 600; transition: all 0.2s; }
            .yt-pt-done-btn:hover { background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.3); }
        </style>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 26px; height: 26px; color: #ff3333; display: flex; filter: drop-shadow(0 0 8px rgba(255,51,51,0.5));">${gearSvg}</div>
                <h3 id="yt-pt-settings-title" style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.5px;">${i18n[currentLang].settingsTitle}</h3>
            </div>
            <button id="yt-pt-done-btn" class="yt-pt-done-btn">${i18n[currentLang].doneBtn}</button>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            ${['en', 'ru', 'uk', 'de'].map(lang => `
                <button class="yt-pt-lang-btn ${currentLang === lang ? 'active' : ''}" data-lang="${lang}">
                    ${lang}
                </button>
            `).join('')}
        </div>
    `;

    flipper.appendChild(front);
    flipper.appendChild(back);
    container.appendChild(flipper);
    document.body.appendChild(container);

    function syncHeight() {
        setTimeout(() => {
            const isSettings = flipper.style.transform === 'rotateY(180deg)';
            container.style.height = (isSettings ? back.scrollHeight : front.scrollHeight) + 'px';
        }, 50);
    }
    syncHeight();

    document.getElementById('yt-pt-close-front').addEventListener('click', () => {
        container.style.opacity = '0';
        container.style.pointerEvents = 'none';
        container.style.transform = 'translateY(-20px) scale(0.95)';
        setTimeout(() => { flipper.style.transform = 'rotateY(0deg)'; }, 400);
    });

    const toggleFlipper = () => {
        flipper.style.transform = flipper.style.transform === 'rotateY(180deg)' ? 'rotateY(0deg)' : 'rotateY(180deg)';
        syncHeight();
    };

    document.getElementById('yt-pt-flipper-btn').addEventListener('click', toggleFlipper);
    document.getElementById('yt-pt-done-btn').addEventListener('click', toggleFlipper);

    document.querySelectorAll('.yt-pt-lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentLang = e.target.dataset.lang;
            chrome.storage.local.set({ ytPtLang: currentLang });
            updateLanguageUI();
        });
    });

    document.getElementById('yt-pt-calc').addEventListener('click', () => {
        const limitInput = document.getElementById('yt-pt-limit').value;
        const limit = parseInt(limitInput) || 99999;

        document.getElementById('yt-pt-loading').style.display = 'block';
        document.getElementById('yt-pt-results').style.display = 'none';
        syncHeight();

        setTimeout(() => {
            const stats = calculatePlaylistStats(limit);

            document.getElementById('yt-pt-count').innerText = stats.count;
            document.getElementById('yt-pt-total').innerText = stats.total;
            document.getElementById('yt-pt-watched').innerText = stats.watched;

            document.getElementById('yt-pt-loading').style.display = 'none';
            document.getElementById('yt-pt-results').style.display = 'block';
            syncHeight();
        }, 200);
    });
}

function updateLanguageUI() {
    document.getElementById('yt-pt-title').innerText = i18n[currentLang].title;
    document.getElementById('yt-pt-limit-label').innerText = i18n[currentLang].limitLabel;
    document.getElementById('yt-pt-limit').placeholder = i18n[currentLang].limitPlaceholder;
    document.getElementById('yt-pt-calc').innerText = i18n[currentLang].calcBtn;
    document.getElementById('yt-pt-loading').innerText = i18n[currentLang].loading;
    document.getElementById('yt-pt-found-label').innerText = i18n[currentLang].found;
    document.getElementById('yt-pt-total-label').innerText = i18n[currentLang].total;
    document.getElementById('yt-pt-watched-label').innerText = i18n[currentLang].watched;
    document.getElementById('yt-pt-settings-title').innerText = i18n[currentLang].settingsTitle;
    document.getElementById('yt-pt-done-btn').innerText = i18n[currentLang].doneBtn;

    document.querySelectorAll('.yt-pt-lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });
}

function calculatePlaylistStats(limit) {
    let videos = document.querySelectorAll(`
        ytd-playlist-video-renderer, 
        ytd-playlist-panel-video-renderer,
        ytd-grid-video-renderer.ytd-playlist-grid-renderer
    `);

    let totalSeconds = 0;
    let watchedSeconds = 0;
    let count = Math.min(videos.length, limit);

    for (let i = 0; i < count; i++) {
        let video = videos[i];
        let timeElement = video.querySelector(`
            span#text.ytd-thumbnail-overlay-time-status-renderer, 
            .badge-shape-wiz__text,
            .badge-shape-wiz__title,
            ytd-thumbnail-overlay-time-status-renderer span.badge-shape-wiz__text
        `);

        if (!timeElement) continue;

        let timeText = timeElement.innerText.trim();
        if (!timeText.match(/[0-9:]+/)) continue;

        let videoSecs = timeToSeconds(timeText);
        totalSeconds += videoSecs;

        let progressElement = video.querySelector('div#progress, #progress-bar div#progress');
        if (progressElement) {
            let widthStyle = progressElement.style.width;
            if (widthStyle) {
                let percent = parseFloat(widthStyle.replace('%', ''));
                watchedSeconds += (videoSecs * (percent / 100));
            }
        }
    }

    return {
        count: count,
        total: formatTime(totalSeconds),
        watched: formatTime(watchedSeconds)
    };
}

function timeToSeconds(timeStr) {
    let parts = timeStr.split(':').reverse();
    let seconds = 0;
    for (let i = 0; i < parts.length; i++) {
        seconds += parseInt(parts[i]) * Math.pow(60, i);
    }
    return seconds;
}

function formatTime(totalSeconds) {
    let s = Math.round(totalSeconds);
    let hours = Math.floor(s / 3600);
    let minutes = Math.floor((s % 3600) / 60);
    let seconds = s % 60;
    return [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0')
    ].join(':');
}