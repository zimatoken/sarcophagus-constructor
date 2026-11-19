// ============================================
// Конструктор Саркофагов v1.4 — Финальная версия
// Основа: v1.3 + контекстная помощь "?", поля Этапа 3,
// защита от null, мгновенное сохранение radio
// ============================================

const DRAFT_KEY = 'sarcophagus_draft_v1';

const state = {
    currentStage: 0,
    totalStages: 5,
    data: {
        type: null,
        name: '',
        version: '',
        date: new Date().toISOString().split('T')[0],
        status: null,
        philosophy: '',
        purpose: '',
        architecture: '',
        typeSpecific: {},
        optional: {
            currentStatus: null,
            checklists: null,
            risks: null,
            changelog: null,
            links: null
        },
        optionalText: {          // текст для опциональных блоков Этапа 3
            currentStatus: '',
            checklists: '',
            risks: '',
            changelog: '',
            links: ''
        },
        aiMemo: 'standard',
        criticalNotes: ''
    }
};

// ============================================
// БАЗА ПОДСКАЗОК — Контекстная помощь
// ============================================
const HELP_TEXTS = {
    'type': {
        title: 'Тип проекта',
        what: 'Это "ветка" конструктора. От неё зависит, какие модули будут предложены на Этапе 2.',
        future: 'Через полгода, когда ты скинешь этот саркофаг новому AI, он по типу поймёт: "Ага, это Enterprise-система — значит, нужны статусы доказательности и Git baseline". Или "Это закрытый урок — значит, главное: что сработало и что переиспользовать".',
        example: 'TAX SHIELD = D (сложное ядро). Я в натуре = B (экосистема). Дикий Инвестор = C (урок). Золотой Инвестор = A (продукт).',
        warning: 'Если выберешь не тот тип, конструктор предложит нерелевантные модули и саркофаг будет "не про то".'
    },
    'name': {
        title: 'Название проекта',
        what: 'Имя, которое будет в заголовке саркофага и в имени скачанного файла.',
        future: 'Это то, как AI будет обращаться к проекту в разговоре. Имя файла будет: SARCOPHAGUS_[Название]_[Версия].md',
        example: 'Например: "TAX SHIELD", "Я в натуре… (Экосистема)", "SOS UNIVERSAL".',
        warning: 'Без названия файл скачается как SARCOPHAGUS__.md и ты потеряешь его в папке загрузок.'
    },
    'version': {
        title: 'Версия саркофага',
        what: 'Версия ДОКУМЕНТА, а не проекта. Растёт, когда ты переписываешь саркофаг.',
        future: 'Когда через месяц скинешь AI v3.1 и v3.7, он поймёт, что v3.7 — актуальный. Это защита от "старых инструкций".',
        example: 'TAX SHIELD v3.1 → v3.5 → v3.7 (каждый раз, когда добавляешь P2-5, P2-6 и т.д.).',
        warning: 'Если не указывать — все версии будут называться одинаково и ты запутаешься.'
    },
    'date': {
        title: 'Дата контрольной точки',
        what: 'Когда ты зафиксировал состояние проекта.',
        future: 'AI увидит: "Саркофаг от 17.11.2026 — значит, всё, что произошло после, он не знает". Это честная граница контекста.',
        example: 'TAX SHIELD: 17.11.2026. Я в натуре: 17.11.2026.',
        warning: 'Без даты AI может предположить, что данные устарели или актуальны — и ошибётся.'
    },
    'status': {
        title: 'Статус проекта',
        what: 'Одна эмодзи-метка + комментарий. Это "температура" проекта прямо сейчас.',
        future: 'AI прочитает 🟡 и поймёт: "Осторожно, не предлагать радикальные изменения". Прочитает ⚠️ — начнёт с вопросов о рисках.',
        example: '🟡 В активной разработке (Phase 1 в коде, но не в runtime).',
        warning: 'Пустой статус = AI будет работать вслепую.'
    },
    'philosophy': {
        title: 'Философия / Принципы',
        what: '4-8 правил, которые НЕЛЬЗЯ нарушать в этом проекте. Это ДНК.',
        future: 'Это то, что AI будет помнить ВСЕГДА, даже после 100 сообщений. Каждый раз, когда он захочет что-то сломать, он проверит: "А это не противоречит принципу №3?"',
        example: 'TAX SHIELD: "Сначала достоверность, затем архитектура". Я в натуре: "Offline-First", "Руль у пользователя".',
        warning: 'Без философии AI будет "хорошим парнем" и согласится на любую твою идею, даже разрушительную. Принципы = его тормоз.'
    },
    'purpose': {
        title: 'Назначение',
        what: '1-2 предложения: ЗАЧЕМ этот проект существует.',
        future: 'Когда AI утонет в деталях, он вернётся к назначению и спросит: "Это приближает нас к цели или нет?"',
        example: 'TAX SHIELD: "Демонстрационное браузерное приложение с TypeScript-ядром для анализа хоз. операций".',
        warning: 'Без назначения проект превращается в "мы делаем что-то непонятное".'
    },
    'architecture': {
        title: 'Архитектура',
        what: 'Слои, папки, стек. Карта территории.',
        future: 'AI, прочитав архитектуру, НЕ будет предлагать React для Vanilla JS проекта. НЕ будет путать core/ и components/.',
        example: 'TAX SHIELD: Приложение (src/) + Ядро (tax-shield-core/). Phase 1 не экспортируется.',
        warning: 'Без архитектуры AI будет предлагать изменения "в никуда".'
    },
    'M01': {
        title: 'Философия и Принципы (M01)',
        what: 'Обязательный модуль. Твой моральный компас проекта.',
        future: 'Через год, когда забудешь, почему ты запретил Phase 1 в runtime — AI напомнит.',
        example: 'TAX SHIELD: "Не подключать Phase 1 к runtime без отдельного решения".',
        warning: 'Этот модуль всегда включён, его нельзя отключить.'
    },
    'M03': {
        title: 'Git Baseline & Доказательства (M03)',
        what: 'HEAD, ветка, коммиты + таблица "Компонент → Статус → Доказательство".',
        future: 'Когда AI спросит "а это точно работает?", ты откроешь M03 и покажешь: "Вот коммит 57006e9, вот тест 17/17". Это твой щит от галлюцинаций.',
        example: 'TAX SHIELD: HEAD: e8baaee3bd9... | P2-5 RBAC: коммит 57006e9, authorization.test.ts 12/12.',
        warning: 'Без M03 в Enterprise-проекте (D) AI будет "уверенно врать" про статус компонентов.'
    },
    'M04': {
        title: 'Матрица ролей (RBAC) и Безопасность (M04)',
        what: 'Таблица: кто что может делать. Плюс чек-лист безопасности.',
        future: 'Когда добавишь новую роль (например, Auditor), AI проверит: "А она вписывается в матрицу?"',
        example: 'TAX SHIELD: Admin/Accountant/Operator/Manager × Upload/Validate/Apply/Cancel.',
        warning: 'Без M04 AI может предложить "открытую" архитектуру с дырами в безопасности.'
    },
    'M06': {
        title: 'База типовых багов и фиксов (M06)',
        what: 'Таблица "БАГ → Причина → Исправление". Твой прививочный журнал.',
        future: 'Через полгода AI снова захочет использовать tags вместо id в conditions — и ты покажешь ему M06. Он вспомнит.',
        example: 'SOS UNIVERSAL: "В conditions — id из options, НЕ tags" (Золотое правило v4.0).',
        warning: 'Без M06 ты будешь наступать на одни и те же грабли. Это самый ценный модуль.'
    },
    'M07': {
        title: 'Open Questions (M07)',
        what: 'Явный список того, что НЕ РЕШЕНО.',
        future: 'AI прочитает "❓ Как обрабатывать мультивалютность — не решено" и НЕ будет выдумывать ответ.',
        example: 'TAX SHIELD: P2-7.2 — классификация orphaned tests (deferred).',
        warning: 'Без M07 AI будет "достраивать" недостающее по своим догадкам.'
    },
    'M08': {
        title: 'Чек-лист проверки (M08)',
        what: '20+ конкретных пунктов с галочками. Ритуал перед релизом.',
        future: 'Перед пушем в GitHub ты откроешь M08 и пройдёшь по пунктам. Ничего не забудешь.',
        example: 'SOS UNIVERSAL: "✅ В conditions используются id из options, а НЕ tags".',
        warning: 'Без чек-листа релизы будут "на авось".'
    },
    'M10': {
        title: 'Дорожная карта (M10)',
        what: 'PHASE 1-N с статусами. Что закрыто, что в плане.',
        future: 'AI, видя "PHASE 3 — в плане", не будет предлагать начать PHASE 5.',
        example: 'TAX SHIELD: A ✅ | B частично | C частично | D не начат | E/F не завершены.',
        warning: 'Без roadmap проект превращается в "делаем всё сразу".'
    },
    'M15': {
        title: 'Инструкция для AI (M15)',
        what: 'Фраза, которую ты кидаешь новому AI вместе с саркофагом.',
        future: 'Это "стартовая команда". Без неё AI не поймёт, что ты от него хочешь.',
        example: '«Скинь этот саркофаг новому AI + скажи, на каком этапе остановился. Руль у тебя.»',
        warning: 'Этот модуль всегда включён. Это ДНК саркофага.'
    },
    'M20': {
        title: 'Модуль SOS / Экстренная помощь (M20)',
        what: 'Сценарии экстренных ситуаций с пошаговыми инструкциями.',
        future: 'Если проект про безопасность/здоровье — это ядро ценности.',
        example: 'SOS UNIVERSAL: 12 сценариев (укус, кровотечение, ожог, боль в груди).',
        warning: 'Для проектов вне медицины/безопасности — не нужен.'
    },
    'M26': {
        title: 'Монетизация и продвижение (M26)',
        what: 'Как проект приносит деньги. Telegram, Boosty, партнёрки.',
        future: 'Твоя цель — пассивный доход. M26 фиксирует воронку, чтобы AI не предлагал "бесплатно навсегда".',
        example: 'Золотой Инвестор: @golden_investor_zx + Boosty + партнёрские ссылки.',
        warning: 'Для закрытых проектов (C) — не нужен. Для Enterprise (D) — обычно не нужен.'
    },
    'M27': {
        title: 'Метрики и KPI (M27)',
        what: 'Как измеряем успех: DAU, retention, доход, XP.',
        future: 'Без метрик ты не поймёшь, работает проект или нет.',
        example: 'Золотой Инвестор: DAU 100 → цель 500. Retention 7d: 40% → цель 60%.',
        warning: 'Для проектов без пользователей (закрытые, ядра) — опционально.'
    },
    'opt-currentStatus': {
        title: 'Текущий фактический статус',
        what: 'Отдельный блок "что реально работает прямо сейчас".',
        future: 'Полезно, когда Этап 2 уже даёт Runtime-аудит (для D), но нужно ещё короче.',
        example: 'Если выбрал D — обычно НЕ нужен, D2.2 уже это даёт.',
        warning: 'Дублирование информации = путаница для AI.'
    },
    'opt-checklists': {
        title: 'Подробные чек-листы',
        what: 'Пошаговые списки действий (перед деплоем, перед тестами).',
        future: 'Когда AI спросит "что делать дальше?", он откроет чек-лист и пойдёт по пунктам.',
        example: 'Я в натуре: "Чек-лист перед пушем приложения в GitHub".',
        warning: 'Если в Этапе 2 уже выбрал M08 — дублировать не нужно.'
    },
    'opt-risks': {
        title: 'Известные ограничения и риски',
        what: 'Список того, что может пойти не так.',
        future: 'AI прочитает риски и будет осторожен в предложениях.',
        example: 'TAX SHIELD: "Юридическая готовность не подтверждена", "15 правил в DRAFT".',
        warning: 'Для проектов с M07 (Open Questions) — частично дублируется.'
    },
    'opt-changelog': {
        title: 'История изменений',
        what: 'Что изменилось с предыдущей версии саркофага.',
        future: 'Показывает эволюцию проекта. Полезно при аудите.',
        example: 'v3.1 → v3.7: добавлены P2-5, P2-6, P2-7, P2-7.1.',
        warning: 'Если проект первый раз — можно пропустить.'
    },
    'opt-links': {
        title: 'Ссылки и деплой',
        what: 'GitHub, GitHub Pages, продакшн-URL.',
        future: 'AI сможет открыть репозиторий и посмотреть код.',
        example: 'SOS UNIVERSAL: https://username.github.io/sos-universal/',
        warning: 'Если репозитория ещё нет (как у TAX SHIELD) — не включай.'
    },
    'aiMemo': {
        title: 'Памятка для AI',
        what: 'Фраза, которой ты открываешь новую сессию с AI.',
        future: 'Это "ключ зажигания". Без неё AI не поймёт, что ты от него ждёшь.',
        example: 'Стандартная: «Скинь этот саркофаг новому AI + скажи, на каком этапе остановился. Руль у тебя.»',
        warning: 'Своя памятка нужна, если проект специфичный (например, "всегда начинай с проверки M06").'
    },
    'criticalNotes': {
        title: 'Критически важное',
        what: 'Всё, что не влезло в другие поля, но критично.',
        future: 'Часто сюда попадают "чёрные лебеди" — вещи, которые взорвутся через месяц.',
        example: '"Не создавать GitHub-репозиторий до зелёных тестов" (TAX SHIELD).',
        warning: 'Если пустое — ок. Но если есть что сказать — не молчи.'
    }
};

