# RotorJS concept

## About

This is a *early development concept* of a JavaScript library for rich JavaScript applications and an example application.

## Usage

```sh
npm install
./build.sh
open index.html
```

## Philosophy

I don't know the future of this code but I know keywords describe my thoughts:

* model,
* view,
* presenter / controller / intent,
* router,
* functional reactive programming,
* unidirectional dataflow,
* immutable state,
* main loop,
* events,
* streams,
* ECMAScript 6,
* minimalism,
* (not yet) testability,
* (not yet) isomorphic,
* [JSX](https://github.com/alexmingoia/jsx-transform),
* (not yet) ["directives"](http://wix.github.io/react-templates),
* ["thunks"](https://github.com/Raynos/vdom-thunk),
* (maybe) Web Components.

## Dependencies

Dependency | Usage
---------- | -----
[virtual-dom](https://github.com/Matt-Esch/virtual-dom) | DOM rendering
[freezer-js](https://github.com/arqex/freezer) | Immutable data state
[main-loop](https://github.com/Raynos/main-loop) | Application loop
[kefir](http://pozadi.github.io/kefir) | Data streams
[vdom-thunk](https://github.com/Raynos/vdom-thunk) | "Thunks"
[route-trie](https://github.com/zensh/route-trie) | Routes matching

## Development dependencies

Dependency | Usage
---------- | -----
[jsx-transform](https://github.com/alexmingoia/jsx-transform) | JSX sugar
[browserify](http://browserify.org/) | Modules system
[babel](https://babeljs.io) | For ECMAScript 6

## Author

Alexander Kurakin <<kuraga333@mail.ru>>


## Feedback and contribute

<https://github.com/kuraga/rotorjs-concept>

## License

MIT
