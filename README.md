# RotorJS (concept)

This is an *early development concept* of a JavaScript library for rich JavaScript applications and an example application.

## Philosophy

Entities:

* model,
* view (renderer),
* main loop,
* router.

Approaches:

* minimalism and simplicity,
* unidirectional dataflow,
* immutable state,
* functional reactive programming,
* (not yet) testability and (not yet) documentability,
* (not yet) isomorphic,
* ECMAScript 2016.

## Example

See <https://github.com/kuraga/rotorjs/tree/master/example>.

## Dependencies

Dependency | Usage
---------- | -----
[virtual-dom](https://github.com/Matt-Esch/virtual-dom) | DOM rendering
[Freezer](https://github.com/arqex/freezer) | Immutable data state
[main-loop](https://github.com/Raynos/main-loop) | Application loop
[route-trie](https://github.com/zensh/route-trie) | Routes matching

## Author

Alexander Kurakin <<kuraga333@mail.ru>>

## Inspired by

* [mercury](https://github.com/Raynos/mercury),
* [Cycle.js](https://github.com/staltz/cycle),
* [Omniscient](http://omniscientjs.github.io),
* [React](http://facebook.github.io/react),
* [Zorium](https://github.com/Zorium/zorium).

## Feedback and contribute

<https://github.com/kuraga/rotorjs/issues>

## License

MIT