// ============================================
// Кнопка "?" и модалка с подсказкой
// ============================================
function renderHelpBtn(fieldId) {
    if (!HELP_TEXTS[fieldId]) return '';
    return `<button type="button" class="help-btn" onclick="showHelp('${fieldId}')" title="Помощь">?</button>`;
}

function showHelp(fieldId) {
    const h = HELP_TEXTS[fieldId];
    if (!h) return;

    const modal = document.createElement('div');
    modal.className = 'help-modal';
    modal.innerHTML = `
        <div class="help-card">
            <h3>❓ ${h.title}</h3>

            <div class="help-section what">
                <h4>📌 Что это</h4>
                <p>${h.what}</p>
            </div>

            <div class="help-section future">
                <h4>🔮 Как это работает в будущем</h4>
                <p>${h.future}</p>
            </div>

            <div class="help-section example">
                <h4>✅ Пример из твоих проектов</h4>
                <p>${h.example}</p>
            </div>

            <div class="help-section warning">
                <h4>⚠️ Что будет, если пропустить</h4>
                <p>${h.warning}</p>
            </div>

            <button class="help-close" onclick="this.closest('.help-modal').remove()">Понятно, закрываю</button>
        </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });

    const escHandler = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

// ============================================
// Автосохранение в localStorage
// ============================================
function saveDraft() {
    try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(state.data));
    } catch (e) {
        console.warn('Не удалось сохранить черновик:', e);
    }
}

function loadDraft() {
    try {
        const raw = localStorage.getItem(DRAFT_KEY);
        if (!raw) return false;
        const draft = JSON.parse(raw);
        if (draft && (draft.name || draft.type || draft.purpose)) {
            if (confirm('Найден сохранённый черновик. Восстановить?')) {
                Object.assign(state.data, draft);
                // защита от старых черновиков без optionalText
                if (!state.data.optionalText) {
                    state.data.optionalText = { currentStatus: '', checklists: '', risks: '', changelog: '', links: '' };
                }
                return true;
            } else {
                localStorage.removeItem(DRAFT_KEY);
            }
        }
    } catch (e) {
        console.warn('Не удалось загрузить черновик:', e);
    }
    return false;
}

// ============================================
// Рендеринг этапов
// ============================================
function renderStage(stage) {
    const wizard = document.getElementById('wizard');
    wizard.innerHTML = '';

    switch (stage) {
        case 0: renderStage0(wizard); break;
        case 1: renderStage1(wizard); break;
        case 2: renderStage2(wizard); break;
        case 3: renderStage3(wizard); break;
        case 4: renderStage4(wizard); break;
    }

    updateProgress();
    updateControls();
}

function updateProgress() {
    const percent = (state.currentStage / (state.totalStages - 1)) * 100;
    document.getElementById('progress').style.width = percent + '%';
    document.getElementById('stageIndicator').textContent =
        `Этап ${state.currentStage} / ${state.totalStages - 1}`;
}

function updateControls() {
    document.getElementById('btnBack').disabled = state.currentStage === 0;

    if (state.currentStage === state.totalStages - 1) {
        document.getElementById('btnNext').style.display = 'none';
        document.getElementById('btnGenerate').style.display = 'inline-block';
    } else {
        document.getElementById('btnNext').style.display = 'inline-block';
        document.getElementById('btnGenerate').style.display = 'none';
    }
}

// --- ЭТАП 0: Выбор типа ---
function renderStage0(container) {
    container.innerHTML = `
        <h2>🏁 Этап 0. Выбор типа проекта ${renderHelpBtn('type')}</h2>
        <div class="question">
            <label>Выбери тип проекта:</label>
            <div class="radio-group">
                ${renderRadioOption('type', 'A', 'Активный продуктовый', 'Живой продукт с фичами, пользователями и развитием (Золотой Инвестор, SOS и т.п.)')}
                ${renderRadioOption('type', 'B', 'Экосистема / Семейство приложений', 'Несколько связанных приложений под единой оболочкой («Я в натуре»)')}
                ${renderRadioOption('type', 'C', 'Закрытый проект / Урок', 'Проект завершён (успешно или нет), фиксируем итоги и выводы')}
                ${renderRadioOption('type', 'D', 'Сложное ядро + Compatibility Layer', 'Enterprise-уровень со строгим разделением слоёв и статусами доказательности (TAX SHIELD)')}
            </div>
        </div>
    `;
}

// --- ЭТАП 1: Обязательное ядро ---
function renderStage1(container) {
    container.innerHTML = `
        <h2>🧱 Этап 1. Обязательное ядро</h2>

        <div class="question" id="q-name">
            <label>1.1 Название проекта <span style="color:#ef4444;">*</span> ${renderHelpBtn('name')}</label>
            <input type="text" id="name" value="${state.data.name}" placeholder="Например: TAX SHIELD">
        </div>

        <div class="question">
            <label>1.2 Версия саркофага ${renderHelpBtn('version')}</label>
            <input type="text" id="version" value="${state.data.version}" placeholder="Например: v3.1">
        </div>

        <div class="question">
            <label>1.3 Дата контрольной точки ${renderHelpBtn('date')}</label>
            <input type="text" id="date" value="${state.data.date}">
        </div>

        <div class="question" id="q-status">
            <label>1.4 Статус проекта <span style="color:#ef4444;">*</span> ${renderHelpBtn('status')}</label>
            <div class="radio-group">
                ${renderRadioOption('status', '✅', 'Стабильный', 'Фундамент не шатается, можно спокойно развивать')}
                ${renderRadioOption('status', '🟡', 'В активной разработке', 'Есть незакрытые важные куски, осторожно с изменениями')}
                ${renderRadioOption('status', '⚠️', 'Требует внимания', 'Есть риски или техдолг, которые могут взорваться')}
                ${renderRadioOption('status', '🏁', 'Закрыт', 'Проект завершён, фиксируем уроки')}
            </div>
        </div>

        <div class="question" id="q-philosophy">
            <label>1.5 Философия / Принципы (4–8 пунктов) <span style="color:#ef4444;">*</span> ${renderHelpBtn('philosophy')}</label>
            <div class="hint">Каждый принцип с новой строки</div>
            <textarea id="philosophy" rows="6">${state.data.philosophy}</textarea>
        </div>

        <div class="question" id="q-purpose">
            <label>1.6 Назначение (1–2 предложения) <span style="color:#ef4444;">*</span> ${renderHelpBtn('purpose')}</label>
            <textarea id="purpose" rows="2">${state.data.purpose}</textarea>
        </div>

        <div class="question">
            <label>1.7 Архитектура (высокоуровнево) ${renderHelpBtn('architecture')}</label>
            <div class="hint">Слои, ключевые папки, стек технологий</div>
            <textarea id="architecture" rows="5">${state.data.architecture}</textarea>
        </div>
    `;
}

// --- ЭТАП 2: Модуль ветвления (динамический из библиотеки) ---
function renderStage2(container) {
    const type = state.data.type;
    let html = `<h2>⚙️ Этап 2. Модули для типа ${type} (${MODULE_LIBRARY.project_types[type]})</h2>`;

    const availableModules = MODULE_LIBRARY.modules.filter(m => m.type.includes(type));

    const requiredModules = availableModules.filter(m =>
        m.required || (m.conditional_required_for && m.conditional_required_for.includes(type))
    );

    const optionalModules = availableModules.filter(m => !m.required && !(m.conditional_required_for && m.conditional_required_for.includes(type)));

    if (requiredModules.length > 0) {
        html += `<h3>🔒 Обязательные модули</h3>`;
        requiredModules.forEach(m => {
            html += renderModuleBlock(m, true);
        });
    }

    if (optionalModules.length > 0) {
        html += `<h3>🧩 Опциональные модули (выбери нужные)</h3>`;
        optionalModules.forEach(m => {
            html += renderModuleBlock(m, false);
        });
    }

    container.innerHTML = html;
    attachModuleCheckboxes();
}

function renderModuleBlock(module, isRequired) {
    const d = state.data.typeSpecific;
    const isChecked = d[`module_${module.id}`] ? 'checked' : '';
    const helpBtn = renderHelpBtn(module.id);

    return `
        <div class="question" style="${!isRequired && !isChecked ? 'opacity: 0.6;' : ''}" id="block_${module.id}">
            <label style="display:flex; align-items:center; gap:10px;">
                ${!isRequired ? `<input type="checkbox" id="check_${module.id}" ${isChecked}>` : '<span>🔒</span>'}
                <span>${module.name} <small style="color:#94a3b8; font-weight:normal;">(${module.id})</small> ${helpBtn}</span>
            </label>
            <div class="hint">${module.description}</div>
            <textarea id="input_${module.id}" rows="4" placeholder="${module.example || 'Введи данные...'}" ${!isRequired && !isChecked ? 'disabled' : ''}>${d[`input_${module.id}`] || ''}</textarea>
        </div>
    `;
}

function attachModuleCheckboxes() {
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', (e) => {
            const id = e.target.id.replace('check_', '');
            const block = document.getElementById(`block_${id}`);
            const textarea = document.getElementById(`input_${id}`);
            const module = MODULE_LIBRARY.modules.find(m => m.id === id);

            if (e.target.checked) {
                block.style.opacity = '1';
                textarea.disabled = false;
                // Умный шаблон: если поле пустое — подставляем template или example
                if (!textarea.value.trim() && module) {
                    const template = module.template || module.example || '';
                    if (template) textarea.value = template;
                }
            } else {
                block.style.opacity = '0.6';
                textarea.disabled = true;
            }

            state.data.typeSpecific[`module_${id}`] = e.target.checked;
            saveDraft();
        });
    });
}

// --- ЭТАП 3: Опциональные блоки ---
function renderStage3(container) {
    const o = state.data.optional;
    container.innerHTML = `
        <h2>🧩 Этап 3. Опциональные блоки</h2>

        ${renderYesNo('opt-currentStatus', '3.1 Текущий фактический статус',
            'Отдельный удобный блок для быстрого чтения',
            'Данных из Этапа 2 достаточно', o.currentStatus)}

        ${renderYesNo('opt-checklists', '3.2 Подробные чек-листы',
            'Добавим пошаговые чек-листы',
            'Обходимся без них', o.checklists)}

        ${renderYesNo('opt-risks', '3.3 Известные ограничения и риски',
            'Выносим отдельным блоком',
            'Риски уже отражены в других разделах', o.risks)}

        ${renderYesNo('opt-changelog', '3.4 История изменений этой версии',
            'Фиксируем изменения с предыдущей версии',
            'История не нужна', o.changelog)}

        ${renderYesNo('opt-links', '3.5 Ссылки и деплой',
            'Добавим GitHub, GitHub Pages и т.д.',
            'Ссылок нет или они нецелесообразны', o.links)}
    `;
}

// --- ЭТАП 4: Финализация + Предпросмотр ---
function renderStage4(container) {
    container.innerHTML = `
        <h2>🏁 Этап 4. Финализация</h2>

        <div class="question">
            <label>4.1 Памятка для AI ${renderHelpBtn('aiMemo')}</label>
            <div class="radio-group">
                ${renderRadioOption('aiMemo', 'standard', 'Стандартная', '«Скинь этот саркофаг новому AI + скажи, на каком этапе остановился. Руль у тебя.»')}
                ${renderRadioOption('aiMemo', 'custom', 'Своя (укажи ниже)', 'Если есть специфические требования к передаче контекста')}
            </div>
        </div>

        <div class="question">
            <label>4.2 Критически важное ${renderHelpBtn('criticalNotes')}</label>
            <div class="hint">Если всё учтено — оставь пустым</div>
            <textarea id="criticalNotes" rows="3">${state.data.criticalNotes}</textarea>
        </div>

        <div class="question" style="background:#0f2a1f;border-left-color:#34d399;">
            <label>✅ Всё готово к генерации!</label>
            <div class="hint">Нажми «Предпросмотр» чтобы увидеть результат, или «Сгенерировать» чтобы сразу скачать.</div>
        </div>

        <div style="margin-top: 20px;">
            <button id="btnPreview" class="btn btn-secondary" style="width:100%;">👀 Предпросмотр Markdown</button>
        </div>
    `;

    const btnPreview = document.getElementById('btnPreview');
    if (btnPreview) {
        btnPreview.addEventListener('click', showPreview);
    }
}

// ============================================
// Вспомогательные функции рендеринга
// ============================================
function renderRadioOption(group, value, title, desc) {
    const checked = state.data[group] === value ? 'checked' : '';
    return `
        <label class="radio-option">
            <input type="radio" name="${group}" value="${value}" ${checked}>
            <div class="label-text">
                <div class="label-title">${title}</div>
                <div class="label-desc">${desc}</div>
            </div>
        </label>
    `;
}

function renderYesNo(id, title, yesDesc, noDesc, currentValue) {
    const helpId = id.replace('opt-', '');
    const key = helpId;
    const text = (state.data.optionalText && state.data.optionalText[key]) || '';
    const show = currentValue === 'yes';

    return `
        <div class="question">
            <label>${title} ${renderHelpBtn(helpId)}</label>
            <div class="yes-no-group">
                <div class="yes-no-option ${currentValue === 'yes' ? 'selected' : ''}" 
                     data-id="${id}" data-value="yes">
                    <div class="yn-title">✅ Да</div>
                    <div class="yn-desc">${yesDesc}</div>
                </div>
                <div class="yes-no-option ${currentValue === 'no' ? 'selected' : ''}" 
                     data-id="${id}" data-value="no">
                    <div class="yn-title">❌ Нет</div>
                    <div class="yn-desc">${noDesc}</div>
                </div>
            </div>
            <textarea id="opttext_${key}" class="opt-text" rows="3" placeholder="Впиши сюда содержимое блока..." style="display:${show ? 'block' : 'none'}; margin-top:10px;">${text}</textarea>
        </div>
    `;
}

// ============================================
// Валидация
// ============================================
function validateStage() {
    const errors = [];

    if (state.currentStage === 0) {
        if (!state.data.type) errors.push('Выбери тип проекта');
    }

    if (state.currentStage === 1) {
        if (!state.data.name.trim()) errors.push('Укажи название проекта (1.1)');
        if (!state.data.status) errors.push('Выбери статус проекта (1.4)');
        if (!state.data.philosophy.trim()) errors.push('Заполни философию/принципы (1.5)');
        if (!state.data.purpose.trim()) errors.push('Заполни назначение (1.6)');
    }

    if (errors.length > 0) {
        alert('⚠️ Проверь поля:\n\n' + errors.join('\n'));
        return false;
    }
    return true;
}

// ============================================
// Сбор данных
// ============================================
function saveCurrentStage() {
    if (state.currentStage === 0) {
        const selected = document.querySelector('input[name="type"]:checked');
        if (selected && selected.value !== state.data.type) {
            state.data.typeSpecific = {};
        }
        if (selected) state.data.type = selected.value;
    }
    else if (state.currentStage === 1) {
        state.data.name = document.getElementById('name').value;
        state.data.version = document.getElementById('version').value;
        state.data.date = document.getElementById('date').value;
        const statusSel = document.querySelector('input[name="status"]:checked');
        if (statusSel) state.data.status = statusSel.value;
        state.data.philosophy = document.getElementById('philosophy').value;
        state.data.purpose = document.getElementById('purpose').value;
        state.data.architecture = document.getElementById('architecture').value;
    }
    else if (state.currentStage === 2) {
        MODULE_LIBRARY.modules.forEach(m => {
            const checkEl = document.getElementById(`check_${m.id}`);
            const inputEl = document.getElementById(`input_${m.id}`);

            if (checkEl) {
                state.data.typeSpecific[`module_${m.id}`] = checkEl.checked;
            }
            if (inputEl) {
                state.data.typeSpecific[`input_${m.id}`] = inputEl.value;
            }
        });
    }
    else if (state.currentStage === 4) {
        const memoSel = document.querySelector('input[name="aiMemo"]:checked');
        if (memoSel) state.data.aiMemo = memoSel.value;
        state.data.criticalNotes = document.getElementById('criticalNotes').value;
    }

    saveDraft();
}

// ============================================
// Генерация Markdown
// ============================================
function generateMarkdown() {
    const d = state.data;

    // --- SHORT CAPSULE ---
    let short = `### 🟢 SHORT CAPSULE: ${d.name || 'Без названия'} ${d.version || 'v1'} (${d.date})\n`;
    short += `**Статус:** ${d.status || 'не указан'} | **Тип:** ${getTypeName(d.type)}\n`;
    short += `**Суть:** ${d.purpose || 'не заполнено'}\n`;
    short += `**Архитектура:** ${(d.architecture || '').split('\n')[0] || 'См. полный саркофаг'}\n`;
    short += `**Главное правило:** ${(d.philosophy || '').split('\n')[0] || 'Руль у пользователя'}\n`;
    short += `**Следующий шаг:** [укажи конкретное действие]\n`;
    short += `*AI-памятка: Прочитай полный саркофаг ниже для контекста. Жду команду для продолжения.*\n`;

    // --- FULL SARCOPHAGUS ---
    let full = `# 🛡️ ${d.name || 'Без названия'}\n`;
    full += `**Версия саркофага:** ${d.version || 'не указана'}\n`;
    full += `**Дата контрольной точки:** ${d.date}\n`;
    full += `**Статус:** ${d.status || 'не указан'}\n\n---\n\n`;

    full += `## 🧭 1. Философия / Принципы\n`;
    const philLines = (d.philosophy || '').split('\n').filter(l => l.trim());
    full += philLines.length > 0
        ? philLines.map((l, i) => `${i + 1}. ${l}`).join('\n')
        : '[не заполнено]';
    full += `\n\n## 🎯 2. Назначение\n${d.purpose || '[не заполнено]'}\n\n`;
    full += `## 🏗️ 3. Архитектура\n${d.architecture || '[не заполнено]'}\n\n---\n\n`;

    full += `## ⚙️ 4. Модуль ${d.type}: ${getTypeName(d.type)}\n\n`;
    full += generateTypeSpecific(d.type, d.typeSpecific);

    full += `\n---\n\n## 📋 5. Опциональные блоки\n\n`;
    if (d.optional.currentStatus === 'yes') full += `### 5.1 Текущий фактический статус\n${(d.optionalText && d.optionalText.currentStatus) || '[не заполнено]'}\n\n`;
    if (d.optional.checklists === 'yes') full += `### 5.2 Подробные чек-листы\n${(d.optionalText && d.optionalText.checklists) || '[не заполнено]'}\n\n`;
    if (d.optional.risks === 'yes') full += `### 5.3 Известные ограничения и риски\n${(d.optionalText && d.optionalText.risks) || '[не заполнено]'}\n\n`;
    if (d.optional.changelog === 'yes') full += `### 5.4 История изменений этой версии\n${(d.optionalText && d.optionalText.changelog) || '[не заполнено]'}\n\n`;
    if (d.optional.links === 'yes') full += `### 5.5 Ссылки и деплой\n${(d.optionalText && d.optionalText.links) || '[не заполнено]'}\n\n`;

    full += `## 🤖 6. Памятка для AI\n`;
    if (d.aiMemo === 'standard') {
        full += `«Скинь этот саркофаг новому AI + скажи, на каком этапе остановился. Руль у тебя.»\n`;
    } else {
        full += `[Своя памятка]\n`;
    }

    if (d.criticalNotes) {
        full += `\n## ⚠️ Критически важное\n${d.criticalNotes}\n`;
    }

    return { short, full };
}

