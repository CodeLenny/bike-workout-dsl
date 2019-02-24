@include "./Metadata.ne"
@include "./Entry.ne"

Workout ->
    Metadata:? EntrySet {%
        function(d) {
            return {
                metadata: d[0],
                entries: d[1],
            };
        }
    %}
