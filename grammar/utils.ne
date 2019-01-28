@builtin "string.ne"
@builtin "whitespace.ne"

DoubleQuotedString -> dqstring {% id %}

SingleQuotedString -> sqstring {% id %}

Linebreak ->
    "\r" "\n"
  | "\r"
  | "\n"

OptionalWhitespace -> _ {% id %}

Whitespace -> __ {% id %}
