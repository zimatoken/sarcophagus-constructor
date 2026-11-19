const DRAFT_KEY = 'sarcophagus_draft_v2';
let currentMode = 'normal'; // 'normal' или 'diagnost'

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
        optionalText: {
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
// СИЛЬНЫЕ ШАБЛОНЫ ДЛЯ ОПЦИОНАЛЬНЫХ БЛОКОВ
// ============================================
const OPTIONAL_TEMPLATES = {
    currentStatus: `| Компонент                        | Статус     | Доказательство                     |
|----------------------------------|------------|------------------------------------|
| Основной интерфейс               | ✅ Работает |                                    |
| Библиотека модулей               | ✅ Работает |                                    |
| Диагностический режим            | ✅ Работает |                                    |
| Автосохранение черновика         | ✅ Работает |                                    |
| Экспорт / Импорт JSON            | ✅ Работает |                                    |
| Публичный деплой (GitHub Pages)  | ❌ Нет     |                                    |
| Синхронизация между устройствами | ❌ Нет     |                                    |

Замени примеры на реальные компоненты своего проекта. В колонке «Доказательство» пиши конкретику: тест, файл, коммит или наблюдение.`,

    checklists: `**Чек-лист перед деплоем / релизом:**
- [ ] Все тесты зелёные
- [ ] Проверена работа в обычном и диагностическом режиме
- [ ] Проверен экспорт и повторный импорт JSON
- [ ] Нет секретов и приватных данных в примерах
- [ ] README и версия обновлены

**Чек-лист перед важными изменениями:**
- [ ] Сделан экспорт текущего черновика (JSON)
- [ ] Понятно, что именно меняем и зачем
- [ ] Есть способ откатиться

Добавь свои пункты под проект.`,

    risks: `- [Риск 1]: описание + влияние
- [Риск 2]: описание + влияние
- [Риск 3]: описание + влияние

Примеры хороших формулировок:
- Публичного деплоя пока нет — инструмент работает только локально
- Диагност — эвристика, а не AI (может ошибаться)
- Данные хранятся только в localStorage текущего браузера
- Нет синхронизации между устройствами`
};

// Большие обучающие шпаргалки: что вводить, зачем, что произойдёт дальше и что требуется от пользователя.
const FIELD_GUIDES = {
 type:{title:'Выбор типа проекта',enter:'Выбери один вариант по реальному назначению проекта: A — живой продукт (игра, сайт, приложение); B — несколько связанных продуктов; C — завершённый проект или извлечённый урок; D — сложное техническое ядро с архитектурой, безопасностью и доказательствами.',why:'Тип определяет структуру будущего саркофага и набор рекомендуемых модулей. Это не оценка сложности и не рейтинг проекта.',next:'На следующем этапе конструктор покажет обязательные и дополнительные модули именно для выбранного типа. Выбор можно изменить, вернувшись назад.',action:'Прочитай описания A/B/C/D и выбери тот вариант, который описывает проект сейчас. Если сомневаешься — выбери ближайший и запиши сомнение в критически важное.'},
 name:{title:'Название проекта',enter:'Короткое узнаваемое название. Используй то же имя, которое встречается в папке проекта, репозитории и документах. Можно добавить назначение в скобках.',why:'Название попадёт в заголовок и имя итогового файла. По нему новый AI будет отличать этот проект от других.',next:'Название станет идентификатором саркофага и будет использовано при формировании файлов.',action:'Введи реальное название, без рекламных лозунгов и длинного описания.'},
 version:{title:'Версия саркофага',enter:'Версию самого документа передачи контекста: например 1.0 при первой фиксации, 1.1 при небольшом обновлении, 2.0 при существенной переработке.',why:'Версия документа не обязана совпадать с версией приложения или продукта. Она помогает понять, какой снимок контекста новее.',next:'Версия попадёт в шапку и имя экспортируемого документа.',action:'Если это первый саркофаг — поставь 1.0. Если обновляешь существующий — увеличь версию по масштабу изменений.'},
 date:{title:'Дата контрольной точки',enter:'Дата, на которую сведения проверены. Используй текущую дату фиксации, а не дату начала проекта.',why:'Саркофаг описывает состояние на конкретный момент. Дата отделяет известные факты от событий, которые произошли позже.',next:'Новый AI будет понимать временную границу достоверности сведений.',action:'Проверь дату. Если часть данных старше или не проверялась, явно отметь это в соответствующем поле.'},
 status:{title:'Текущий статус проекта',enter:'Выбери фактическое состояние: стабилен; активно разрабатывается; требует внимания из-за проблем или рисков; закрыт.',why:'Статус задаёт тон дальнейшей работы. Он предупреждает AI, нужно ли беречь стабильную систему, продолжать разработку или сначала разбирать риски.',next:'Статус будет вынесен в документ и поможет новому AI выбрать безопасный первый шаг.',action:'Оцени состояние на сегодня, а не желаемое состояние. При наличии серьёзного блокера выбери «Требует внимания».'},
 philosophy:{title:'Философия и принципы',enter:'Запиши 4–10 коротких правил, которые нельзя нарушать. Это могут быть запреты, приоритеты качества, правила принятия решений и границы полномочий.',why:'Принципы защищают проект от решений, которые технически возможны, но противоречат его замыслу. Это постоянные ограничения для будущего AI.',next:'Принципы попадут в обязательное ядро саркофага и будут служить фильтром для предложений и изменений.',action:'Каждый принцип — отдельной строкой. Формулируй проверяемо: «не менять рабочую архитектуру без диагностики», а не «делать качественно».'},
 purpose:{title:'Назначение проекта',enter:'Одним-двумя предложениями опиши: для кого проект, какую проблему решает и какой результат должен давать.',why:'Назначение помогает отличать полезные задачи от отвлекающих улучшений и удерживает общий вектор.',next:'AI сможет сверять предлагаемые функции с основной целью проекта.',action:'Опиши результат для пользователя, а не список технологий и не план разработки.'},
 architecture:{title:'Архитектура и стек',enter:'Укажи фактические технологии, основные папки и слои, точки входа, хранилища, внешние сервисы и границы между компонентами. Если не знаешь — так и напиши.',why:'Архитектурная карта не даёт AI предлагать файлы, фреймворки и интеграции, которых в проекте нет.',next:'Эти сведения станут ориентиром для чтения кода и планирования изменений.',action:'Пиши только то, что проверено. Отделяй «реализовано» от «планируется» и не вставляй секреты, токены или пароли.'},
 'opt-currentStatus':{title:'Отдельный фактический статус',enter:'Кратко перечисли, что реально работает сейчас, что не работает, что проверено и чем подтверждено.',why:'Помогает отделить текущую реальность от планов и общей архитектуры.',next:'В итоговом документе появится отдельная сводка работающих и незавершённых частей.',action:'Выбирай «Да», если нужен отдельный компактный блок. В появившемся поле укажи компонент → состояние → доказательство. Не дублируй без необходимости подробный аудит.'},
 'opt-checklists':{title:'Дополнительные чек-листы',enter:'Укажи повторяемые процедуры: перед релизом, перед коммитом, перед импортом данных, после развёртывания.',why:'Чек-лист превращает опыт в повторяемый процесс и снижает риск забыть критический шаг.',next:'Новый AI сможет выполнять процедуру последовательно и отмечать результат каждого пункта.',action:'Выбирай «Да», если чек-листов ещё нет в выбранных модулях или нужны отдельные рабочие списки. Записывай конкретные действия и ожидаемый результат.'},
 'opt-risks':{title:'Известные ограничения и риски',enter:'Перечисли известные дефекты, ограничения, неподтверждённые решения, технические и организационные риски. Для каждого добавь влияние и способ проверки, если известны.',why:'Это предупреждает AI, что нельзя считать проект полностью готовым или самостоятельно обходить известные ограничения.',next:'Риски попадут в отдельный раздел и будут учитываться при выборе следующих действий.',action:'Выбирай «Да», если риски не собраны в другом модуле. Не скрывай проблемы и не выдавай предположение за подтверждённый дефект.'},
 'opt-changelog':{title:'История изменений',enter:'Зафиксируй важные изменения с предыдущей версии: дата, что изменилось, зачем и как проверено.',why:'История объясняет, почему проект пришёл к текущему состоянию и какие решения уже принимались.',next:'AI сможет отличить новое состояние от старых инструкций и не предложит повторно отменённые решения.',action:'Выбирай «Да» при обновлении существующего саркофага или когда важна эволюция проекта. Для первой фиксации можно выбрать «Нет».'},
 'opt-links':{title:'Ссылки и точки доступа',enter:'Добавь адреса репозитория, документации, демо, production, задач и файлов. Подпиши, что находится по каждой ссылке и есть ли доступ.',why:'Ссылки позволяют продолжить работу с реальными источниками, а не только с пересказом.',next:'Они попадут в отдельный раздел документа. AI сможет запросить доступные источники, если среда это позволяет.',action:'Выбирай «Да», если есть полезные адреса. Не вставляй приватные токены, пароли и ссылки с секретными параметрами.'},
 aiMemo:{title:'Памятка для следующего AI',enter:'Выбери стандартную инструкцию либо напиши конкретные правила старта: сначала прочитать саркофаг, проверить факты, задать вопросы, не менять файлы до согласования и т.п.',why:'Саркофаг переносит контекст, а памятка задаёт способ работы с ним. Она помогает новому AI начать с правильной роли и порядка действий.',next:'Памятка будет включена в финальный документ как стартовая команда следующей сессии.',action:'Оставь стандартный вариант, если особых требований нет. Выбирай «Своя» только если нужны дополнительные правила; тогда заполни появившееся поле.'},
 criticalNotes:{title:'Критически важное',enter:'Добавь то, что нельзя потерять и что не подходит ни к одному предыдущему полю: запреты, незакрытые договорённости, опасные места, важные решения или следующий обязательный шаг.',why:'Это последний предохранитель от потери контекста. Здесь фиксируются исключения, которые могут изменить ход работы.',next:'Заметки попадут в финальную часть саркофага и будут заметны следующему AI.',action:'Если такого нет — оставь пустым. Если есть — пиши конкретно, без общих пожеланий.'},
 diagnostInput:{title:'Описание ситуации для Диагноста',enter:'Опиши своими словами: что за проект, чего хочешь добиться, что уже сделано, что не получается, какие ошибки видишь и что нельзя менять. Можно вставить лог ошибки без паролей и токенов.',why:'Диагност использует описание как отправную точку для предварительной классификации проекта и предложения модулей.',next:'Он покажет рекомендацию, которую можно применить как черновое заполнение. Это не самостоятельное экспертное заключение и не гарантированный AI-анализ.',action:'Дай факты и симптомы. После применения рекомендации обязательно проверь тип, название, назначение, принципы и выбранные модули вручную.'}
};

function renderGuide(key, module) {
 const g = FIELD_GUIDES[key];
 let data = g;
 if (!data && module) {
   data = {title:module.name, enter:`Заполни этот модуль конкретными сведениями по его назначению: ${module.description || 'зафиксируй важный контекст проекта'}. Используй факты, решения, статусы и проверяемые детали.`, why:'Модуль добавляет специализированный контекст в переносимый документ, чтобы следующий AI не восстанавливал его по догадкам.', next:`Содержимое поля ${module.id} будет включено в соответствующий раздел итогового саркофага.`, action:`Если модуль обязательный — заполни его. Если дополнительный — включай только когда он действительно нужен проекту. Начни с шаблона/примера и замени общие формулировки реальными данными.`};
 }
 if (!data) return '';
 const example = data.example || (HELP_TEXTS[key] && HELP_TEXTS[key].example) || (module && (module.example || module.template)) || 'Пиши конкретные факты и решения; если точного ответа пока нет, отметь это явно.';
 return `<div class="field-guide" aria-label="Шпаргалка: ${escapeHtml(data.title)}"><div class="field-guide-title">📘 ШПАРГАЛКА · ${escapeHtml(data.title)}</div><div class="guide-grid"><div><b>✍️ Что сюда вводить</b><p>${escapeHtml(data.enter)}</p></div><div><b>🎯 Зачем это нужно</b><p>${escapeHtml(data.why)}</p></div><div><b>➡️ Что последует</b><p>${escapeHtml(data.next)}</p></div><div><b>🧭 Что сделать тебе</b><p>${escapeHtml(data.action)}</p></div><div class="guide-example"><b>🧪 Пример ориентира</b><p>${escapeHtml(example)}</p></div></div></div>`;
}

// ============================================
// РЕЖИМ ДИАГНОСТА
// ============================================

document.getElementById('modeNormal').addEventListener('click', () => {
    currentMode = 'normal';
    document.getElementById('modeNormal').classList.add('active');
    document.getElementById('modeNormal').setAttribute('aria-pressed', 'true');
    document.getElementById('modeDiagnost').classList.remove('active');
    document.getElementById('modeDiagnost').setAttribute('aria-pressed', 'false');
    document.getElementById('diagnostMode').style.display = 'none';
    document.getElementById('wizard').style.display = 'block';
    document.querySelector('.controls').style.display = 'flex';
});

document.getElementById('modeDiagnost').addEventListener('click', () => {
    currentMode = 'diagnost';
    document.getElementById('modeDiagnost').classList.add('active');
    document.getElementById('modeDiagnost').setAttribute('aria-pressed', 'true');
    document.getElementById('modeNormal').classList.remove('active');
    document.getElementById('modeNormal').setAttribute('aria-pressed', 'false');
    document.getElementById('diagnostMode').style.display = 'block';
    document.getElementById('wizard').style.display = 'none';
    document.querySelector('.controls').style.display = 'none';
});

document.getElementById('btnDiagnostAnalyze').addEventListener('click', () => {
    const input = document.getElementById('diagnostInput').value.trim();
    if (!input) {
        alert('⚠️ Опиши проблему или ситуацию!');
        return;
    }
    
    // Локальный анализ по ключевым словам; внешняя AI-модель не вызывается.
    const analysis = analyzeDiagnost(input);
    
    document.getElementById('diagnostOutput').textContent = analysis.recommendation;
    document.getElementById('diagnostResult').style.display = 'block';
    
    // Сохраняем анализ для применения
    window._diagnostAnalysis = analysis;
});

document.getElementById('btnApplyDiagnost').addEventListener('click', () => {
    const analysis = window._diagnostAnalysis;
    if (!analysis) return;
    
    // Применяем рекомендации к state
    if (analysis.type) state.data.type = analysis.type;
    if (analysis.name) state.data.name = analysis.name;
    if (analysis.purpose) state.data.purpose = analysis.purpose;
    if (analysis.philosophy) state.data.philosophy = analysis.philosophy;
    if (analysis.modules) {
        const moduleAliases = {
            foundation: 'M01', compass: 'M10', playground: 'M14',
            treasure: 'M26', first_aid: 'M06', translator: 'M24', sos: 'M20'
        };
        analysis.modules.forEach(alias => {
            const moduleId = moduleAliases[alias] || alias;
            if (MODULE_LIBRARY.modules.some(item => item.id === moduleId)) {
                state.data.typeSpecific[`module_${moduleId}`] = true;
            }
        });
    }
    
    // Переключаемся в обычный режим
    currentMode = 'normal';
    document.getElementById('modeNormal').classList.add('active');
    document.getElementById('modeNormal').setAttribute('aria-pressed', 'true');
    document.getElementById('modeDiagnost').classList.remove('active');
    document.getElementById('modeDiagnost').setAttribute('aria-pressed', 'false');
    document.getElementById('diagnostMode').style.display = 'none';
    document.getElementById('wizard').style.display = 'block';
    document.querySelector('.controls').style.display = 'flex';
    
    // Рендерим Этап 1 с заполненными данными
    state.currentStage = 1;
    saveDraft();
    renderStage(1);
});

function analyzeDiagnost(input) {
    const lower = input.toLowerCase();
    let type = 'A';
    let name = 'Новый проект';
    let purpose = '';
    let philosophy = '';
    let modules = [];
    let recommendation = '';
    
    // Определяем тип проекта
    if (lower.includes('игр') || lower.includes('game')) {
        type = 'A';
        name = 'Игровой проект';
        purpose = 'Создание игры с увлекательным геймплеем и монетизацией.';
        philosophy = '1. Геймплей — король\n2. Игрок должен возвращаться\n3. Монетизация не ломает баланс';
        modules = ['foundation', 'compass', 'playground', 'treasure'];
        recommendation = '🎮 Тип: Активный продуктовый (Игра)\n\nРекомендуемые модули:\n- 🏗️ Фундамент (правила игры)\n- 🗺️ Компас (этапы разработки)\n- 🎮 Игровая площадка (геймификация)\n- 💰 Сундук с сокровищами (монетизация)\n\nЗаполни поля на следующем экране!';
    } else if (lower.includes('сайт') || lower.includes('web') || lower.includes('лендинг')) {
        type = 'A';
        name = 'Веб-проект';
        purpose = 'Создание сайта для привлечения клиентов или продажи услуг.';
        philosophy = '1. Конверсия — главная метрика\n2. Скорость загрузки критична\n3. Мобильная версия обязательна';
        modules = ['foundation', 'compass', 'treasure', 'translator'];
        recommendation = '🌐 Тип: Активный продуктовый (Сайт)\n\nРекомендуемые модули:\n- 🏗️ Фундамент (цели сайта)\n- 🗺️ Компас (этапы запуска)\n- 💰 Сундук с сокровищами (монетизация)\n- 🌍 Переводчик (локализация)\n\nЗаполни поля на следующем экране!';
    } else if (lower.includes('приложен') || lower.includes('app') || lower.includes('мобильн')) {
        type = 'A';
        name = 'Мобильное приложение';
        purpose = 'Создание мобильного приложения для решения конкретной проблемы пользователей.';
        philosophy = '1. Offline-first — интернет не гарантия\n2. Простота интерфейса\n3. Удержание важнее привлечения';
        modules = ['foundation', 'compass', 'treasure', 'sos'];
        recommendation = '📱 Тип: Активный продуктовый (Приложение)\n\nРекомендуемые модули:\n- 🏗️ Фундамент (проблема пользователя)\n- 🗺️ Компас (этапы разработки)\n- 💰 Сундук с сокровищами (монетизация)\n- 🚨 SOS-кнопка (экстренные сценарии)\n\nЗаполни поля на следующем экране!';
    } else if (lower.includes('брос') || lower.includes('удал') || lower.includes('retention') || lower.includes('удержан')) {
        type = 'A';
        name = 'Проект с проблемой удержания';
        purpose = 'Решение проблемы низкого удержания пользователей.';
        philosophy = '1. Первый опыт — критичен\n2. Геймификация удерживает\n3. Постоянная ценность';
        modules = ['foundation', 'compass', 'playground', 'first_aid'];
        recommendation = '⚠️ Проблема: Низкое удержание пользователей\n\nРешение:\n1. Упрости онбординг (первые 5 минут)\n2. Добавь геймификацию (XP, достижения)\n3. Найди "крючок" — почему возвращаться?\n\nРекомендуемые модули:\n- 🏗️ Фундамент (ценность для пользователя)\n- 🗺️ Компас (план улучшений)\n- 🎮 Игровая площадка (геймификация)\n- 💊 Аптечка (известные проблемы)\n\nЗаполни поля на следующем экране!';
    } else if (lower.includes('эконом') || lower.includes('баланс') || lower.includes('инфляц')) {
        type = 'A';
        name = 'Проект с экономической системой';
        purpose = 'Создание сбалансированной экономической системы.';
        philosophy = '1. Баланс — это процесс, не результат\n2. Инфляция неизбежна — контролируй её\n3. Игрок должен чувствовать прогресс';
        modules = ['foundation', 'compass', 'playground', 'treasure'];
        recommendation = '⚖️ Проблема: Баланс экономической системы\n\nРешение:\n1. Определи источники и стоки ресурсов\n2. Добавь "раковины" (sinks) для избытка\n3. Тестируй на малой группе\n\nРекомендуемые модули:\n- 🏗️ Фундамент (правила экономики)\n- 🗺️ Компас (этапы балансировки)\n- 🎮 Игровая площадка (механики)\n- 💰 Сундук с сокровищами (монетизация)\n\nЗаполни поля на следующем экране!';
    } else {
        // Общий случай
        recommendation = '🔧 Тип: Активный продуктовый (общий)\n\nРекомендуемые модули:\n- 🏗️ Фундамент (зачем проект)\n- 🗺️ Компас (план действий)\n- 💰 Сундук с сокровищами (монетизация)\n\nЗаполни поля на следующем экране!';
    }
    
    return { type, name, purpose, philosophy, modules, recommendation };
}

// ============================================
// ОСНОВНАЯ ЛОГИКА (как в v1.4)
// ============================================

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[ch]);
}

