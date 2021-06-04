"use strict";

const { assert } = require("./util");

class Value {
    eq(v) { return this === v; }
    eqv(v) { return this.eq(v); }
    equal(v) { return this.eqv(v); }

    toString() { return `[${this.constructor.name}]`; }

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

    [globalThis.Symbol.iterator]() {
        assert(false);
    }
}

class Nil extends Value {
    toString() {
        return "()";
    }

    *[globalThis.Symbol.iterator]() { }
}

class Pair extends Value {
    constructor(head, tail) {
        super();
        assert(head instanceof Value && tail instanceof Value, `${head}, ${tail}`);
        this.head = head;
        this.tail = tail;
    }

    equal(v) {
        if (v instanceof Pair) {
            return equal(car(this), car(v)) && equal(cdr(this), cdr(v));
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
            } else if (cur.tail instanceof Pair) {
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

    *[globalThis.Symbol.iterator]() {
        let cur = this;
        while (!nil_p(cur)) {
            yield car(cur);
            cur = cdr(cur);
        }
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
    toString() {
        return this.imm ? "#t" : "#f";
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
        {
            let cur = params;
            while (pair_p(cur)) {
                assert(symbol_p(car(cur)));
                cur = cdr(cur);
            }
            assert(nil_p(cur) || symbol_p(cur));
        }
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
const tru = new Boolean(true);
const fls = new Boolean(false);
const untouchable = new Symbol("[untouchable]");

const nil_p = v => v instanceof Nil;
const pair_p = v => v instanceof Pair;
const number_p = v => v instanceof Number;
const boolean_p = v => v instanceof Boolean;
const symbol_p = v => v instanceof Symbol;
const procedure_p = v => v instanceof Procedure;

const list_p = v => nil_p(v) ? true : pair_p(v) ? list_p(cdr(v)) : false;

const eq = Value.eq;
const eqv = Value.eqv;
const equal = Value.equal;

const cons = (a, b) => new Pair(a, b);
const car = p => p.head;
const cdr = p => p.tail;
const set_car = (p, v) => p.head = v;
const set_cdr = (p, v) => p.tail = v;

const list_map = (f, l) => nil_p(l) ? nil : cons(f(car(l)), list_map(f, cdr(l)));
const list_foldl = (f, i, l) => nil_p(l) ? i : list_foldl(f, f(i, car(l)), cdr(l));
const list_foldr = (f, l, i) => nil_p(l) ? i : f(car(l), list_foldr(f, cdr(l), i));
const list_length = l => nil_p(l) ? 0 : 1 + list_length(cdr(l));
const list_ref = (l, n) => n <= 0 ? car(l) : list_ref(cdr(l), n - 1);

module.exports = {
    Pair,
    Number,
    Boolean,
    Symbol,
    Closure,
    Primitive,

    nil,
    tru,
    fls,
    untouchable,

    nil_p,
    pair_p,
    number_p,
    boolean_p,
    symbol_p,
    procedure_p,

    list_p,

    eq,
    eqv,
    equal,

    cons,
    car,
    cdr,
    set_car,
    set_cdr,

    list_map,
    list_foldl,
    list_foldr,
    list_length,
    list_ref,
}