function getTypeName(type) {
    const names = {
        'A': 'Активный продуктовый',
        'B': 'Экосистема',
        'C': 'Закрытый проект / Урок',
        'D': 'Сложное ядро + Compatibility'
    };
    return names[type] || type || 'не выбран';
}

function generateTypeSpecific(type, data) {
    let out = '';
    if (!type) return out;
    const typeModules = MODULE_LIBRARY.modules.filter(m => m.type.includes(type));

    typeModules.forEach(m => {
        if (!m.required && !(m.conditional_required_for && m.conditional_required_for.includes(type))) {
            if (data[`module_${m.id}`] !== true) return;
        }

        const content = data[`input_${m.id}`] || '[не заполнено]';
        out += `### ${m.name} (${m.id})\n${content}\n\n`;
    });

    return out;
}

// ============================================
// Предпросмотр (модалка)
// ============================================
function showPreview() {
    saveCurrentStage();
    const { short, full } = generateMarkdown();

    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; inset: 0; background: rgba(0,0,0,0.8); 
        z-index: 9999; display: flex; align-items: center; justify-content: center;
        padding: 20px; overflow-y: auto;
    `;
    modal.innerHTML = `
        <div style="background: #1e293b; border-radius: 12px; max-width: 900px; width: 100%; 
                    max-height: 90vh; overflow-y: auto; padding: 24px; color: #f1f5f9;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h2 style="margin: 0; color: #60a5fa;">👀 Предпросмотр</h2>
                <button id="closePreview" style="background: #ef4444; color: white; border: none; 
                        border-radius: 8px; padding: 8px 16px; cursor: pointer; font-weight: bold;">✕ Закрыть</button>
            </div>
            <h3 style="color: #34d399;">📦 SHORT CAPSULE</h3>
            <pre style="background: #0f172a; padding: 16px; border-radius: 8px; 
                        white-space: pre-wrap; word-wrap: break-word; font-size: 13px; 
                        line-height: 1.6; color: #cbd5e1;">${escapeHtml(short)}</pre>
            <h3 style="color: #34d399;">📜 FULL SARCOPHAGUS</h3>
            <pre style="background: #0f172a; padding: 16px; border-radius: 8px; 
                        white-space: pre-wrap; word-wrap: break-word; font-size: 13px; 
                        line-height: 1.6; color: #cbd5e1;">${escapeHtml(full)}</pre>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('closePreview').addEventListener('click', () => {
        modal.remove();
    });
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// Навигация и события (с защитой от null)
// ============================================
function bindIf(id, evt, fn) {
    const el = document.getElementById(id);
    if (el) el.addEventListener(evt, fn);
}

