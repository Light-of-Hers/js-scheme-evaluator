'use strict';

const { parse } = require("./parser");
const { void_p } = require("./value");
const { uncomment, desugar, js2scm } = require("./transform");
const { evaluate } = require("./evaluate");
const { prim_scope } = require("./primitive");
const { read_sexp, load_file } = require("./io");
const { Scope } = require("./scope");
const { argv } = require("yargs");

const prompt = "$ ";

const lib_scope = new Scope(prim_scope);
const eval_string = s => {
    s = uncomment(s);
    if (s.trim() == "")
        return null;
    s = parse(s);
    s = desugar(s);
    s = js2scm(s);
    return evaluate(s, lib_scope);
}
eval_string(load_file("lib.scm"));

if (argv.input || argv.i) {
    const path = argv.input || argv.i;
    eval_string(load_file(path));
} else {
    while (true) {
        process.stdout.write(prompt);
        try {
            const s = read_sexp();
            if (s === null) {
                console.log();
                break;
            }
            const v = eval_string(s);
            if (v !== null && !void_p(v))
                console.log(String(v));
        } catch (e) {
            console.error(e);
        }
    }
}
