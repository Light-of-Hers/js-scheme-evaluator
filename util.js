"use strict";

function assert(cond, msg) {
    if (!cond) {
        throw new Error(msg || "Assertion failed");
    }
}

module.exports = {
    assert,
}
