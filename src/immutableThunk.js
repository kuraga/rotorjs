import deepEqual from 'deep-equal';

// `ImmutableThunk` may be used with virtual-dom/vnode.
export default class ImmutableThunk {

  type = 'Thunk';

  constructor(fn, args, thunkProto = {}, equalArgs = undefined, equalRenders = undefined) {
    this.fn = fn;
    this.args = args;
    Object.keys(thunkProto).forEach((key) => {
      this[key] = thunkProto[key];
    });
    this.equalArgs = equalArgs || defaultEqualArgs;
    this.equalRenders = equalRenders || defaultEqualRenders;

    function defaultEqualArgs(first, second) {
      return deepEqual(first, second, { strict: true });
    }

    function defaultEqualRenders(first, second) {
      return true;
    }
  }

  render(previous) {
    if (shouldUpdate(this, previous)) {
      return this.fn.apply(null, this.args);
    } else {
      return previous.vnode;
    }

    function shouldUpdate(current, previous) {
      return (
        !current || !previous ||
        !current.equalRenders(current.fn, previous.fn) ||
        !current.equalArgs(current.args, previous.args)
      );
    }
  }

};
