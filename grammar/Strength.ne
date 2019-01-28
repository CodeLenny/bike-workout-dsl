@builtin "number.ne"
@builtin "whitespace.ne"

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
  Strength _ "/" _ {% id %}

Strength ->
    Wattage {% id %}
  # | Heartrate {% id %}
  | FTP_Target {% id %}
  # | FTHR_Target {% id %}

@{%
function strengthValue(n, units) {
    return function(d) {
        return { value: d[n], units };
    };
}
%}

Wattage -> decimal _ "w"i {%  strengthValue(0, "watts") %}

Heartrate -> decimal _ "bpm"i {% strengthValue(0, "bpm") %}

FTP_Target -> decimal _ "%" _ "ftp"i {% strengthValue(0, "ftp") %}

FTHR_Target -> decimal _ "%" _ "fthr"i {% strengthValue(0, "fthr") %}
