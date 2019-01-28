@include "./Metadata.ne"
@include "./Entry.ne"

Workout ->
    Metadata:? Entry:* {%
        function(d) {
            return {
                metadata: d[0],
                entries: d[1],
            };
        }
    %}
