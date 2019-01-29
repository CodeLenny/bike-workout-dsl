@builtin "number.ne"
@include "./utils.ne"

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
  Strength OptionalWhitespace "/" OptionalWhitespace {% id %}

Strength ->
    Wattage {% id %}
  | Heartrate {% id %}
  | FTP_Target {% id %}
  | FTHR_Target {% id %}

@{%
function strengthValue(n, units) {
    return function(d) {
        return { value: d[n], units };
    };
}
%}

Wattage -> decimal OptionalWhitespace "w"i {%  strengthValue(0, "watts") %}

Heartrate -> decimal OptionalWhitespace ("bpm" | "BPM") {% strengthValue(0, "bpm") %}

FTP_Target -> decimal OptionalWhitespace "%" OptionalWhitespace ("ftp" | "FTP") {% strengthValue(0, "ftp") %}

FTHR_Target -> decimal OptionalWhitespace "%" OptionalWhitespace ("fthr" | "FTHR") {% strengthValue(0, "fthr") %}