function normalizeProjectData(source) {
    const defaults = {
        type: null, name: '', version: '', date: new Date().toISOString().slice(0, 10),
        status: null, philosophy: '', purpose: '', architecture: '', typeSpecific: {},
        optional: { currentStatus: null, checklists: null, risks: null, changelog: null, links: null },
        optionalText: { currentStatus: '', checklists: '', risks: '', changelog: '', links: '' },
        aiMemo: 'standard', customAiMemo: '', criticalNotes: ''
    };
    const data = source && typeof source === 'object' && !Array.isArray(source) ? source : {};
    const asText = (value, max) => typeof value === 'string' ? value.slice(0, max) : '';
    const typeSpecific = {};
    const allowedModuleKeys = new Set(MODULE_LIBRARY.modules.flatMap(m => [`module_${m.id}`, `input_${m.id}`]));
    if (data.typeSpecific && typeof data.typeSpecific === 'object' && !Array.isArray(data.typeSpecific)) {
        for (const [key, value] of Object.entries(data.typeSpecific)) {
            if (!allowedModuleKeys.has(key)) continue;
            if (key.startsWith('module_') && typeof value === 'boolean') typeSpecific[key] = value;
            if (key.startsWith('input_') && typeof value === 'string') typeSpecific[key] = value.slice(0, 100000);
        }
    }
    const optional = {};
    const optionalText = {};
    for (const key of Object.keys(defaults.optional)) {
        optional[key] = ['yes', 'no'].includes(data.optional?.[key]) ? data.optional[key] : null;
        optionalText[key] = asText(data.optionalText?.[key], 100000);
    }
    const validType = ['A', 'B', 'C', 'D'].includes(data.type) ? data.type : null;
    const validStatus = ['✅', '🟡', '⚠️', '🏁'].includes(data.status) ? data.status : null;
    return {
        ...defaults,
        type: validType,
        name: asText(data.name, 300), version: asText(data.version, 80),
        date: asText(data.date, 40) || defaults.date,
        status: validStatus,
        philosophy: asText(data.philosophy, 30000), purpose: asText(data.purpose, 30000),
        architecture: asText(data.architecture, 50000), typeSpecific,
        optional, optionalText,
        aiMemo: data.aiMemo === 'custom' ? 'custom' : 'standard',
        customAiMemo: asText(data.customAiMemo, 20000),
        criticalNotes: asText(data.criticalNotes, 30000)
    };
}

