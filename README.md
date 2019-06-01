# RotorJS

This is a beta-stage component-based JavaScript library for single-page applications and an example application.

[![npm version](https://badge.fury.io/js/rotorjs.svg)](http://badge.fury.io/js/rotorjs)

## Installation

```sh
npm install rotorjs
```

(Note: an ECMAScript 6+ & ESM-compatible environment is required.)

**Note**: current version of RotorJS is 0.7.0. But it [doesn't work](https://github.com/kuraga/rotorjs/tree/master/BLOCKERS.md).
So current published version is [0.5.2](https://github.com/kuraga/rotorjs/releases/tag/v0.5.2) but it has been rewritten completely.

## Philosophy

RotorJS provides classes which represent an application and its components.

It uses exchangeble "middlewares" under the hood.
A middleware consist of a model class, a rendering loop class and (possible) other classes.
You can use your own middlewares so RotorJS is DOM-agnostic, model-agnostic, etc.

A component is a subclass of RotorJS class, it has to provide a render function.
Component's state (model) is available during render.
Components may also have their activating and deactivating hooks.
Subcomponents are supported.

Application is also a subclass of a RotorJS class.
You may implement application's start and stop hooks but default start hook receives a root component.

A target object (e.g. DOM tree) is available after application has been started.
It is changed during some component's state updating.
So target is "current view" of application.

Some additional features are also provided.

## Approaches

* minimalism,
* modularity,
* testability,
* (not yet) documentability,
* isomorphism,
* ECMAScript 6 & ESM.

## Default middleware

Default middleware is based on [Freezer](https://github.com/arqex/freezer) and [Snabbdom](https://github.com/snabbdom/snabbdom).
So your application uses unidirectional dataflow, immutable state and provides DOM target with default middleware.

You simple have to append application's target to your document's body and use
[Snabbdom's helpers](https://github.com/snabbdom/snabbdom#helpers) to construct component's view.
See [example](https://github.com/kuraga/rotorjs/tree/master/example) for more information.

## Getting started

TODO

## Example

See <https://github.com/kuraga/rotorjs/tree/master/example>.

## See also

* [DBMON RotorJS](http://mathieuancelin.github.io/js-repaint-perfs/rotorjs/index.html),
* [DBMON RotorJS (with using VnodeImmutableThunk)](http://mathieuancelin.github.io/js-repaint-perfs/rotorjs/with_thunks.html).

## Author

Alexander Kurakin <<kuraga333@mail.ru>>

## Inspired by

* [mercury](https://github.com/Raynos/mercury),
* [Cycle.js](https://github.com/staltz/cycle),
* [Omniscient](http://omniscientjs.github.io),
* [React](http://facebook.github.io/react),
* [Preact](http://developit.github.io/preact),
* [Zorium](https://github.com/Zorium/zorium).
* [Freezer](https://github.com/arqex/freezer),
* [virtual-dom](https://github.com/Matt-Esch/virtual-dom),
* [route-trie](https://github.com/zensh/route-trie),
* [Snabbdom](https://github.com/snabbdom/snabbdom).

## Feedback and contribute

<https://github.com/kuraga/rotorjs/issues>

## License

MIT
