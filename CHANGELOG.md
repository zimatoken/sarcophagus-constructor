# Changelog

## 2.1.0 — 2026-11-18
- Усилена основная браузерная версия `web-v2`.
- Исправлено соответствие диагностических алиасов ID модулей.
- Исправлено восстановление текущего этапа после диагностики и перезагрузки.
- Добавлены нормализация и версионирование черновика.
- Добавлены JSON import/export и копирование SHORT/FULL.
- Добавлено экранирование пользовательских значений в HTML-шаблонах.
- Добавлена пользовательская памятка AI.
- Добавлены локальный сервер, статические проверки, Node.js тесты и документация аудита.
- Сохранена классическая версия v1.4.

## 2.1.1 — 2026-11-18
- Исправлено вычисление корневого пути проекта в тестах и статическом checker через `fileURLToPath(new URL(...))`; устранён Windows-дефект с повторным префиксом диска (`E:\E:\...`).
- Повторно выполнены все автоматические тесты и статическая проверка после исправления.


## 2.2.0 — восстановление контекстной помощи и фирменный стиль
- Возвращена полная база контекстных подсказок из классической версии v1.4.
- Подсказки доступны на этапах выбора типа, обязательного ядра, опциональных блоков и финализации.
- Подсказки модулей открываются в едином безопасном модальном окне.
- Исправлен визуальный стиль переключателей режимов и кнопок помощи.
- Добавлен фирменный логотип в заголовок, launcher и favicon.
- Классическая версия v1.4 оставлена без изменений.

## 2.3.0 — Guided Edition
- Добавлены большие постоянно видимые шпаргалки ко всем фиксированным полям мастера.
- Для всех 30 модулей шпаргалки формируются из фактического описания и примера/шаблона библиотеки.
- Каждая шпаргалка объясняет, что вводить, зачем это нужно, что произойдёт дальше, что требуется от пользователя и приводит пример ориентира.
- Расширено содержимое модального окна `?` практическими инструкциями.
- Добавлено отдельное руководство пользователя `docs/USER_GUIDE_v1.0.md`.
- Сохранены структура данных, IDs модулей, сценарий мастера, импорт/экспорт и локальное сохранение.


## v2.4.0 — Production Hardening

- Hardened JSON import: validates application marker, supported schema versions, root/data object shape, field types, and project type before replacing the current draft.
- Normalizes imported data through explicit field allowlists and per-field length limits; unknown module keys are discarded.
- Improved help dialog accessibility: semantic dialog attributes, focus placement/restoration, Tab focus containment, Escape/backdrop/close cleanup, and listener removal.
- Clarified that Diagnostic mode is a local keyword heuristic, not an AI service or expert assessment.
- Added keyboard focus styling and narrow-screen layout refinements.
- Added regression tests for import validation, normalization, complex draft restore, FULL output filtering, help-dialog lifecycle, and all 30 module definitions.
- Preserved the existing v2.3.0 wizard, module library, project flow, and generation model; no dependencies or backend added.
