В зависимостях присутствуют проблемы, которые покаи не решены.
В этот файл вносится информация о них, в коммите, где возникает проблема.

* Не происходит сборка примера, поскольку в `node-glob` присутствует проблема:
  [isaacs/node-glob#365](https://github.com/isaacs/node-glob/issues/365).
  В коде имеются циклические зависимости, что вызывает неправильную транспиляцию кода примера `rollup`.
  Предложено исправление: [isaacs/node-glob#374](https://github.com/isaacs/node-glob/issues/374).

* Не происходит сборка браузерных тестов; не происходит сборка примера,
  поскольку в `rollup-plugin-node-globals` присутствует проблема:
  [calvinmetcalf/rollup-plugin-node-globals#20](https://github.com/calvinmetcalf/rollup-plugin-node-globals/issues/20).
  При наличии в транспилируемом коде зависимостей `process`, возникает ошибка траспилирования.

* Не происходит сборка примера, поскольку в `gulp-rollup` присутствует проблема:
  [mcasimir/gulp-rollup#75](https://github.com/mcasimir/gulp-rollup/pull/75).
  Используется старая версия `rollup`, из-за чего не транспилируются ECMAScript2019-код примера.
  Предложено решение проблемы: [mcasimir/gulp-rollup#76](https://github.com/mcasimir/gulp-rollup/pull/76).
