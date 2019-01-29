@include "./utils.ne"

Metadata ->
    MetadataEntry:+

MetadataEntry ->
    MetadataKey OptionalWhitespace "=" OptionalWhitespace MetadataValue Linebreak

MetadataKey ->
    "name" {% id %}
  | "author" {% id %}

MetadataValue ->
    DoubleQuotedString
  | SingleQuotedString
  | Integer
