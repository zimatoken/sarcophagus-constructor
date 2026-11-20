const MODULE_LIBRARY = {
  "version": "1.4",
  "description": "Библиотека модулей для универсального Конструктора Саркофагов. Ядро знаний, извлечённое из проектов Максима.",
  "meta": {
    "author": "Максим + Турбо ZX + Джин ЛИ",
    "date": "2026-11-20",
    "total_modules": 30,
    "required_modules": ["M01", "M02", "M15"],
    "conditional_required": {
      "M06": ["A", "B", "D"]
    }
  },
  "project_types": {
    "A": "Активный продуктовый",
    "B": "Экосистема / Семейство приложений",
    "C": "Закрытый проект / Урок",
    "D": "Сложное ядро + Compatibility Layer"
  },
  "modules": [
    {
      "id": "M01",
      "name": "Философия и Принципы",
      "type": ["A", "B", "C", "D"],
      "required": true,
      "fields": ["principles", "motto", "identity_anchor"],
      "source": ["Все проекты"],
      "description": "4–10 принципов, которые задают вектор проекта. Без них AI не поймёт, «что такое хорошо».",
      "example": "«Руль у пользователя», «Честность важнее приятности», «Говори на человеческом языке»"
    },
    {
      "id": "M02",
      "name": "Архитектура и Стек",
      "type": ["A", "B", "C", "D"],
      "required": true,
      "fields": ["layers", "folders", "stack", "key_rule"],
      "source": ["Все проекты"],
      "description": "Слои, ключевые папки, стек технологий. Ключевое правило: core/ никогда не импортирует из components/.",
      "example": "src/core/ — ядро, src/components/ — UI, src/data/ — данные"
    },
    {
      "id": "M03",
      "name": "Git Baseline & Доказательства",
      "type": ["D", "A"],
      "required": false,
      "fields": ["head_commit", "branch", "last_commits", "component_status_table"],
      "source": ["TAX SHIELD", "Золотой Инвестор"],
      "description": "Фиксация HEAD, ветки и последних коммитов. Таблица компонентов с доказательствами.",
      "template": "HEAD: [вставь последний коммит]\nBranch: main\nLast commits:\n- [коммит 1]\n- [коммит 2]\n\n| Компонент | Статус | Доказательство |\n|---|---|---|\n| [компонент] | ✅/🟡/❌ | [коммит/ссылка] |"
    },
    {
      "id": "M04",
      "name": "Матрица ролей (RBAC) и Безопасность",
      "type": ["D", "A"],
      "required": false,
      "fields": ["role_table", "security_checks", "jwt", "rate_limit", "tenant_isolation"],
      "source": ["TAX SHIELD"],
      "description": "Таблица действий по ролям. Отдельный блок безопасности: JWT, Rate Limit, Tenant Isolation.",
      "example": "Действие | Admin | Accountant | Viewer"
    },
    {
      "id": "M05",
      "name": "Стандарт модуля / API-контракт",
      "type": ["B", "A"],
      "required": false,
      "fields": ["data_schema", "golden_rules", "load_order"],
      "source": ["SOS", "Компас", "Садовод", "Педагог", "Айболит"],
      "description": "Жёсткая схема данных. Золотые правила: ID vs TAGS, порядок загрузки.",
      "example": "window.SOS_REGISTER_QUIZ({ meta, questions, solutions })"
    },
    {
      "id": "M06",
      "name": "База типовых багов и фиксов",
      "type": ["A", "B", "D"],
      "required": false,
      "conditional_required_for": ["A", "B", "D"],
      "fields": ["bug_table", "lessons_learned"],
      "source": ["Все проекты"],
      "description": "Таблица БАГ → Причина → Исправление. Для типа C трансформируется в «Извлечённые уроки».",
      "template": "| БАГ | Причина | Исправление |\n|---|---|---|\n| UTF-8 BOM → Quirks Mode | Нет meta charset | Сохранять HTML без BOM |\n| [твой баг] | [причина] | [решение] |"
    },
    {
      "id": "M07",
      "name": "Open Questions (Нерешённое)",
      "type": ["D", "A"],
      "required": false,
      "fields": ["open_questions"],
      "source": ["TAX SHIELD", "Золотой Инвестор"],
      "description": "Явный список того, что не решено, чтобы новый AI не тупил и не строил предположений.",
      "example": "❓ Как обрабатывать мультивалютность? — не решено"
    },
    {
      "id": "M08",
      "name": "Чек-лист проверки (20+ пунктов)",
      "type": ["A", "B"],
      "required": false,
      "fields": ["checklist"],
      "source": ["SOS", "Компас", "Педагог"],
      "description": "Конкретные пункты с галочками: валидация данных, психологическая грамотность, логическая полнота.",
      "template": "□ Все поля заполнены\n□ Нет any в TypeScript\n□ Нет хардкода цветов\n□ Все данные локально\n□ [свой пункт]"
    },
    {
      "id": "M09",
      "name": "Стандарты UI/UX и темы",
      "type": ["A", "B"],
      "required": false,
      "fields": ["css_variables", "theme", "responsive", "language_rules"],
      "source": ["Золотой Инвестор", "Компас", "Садовод", "Педагог", "Айболит"],
      "description": "CSS-переменные, тёмная/светлая тема, адаптив. Правило «Говори на человеческом языке».",
      "example": "--bg: #0c1426; --text: #f1f5f9;"
    },
    {
      "id": "M10",
      "name": "Дорожная карта (PHASE/Волны)",
      "type": ["A", "B", "C", "D"],
      "required": false,
      "fields": ["phases", "completed", "next_steps"],
      "source": ["Все проекты"],
      "description": "PHASE 1–N, что закрыто, что в плане. Для активного продукта без плана — смерть.",
      "template": "PHASE 1 — [название] ✅\nPHASE 2 — [название] ✅\nPHASE 3 — [название] 🔜\nPHASE 4 — [название] 🔜"
    },
    {
      "id": "M11",
      "name": "Безопасный деплой (GitHub Pages)",
      "type": ["A", "B", "D"],
      "required": false,
      "fields": ["deploy_algorithm", "forbidden_actions"],
      "source": ["Золотой Инвестор", "Дикий Инвестор", "Компас", "ФинСистема"],
      "description": "Алгоритм «Временная папка». Что НЕ делать: git rm -rf . в основной папке.",
      "example": "mkdir .deploy-gh-pages → git init → git branch -M gh-pages → push --force"
    },
    {
      "id": "M12",
      "name": "Ключи localStorage / Данные",
      "type": ["A", "B", "D"],
      "required": false,
      "fields": ["storage_keys", "export_import", "offline_first"],
      "source": ["Золотой Инвестор", "Компас", "Садовод", "Педагог", "Айболит"],
      "description": "Список ключей, экспорт/импорт, offline-first. IndexedDB vs localStorage.",
      "example": "gi_policy_v1 — JSON InvestmentPolicy; compass_insights — инсайты"
    },
    {
      "id": "M13",
      "name": "Философия продукта (Девиз)",
      "type": ["A", "B", "C"],
      "required": false,
      "fields": ["motto", "product_philosophy"],
      "source": ["Золотой Инвестор", "Дикий Инвестор"],
      "description": "Короткий девиз и философия продукта. «Приложение — штурман. Руль у тебя».",
      "example": "«Приложение — твой штурман. Но руль — у тебя.»"
    },
    {
      "id": "M14",
      "name": "Геймификация (XP, стрики, достижения)",
      "type": ["B", "A"],
      "required": false,
      "fields": ["xp_formula", "levels", "streaks", "achievements", "tribes"],
      "source": ["Экосистема «Я В НАТУРЕ»", "Садовод", "Педагог"],
      "description": "Формула уровня, начисление XP, стрики, достижения, 10 племён.",
      "example": "XP: полив +5, посадка +15, сбор урожая +50. Уровни: Новичок → Ученик → ... → Маэстро"
    },
    {
      "id": "M15",
      "name": "Инструкция для AI при сбросе контекста",
      "type": ["A", "B", "C", "D"],
      "required": true,
      "fields": ["ai_instruction", "workflow", "resume_rules"],
      "source": ["Все проекты"],
      "description": "Суть саркофага — передача контекста. «Скинь этот Саркофаг новому AI + скажи, где остановился».",
      "example": "1. Скинь Саркофаг. 2. Скажи, где остановился. 3. Продолжаем с того же места."
    },
    {
      "id": "M16",
      "name": "Мостики между проектами (Deep Links)",
      "type": ["B", "D"],
      "required": false,
      "fields": ["deep_links", "shared_storage", "inbox_key"],
      "source": ["Дикий Инвестор ↔ Золотой Инвестор ↔ Компас ↔ ФинСистема"],
      "description": "Общий origin → общий localStorage. Deep links: from=kg&amount=...&ts=...",
      "example": "from=zi&portfolio=...&ts=... / from=di&pnl=...&ts=..."
    },
    {
      "id": "M17",
      "name": "Follow-up и проверка исходов",
      "type": ["A", "B", "C"],
      "required": false,
      "fields": ["follow_up_question", "follow_up_options", "reward", "check_period"],
      "source": ["Компас", "Золотой Инвестор"],
      "description": "Через 7/30 дней спросить: «Сработало?» Сохраняет инсайт, планирует follow-up.",
      "example": "«Неделю назад ты решил преодолеть страх. Что из этого сделал?»"
    },
    {
      "id": "M18",
      "name": "Психологическая грамотность",
      "type": ["A", "B", "C"],
      "required": false,
      "fields": ["no_moral_judgments", "two_minute_technique", "identity_framing"],
      "source": ["Компас"],
      "description": "Нет моральных оценок, техника «2 минуты», identity framing («Ты — X», не «попробуй X»).",
      "example": "«Ты — творец. Страх — не враг, а сигнал роста.»"
    },
    {
      "id": "M19",
      "name": "Геймификация как философия",
      "type": ["A", "B"],
      "required": false,
      "fields": ["xp_actions", "daily_quests", "routine_to_game"],
      "source": ["Садовод", "Педагог", "Айболит"],
      "description": "XP за действия, ежедневные квесты, превращение рутины в игру.",
      "example": "💧 Полить 3 растения +30 XP; 🌾 Подкормить +40 XP"
    },
    {
      "id": "M20",
      "name": "Модуль SOS / Экстренная помощь",
      "type": ["A", "B", "C"],
      "required": false,
      "fields": ["sos_scenarios", "step_by_step", "disclaimer"],
      "source": ["Айболит", "Садовод", "Педагог"],
      "description": "Сценарии (укус, кровотечение, ожог...), пошаговые инструкции, «не заменяет врача».",
      "example": "🐝 Укус → 🩸 Кровотечение → 🔥 Ожог → 💔 Боль в груди → ..."
    },
    {
      "id": "M21",
      "name": "Модуль «Пожилые» / «Дети»",
      "type": ["A", "B"],
      "required": false,
      "fields": ["elderly_tabs", "kids_tabs", "vaccination_calendar"],
      "source": ["Айболит"],
      "description": "5 вкладок для пожилых. Календарь прививок для детей.",
      "example": "💊 Препараты | 🩺 Болезни | ⚠️ Опасные сочетания | 🛡️ Профилактика | 🚨 SOS"
    },
    {
      "id": "M22",
      "name": "Финансовое ядро",
      "type": ["D", "A"],
      "required": false,
      "fields": ["compound_interest", "monte_carlo", "health_score", "fire", "taxes", "iis"],
      "source": ["Финансовая Система", "Золотой Инвестор"],
      "description": "Сложный процент с инфляцией, Монте-Карло, Health Score, FIRE-таймер, налоги РФ 2026, ИИС-вычет.",
      "example": "Health Score 0–100 по 4 параметрам: сбережения, долги, подушка, инвестиции"
    },
    {
      "id": "M23",
      "name": "P2P-обмен и мессенджер",
      "type": ["B", "D"],
      "required": false,
      "fields": ["deals", "barter", "webrtc", "qr"],
      "source": ["Финансовая Система"],
      "description": "Сделки, бартер, WebRTC, QR. P2P-обмен без посредников.",
      "example": "Воронка сделок → переговоры → бартер → QR-обмен"
    },
    {
      "id": "M24",
      "name": "Локализация (RU/EN)",
      "type": ["B", "A"],
      "required": false,
      "fields": ["locales_file", "keys", "language_switch"],
      "source": ["Финансовая Система", "Компас", "Экосистема"],
      "description": "Централизованные locales.js, ключи cat_*, переключение языка.",
      "example": "core/locales.js — LOCALES + t(key, params)"
    },
    {
      "id": "M25",
      "name": "Стандарт данных для энциклопедий",
      "type": ["A", "B"],
      "required": false,
      "fields": ["entity_schema", "lifecycle", "sos_triggers", "companionship"],
      "source": ["Садовод", "Педагог", "Айболит"],
      "description": "Единая схема для 40 растений / 12 методик / 44 препаратов.",
      "example": "window.GARDEN_REGISTER_PLANT({ meta, requirements, planting_window, lifecycle })"
    },
    {
      "id": "M26",
      "name": "Монетизация и продвижение",
      "type": ["A", "B"],
      "required": false,
      "fields": ["telegram_channel", "boosty", "affiliate_links", "funnel", "conversion_metrics"],
      "source": ["Золотой Инвестор"],
      "description": "Telegram-канал, Boosty, партнёрские ссылки. Воронка: бесплатный контент → платный продукт.",
      "example": "Бесплатно навсегда — основная версия. Boosty — опционально."
    },
    {
      "id": "M27",
      "name": "Метрики и KPI",
      "type": ["A", "B", "D"],
      "required": false,
      "fields": ["dau", "retention", "revenue", "user_xp", "target_metrics", "analytics_tools"],
      "source": ["Золотой Инвестор", "Дикий Инвестор", "Финансовая Система"],
      "description": "Как измеряем успех? DAU, retention, доход, XP пользователей. Целевые показатели.",
      "example": "DAU: 100 → цель 500; retention 7d: 40% → цель 60%"
    },
    {
      "id": "M28",
      "name": "Honest Wording & Trust System",
      "type": ["A", "B", "D"],
      "required": false,
      "fields": ["honest_wording", "trust_score", "trust_indicator", "disclaimers"],
      "source": ["Золотой Инвестор v4.2"],
      "description": "Честные формулировки вместо маркетинга. Система доверия (trustScore). Явные дисклеймеры.",
      "example": "❌ «Доходность 25–30%» → ✅ «Модельная оценка при текущих ставках»",
      "template": "## Honest Wording\n- Что было нечестно: [формулировка]\n- Как стало: [формулировка]\n\n## Trust System\n- trustScore = [формула]"
    },
    {
      "id": "M29",
      "name": "Stress Test & Monte Carlo",
      "type": ["D", "A"],
      "required": false,
      "fields": ["monte_carlo_params", "scenarios", "stress_shocks", "visualization"],
      "source": ["Золотой Инвестор v4.2"],
      "description": "Детерминированные стресс-тесты (5 шоков). 3 сценария. Визуализация результатов.",
      "example": "🔥 Инфляция +4 п.п. / 💥 Волатильность ×2",
      "template": "## Monte Carlo\n- Параметры: [annualReturn, volatility, horizon]\n\n## Stress Test\n1. 🔥 Инфляция +4 п.п. → [результат]\n2. 📈 Ставка +2 п.п. → [результат]"
    },
    {
      "id": "M30",
      "name": "Протокол передачи контекста (расширенный)",
      "type": ["A", "B", "C", "D"],
      "required": false,
      "fields": ["reading_protocol", "role_definition", "first_actions", "forbidden_actions"],
      "source": ["Все проекты"],
      "description": "Расширенная инструкция для AI: что читать первым, какие факты проверить, что нельзя менять.",
      "example": "1. Прочитай SHORT CAPSULE\n2. Прочитай FULL SARCOPHAGUS\n3. Проверь факты в M03",
      "template": "## Протокол чтения\n1. Сначала SHORT CAPSULE\n2. Потом FULL SARCOPHAGUS\n\n## Роль AI\n- Ты — [роль]\n- Твоя задача: [задача]"
    }
  ]
};