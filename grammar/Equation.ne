@include "./string.ne"
@include "./whitespace.ne"
@include "./number.ne"
@include "./variable.ne"
@include "./lexer.ne"

@lexer lex

@{%
function twoEquationOperator(operatorName) {
    return function(d) {
        return {
            type: operatorName,
            left: d[0],
            right: d[2],
            line: d[1][1].line,
            col: d[1][1].col,
        }
    }
}
%}

Equation ->
    InterpolatedString {% function(d) {
        return { type: "string", value: d[0] };
    } %}
  | (%startEquation OptionalWhitespace)
    Equation
    (OptionalWhitespace %endEquation) {% function(d) {
        return { type: "equation", value: d[1] };
    } %}
  | Variable {% id %}
  | Number {% function(d) {
        return { type: "number", value: d[0] };
    } %}
  | Equation
    (OptionalWhitespace %multiply OptionalWhitespace)
    Equation {% twoEquationOperator("multiply") %}
  | Equation
    (OptionalWhitespace %divide OptionalWhitespace)
    Equation {% twoEquationOperator("divide") %}
  | Equation
    (OptionalWhitespace %plus OptionalWhitespace)
    Equation {% twoEquationOperator("plus") %}
  | Equation
    (OptionalWhitespace %minus OptionalWhitespace)
    Equation {% twoEquationOperator("minus") %}
