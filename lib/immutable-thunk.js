import deepEqual from 'deep-equal';

// ImmutableThunk may be used with virtual-dom/vnode.

// TODO: should we use `==` or `===` to check equality?
export default function ImmutableThunk(fn, args, eqArgs = deepEqual) {
    this.fn = fn;
    this.args = args;
    this.eqArgs = eqArgs;
}

ImmutableThunk.prototype.type = 'Thunk';

ImmutableThunk.prototype.render = function render(previous) {
    if (shouldUpdate(this, previous)) {
        return this.fn.apply(null, this.args);
    } else {
        return previous.vnode;
    }

    function shouldUpdate(current, previous) {
        return ( !current || !previous /* || current.fn !== previous.fn */ ||
            !current.eqArgs(current.args, previous.args) );
    }
};
