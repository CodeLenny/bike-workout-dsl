@include "./Workout.ne"
@include "./whitespace.ne"
@include "./lexer.ne"

@lexer lex

Plan ->
    (Workout PlanSeperation {% id %}):* Workout {%
        function(d) {
            if(d[0] && Array.isArray(d[0])) {
                return [ ...d[0], d[1] ];
            }
            return [ d[1] ];
        }
    %}

PlanSeperation -> OptionalWhitespace %minusDivider Linebreak OptionalWhitespaceLines
