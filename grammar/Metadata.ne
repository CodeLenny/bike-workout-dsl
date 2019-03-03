@include "./string.ne"
@include "./whitespace.ne"
@include "./lexer.ne"

@lexer lex

Metadata ->
    MetadataEntry:+

MetadataEntry ->
    MetadataKey OptionalWhitespace %equals OptionalWhitespace MetadataValue Linebreak

MetadataKey ->
    "name" {% id %}
  | "author" {% id %}

MetadataValue ->
    InterpolatedString
  | Integer
