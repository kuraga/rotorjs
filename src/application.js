export default function getApplicationClass(Cursor, Loop) {
  class Application {
    constructor() {
      this.__redrawBinded = this.redraw.bind(this);
      this.__cursorUpdatedHandler = () => { this.redraw() };
      this.__renderBinded = this.render.bind(this);
    }

    start(rootComponent) {
      let rootComponentName = rootComponent.name;
      let initialState = {
        rootComponentName,
        __subcomponents: {
          [rootComponentName]: rootComponent.initialState
        }
      };
      this.__cursor = new Cursor(initialState);

      this.rootComponent.activate();

      this.__loop = new Loop(this.__renderBinded);

      this.__cursor.subscribe(this.__cursorUpdatedHandler);
    }

    stop() {
      this.rootComponent.deactivate();

      this.__cursor.unsubscribe(this.__cursorUpdatedHandler);
    }

    get target() {
      return this.__loop.target;
    }

    render() {
      return this.rootComponent.render();
    }

    redraw() {
      this.__loop.redraw();
    }

    get __state() {
      return this.__cursor.get();
    }

    get rootComponent() {
      let rootComponentName = this.__state.rootComponentName;
      let rootComponentState = this.__state.__subcomponents[rootComponentName];
      return rootComponentState.component;
    }

    getComponentState(path) {
      if (path.length == 0) {
        throw new Error('Incorrect component path');
      }

      let result = this.__state;
      for (let chunk of path) {
        result = result.__subcomponents[chunk];
      }

      return result;
    }
  }

  return Application;
}
