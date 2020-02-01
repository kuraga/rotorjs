В зависимостях присутствуют проблемы, которые покаи не решены.
В этот файл вносится информация о них, в коммите, где возникает проблема.

* Не вполняются серверные тесты, и не ппроисходит сборка примера, поскольку в `snabbdom` присутствует проблема:
  там используется некорректный с точки зрения ESM код. Смотрите следующие тикеты:
  [snabbdom/snabbdom#200](https://github.com/snabbdom/snabbdom/pull/200),
  [snabbdom/snabbdom#225](https://github.com/snabbdom/snabbdom/pull/225),
  [snabbdom/snabbdom#247](https://github.com/snabbdom/snabbdom/pull/247),
  [snabbdom/snabbdom#261](https://github.com/snabbdom/snabbdom/pull/261),
  [snabbdom/snabbdom#312](https://github.com/snabbdom/snabbdom/pull/312),
  [snabbdom/snabbdom#319](https://github.com/snabbdom/snabbdom/pull/319),
  [snabbdom/snabbdom#338](https://github.com/snabbdom/snabbdom/pull/338).

* Не происходит сборка браузерных тестов, и не происходит сборка примера,
  поскольку в `rollup-plugin-node-globals` присутствует проблема:
  [calvinmetcalf/rollup-plugin-node-globals#23](https://github.com/calvinmetcalf/rollup-plugin-node-globals/issues/23).
  Выражения `__dirname` и `__filename` транспилируются неверно.

* Не происходит сборка браузерных тестов, поскольку в `rollup-plugin-node-globals` присутствует проблема:
  [calvinmetcalf/rollup-plugin-node-globals#20](https://github.com/calvinmetcalf/rollup-plugin-node-globals/issues/20).
  Проблема проявляется при транспиляции ESM-файлов.

* Не происходит сборка браузерных тестов, поскольку в `node-glob` присутствует проблема:
  [isaacs/node-glob#365](https://github.com/isaacs/node-glob/issues/365).
  В коде имеются циклические зависимости, что вызывает неправильную транспиляцию кода примера `rollup`.
  Предложено исправление: [isaacs/node-glob#374](https://github.com/isaacs/node-glob/issues/374).