function validateImportedProject(parsed) {
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Корень JSON должен быть объектом');
    if (parsed.app && parsed.app !== 'Sarcophagus Constructor') throw new Error('Файл создан другим приложением');
    if (parsed.schemaVersion !== undefined && ![1, 2].includes(parsed.schemaVersion)) throw new Error(`Неподдерживаемая версия формата: ${parsed.schemaVersion}`);
    const data = Object.prototype.hasOwnProperty.call(parsed, 'data') ? parsed.data : parsed;
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('В файле отсутствует объект данных проекта');
    if (data.type != null && !['A', 'B', 'C', 'D'].includes(data.type)) throw new Error('Некорректный тип проекта');
    for (const key of ['name', 'version', 'date', 'philosophy', 'purpose', 'architecture', 'customAiMemo', 'criticalNotes']) {
        if (data[key] !== undefined && typeof data[key] !== 'string') throw new Error(`Поле «${key}» должно быть текстом`);
    }
    for (const key of ['typeSpecific', 'optional', 'optionalText']) {
        if (data[key] !== undefined && (!data[key] || typeof data[key] !== 'object' || Array.isArray(data[key]))) throw new Error(`Некорректная структура поля «${key}»`);
    }
    return data;
}

function saveDraft() {
    try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({
            schemaVersion: 2, savedAt: new Date().toISOString(),
            currentStage: state.currentStage, data: state.data
        }));
        const indicator = document.getElementById('saveStatus');
        if (indicator) indicator.textContent = 'Черновик сохранён локально';
    } catch (e) {
        console.warn('Черновик не сохранён:', e);
        const indicator = document.getElementById('saveStatus');
        if (indicator) indicator.textContent = 'Не удалось сохранить черновик — экспортируй JSON';
    }
}

