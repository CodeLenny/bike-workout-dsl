const fs = require("fs-extra");
const cheerio = require("cheerio");
const blade = require("blade");
const asciidoctor = require("asciidoctor.js")();
const nearley = require("nearley");

function nearleyc(source, dest, cb) {
    jake.exec(`node_modules/.bin/nearleyc ${source} > ${dest}`, cb);
}

function bladeCompilation(source, dest, options = {}) {
    const htmlRender = new Promise((resolve, reject) => {
        blade.renderFile(
            source,
            options,
            (err, html) => {
                if(err) {
                    reject(err);
                }
                resolve(html);
            },
        );
    });
    return htmlRender.then(html => fs.writeFile(dest, html));
}

function sass(dest, source) {
    return new Promise((resolve, reject) => {
        jake.exec(`node_modules/.bin/sass ${source} > ${dest}`, function() {
            resolve();
        });
    });
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
        const railroadDirectoryTask = jake.Task["build/railroad"];
        railroadDirectoryTask.addListener("complete", function() {
            jake.exec(`node_modules/.bin/nearley-railroad ${this.source} > ${this.name}`, function() {
                complete();
            });
        });
        railroadDirectoryTask.invoke();
    },
);

directory("build/doc/");

rule(
    /build\/doc\/.*\.html/,
    function(name) {
        return name
            .replace("build/doc/", "docs/src/grammar/")
            .replace(".html", ".adoc");
    },
    { async: true },
    function() {
        const src = this.source;
        const dest = this.name;
        return fs
            .ensureDir("build/doc/")
            .then(() => fs.readFile(src, "utf8"))
            .then(adoc => asciidoctor.convert(adoc, {
                header_footer: false,
            }))
            .then(html => fs.writeFile(dest, html));
    },
);

const grammarTemplateFiles = new jake.FileList();
grammarTemplateFiles.include(
    "docs/src/template/core-nav-links.blade",
    "docs/src/template/extra-nav-links.blade",
    "docs/src/template/grammar-nav-links.blade",
    "docs/src/template/grammar.blade",
);

directory("docs/out/grammar/");

file("docs/out/grammar/index.html", [
    "docs/src/grammar/index.blade",
    "docs/out/grammar/",
    ...grammarTemplateFiles.toArray(),
    ],
    () => bladeCompilation("docs/src/grammar/index.blade", "docs/out/grammar/index.html"));

file("docs/out/index.html", [
    "docs/src/index.blade",
    "docs/src/template/about-page.blade",
    ], { async: true },
    () => bladeCompilation("docs/src/index.blade", "docs/out/index.html"));

const grammarDocFiles = new jake.FileList();
const grammarFiles = new jake.FileList();
grammarFiles.include("grammar/*.ne");
grammarFiles
    .toArray()
    .forEach(file => {
        const modelName = file.replace("grammar/", "").replace(".ne", "");
        const railroad = file
            .replace("grammar/", "build/railroad/")
            .replace(".ne", ".html");
        const doc = file
            .replace("grammar/", "build/doc/")
            .replace(".ne", ".html");
        const output = file
            .replace("grammar/", "docs/out/grammar/")
            .replace(".ne", "/index.html");
        const outDir = output.replace("/index.html", "");
        grammarDocFiles.include(output);

        directory(outDir);

        task(
            output,
            [
                railroad,
                doc,
                ...grammarTemplateFiles.toArray(),
                outDir,
                "docs/src/links.json",
            ],
            { async: true },
            function() {
                const svgLinks = require("./docs/src/links.json");
                const svgContents = fs
                    .readFile(railroad, "utf8")
                    .then(file => cheerio.load(file))
                    .then($ => {
                        const svgs = {};
                        $("h1").each(function(i, elem) {
                            const name = $(this).text();
                            const svg = $.html($(this).next().children("svg"));
                            svgs[name] = svg;
                        });
                        return svgs;
                    });
                const docContents = fs.readFile(doc, "utf8");
                return Promise
                    .all([svgContents, docContents])
                    .then(([ svgs, documentation ]) => {
                        return new Promise((resolve, reject) => {
                            blade.renderFile(
                                "docs/src/template/grammar.blade",
                                {
                                    title: modelName,
                                },
                                (err, html) => {
                                    if(err) {
                                        reject(err);
                                    }
                                    $ = cheerio.load(html, {
                                        decodeEntities: false,
                                    });
                                    $("#documentation").html(documentation);
                                    $("[railroad-of]").each(function (i, elem) {
                                        const diagram = $(this).attr("railroad-of");
                                        $(this).html(svgs[diagram]);
                                    });
                                    $("svg text").each(function (i, elem) {
                                        const name = $(this).text();
                                        if(svgLinks[name]) {
                                            $(this).html(`<a href="../${svgLinks[name]}">${name}</a>`);
                                        }
                                    });
                                    resolve($.html());
                                },
                            );
                        });
                    })
                    .then(html => fs.writeFile(output, html))
                    .catch(err => {
                        console.log(err);
                        throw err;
                    });
            },
        );
    });

rule(
    /docs\/grammar\/.*\/index.html/,
    function(name) {
        return name
            .replace("docs/grammar/", "build/")
            .replace("/index.html", ".html");
    },
    [
        "build/",
    ],
    function() {
        // read in railroad, split out SVG from CSS
        // read in (and compile) adoc files
        // combine HTML & SVG
        // Add links to other files
        // Write out
    },
);

file("docs/out/css/site.css", [
        "docs/src/sass/site.scss",
    ], { async: true },
    () => sass("docs/out/css/site.css", "docs/src/sass/site.scss"));

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

task("docs", [
    "docs/out/css/site.css",
    "docs/out/index.html",
    "docs/out/grammar/index.html",
    ...grammarDocFiles.toArray(),
]);
