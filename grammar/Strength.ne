@include "./Equation.ne"
@include "./number.ne"
@include "./whitespace.ne"
@include "./lexer.ne"

@lexer lex

StrengthDescription ->
    StrengthListEntry:* Strength {%
      function(d) {
        if(!Array.isArray(d[0])) {
          return d[1];
        }
        return [ ...d[0], d[1] ];
      }
    %}

StrengthListEntry ->
  Strength OptionalWhitespace %divide OptionalWhitespace {% id %}

Strength ->
    Wattage {% id %}
  | Heartrate {% id %}
  | FTP_Target {% id %}
  | FTHR_Target {% id %}

@{%
function strengthValue(n, units) {
    return function(d) {
        const obj = d[n];
        obj.units = units;
        return obj;
    };
}
%}

Wattage -> StrengthValue OptionalWhitespace "w"i {%  strengthValue(0, "watts") %}

Heartrate -> StrengthValue OptionalWhitespace ("bpm" | "BPM") {% strengthValue(0, "bpm") %}

FTP_Target -> StrengthValue OptionalWhitespace ("% ftp" | "% FTP") {% strengthValue(0, "ftp") %}

FTHR_Target -> StrengthValue OptionalWhitespace ("% fthr" | "% FTHR") {% strengthValue(0, "fthr") %}

StrengthValue ->
    Number {% function(d) {
        return { type: "number", value: d[0] };
    } %}
  | %startEquation Equation %endEquation {% function(d) {
        return { type: "equation", value: d[1] };
    } %}
