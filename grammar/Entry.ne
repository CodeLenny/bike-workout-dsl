@builtin "postprocessors.ne"
@include "./Activity.ne"
@include "./utils.ne"

EntrySet ->
    (OptionalWhitespaceLines Entry {% nth(1) %}):+ {% id %}

Entry ->
    Activity {% id %}
  | EntryScope OptionalWhitespace Linebreak {% id %}
  # | ActivityDelta
  # | ActivityDefinition
  # | ActivityDefinitionInstantiation
  # | DialogEntry
  # | Loop
  # | ConstantDefinition

EntryScope ->
    ("{" OptionalWhitespace Linebreak)
    EntrySet
    (OptionalWhitespaceLines "}")
    {%
        function(d) {
            return {
                type: "scope",
                contents: d[1],
            };
        }
    %}
