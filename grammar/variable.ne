@include "./lexer.ne"
@lexer lex

Variable ->
    %variable {% function(d) {
        return {
            type: "variable",
            value: d[0].text.slice(1),
            line: d[0].line,
            col: d[0].col,
        };
    } %}
