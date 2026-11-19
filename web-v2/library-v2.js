const MODULE_LIBRARY = {
  "version": "1.3",
  "description": "Библиотека модулей для универсального Конструктора Саркофагов. Ядро знаний, извлечённое из проектов Максима.",
  "meta": {
    "author": "Максим + Турбо ZX + Джин ЛИ",
    "date": "2026-11-18",
    "total_modules": 27,
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
      "description": "4–10 принципов, которые задают вектор проекта. Без них AI не поймёт, «что такое хорошо»."
    },
    {
      "id": "M02",
      "name": "Архитектура и Стек",
      "type": ["A", "B", "C", "D"],
      "required": true,
      "fields": ["layers", "folders", "stack", "key_rule"],
      "source": ["Все проекты"],
      "description": "Слои, ключевые папки, стек технологий. Ключевое правило: core/ никогда не импортирует из components/."
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
      "fields": ["role_table", "security_checks", "jwt", "rate_limit"],
      "source": ["TAX SHIELD"],
      "description": "Таблица действий по ролям. Отдельный блок безопасности: JWT, Rate Limit, Tenant Isolation."
    },
    {
      "id": "M05",
      "name": "Стандарт модуля / API-контракт",
      "type": ["B", "A"],
      "required": false,
      "fields": ["data_schema", "golden_rules", "load_order"],
      "source": ["SOS", "Компас", "Садовод"],
      "description": "Жёсткая схема данных, которую нельзя нарушать. Золотые правила: ID vs TAGS, порядок загрузки."
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
      "description": "Явный список того, что не решено, чтобы новый AI не тупил и не строил предположений."
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
      "fields": ["css_variables", "theme", "responsive"],
      "source": ["Золотой Инвестор", "Компас", "Садовод"],
      "description": "CSS-переменные, тёмная/светлая тема, адаптив. Правило «Говори на человеческом языке»."
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
      "source": ["Золотой Инвестор", "Дикий Инвестор"],
      "description": "Алгоритм «Временная папка». Что НЕ делать: git rm -rf . в основной папке."
    },
    {
      "id": "M12",
      "name": "Ключи localStorage / Данные",
      "type": ["A", "B", "D"],
      "required": false,
      "fields": ["storage_keys", "export_import", "offline_first"],
      "source": ["Золотой Инвестор", "Компас", "Садовод"],
      "description": "Список ключей, экспорт/импорт, offline-first. IndexedDB vs localStorage."
    },
    {
      "id": "M13",
      "name": "Философия продукта (Девиз)",
      "type": ["A", "B", "C"],
      "required": false,
      "fields": ["motto", "product_philosophy"],
      "source": ["Золотой Инвестор", "Дикий Инвестор"],
      "description": "Короткий девиз и философия продукта. «Приложение — штурман. Руль у тебя»."
    },
    {
      "id": "M14",
      "name": "Геймификация (XP, стрики, достижения)",
      "type": ["B", "A"],
      "required": false,
      "fields": ["xp_formula", "levels", "streaks", "achievements"],
      "source": ["Экосистема «Я В НАТУРЕ»", "Садовод"],
      "description": "Формула уровня, начисление XP, стрики, достижения, племена."
    },
    {
      "id": "M15",
      "name": "Инструкция для AI при сбросе контекста",
      "type": ["A", "B", "C", "D"],
      "required": true,
      "fields": ["ai_instruction", "workflow", "resume_rules"],
      "source": ["Все проекты"],
      "description": "Суть саркофага — передача контекста. «Скинь этот Саркофаг новому AI + скажи, где остановился»."
    },
    {
      "id": "M16",
      "name": "Мостики между проектами (Deep Links)",
      "type": ["B", "D"],
      "required": false,
      "fields": ["deep_links", "shared_storage", "inbox_key"],
      "source": ["Дикий Инвестор ↔ Золотой Инвестор ↔ Компас"],
      "description": "Общий origin → общий localStorage. Deep links: from=kg&amount=...&ts=..."
    },
    {
      "id": "M17",
      "name": "Follow-up и проверка исходов",
      "type": ["A", "B", "C"],
      "required": false,
      "fields": ["follow_up_question", "follow_up_options", "reward"],
      "source": ["Компас", "Золотой Инвестор"],
      "description": "Через 7/30 дней спросить: «Сработало?» Сохраняет инсайт, планирует follow-up."
    },
    {
      "id": "M18",
      "name": "Психологическая грамотность",
      "type": ["A", "B", "C"],
      "required": false,
      "fields": ["no_moral_judgments", "two_minute_technique", "identity_framing"],
      "source": ["Компас"],
      "description": "Нет моральных оценок, техника «2 минуты», identity framing («Ты — X», не «попробуй X»)."
    },
    {
      "id": "M19",
      "name": "Геймификация как философия",
      "type": ["A", "B"],
      "required": false,
      "fields": ["xp_actions", "daily_quests", "routine_to_game"],
      "source": ["Садовод", "Педагог", "Айболит"],
      "description": "XP за действия, ежедневные квесты, превращение рутины в игру."
    },
    {
      "id": "M20",
      "name": "Модуль SOS / Экстренная помощь",
      "type": ["A", "B", "C"],
      "required": false,
      "fields": ["sos_scenarios", "step_by_step", "disclaimer"],
      "source": ["Айболит", "Садовод"],
      "description": "Сценарии (укус, кровотечение...), пошаговые инструкции, «не заменяет врача»."
    },
    {
      "id": "M21",
      "name": "Модуль «Пожилые» / «Дети»",
      "type": ["A", "B"],
      "required": false,
      "fields": ["elderly_tabs", "kids_tabs", "vaccination_calendar"],
      "source": ["Айболит"],
      "description": "5 вкладок для пожилых. Календарь прививок для детей."
    },
    {
      "id": "M22",
      "name": "Финансовое ядро",
      "type": ["D", "A"],
      "required": false,
      "fields": ["compound_interest", "monte_carlo", "health_score", "fire", "taxes"],
      "source": ["Финансовая Система", "Золотой Инвестор"],
      "description": "Сложный процент, Монте-Карло, Health Score, FIRE-таймер, налоги РФ, ИИС."
    },
    {
      "id": "M23",
      "name": "P2P-обмен и мессенджер",
      "type": ["B", "D"],
      "required": false,
      "fields": ["deals", "barter", "webrtc", "qr"],
      "source": ["Финансовая Система"],
      "description": "Сделки, бартер, WebRTC, QR. P2P-обмен без посредников."
    },
    {
      "id": "M24",
      "name": "Локализация (RU/EN)",
      "type": ["B", "A"],
      "required": false,
      "fields": ["locales_file", "keys", "language_switch"],
      "source": ["Финансовая Система", "Компас", "Экосистема"],
      "description": "Централизованные locales.js, ключи cat_*, переключение языка."
    },
    {
      "id": "M25",
      "name": "Стандарт данных для энциклопедий",
      "type": ["A", "B"],
      "required": false,
      "fields": ["entity_schema", "lifecycle", "sos_triggers"],
      "source": ["Садовод", "Педагог", "Айболит"],
      "description": "Единая схема: meta, requirements, lifecycle, sos_triggers."
    },
    {
      "id": "M26",
      "name": "Монетизация и продвижение",
      "type": ["A", "B"],
      "required": false,
      "fields": ["telegram_channel", "boosty", "affiliate_links", "funnel"],
      "source": ["Золотой Инвестор"],
      "description": "Telegram-канал, Boosty, партнёрские ссылки. Воронка: бесплатный контент → платный продукт."
    },
    {
      "id": "M27",
      "name": "Метрики и KPI",
      "type": ["A", "B", "D"],
      "required": false,
      "fields": ["dau", "retention", "revenue", "user_xp", "target_metrics"],
      "source": ["Золотой Инвестор", "Дикий Инвестор"],
      "description": "Как измеряем успех? DAU, retention, доход, XP пользователей. Целевые показатели."
    }
  ]
};
