@include "./lexer.ne"
@lexer lex

WhitespaceLines -> (Whitespace {% id %} | Linebreak {% id %}):+

Whitespace -> %ws:+ {% id %}

OptionalWhitespace -> %ws:* {% id %}

OptionalWhitespaceLines -> (Whitespace {% id %} | Linebreak {% id %}):*

Linebreak -> %nl {% id %}