function loadDraft() {
    try {
        const raw = localStorage.getItem(DRAFT_KEY);
        if (!raw) return false;
        const parsed = JSON.parse(raw);
        const envelope = parsed && parsed.data ? parsed : { data: parsed, currentStage: 0 };
        if (envelope.data && (envelope.data.name || envelope.data.type || envelope.data.purpose)) {
            if (confirm('Найден сохранённый черновик. Восстановить?')) {
                state.data = normalizeProjectData(envelope.data);
                state.currentStage = Number.isInteger(envelope.currentStage)
                    ? Math.min(4, Math.max(0, envelope.currentStage)) : 0;
                return true;
            }
        }
    } catch (e) {
        console.warn('Черновик повреждён или не прочитан:', e);
        alert('Не удалось прочитать локальный черновик. Если у тебя есть JSON-экспорт, импортируй его.');
    }
    return false;
}

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
    document.getElementById('stageIndicator').textContent = `Этап ${state.currentStage} / ${state.totalStages - 1}`;
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

function renderStage0(container) {
    container.innerHTML = `
        <h2>🏁 Этап 0. Выбор типа проекта</h2>
        <div class="question">
            <div class="field-label-row"><label>Выбери тип проекта:</label>${renderHelpBtn('type')}</div>
            ${renderGuide('type')}
            <div class="radio-group">
                ${renderRadioOption('type', 'A', '🎮 Активный продуктовый', 'Игра, сайт, приложение — живой продукт')}
                ${renderRadioOption('type', 'B', '🌐 Экосистема', 'Семейство связанных приложений')}
                ${renderRadioOption('type', 'C', '📚 Закрытый проект / Урок', 'Проект завершён, фиксируем выводы')}
                ${renderRadioOption('type', 'D', '⚙️ Сложное ядро', 'Enterprise: слои, безопасность, доказательства')}
            </div>
        </div>`;
}

function renderStage1(container) {
    container.innerHTML = `
        <h2>🧱 Этап 1. Обязательное ядро</h2>
        <div class="question">
            <div class="field-label-row"><label>1.1 Название проекта *</label>${renderHelpBtn('name')}</div>
            ${renderGuide('name')}
            <input type="text" id="name" value="${escapeHtml(state.data.name)}" placeholder="Например: Моя супер игра">
        </div>
        <div class="question">
            <div class="field-label-row"><label>1.2 Версия саркофага</label>${renderHelpBtn('version')}</div>
            ${renderGuide('version')}
            <input type="text" id="version" value="${escapeHtml(state.data.version)}" placeholder="Например: v1.0">
        </div>
        <div class="question">
            <div class="field-label-row"><label>1.3 Дата</label>${renderHelpBtn('date')}</div>
            ${renderGuide('date')}
            <input type="text" id="date" value="${escapeHtml(state.data.date)}">
        </div>
        <div class="question">
            <div class="field-label-row"><label>1.4 Статус *</label>${renderHelpBtn('status')}</div>
            ${renderGuide('status')}
            <div class="radio-group">
                ${renderRadioOption('status', '✅', 'Стабильный', 'Всё работает, развиваем')}
                ${renderRadioOption('status', '🟡', 'В разработке', 'Есть незакрытые куски')}
                ${renderRadioOption('status', '⚠️', 'Требует внимания', 'Есть риски')}
                ${renderRadioOption('status', '🏁', 'Закрыт', 'Проект завершён')}
            </div>
        </div>
        <div class="question">
            <div class="field-label-row"><label>1.5 Философия / Принципы *</label>${renderHelpBtn('philosophy')}</div>
            ${renderGuide('philosophy')}
            <div class="hint">Каждый принцип с новой строки</div>
            <textarea id="philosophy" rows="6">${escapeHtml(state.data.philosophy)}</textarea>
        </div>
        <div class="question">
            <div class="field-label-row"><label>1.6 Назначение *</label>${renderHelpBtn('purpose')}</div>
            ${renderGuide('purpose')}
            <textarea id="purpose" rows="2">${escapeHtml(state.data.purpose)}</textarea>
        </div>
        <div class="question">
            <div class="field-label-row"><label>1.7 Архитектура</label>${renderHelpBtn('architecture')}</div>
            ${renderGuide('architecture')}
            <div class="hint">Слои, папки, стек</div>
            <textarea id="architecture" rows="5">${escapeHtml(state.data.architecture)}</textarea>
        </div>`;
}

