function nearleyc(source, dest, cb) {
    jake.exec(`node_modules/.bin/nearleyc ${source} > ${dest}`, cb);
}

rule(".js", ".ne", {async: true}, function() {
    nearleyc(this.source, this.name, function() {
        complete();
    });
});

const ActivityDeps = [ "grammar/Duration.ne", "grammar/Strength.ne", "grammar/utils.ne" ];

file("grammar/Activity.js", [ ...ActivityDeps ], { async: true }, function() {
    nearleyc("grammar/Activity.ne", this.name, function() {
        complete();
    });
});

const EntryDeps = [ "grammar/Entry.ne", ...ActivityDeps ];

file("grammar/Entry.js", [ ...EntryDeps ], { async: true }, function() {
    nearleyc("grammar/Entry.ne", this.name, function() {
        complete();
    });
});

const WorkoutDeps = [ "grammar/Workout.ne", "grammar/Metadata.ne", ...EntryDeps ];

file("grammar/Workout.js", [ ...WorkoutDeps ], { async: true }, function() {
    nearleyc("grammar/Workout.ne", this.name, function() {
        complete();
    });
});

const PlanDeps = [ "grammar/Plan.ne", ...WorkoutDeps ];

file("grammar/Plan.js", [ ...PlanDeps ], { async: true }, function() {
    nearleyc("grammar/Plan.ne", this.name, function() {
        complete();
    });
});

directory("build/railroad/");

rule(
    /build\/railroad\/.*\.html/,
    function(name) {
        return name
            .replace("build/railroad/", "grammar/")
            .replace(".html", ".ne");
    },
    { async: true },
    function() {
        jake.exec(`node_modules/.bin/nearley-railroad ${this.source} > ${this.name}`, function() {
            complete();
        });
    },
);

task("build", [
    "grammar/Plan.js",
]);

task("test", [
    "build",
    "grammar/Activity.js",
    "grammar/Duration.js",
    "grammar/Strength.js",
    "grammar/Workout.js",
]);

// TODO: Eventually these tasks will be triggered by other tasks
task("temp", [
    "build/railroad/Activity.html",
]);