bindIf('btnNext', 'click', () => {
    saveCurrentStage();
    if (!validateStage()) return;

    if (state.currentStage < state.totalStages - 1) {
        state.currentStage++;
        renderStage(state.currentStage);
    }
});

bindIf('btnBack', 'click', () => {
    saveCurrentStage();
    if (state.currentStage > 0) {
        state.currentStage--;
        renderStage(state.currentStage);
    }
});

bindIf('btnGenerate', 'click', () => {
    saveCurrentStage();
    if (!validateStage()) return;

    const { short, full } = generateMarkdown();

    document.getElementById('wizard').style.display = 'none';
    document.querySelector('.controls').style.display = 'none';
    document.getElementById('result').style.display = 'block';
    document.getElementById('shortCapsule').textContent = short;
    document.getElementById('fullSarcophagus').textContent = full;

    window._generatedShort = short;
    window._generatedFull = full;
});

// Раздельный экспорт
bindIf('btnDownloadShort', 'click', () => {
    const filename = `SHORT_${(state.data.name || 'sarcophagus').replace(/\s+/g, '_')}_${state.data.version || 'v1'}.md`;
    downloadFile(window._generatedShort || '', filename);
});

bindIf('btnDownloadFull', 'click', () => {
    const filename = `FULL_${(state.data.name || 'sarcophagus').replace(/\s+/g, '_')}_${state.data.version || 'v1'}.md`;
    downloadFile(window._generatedFull || '', filename);
});