function renderStage2(container) {
    const type = state.data.type;
    let html = `<h2>⚙️ Этап 2. Модули для типа ${type}</h2>`;
    const available = MODULE_LIBRARY.modules.filter(m => m.type.includes(type));
    const required = available.filter(m => m.required || (m.conditional_required_for && m.conditional_required_for.includes(type)));
    const optional = available.filter(m => !m.required && !(m.conditional_required_for && m.conditional_required_for.includes(type)));
    
    if (required.length) {
        html += `<h3>🔒 Обязательные модули</h3>`;
        required.forEach(m => { html += renderModuleBlock(m, true); });
    }
    if (optional.length) {
        html += `<h3>🧩 Опциональные модули</h3>`;
        optional.forEach(m => { html += renderModuleBlock(m, false); });
    }
    container.innerHTML = html;
    attachModuleCheckboxes();
}

function renderModuleBlock(module, isRequired) {
    const d = state.data.typeSpecific;
    const isChecked = d[`module_${module.id}`] ? 'checked' : '';
    const badge = isRequired 
        ? '<span class="module-badge required">🔒 Обязательный</span>' 
        : '<span class="module-badge optional">Опциональный</span>';

    const iconById = { M01: 'foundation.png', M02: 'foundation.png', M03: 'compass.png', M04: 'emergency.png', M06: 'first-aid.png', M08: 'compass.png', M10: 'compass.png', M14: 'playground.png', M15: 'ai-memo.png', M20: 'emergency.png', M22: 'treasure.png', M26: 'treasure.png' };
    const iconPath = module.icon || `../web/assets/icons/${iconById[module.id] || 'ai-memo.png'}`;

    return `
        <div class="module-card" data-module="${module.id}" 
             style="${!isRequired && !isChecked ? 'opacity: 0.5;' : ''}" 
             id="block_${module.id}">

            <img src="${iconPath}" alt="${escapeHtml(module.name)}" class="module-icon"
                 onerror="this.style.display='none'">

            <div class="module-content">
                <div class="module-header">
                    <span class="module-name">${escapeHtml(module.name)}</span>
                    ${badge}
                    ${renderHelpBtn(module.id)}
                </div>

                <div class="module-description">${escapeHtml(module.description)}</div>
                ${renderGuide(module.id, module)}

                ${!isRequired ? `
                    <label style="display:flex; align-items:center; gap:8px; margin-bottom:12px; cursor:pointer;">
                        <input type="checkbox" id="check_${module.id}" ${isChecked} 
                               style="width:18px; height:18px; cursor:pointer;">
                        <span style="color:#94a3b8; font-size:14px;">
                            ${isChecked ? '✅ Модуль активирован' : 'Включить модуль'}
                        </span>
                    </label>
                ` : ''}

                <textarea id="input_${module.id}" class="module-textarea" 
                          rows="4" 
                          placeholder="${escapeHtml(module.example || 'Введи данные...')}"
                          ${!isRequired && !isChecked ? 'disabled' : ''}>${escapeHtml(d[`input_${module.id}`] || '')}</textarea>
            </div>
        </div>
    `;
}

function renderHelpBtn(helpId) {
    if (!HELP_TEXTS[helpId] && !MODULE_LIBRARY.modules.some(m => m.id === helpId)) return '';
    return `<button type="button" class="help-btn" data-help="${helpId}" aria-label="Подсказка: ${helpId}" title="Подробная подсказка">?</button>`;
}

function showHelp(helpId) {
    const h = HELP_TEXTS[helpId];
    const module = MODULE_LIBRARY.modules.find(m => m.id === helpId);
    if (!h && !module) return;
    const data = h || {
        title: module.name,
        what: module.description || 'Описание модуля.',
        future: module.ai_prompt || 'Используй этот модуль для фиксации важного контекста проекта.',
        example: module.example || module.template || 'Заполни поле конкретными фактами, решениями и проверяемыми данными.',
        warning: 'Не оставляй критически важные сведения только в переписке: зафиксируй их в саркофаге.'
    };
    const previousFocus = document.activeElement;
    const modal = document.createElement('div');
    modal.className = 'help-modal';
    modal.setAttribute('role', 'presentation');
    const card = document.createElement('div');
    card.className = 'help-card';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-modal', 'true');
    card.setAttribute('aria-labelledby', 'helpDialogTitle');
    card.setAttribute('tabindex', '-1');
    const heading = document.createElement('h3');
    heading.id = 'helpDialogTitle';
    heading.textContent = `❓ ${data.title}`;
    card.appendChild(heading);
    [['what','📌 Что это'],['future','🔮 Как это работает в будущем'],['example','✅ Пример'],['warning','⚠️ Что будет, если пропустить']].forEach(([key,title]) => {
        const section = document.createElement('section');
        section.className = `help-section ${key}`;
        const h4 = document.createElement('h4'); h4.textContent = title;
        const p = document.createElement('p'); p.textContent = data[key] || '';
        section.append(h4,p); card.appendChild(section);
    });
    const guide = FIELD_GUIDES[helpId];
    if (guide) {
        [['enter','✍️ Что вводить'],['why','🎯 Зачем'],['next','➡️ Что последует'],['action','🧭 Что требуется от тебя']].forEach(([key,title]) => {
            const section = document.createElement('section'); section.className = 'help-section guide-detail';
            const h4 = document.createElement('h4'); h4.textContent = title;
            const p = document.createElement('p'); p.textContent = guide[key] || ''; section.append(h4,p); card.appendChild(section);
        });
    }
    const close = document.createElement('button');
    close.type = 'button'; close.className = 'help-close'; close.textContent = 'Понятно, закрываю';
    const cleanup = () => {
        document.removeEventListener('keydown', onKey);
        modal.remove();
        if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
    };
    close.addEventListener('click', cleanup);
    card.appendChild(close); modal.appendChild(card);
    modal.addEventListener('click', e => { if (e.target === modal) cleanup(); });
    const onKey = e => {
        if (e.key === 'Escape') { e.preventDefault(); cleanup(); return; }
        if (e.key === 'Tab') {
            const focusable = [...card.querySelectorAll('button, a[href], input, textarea, select, [tabindex]:not([tabindex="-1"])')];
            if (!focusable.length) { e.preventDefault(); card.focus(); return; }
            const first = focusable[0], last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    };
    document.addEventListener('keydown', onKey);
    document.body.appendChild(modal);
    close.focus();
}

function attachModuleCheckboxes() {
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', (e) => {
            const id = e.target.id.replace('check_', '');
            const block = document.getElementById(`block_${id}`);
            const textarea = document.getElementById(`input_${id}`);
            const module = MODULE_LIBRARY.modules.find(m => m.id === id);

            // Находим span с текстом надежно, независимо от порядка элементов в label
            const statusSpan = cb.parentElement.querySelector('span');

            if (e.target.checked) {
                block.style.opacity = '1';
                textarea.disabled = false;
                if (statusSpan) statusSpan.textContent = '✅ Модуль активирован';

                // Умный шаблон: подставляем только если поле пустое
                if (!textarea.value.trim() && module) {
                    const template = module.template || module.example || '';
                    if (template) textarea.value = template;
                }

                // Анимация "включения"
                block.style.transform = 'scale(1.02)';
                setTimeout(() => { block.style.transform = ''; }, 200);
            } else {
                block.style.opacity = '0.5';
                textarea.disabled = true;
                if (statusSpan) statusSpan.textContent = 'Включить модуль';
            }

            // 🔒 ЗАЩИТА: сохраняем в стейт только если модуль действительно найден
            if (module) {
                state.data.typeSpecific[`module_${module.id}`] = e.target.checked;
            }

            saveDraft();
        });
    });
}

