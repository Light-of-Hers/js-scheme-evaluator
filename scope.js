"use strict";

const { assert } = require("./util");

class Scope {
    constructor(outer = null, init_map = new Map()) {
        this.outer = outer;
        this.map = init_map;
    }

    define_value(k, v) {
        k = String(k);
        assert(!this.map.has(k), `redefination of variable ${k}`);
        this.map.set(k, v);
    }

    set_value(k, v) {
        k = String(k);
        this.map.set(k, v);
    }

    get_value(k) {
        const v = this.map.get(k);
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
