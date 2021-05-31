'use strict';

const { parse } = require("./parser");
const { desugar, js2scm } = require("./transform");

const js = parse("(letrec ((f 1) (g 2)) (+ f g) (let* ((a 1) (b (+ a 1))) (+ a b)))");
console.log(String(js2scm(js)));
console.log(String(js2scm(desugar(js))));
