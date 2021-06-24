"use strict";

const { assert } = require("./util");
const V = require("./value");
const { nil, tru, fls, untouchable, pair_p, list_p, nil_p, procedure_p, symbol_p, cons, car, cdr, eq, list_map } = V;
const K = require("./keyword");
const { Scope } = require("./scope");

const evaluate = (exp, scope) => {
    if (symbol_p(exp)) {
        const v = Scope.lookup(scope, exp.imm);
        assert(v !== undefined, `unknown variable ${exp}`);
        assert(!eq(v, untouchable), `untouchable value`);
        return v;
    } else if (!pair_p(exp)) {
        return exp;
    } else if (list_p(exp)) {
        const fst = car(exp);
        if (eq(fst, K.quote)) { // quote
            return car(cdr(exp));
        } else if (eq(fst, K.lambda)) { // lambda
            const params = car(cdr(exp));
            const body = cdr(cdr(exp));
            return new V.Closure(params, body, scope);
        } else if (eq(fst, K.define)) { // define
            const key = car(cdr(exp));
            const val = evaluate(car(cdr(cdr(exp))), scope);
            assert(symbol_p(key), `invalid syntax ${exp}`);
            scope.define_value(key, val);
            return nil;
        } else if (eq(fst, K.set_star)) { // set!
            const key = car(cdr(exp));
            const val = evaluate(car(cdr(cdr(exp))), scope)
            assert(symbol_p(key), `invalid syntax ${exp}`);
            scope.set_value(key, val);
            return nil;
        } else if (eq(fst, K.begin)) { // begin
            const body = cdr(exp);
            return eval_seq(body, scope);
        } else if (eq(fst, K.cond)) { // cond
            let stmts = cdr(exp);
            while (!nil_p(stmts)) {
                const stmt = car(stmts);
                const pred = car(stmt), clause = car(cdr(stmt));
                if (eq(pred, K.else)) {
                    assert(nil_p(cdr(stmts)), `invalid syntax ${exp}`);
                    return evaluate(clause, scope);
                } else if (!eq(evaluate(pred, scope), fls)) {
                    return evaluate(clause, scope);
                }
                stmts = cdr(stmts);
            }
            return nil;
        } else { // apply
            const op = evaluate(fst, scope);
            assert(procedure_p(op), `${op} is not a procedure`);
            const args = list_map(v => evaluate(v, scope), cdr(exp));
            return apply(op, args);
        }
    } else {
        assert(false, `invalid syntax ${exp}`);
    }
};

const eval_seq = (lst, scope) => {
    assert(!nil_p(lst));
    let last = nil;
    for (const v of lst) {
        last = evaluate(v, scope);
    }
    return last;
};

const apply = (proc, args) => {
    if (proc instanceof V.Primitive) {
        return proc.func(args);
    } else if (proc instanceof V.Closure) {
        const scope = new Scope(proc.scope);
        let cur_ps = proc.params, cur_as = args;
        while (pair_p(cur_ps) && pair_p(cur_as)) {
            scope.define_value(car(cur_ps), car(cur_as));
            cur_ps = cdr(cur_ps);
            cur_as = cdr(cur_as);
        }
        assert(!pair_p(cur_ps), `too less arguments, expected ${proc.params}, given ${args}`);
        if (nil_p(cur_ps)) {
            assert(nil_p(cur_as), `too many arguments, expected ${proc.params}, given ${args}`);
        } else if (symbol_p(cur_ps)) {
            scope.define_value(cur_ps, cur_as);
        } else {
            assert(false);
        }
        return eval_seq(proc.body, scope);
    } else {
        assert(false);
    }
};

module.exports = {
    evaluate,
    apply,
}
