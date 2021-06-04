'use strict';

const { parse } = require("./parser");
const { desugar, js2scm } = require("./transform");
const { evaluate } = require("./evaluate");
const { init_scope } = require("./primitive");

const js = parse(
    // "(letrec ((f (lambda (n) (if (= n 0) 1 (* n (f (- n 1))))))) (f 10))",
    "(apply + '(1 2 3))",
);
const js_ = desugar(js);
const scm = js2scm(js_);
console.log(String(scm));
const res = evaluate(scm, init_scope);
console.log(String(res));
