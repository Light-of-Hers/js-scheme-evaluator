"use strict";

const fs = require('fs');

const read_sexp = (() => {
    const char_buf = Buffer.alloc(1);
    const get_char = () => {
        if (fs.readSync(0, char_buf, 0, 1) <= 0)
            return null;
        return char_buf.toString('utf8');
    };
    return () => {
        let unmatched = 0;
        let s = "";
        while (true) {
            const c = get_char();
            if (c === null)
                return null;
            if ((c == '\n' || c == '\r') && unmatched == 0)
                break;
            s += c;
            if (c == "(" || c == "[")
                unmatched++;
            else if (c == ")" || c == "]")
                unmatched--;
        }
        return s;
    };
})();

const load_file = path => {
    const s = fs.readFileSync(path);
    return "(begin" + String(s) + ")";
}

module.exports = {
    read_sexp,
    load_file,
}
