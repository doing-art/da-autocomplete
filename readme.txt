1. Инструкция по запуску приложения.

1) Открыть консоль и перейти в корень проекта.
2) Выпонить установку пакетов (ввести команду yarn install). Для работы команды необходимо, чтобы на устройстве был установлен Node Js, yarn.
Если возникли трудности с установокой yarn, можно запустить команду npm install, так как пакетный менеджеры работают с одним и тем же хранилищем.
3) После установки пакетов необходимо запустить сервре Node JS. Для этого необходимо перейти в папку "/lib" и выполнить команду "node server".
После запуска сервера оставить консоль в рабочем состоянии.
4) Ввести в адресной строке браузера http://localhost:3000/.

--------------------------------------------------------------------------------------------------------------------------------------------------

2. Особенности.

Функционал по фильтрации выполняется на серверной стороне приложения. Без запуска сервера приложение фильтраия и выборка данных производиться не будут.

--------------------------------------------------------------------------------------------------------------------------------------------------

3. Структура проекта.

В папке "src" хронится исходный код (sass/js). 
В папке "lib" - скомпилированные webpack'ом исходники. Также серверный код в файле server.js, и пример использования автокомплита в папке example.

--------------------------------------------------------------------------------------------------------------------------------------------------

4. Обусловленность выбора технологий.

Логика элемента урпавления написана на нативном JS. Это позволяет избежать лишних зависимостей и дает возможность легко интегрировать виджет в любое 
клиентское приложение, написанное будь то с использованием современных фреймворков(react, angular, vie.js...), либо с использованием клиентских библиотек (jquery).