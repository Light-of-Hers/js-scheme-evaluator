"use strict";

const { assert } = require("./util");

class Value {
    eq(v) { return this === v; }
    eqv(v) { return this.eq(v); }
    equal(v) { return this.eqv(v); }

    toString() { return String(this); }

    static eq(a, b) {
        assert(a instanceof Value && b instanceof Value);
        return a.eq(b);
    }
    static eqv(a, b) {
        assert(a instanceof Value && b instanceof Value);
        return a.eqv(b);
    }
    static equal(a, b) {
        assert(a instanceof Value && b instanceof Value);
        return a.equal(b);
    }
}

class Nil extends Value {
    toString() {
        return "()";
    }
}

class Pair extends Value {
    constructor(head, tail) {
        super();
        assert(head instanceof Value && tail instanceof Value);
        this.head = head;
        this.tail = tail;
    }

    equal(v) {
        if (v instanceof Pair) {
            return equal(this.head, v.head) && equal(this.tail, v.tail);
        } else {
            return false;
        }
    }

    toString() {
        let cur = this;
        let s = "(";
        while (true) {
            s += cur.head.toString();
            if (eq(cur.tail, nil)) {
                break;
            } else if (pair_p(cur.tail)) {
                s += " ";
                cur = cur.tail;
            } else {
                s += " . " + cur.tail.toString();
                break;
            }
        }
        s += ")";
        return s;
    }
}

class Immediate extends Value {
    constructor(imm) {
        super();
        assert(this._valid(imm));
        this.imm = imm;
    }
    _valid(imm) {
        return true;
    }
    eq(v) {
        if (this.constructor === v.constructor) {
            return this.imm === v.imm;
        } else {
            return false;
        }
    }
    eqv(v) {
        if (this.constructor === v.constructor) {
            return this.imm == v.imm;
        } else {
            return false;
        }
    }
    toString() {
        return String(this.imm);
    }
}

class Number extends Immediate {
    _valid(imm) {
        return typeof imm === "number" || imm instanceof globalThis.Number;
    }
}

class Boolean extends Immediate {
    _valid(imm) {
        return typeof imm === "boolean" || imm instanceof globalThis.Boolean;
    }
}

class Symbol extends Immediate {
    _valid(imm) {
        return typeof imm === "string" || imm instanceof globalThis.String;
    }
}


class Procedure extends Value { }

class Closure extends Procedure {
    constructor(params, body, scope) {
        super();
        this.params = params;
        this.body = body;
        this.scope = scope;
    }
}

class Primitive extends Procedure {
    constructor(func) {
        super();
        this.func = func;
    }
}

const nil = new Nil;

const nil_p = v => v instanceof Nil;
const pair_p = v => v instanceof Pair;
const number_p = v => v instanceof Number;
const boolean_p = v => v instanceof Boolean;
const symbol_p = v => v instanceof Symbol;
const procedure_p = v => v instanceof Procedure;

const eq = Value.eq;
const eqv = Value.eqv;
const equal = Value.equal;

const cons = (a, b) => new Pair(a, b);
const car = p => p.head;
const cdr = p => p.tail;
const set_car = (p, v) => p.head = v
const set_cdr = (p, v) => p.tail = v

module.exports = {
    Pair,
    Number,
    Boolean,
    Symbol,
    Closure,
    Primitive,

    nil,

    nil_p,
    pair_p,
    number_p,
    boolean_p,
    symbol_p,
    procedure_p,

    eq,
    eqv,
    equal,

    cons,
    car,
    cdr,
    set_car,
    set_cdr,
}
