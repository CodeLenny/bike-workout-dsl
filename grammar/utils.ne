@builtin "string.ne"

DoubleQuotedString -> dqstring {% id %}

SingleQuotedString -> sqstring {% id %}

Linebreaks -> Linebreak:+ {% id %}

Linebreak ->
    "\r" "\n" {% id %}
  | "\r" {% id %}
  | "\n" {% id %}

OptionalWhitespace -> WhitespaceChar:* {% id %}

OptionalWhitespaceLines ->
    (Linebreak {% id %} | WhitespaceChar {% id %}):* {% id %}

Whitespace -> WhitespaceChar:+ {% id %}

WhitespaceLines ->
    (Linebreak {% id %} | WhitespaceChar {% id %}):+

WhitespaceChar -> [ \t\v\f] {% id %}