function renderStage3(container) {
    const o = state.data.optional;

    container.innerHTML = `
        <h2>🧩 Этап 3. Опциональные блоки</h2>

        ${renderYesNo('opt-currentStatus', '3.1 Фактический статус',
            'Отдельный блок с таблицей «что реально работает»',
            'Данных из Этапа 2 достаточно', o.currentStatus)}

        ${renderYesNo('opt-checklists', '3.2 Чек-листы',
            'Добавим рабочие чек-листы',
            'Обходимся без них', o.checklists)}

        ${renderYesNo('opt-risks', '3.3 Риски и ограничения',
            'Выносим отдельным блоком',
            'Риски уже отражены в других разделах', o.risks)}

        ${renderYesNo('opt-changelog', '3.4 История изменений',
            'Фиксируем изменения с предыдущей версии',
            'История не нужна', o.changelog)}

        ${renderYesNo('opt-links', '3.5 Ссылки и деплой',
            'Добавим GitHub, GitHub Pages и т.д.',
            'Ссылок пока нет', o.links)}
    `;
}

function renderStage4(container) {
    container.innerHTML = `
        <h2>🏁 Этап 4. Финализация</h2>
        <div class="question">
            <div class="field-label-row"><label>4.1 Памятка для AI</label>${renderHelpBtn('aiMemo')}</div>
            ${renderGuide('aiMemo')}
            <div class="radio-group">
                ${renderRadioOption('aiMemo', 'standard', 'Стандартная', '«Скинь саркофаг новому AI + скажи, где остановился»')}
                ${renderRadioOption('aiMemo', 'custom', 'Своя', 'Специфические требования')}
            </div>
        </div>
        <div class="question" id="customMemoQuestion" style="display:${state.data.aiMemo === 'custom' ? 'block' : 'none'}">
            <div class="field-label-row"><label>Своя памятка для AI</label>${renderHelpBtn('aiMemo')}</div>
            ${renderGuide('aiMemo')}
            <textarea id="customAiMemo" rows="3">${escapeHtml(state.data.customAiMemo)}</textarea>
        </div>
        <div class="question">
            <div class="field-label-row"><label>4.2 Критически важное</label>${renderHelpBtn('criticalNotes')}</div>
            ${renderGuide('criticalNotes')}
            <div class="hint">Если всё учтено — оставь пустым</div>
            <textarea id="criticalNotes" rows="3">${escapeHtml(state.data.criticalNotes)}</textarea>
        </div>
        <div class="question" style="background:#0f2a1f;border-left-color:#34d399;">
            <label>✅ Всё готово!</label>
            <div class="hint">Нажми «Сгенерировать»</div>
        </div>`;
}

function renderRadioOption(group, value, title, desc) {
    const checked = state.data[group] === value ? 'checked' : '';
    return `<label class="radio-option"><input type="radio" name="${group}" value="${value}" ${checked}><div class="label-text"><div class="label-title">${title}</div><div class="label-desc">${desc}</div></div></label>`;
}

function renderYesNo(id, title, yesDesc, noDesc, currentValue) {
    const key = id.replace('opt-', '');
    const text = (state.data.optionalText && state.data.optionalText[key]) || '';
    const show = currentValue === 'yes';

    // Если выбрано «Да» и поле пустое — подставляем сильный шаблон
    let displayText = text;
    if (show && !text.trim() && OPTIONAL_TEMPLATES[key]) {
        displayText = OPTIONAL_TEMPLATES[key];
    }

    return `
        <div class="question">
            <div class="field-label-row">
                <label>${title}</label>
                ${renderHelpBtn(id)}
            </div>
            ${renderGuide ? renderGuide(id) : ''}
            
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

            <textarea id="opttext_${key}" 
                      class="opt-text" 
                      rows="8" 
                      placeholder="Заполни содержимое блока..." 
                      style="display:${show ? 'block' : 'none'}; margin-top:12px; width:100%;">${escapeHtml(displayText)}</textarea>
        </div>`;
}

function validateStage() {
    const errors = [];
    if (state.currentStage === 0 && !state.data.type) errors.push('Выбери тип проекта');
    if (state.currentStage === 1) {
        if (!state.data.name.trim()) errors.push('Укажи название (1.1)');
        if (!state.data.status) errors.push('Выбери статус (1.4)');
        if (!state.data.philosophy.trim()) errors.push('Заполни философию (1.5)');
        if (!state.data.purpose.trim()) errors.push('Заполни назначение (1.6)');
    }
    if (errors.length) { alert('⚠️ Проверь поля:\n\n' + errors.join('\n')); return false; }
    return true;
}

function saveCurrentStage() {
    if (state.currentStage === 0) {
        const s = document.querySelector('input[name="type"]:checked');
        if (s && s.value !== state.data.type) state.data.typeSpecific = {};
        if (s) state.data.type = s.value;
    } else if (state.currentStage === 1) {
        state.data.name = document.getElementById('name').value;
        state.data.version = document.getElementById('version').value;
        state.data.date = document.getElementById('date').value;
        const ss = document.querySelector('input[name="status"]:checked');
        if (ss) state.data.status = ss.value;
        state.data.philosophy = document.getElementById('philosophy').value;
        state.data.purpose = document.getElementById('purpose').value;
        state.data.architecture = document.getElementById('architecture').value;
    } else if (state.currentStage === 2) {
        MODULE_LIBRARY.modules.forEach(m => {
            const c = document.getElementById(`check_${m.id}`);
            const i = document.getElementById(`input_${m.id}`);
            if (c) state.data.typeSpecific[`module_${m.id}`] = c.checked;
            if (i) state.data.typeSpecific[`input_${m.id}`] = i.value;
        });
    } else if (state.currentStage === 4) {
        const ms = document.querySelector('input[name="aiMemo"]:checked');
        if (ms) state.data.aiMemo = ms.value;
        const customMemo = document.getElementById('customAiMemo');
        if (customMemo) state.data.customAiMemo = customMemo.value;
        state.data.criticalNotes = document.getElementById('criticalNotes').value;
    }
    saveDraft();
}

