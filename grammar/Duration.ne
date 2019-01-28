@builtin "number.ne"
@builtin "whitespace.ne"

@{%
function durationHMS(d) {
  return {
    hours: d[0] || 0,
    minutes: d[2] || 0,
    seconds: d[4] || 0,
  };
}
%}

Duration ->
    HoursMinutesSeconds {% id %}
  | MinutesSeconds {% id %}
  | HoursStart {% id %}
  | MinutesStart {% id %}
  | Seconds {% id %}

HoursMinutesSeconds -> unsigned_int ":" unsigned_int ":" unsigned_int {% durationHMS %}

MinutesSeconds -> unsigned_int ":" unsigned_int {%
  function(d) {
    return { hours: 0, minutes: d[0], seconds: d[2] };
  }
%}

HoursStart ->
    Hours _ MinutesStart {%
      function(d) {
        d[2].hours = d[0].hours;
        return d[2];
      }
    %}
  | Hours {% id %}

MinutesStart ->
    Minutes _ Seconds {%
      function(d) {
        d[2].minutes = d[0].minutes;
        return d[2];
      }
    %}
  | Minutes {% id %}

Hours -> unsigned_int _ "h"i {%
  function(d) {
    return { hours: d[0], minutes: 0, seconds: 0 };
  }
%}

Minutes -> unsigned_int _ "m"i {%
  function(d) {
    return { hours: 0, minutes: d[0], seconds: 0 };
  }
%}


Seconds -> unsigned_int _ "s"i {%
  function(d) {
    return { hours: 0, minutes: 0, seconds: d[0] };
  }
%}
