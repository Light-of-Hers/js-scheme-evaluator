"use strict";

const { Symbol: S } = require("./value");

module.exports = {
    lambda: new S("lambda"),
    let: new S("let"),
    let_star: new S("let*"),
    letrec: new S("letrec"),
    define: new S("define"),
    quote: new S("quote"),
    begin: new S("begin"),
    set_star: new S("set!"),
    if: new S("if"),
    cond: new S("cond"),
    else: new S("else"),
    and: new S("and"),
    or: new S("or"),
}
