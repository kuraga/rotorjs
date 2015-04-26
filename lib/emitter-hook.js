// `EmitterHook` may be used with virtual-dom/virtual-hyperscript.
export default class EmitterHook {

  // NOTE: `emitter` should have emit function
  constructor(emitter) {
    this.emitter = emitter;
    this.eventName = null;
    this.eventCallback = EmitterHook.prototype.bubble.bind(this);
  }

  hook(node, propertyName) {
    this.eventName = 'on' + propertyName.substr(6);
    node[this.eventName] = this.eventCallback;
  }

  unhook(node, propertyName) {
    node[this.eventName] = undefined;
  }

  bubble(event) {
    this.emitter.emit(event);
  }

};
