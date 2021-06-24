Start
    = _ sexp:Sexp _ { return sexp; }
;

Sexp 
    = atom:Atom { return atom; } 
    / "'" sexp:Sexp { return ["quote", sexp]; }
    / "(" sexps:(_ Sexp _)* ")" { return sexps.map(e => e[1]); }
    / "[" sexps:(_ Sexp _)* "]" { return sexps.map(e => e[1]); }
;

Atom 
    = Number
    / Boolean
    / Symbol
;

Number
    = [-]?[0-9]+([.][0-9]*)? { return parseFloat(text()); }
;

Boolean
    = "#t" { return true; }
    / "#f" { return false; }
;

Symbol
    = [^0-9()\[\]"' \t\n\r;][^()\[\]"' \t\n\r;]* { return text(); }
;

_ "whitespace"
    = [ \t\n\r]*
;
