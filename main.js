'use strict';

const { parse } = require("./parser");
const { uncomment, desugar, js2scm } = require("./transform");
const { evaluate } = require("./evaluate");
const { prim_scope } = require("./primitive");
const { read_sexp, load_file } = require("./io");
const { Scope } = require("./scope");

const prompt = "$ ";

const lib_scope = new Scope(prim_scope);
const eval_string = s => {
    s = uncomment(s);
    s = parse(s);
    s = desugar(s);
    s = js2scm(s);
    return evaluate(s, lib_scope);
}
eval_string(load_file("lib.scm"));

while (true) {
    process.stdout.write(prompt);
    try {
        const s = read_sexp();
        if (s === null) {
            console.log();
            break;
        }
        if (s.length > 0)
            console.log(String(eval_string(s)));
    } catch (e) {
        console.error(e);
    }
}
