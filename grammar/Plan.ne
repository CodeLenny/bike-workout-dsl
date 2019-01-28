@include "./utils.ne"
@include "./Workout.ne"

Plan ->
    (Workout PlanSeperation {% id %}):* Workout {%
        function(d) {
            if(d[0] && Array.isArray(d[0])) {
                return [ ...d[0], d[1] ];
            }
            return [ d[1] ];
        }
    %}

PlanSeperation -> _ Linebreak "---" "-":* Linebreak _