bindIf('btnRestart', 'click', () => {
    if (confirm('Начать новый саркофаг? Текущие данные будут потеряны.')) {
        localStorage.removeItem(DRAFT_KEY);
        location.reload();
    }
});

function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// Делегирование событий: radio — мгновенное сохранение
document.getElementById('wizard').addEventListener('change', (e) => {
    const t = e.target;
    if (t.name === 'type') { state.data.type = t.value; saveDraft(); }
    else if (t.name === 'status') { state.data.status = t.value; saveDraft(); }
    else if (t.name === 'aiMemo') { state.data.aiMemo = t.value; saveDraft(); }
});

// Делегирование: yes/no опции
document.getElementById('wizard').addEventListener('click', (e) => {
    const ynOption = e.target.closest('.yes-no-option');
    if (ynOption) {
        const id = ynOption.dataset.id;
        const value = ynOption.dataset.value;
        const key = id.replace('opt-', '');
        state.data.optional[key] = value;

        const siblings = ynOption.parentElement.querySelectorAll('.yes-no-option');
        siblings.forEach(s => s.classList.remove('selected'));
        ynOption.classList.add('selected');

        const ta = document.getElementById('opttext_' + key);
        if (ta) ta.style.display = value === 'yes' ? 'block' : 'none';

        saveDraft();
    }
});

// Делегирование: текст опциональных блоков — мгновенное сохранение
document.getElementById('wizard').addEventListener('input', (e) => {
    const t = e.target;
    if (t.classList && t.classList.contains('opt-text')) {
        const key = t.id.replace('opttext_', '');
        if (!state.data.optionalText) {
            state.data.optionalText = { currentStatus: '', checklists: '', risks: '', changelog: '', links: '' };
        }
        state.data.optionalText[key] = t.value;
        saveDraft();
    }
});

// ============================================
// Инициализация
// ============================================
loadDraft();
renderStage(0);