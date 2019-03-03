@builtin "postprocessors.ne"
@include "./Duration.ne"
@include "./Strength.ne"
@include "./whitespace.ne"
@include "./string.ne"

Activity ->
    (ActivityName Whitespace {% id %}):? Duration Whitespace ("at" | "AT") Whitespace StrengthDescription OptionalWhitespace ActivityDialog:? ActivityDescription:? Linebreak:+ {%
      function(d) {
        return {
            type: "activity",
            name: d[0],
            duration: d[1],
            strength: d[5],
            dialog: Array.isArray(d[7]) ? d[7] : [],
            description: Array.isArray(d[8]) ? [].concat(...d[8]) : [],
        };
      }
    %}

ActivityName -> InterpolatedString {% id %}

ActivityDialog ->
    ActivityDialogEntry:+ {% id %}

ActivityDialogEntry ->
    Linebreak OptionalWhitespace "@" OptionalWhitespace Duration Whitespace InterpolatedString OptionalWhitespace {%
        function(d) {
            return {
                message: d[6],
                offset: d[4],
            }
        }
    %}

ActivityDescription ->
    ActivityDescriptionLine:+ {% id %}

ActivityDescriptionLine ->
    Linebreak OptionalWhitespace ">" Whitespace InterpolatedString OptionalWhitespace {% nth(4) %}
