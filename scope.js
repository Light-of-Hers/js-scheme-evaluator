const { assert } = require("./util");

class Scope {
    constructor(outer = null) {
        this.outer = outer;
        this.map = new Map();
    }

    define_value(k, v) {
        assert(!this.map.has(k));
        this.map.set(k, v);
    }

    set_value(k, v) {
        this.map.set(k, v);
    }

    get_value(k) {
        const v = this.map.get(k);
        assert(v != untouchable);
        return v;
    }

    static lookup(scope, k) {
        if (scope === null)
            return undefined;
        const v = scope.get_value(k);
        return v === undefined ? this.lookup(scope.outer, k) : v;
    }
}

module.exports = {
    Scope,
}