// ============================================
// ГЕНЕРАЦИЯ MARKDOWN + ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

function generateMarkdown() {
    const d = state.data;
    const typeName = getTypeName(d.type);
    const statusLabel = d.status || 'не указан';

    // ----- SHORT CAPSULE -----
    let short = `### 🟢 SHORT CAPSULE: ${d.name || 'Без названия'} ${d.version || 'v1'} (${d.date})\n`;
    short += `**Статус:** ${statusLabel} | **Тип:** ${typeName}\n\n`;
    short += `**Суть:**\n${(d.purpose || 'не заполнено').trim()}\n\n`;

    const archLines = (d.architecture || '').split('\n').map(l => l.trim()).filter(Boolean);
    short += `**Архитектура:** ${archLines.slice(0, 2).join(' | ') || 'См. полный саркофаг'}\n\n`;

    const firstPrinciple = (d.philosophy || '').split('\n').map(l => l.trim()).filter(Boolean)[0] || 'Руль у пользователя';
    short += `**Главное правило:** ${firstPrinciple}\n\n`;

    const nextStep = extractNextStep(d);
    short += `**Следующий шаг:** ${nextStep}\n\n`;
    short += `*AI-памятка: ${getAiMemoText(d)}*\n`;

    // ----- FULL SARCOPHAGUS -----
    let full = `# 🛡️ ${d.name || 'Без названия'}\n`;
    full += `**Версия саркофага:** ${d.version || 'не указана'}\n`;
    full += `**Дата контрольной точки:** ${d.date}\n`;
    full += `**Статус:** ${statusLabel}\n\n---\n\n`;

    full += `## 🧭 1. Философия / Принципы\n\n`;
    const principles = (d.philosophy || '').split('\n').map(l => l.trim()).filter(Boolean);
    if (principles.length) {
        principles.forEach((p, i) => {
            full += `${i + 1}. ${p}\n`;
        });
    } else {
        full += `_[не заполнено]_\n`;
    }
    full += `\n`;

    full += `## 🎯 2. Назначение\n\n${(d.purpose || '_[не заполнено]_').trim()}\n\n`;
    full += `## 🏗️ 3. Архитектура\n\n${(d.architecture || '_[не заполнено]_').trim()}\n\n---\n\n`;

    full += `## ⚙️ 4. Модули\n\n`;
    full += generateTypeSpecific(d.type, d.typeSpecific);
    full += `\n---\n\n`;

    full += `## 📋 5. Опциональные блоки\n\n`;

    if (d.optional.currentStatus === 'yes') {
        const content = ((d.optionalText && d.optionalText.currentStatus) || '').trim();
        full += `### 5.1 Фактический статус\n\n${content || '_[блок включён, но содержимое не заполнено]_'}\n\n`;
    }

    if (d.optional.checklists === 'yes') {
        const content = ((d.optionalText && d.optionalText.checklists) || '').trim();
        full += `### 5.2 Чек-листы\n\n${content || '_[блок включён, но содержимое не заполнено]_'}\n\n`;
    }

    if (d.optional.risks === 'yes') {
        const content = ((d.optionalText && d.optionalText.risks) || '').trim();
        full += `### 5.3 Известные ограничения и риски\n\n${content || '_[блок включён, но содержимое не заполнено]_'}\n\n`;
    }

    if (d.optional.changelog === 'yes') {
        const content = ((d.optionalText && d.optionalText.changelog) || '').trim();
        full += `### 5.4 История изменений\n\n${content || '_[блок включён, но содержимое не заполнено]_'}\n\n`;
    }

    if (d.optional.links === 'yes') {
        const content = ((d.optionalText && d.optionalText.links) || '').trim();
        full += `### 5.5 Ссылки и деплой\n\n${content || '_[блок включён, но содержимое не заполнено]_'}\n\n`;
    }

    full += `## 🤖 6. Памятка для AI\n\n${getAiMemoText(d)}\n\n`;

    if (d.criticalNotes && d.criticalNotes.trim()) {
        full += `## ⚠️ Критически важное\n\n${d.criticalNotes.trim()}\n\n`;
    }

    full += `---\n\n**Следующий конкретный шаг:** ${nextStep}\n`;

    return { short, full };
}

function getTypeName(type) {
    const names = {
        'A': 'Активный продуктовый',
        'B': 'Экосистема / Семейство приложений',
        'C': 'Закрытый проект / Урок',
        'D': 'Сложное ядро + Compatibility Layer'
    };
    return names[type] || type || 'не выбран';
}

function getAiMemoText(d) {
    if (d.aiMemo === 'custom' && d.customAiMemo && d.customAiMemo.trim()) {
        return d.customAiMemo.trim();
    }
    return 'Скинь этот саркофаг новому AI + скажи, на каком этапе остановился и какую версию конструктора используешь. Сначала прочитай SHORT CAPSULE, потом FULL. Руль у тебя.';
}

function extractNextStep(d) {
    // 1. Ищем в criticalNotes
    if (d.criticalNotes && d.criticalNotes.trim()) {
        const lines = d.criticalNotes.split('\n').map(l => l.trim()).filter(Boolean);
        const found = lines.find(l =>
            /следующ|приоритет|сейчас нужно|next|todo|сделать|деплой|запуш/i.test(l)
        );
        if (found) return found.replace(/^[-•*✅⚠️]+\s*/, '');
    }

    // 2. Ищем в модуле M10 (Дорожная карта)
    const m10 = d.typeSpecific && d.typeSpecific['input_M10'];
    if (m10 && m10.trim()) {
        const lines = m10.split('\n').map(l => l.trim()).filter(Boolean);
        const active = lines.find(l => /🔜|в работе|сейчас|приоритет|следующ/i.test(l));
        if (active) return active.replace(/^[-•*✅⚠️🔜]+\s*/, '');
    }

    return 'Указать конкретный следующий шаг (сейчас не зафиксирован)';
}

function generateTypeSpecific(type, data) {
    let out = '';
    if (!type) return out;

    MODULE_LIBRARY.modules
        .filter(m => m.type.includes(type))
        .forEach(m => {
            const isRequired = m.required || (m.conditional_required_for && m.conditional_required_for.includes(type));
            if (!isRequired && data[`module_${m.id}`] !== true) return;

            const content = data[`input_${m.id}`] || '[не заполнено]';
            out += `### ${m.name} (${m.id})\n${content}\n\n`;
        });

    return out;
}

// Навигация

// ============================================
// НАВИГАЦИЯ И ОБРАБОТЧИКИ
// ============================================

document.getElementById('btnNext').addEventListener('click', () => {
    saveCurrentStage();
    if (!validateStage()) return;
    if (state.currentStage < state.totalStages - 1) { state.currentStage++; saveDraft(); renderStage(state.currentStage); }
});

document.getElementById('btnBack').addEventListener('click', () => {
    saveCurrentStage();
    if (state.currentStage > 0) { state.currentStage--; saveDraft(); renderStage(state.currentStage); }
});

