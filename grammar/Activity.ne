@builtin "string.ne"
@builtin "postprocessors.ne"
@include "./utils.ne"
@include "./Duration.ne"
@include "./Strength.ne"

Activity ->
    (ActivityName Whitespace {% id %}):? Duration Whitespace ("at" | "AT") Whitespace StrengthDescription OptionalWhitespace ActivityDialog:? ActivityDescription:? Linebreak {%
      function(d) {
        return {
            type: "activity",
            name: d[0],
            duration: d[1],
            strength: d[5],
            dialog: Array.isArray(d[7]) ? d[7] : [],
            description: typeof d[8] === "string" ? d[8] : "",
        };
      }
    %}

ActivityName -> DoubleQuotedString {% id %}

ActivityDialog ->
    ActivityDialogEntry:+ {% id %}

ActivityDialogEntry ->
    Linebreak OptionalWhitespace "@" OptionalWhitespace Duration Whitespace DoubleQuotedString OptionalWhitespace {%
        function(d) {
            return {
                message: d[6],
                offset: d[4],
            }
        }
    %}

ActivityDescription ->
    ActivityDescriptionLine:+ {%
      function(d) {
          return d[0].join("\n");
      }
    %}

ActivityDescriptionLine ->
    Linebreak OptionalWhitespace ">" Whitespace DoubleQuotedString OptionalWhitespace {% nth(4) %}
