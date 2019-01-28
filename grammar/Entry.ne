@include "./Activity.ne"

Entry ->
    Activity {% id %}
  # | ActivityDelta
  # | ActivityDefinition
  # | ActivityDefinitionInstantiation
  # | DialogEntry
  # | Loop
  # | ConstantDefinition
