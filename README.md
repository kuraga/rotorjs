# RotorJS concept

## About

This is an *early development concept* of a JavaScript library for rich JavaScript applications and an example application.

## Example

<https://github.com/kuraga/rotorjs/tree/master/example>

## Philosophy

Entities:

* model,
* view (render),
* main loop,
* data streams,
* router.

Approaches:

* minimalism and simplicity,
* (not yet) testability,
* (not yet) isomorphic,
* unidirectional dataflow,
* immutable state,
* functional reactive programming,
* ECMAScript 6.

Additional features:

* ["thunks"](https://github.com/Raynos/vdom-thunk),
* [JSX](https://github.com/alexmingoia/jsx-transform).

Possible future additional features:

* dependency injection,
* ["directives"](http://wix.github.io/react-templates),
* Web Components.

## Dependencies

Dependency | Usage
---------- | -----
[virtual-dom](https://github.com/Matt-Esch/virtual-dom) | DOM rendering
[freezer-js](https://github.com/arqex/freezer) | Immutable data state
[main-loop](https://github.com/Raynos/main-loop) | Application loop
[kefir](http://pozadi.github.io/kefir) | Data streams
[route-trie](https://github.com/zensh/route-trie) | Routes matching

## Development dependencies

Dependency | Usage
---------- | -----
[babel](https://babeljs.io) | For ECMAScript 6
[gulp.js](http://gulpjs.com) | Development automation

## Author

Alexander Kurakin <<kuraga333@mail.ru>>

## Inspired by

* [mercury](https://github.com/Raynos/mercury),
* [Cycle.js](https://github.com/staltz/cycle),
* [Omniscient](http://omniscientjs.github.io),
* [React](http://facebook.github.io/react),
* [Zorium](https://github.com/Zorium).

## Feedback and contribute

<https://github.com/kuraga/rotorjs/issues>

## License

MIT
