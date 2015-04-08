'use strict';

// EmitterHook may be used with virtual-dom/virtual-hyperscript.

module.exports = EmitterHook;

// NOTE: emmiter should have emit function
function EmitterHook(emitter) {
    if (!(this instanceof EmitterHook)) {
        return new EmitterHook(emitter);
    }

    this.emitter = emitter;
    this.eventName = null;
    this.eventemitter = null;
    this.eventCallback = EmitterHook.prototype.bubble.bind(this);
}

EmitterHook.prototype.hook = function (node, propertyName) {
    this.eventName = 'on' + propertyName.substr(6);
    node[this.eventName] = this.eventCallback;
};

EmitterHook.prototype.unhook = function(node, propertyName) {
    node[this.eventName] = undefined;
};

EmitterHook.prototype.bubble = function (event) {
    this.emitter.emit(event);
};
