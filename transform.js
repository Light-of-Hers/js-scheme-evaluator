"use strict";

const { assert } = require("./util");
const { caseOf } = require("matches");
const V = require("./value");
const { nil, tru, fls, cons, car, cdr, set_car, set_cdr } = V;

const uncomment = (() => {
    const pat = /(;[^\r\n]*[\r\n]?)/g;
    return s => s.replace(pat, "");
})();

const desugar = (() => {

    const pass0 = obj => caseOf(obj, {
        '["quote", ...]': () => obj,
        '[...objs]': os => caseOf(os.map(pass0), {
            '["let", name@String, bindings, ...body]': (name, bindings, body) => {
                const params = bindings.map(b => b[0]);
                const args = bindings.map(b => b[1]);
                return ["letrec", [[name, ["lambda", params, ...body]]], [name, ...args]];
            },
            "other": o => o,
        }),
        '_': () => obj,
    })

    const pass1 = obj => caseOf(obj, {
        '["quote", ...]': () => obj,
        '[...objs]': os => caseOf(os.map(pass1), {
            '["let*", bindings, ...body]': (bindings, body) => {
                let cur = body;
                for (const bind of bindings.reverse()) {
                    cur = [["let", [bind], ...cur]];
                }
                return cur[0];
            },
            '["letrec", bindings, ...body]': (bindings, body) => {
                return ["let", bindings.map(b => [b[0], ["quote", V.untouchable.imm]]),
                    ...bindings.map(b => ["set!", b[0], b[1]]), ...body];
            },
            '["define", [name, ".", arg], ...body]': (name, arg, body) => {
                return ["define", name, ["lambda", arg, ...body]];
            },
            '["define", [name, ...args], ...body]': (name, args, body) => {
                return ["define", name, ["lambda", args, ...body]];
            },
            '["and", ...args]': args => {
                return args.reduceRight((acc, v) => ["if", v, acc, false], true);
            },
            '["or", ...args]': args => {
                return args.reduceRight((acc, v) => ["if", v, true, acc], false);
            },
            'other': o => o,
        }),
        '_': () => obj,
    });

    const pass2 = obj => caseOf(obj, {
        '["quote", ...]': () => obj,
        '[...objs]': os => caseOf(os.map(pass2), {
            '["let", bindings, ...body]': (bindings, body) => {
                return [["lambda", bindings.map(b => b[0]), ...body],
                ...bindings.map(b => b[1])];
            },
            '["if", pred, then, alter]': (pred, then, alter) => {
                return ["cond", [pred, then], ["else", alter]];
            },
            'other': o => o,
        }),
        '_': () => obj,
    });

    const passes = [
        pass0,
        pass1,
        pass2,
    ];

    return obj => {
        for (const ps of passes) {
            obj = ps(obj);
        }
        return obj;
    };
})();

const json2scm = obj => {
    if (typeof obj === "string" || obj instanceof String) {
        assert(obj !== ".", "invalid syntax");
        return new V.Symbol(obj);
    } else if (typeof obj === "boolean" || obj instanceof Boolean) {
        return obj ? tru : fls;
    } else if (typeof obj == "number" || obj instanceof Number) {
        return new V.Number(obj);
    } else if (obj instanceof Array) {
        const dummy = cons(nil, nil);
        let cur = dummy;
        const len = obj.length;
        for (let i = 0; i < len; ++i) {
            if (obj[i] === ".") {
                assert(i + 2 === len, "invalid syntax");
                set_cdr(cur, json2scm(obj[++i]));
            } else {
                cur = set_cdr(cur, cons(json2scm(obj[i]), nil));
            }
        }
        return cdr(dummy);
    } else {
        assert(false);
    }
};

module.exports = {
    uncomment,
    desugar,
    json2scm,
}
