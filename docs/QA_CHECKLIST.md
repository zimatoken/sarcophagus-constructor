# Ручной QA-чек-лист v2.1

- [ ] Открыть корневой `index.html`, перейти в v2.1.
- [ ] Выбрать тип A, B, C, D; убедиться, что выбор сохраняется после переходов назад/вперёд.
- [ ] Заполнить поля этапа 1, включая кавычки, `<script>`, `&` и кириллицу; убедиться, что текст отображается как текст, а не исполняется.
- [ ] На этапе 2 включить и выключить несколько модулей; заполнить тексты.
- [ ] Проверить, что все обязательные модули попадают в FULL, выбранные опциональные — тоже, выключенные — нет.
- [ ] Проверить каждую опцию этапа 3: Да показывает textarea, Нет скрывает; текст попадает в FULL.
- [ ] Выбрать стандартную памятку, затем свою; заполнить текст и убедиться, что он попал в FULL.
- [ ] Перезагрузить страницу на каждом этапе и проверить восстановление черновика.
- [ ] Пройти диагностический режим по игровому, веб-, мобильному и общему описанию; убедиться, что рекомендованные модули отмечены корректными ID.
- [ ] Сгенерировать SHORT и FULL; проверить копирование и скачивание.
- [ ] Экспортировать JSON; очистить черновик; импортировать JSON; сверить данные.
- [ ] Попробовать некорректный JSON и файл больше 2 MB — импорт должен быть отклонён с понятным сообщением.
- [ ] Проверить desktop и mobile viewport, клавиатурный фокус.
- [ ] Открыть классическую v1.4 и убедиться, что она по-прежнему доступна.

## Проверки командой

```bash
npm test
npm run check
```


## v2.2.0 — дополнительная проверка интерфейса
- [ ] На каждом релевантном поле есть кнопка `?`, открывающая подробную подсказку.
- [ ] Подсказки этапа 0, этапа 1, этапа 3 и этапа 4 соответствуют оригинальным текстам v1.4.
- [ ] Кнопки `Обычный режим` и `Диагност` оформлены в общей теме; активный режим визуально выделен.
- [ ] Кнопки помощи имеют единый стиль и работают мышью/клавиатурой.
- [ ] Логотип отображается в шапке и на стартовой странице; favicon виден во вкладке.
- [ ] Импорт/экспорт JSON и восстановление черновика работают после обновления.


## v2.4.0 Production Hardening Regression

- [ ] Import valid v2 JSON and confirm all fields/modules/optional sections restore.
- [ ] Reject foreign `app`, unsupported `schemaVersion`, wrong field types, invalid project type, arrays as root/data.
- [ ] Confirm failed import leaves the current draft unchanged.
- [ ] Confirm text fields over configured limits are truncated safely during normalization.
- [ ] Save a project with all module fields and optional sections, reload, and restore the final stage.
- [ ] Generate FULL and verify required + selected modules appear, disabled optional modules do not, and enabled optional sections appear.
- [ ] Open and close help using close button, backdrop, and Escape; confirm focus returns and Tab remains inside the dialog.
- [ ] Test at 375px, 414px, 768px and desktop widths; confirm no horizontal overflow.
- [ ] Test keyboard-only navigation and visible focus.
- [ ] Confirm Diagnostic labels do not claim an AI service is running.