document.getElementById('btnGenerate').addEventListener('click', () => {
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

document.getElementById('btnDownloadShort').addEventListener('click', () => {
    const filename = `SHORT_${safeFilename(state.data.name)}_${safeFilename(state.data.version || 'v1')}.md`;
    downloadFile(window._generatedShort || '', filename);
});

document.getElementById('btnDownloadFull').addEventListener('click', () => {
    const filename = `FULL_${safeFilename(state.data.name)}_${safeFilename(state.data.version || 'v1')}.md`;
    downloadFile(window._generatedFull || '', filename);
});

document.getElementById('btnCopyShort')?.addEventListener('click', () => copyText(window._generatedShort || ''));
document.getElementById('btnCopyFull')?.addEventListener('click', () => copyText(window._generatedFull || ''));

function exportProjectJSON() {
    const payload = { app: 'Sarcophagus Constructor', schemaVersion: 2, exportedAt: new Date().toISOString(), data: state.data };
    downloadFile(JSON.stringify(payload, null, 2), `SARCOPHAGUS_${safeFilename(state.data.name)}.json`, 'application/json');
}
document.getElementById('btnExportJSON')?.addEventListener('click', exportProjectJSON);
document.getElementById('btnExportJSONResult')?.addEventListener('click', exportProjectJSON);
document.getElementById('btnImportJSON')?.addEventListener('click', () => document.getElementById('importJSONFile').click());
document.getElementById('importJSONFile')?.addEventListener('change', async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
        if (file.size > 2 * 1024 * 1024) throw new Error('Файл больше 2 МБ');
        const parsed = JSON.parse(await file.text());
        const imported = validateImportedProject(parsed);
        if (!confirm('Импорт заменит текущий черновик. Перед импортом рекомендуется сохранить текущий JSON. Продолжить?')) return;
        state.data = normalizeProjectData(imported);
        state.currentStage = 0;
        saveDraft();
        document.getElementById('result').style.display = 'none';
        document.getElementById('wizard').style.display = 'block';
        document.querySelector('.controls').style.display = 'flex';
        renderStage(0);
        alert('Проект импортирован. Проверь данные перед генерацией.');
    } catch (error) {
        alert(`Не удалось импортировать JSON: ${error.message}`);
    } finally {
        event.target.value = '';
    }
});

function safeFilename(value) {
    return String(value || 'sarcophagus').trim().replace(/[^\p{L}\p{N}_-]+/gu, '_').replace(/^_+|_+$/g, '').slice(0, 70) || 'sarcophagus';
}
async function copyText(value) {
    try {
        await navigator.clipboard.writeText(value);
        alert('Скопировано в буфер обмена.');
    } catch {
        alert('Браузер запретил доступ к буферу. Используй скачивание файла.');
    }
}

document.getElementById('btnRestart').addEventListener('click', () => {
    if (confirm('Начать новый саркофаг?')) { localStorage.removeItem(DRAFT_KEY); location.reload(); }
});

function downloadFile(content, filename, mimeType = 'text/markdown;charset=utf-8') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.style.display = 'none';
    document.body.appendChild(a); a.click(); a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

document.getElementById('wizard').addEventListener('change', (e) => {
    const t = e.target;
    if (t.name === 'type') { state.data.type = t.value; saveDraft(); }
    else if (t.name === 'status') { state.data.status = t.value; saveDraft(); }
    else if (t.name === 'aiMemo') {
        state.data.aiMemo = t.value;
        const box = document.getElementById('customMemoQuestion');
        if (box) box.style.display = t.value === 'custom' ? 'block' : 'none';
        saveDraft();
    }
});

document.getElementById('wizard').addEventListener('click', (e) => {
    const yn = e.target.closest('.yes-no-option');
    if (!yn) return;

    const id = yn.dataset.id;
    const value = yn.dataset.value;
    const key = id.replace('opt-', '');

    // Сохраняем выбор
    state.data.optional[key] = value;

    // Визуальное выделение
    yn.parentElement.querySelectorAll('.yes-no-option').forEach(s => s.classList.remove('selected'));
    yn.classList.add('selected');

    const ta = document.getElementById('opttext_' + key);
    if (!ta) return;

    if (value === 'yes') {
        ta.style.display = 'block';

        // Если поле пустое — подставляем сильный шаблон
        if (!ta.value.trim() && OPTIONAL_TEMPLATES[key]) {
            ta.value = OPTIONAL_TEMPLATES[key];
            // Сразу сохраняем в state
            if (!state.data.optionalText) state.data.optionalText = {};
            state.data.optionalText[key] = ta.value;
        }
    } else {
        ta.style.display = 'none';
    }

    saveDraft();
});

document.getElementById('wizard').addEventListener('input', (e) => {
    const t = e.target;
    const fieldMap = {
        name: 'name', version: 'version', date: 'date',
        philosophy: 'philosophy', purpose: 'purpose', architecture: 'architecture',
        criticalNotes: 'criticalNotes', customAiMemo: 'customAiMemo'
    };
    if (fieldMap[t.id]) {
        state.data[fieldMap[t.id]] = t.value;
        saveDraft();
        return;
    }
    if (t.id.startsWith('input_M')) {
        state.data.typeSpecific[t.id.replace('input_', 'input_')] = t.value;
        saveDraft();
        return;
    }
    if (t.classList && t.classList.contains('opt-text')) {
        const key = t.id.replace('opttext_', '');
        state.data.optionalText[key] = t.value;
        saveDraft();
    }
});

// Стили карточек модулей (v2.0) — инжектим, чтобы не править HTML
(function injectModuleCardStyles() {
    if (document.getElementById('moduleCardStyles')) return;
    const css = `
        .module-card { display: flex; gap: 16px; background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 16px; margin-bottom: 16px; transition: opacity 0.2s, transform 0.2s; }
        .module-icon { width: 48px; height: 48px; object-fit: contain; flex-shrink: 0; }
        .module-content { flex: 1; min-width: 0; }
        .module-header { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 6px; }
        .module-name { font-weight: 700; font-size: 16px; color: #e2e8f0; }
        .module-badge { font-size: 11px; padding: 2px 8px; border-radius: 10px; }
        .module-badge.required { background: #3b2f0b; color: #fbbf24; }
        .module-badge.optional { background: #1e3a8a; color: #93c5fd; }
        .help-btn { background: none; border: 1px solid #475569; color: #94a3b8; border-radius: 8px; padding: 2px 8px; cursor: pointer; font-size: 12px; }
        .help-btn:hover { color: #e2e8f0; border-color: #64748b; }
        .module-description { color: #94a3b8; font-size: 14px; margin-bottom: 12px; }
        .module-textarea { width: 100%; box-sizing: border-box; background: #0f172a; color: #e2e8f0; border: 1px solid #334155; border-radius: 8px; padding: 10px; font-family: inherit; }
        .module-textarea:disabled { opacity: 0.5; }
    `;
    const style = document.createElement('style');
    style.id = 'moduleCardStyles';
    style.textContent = css;
    document.head.appendChild(style);
})();

// Единый обработчик контекстных подсказок для полей и модулей
document.getElementById('wizard').addEventListener('click', (e) => {
    const helpBtn = e.target.closest('.help-btn');
    if (!helpBtn) return;
    showHelp(helpBtn.dataset.help);
});

// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================

loadDraft();
renderStage(state.currentStage);