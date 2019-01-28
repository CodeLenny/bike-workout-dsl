@include "./utils.ne"

Metadata ->
    MetadataEntry:+

MetadataEntry ->
    MetadataKey Whitespace "=" Whitespace MetadataValue Linebreak

MetadataKey ->
    "Name"
  | "Author"

MetadataValue ->
    DoubleQuotedString
  | SingleQuotedString
  | Integer
