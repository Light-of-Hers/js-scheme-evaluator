"use strict";

const V = require("./value");
const { list_foldl, tru, fls, nil, car, cdr, cons, set_car, set_cdr } = V;
const { apply } = require("./evaluate");
const { assert } = require("./util");
const { Scope } = require("./scope");

const add_like_op = (op, init) => new V.Primitive(args => new V.Number(list_foldl((a, v) => {
    assert(V.number_p(v), `expected a number, given ${v}`);
    return op(a, v.imm);
}, init, args)));

const sub_like_op = (op, init) => new V.Primitive(args => {
    assert(!V.nil_p(args), `expected at least one argument`);
    const n = car(args);
    assert(V.number_p(n), `expected a number, given ${n}`);
    if (V.nil_p(cdr(args))) {
        return new V.Number(op(init, n.imm));
    } else {
        return new V.Number(list_foldl((a, v) => {
            assert(V.number_p(v), `expected a number, given ${v}`);
            return op(a, v.imm);
        }, n, cdr(args)));
    }
});

const rel_op = op => new V.Primitive(args => {
    assert(!V.nil_p(args), `expected at least one argument`);
    let res = true;
    let prev = car(args);
    assert(V.number_p(prev), `expected a number, given ${prev}`);
    for (const cur of cdr(args)) {
        assert(V.number_p(cur), `expected a number, given ${cur}`);
        if (!op(prev.imm, cur.imm))
            res = false;
        prev = cur;
    }
    return res ? tru : fls;
});

const n_args_op = (n, op) => new V.Primitive(args => {
    args = [...args];
    assert(args.length == n, `expected ${n} arguments, given ${args.length}`);
    return op(...args);
});

const pred_op = op => n_args_op(1, v => op(v) ? tru : fls);

const prims = {
    "+": add_like_op((a, b) => a + b, 0),
    "-": sub_like_op((a, b) => a - b, 0),
    "*": add_like_op((a, b) => a * b, 1),
    "/": sub_like_op((a, b) => a / b, 1),
    "=": rel_op((a, b) => a === b),
    "<": rel_op((a, b) => a < b),
    ">": rel_op((a, b) => a > b),
    "<=": rel_op((a, b) => a <= b),
    ">=": rel_op((a, b) => a >= b),
    "null?": pred_op(V.nil_p),
    "pair?": pred_op(V.pair_p),
    "number?": pred_op(V.number_p),
    "boolean?": pred_op(V.boolean_p),
    "symbol?": pred_op(V.symbol_p),
    "procedure?": pred_op(V.procedure_p),
    "cons": n_args_op(2, cons),
    "car": n_args_op(1, car),
    "cdr": n_args_op(1, cdr),
    "set-car!": n_args_op(2, set_car),
    "set-cdr!": n_args_op(2, set_cdr),
    "apply": n_args_op(2, apply),
};

const prim_scope = new Scope(null, new Map(Object.entries(prims)));

module.exports = {
    prim_scope,
}