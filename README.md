# RotorJS

This is a beta-stage component-based JavaScript library for single-page applications and an example application.

## Philosophy

RotorJS provides classes which represent an application and its components.

It uses exchangeble "middlewares" under the hood.
A middleware consist of a model class, a rendering loop class and (possible) other classes.
You can use your own middlewares so RotorJS is DOM-agnostic, model-agnostic, etc.

A component is a subclass of RotorJS class, it has to provide a render function.
Component's state (model) is available during render.
Components may also have their activating and deactivating hooks.
Subcomponents are supported.

Application is also a subclass RotorJS class.
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
* ECMAScript 2015.

## Default middleware

Default middleware is based on [Freezer](https://github.com/arqex/freezer) and [virtual-dom](https://github.com/Matt-Esch/virtual-dom).
So your application uses unidirectional dataflow, immutable state and provides DOM target with default middleware.

You simple have to append application's target to your document's body and use virtual-dom's
[virtual-hyperscript](https://github.com/Matt-Esch/virtual-dom/tree/master/virtual-hyperscript) to construct component's view.
See [example](https://github.com/kuraga/rotorjs/tree/master/example) for more information.

## Get started

TODO

## Example

See <https://github.com/kuraga/rotorjs/tree/master/example>.

## Author

Alexander Kurakin <<kuraga333@mail.ru>>

## Inspired by

* [mercury](https://github.com/Raynos/mercury),
* [Cycle.js](https://github.com/staltz/cycle),
* [Omniscient](http://omniscientjs.github.io),
* [React](http://facebook.github.io/react),
* [Preact](http://developit.github.io/preact),
* [Zorium](https://github.com/Zorium/zorium).

## Feedback and contribute

<https://github.com/kuraga/rotorjs/issues>

## License

MIT
