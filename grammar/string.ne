@builtin "postprocessors.ne"
@include "./whitespace.ne"
@include "./Equation.ne"
@include "./variable.ne"
@include "./lexer.ne"
@lexer lex

InterpolatedString ->
    %startString InterpolatedStringContents:* %endString {% nth(1) %}

InterpolatedStringContents ->
    Variable {% id %}
  | (%startEquation OptionalWhitespace)
    Equation
    (OptionalWhitespace %endEquation) {% function(d) {
        return { type: "equation", value: d[1] };
    } %}
  | %text {% function(d) {
        return { type: "text", value: d[0].text };
    } %}

PlainString ->
    %startString PlainStringContents:* %endString {% nth(1) %}

PlainStringContents ->
    %text {% function(d) {
        return { type: "text", value: d[0].text };
    } %}
