@include "./lexer.ne"
@lexer lex

Number ->
    float {% id %}
  | int {% id %}

int ->
    unsigned_int {% id %}
  | negative_int {% id %}

float ->
    unsigned_float {% id %}
  | negative_float {% id %}

unsigned_int ->
    %uint {% function(d) {
        return parseInt(d[0]);
    } %}

negative_int ->
    %nint {% function(d) {
        return parseInt(d[0]);
    } %}

unsigned_float ->
    %ufloat {% function(d) {
        return parseFloat(d[0]);
    } %}

negative_float ->
    %nfloat {% function(d) {
        return parseFloat(d[0]);
    } %}
