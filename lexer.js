const moo = require("moo");

const ws = /[ \t\v\f]+/;
const variableIdentifier = "[a-zA-Z0-9_]+";
const variableInstance = "$" + variableIdentifier;
const variable = new RegExp(variableInstance);
const startString = [
    { match: `"`, push: "dqStringLiteral" },
    { match: `'`, push: "sqStringLiteral" },
];
const startEquation = { match: "(", push: "equation" };
const nfloat = { match: /-(?:[0-9]+\.[0-9]+|[0-9]+\.|\.[0-9]+)/, value: v => parseFloat(v, 10) };
const ufloat =  { match: /(?:[0-9]+\.[0-9]+|[0-9]+\.|\.[0-9]+)/, value: v => parseFloat(v, 10) };
const nint = { match: /-[0-9]+/, value: v => parseInt(v, 10) };
const uint = { match: /[0-9]+/, value: v => parseInt(v, 10) };
const plus = "+";
const minus = "-";
const multiply = "*";
const divide = "/";
const nl = { match: /\n/, lineBreaks: true };

const lexer = moo.states({

    // The top-level contents of a file.
    main: {
        ws,
        startString,
        startEquation,
        variable,
        nfloat, ufloat, nint, uint,
        metadataKeyword: [
            "name", "Name", "NAME",
            "author", "Author", "AUTHOR",
        ],
        keyword: [
            "loop", "Loop", "LOOP",
            "at", "AT",
            "or", "OR",
        ],
        strengthUnit: [
            "% FTP", "% ftp",
            "% FTHR", "% fthr",
            "BPM", "bpm",
        ],
        durationUnit: [
            "W", "w",
            "H", "h",
            "M", "m",
            "S", "S",
        ],
        colon: ":",
        at: "@",
        equals: "=",
        gt: ">",
        minusDivider: /---+/,
        equalsDivider: /===+/,
        nl,
    },

    // Contents of string literals with double quotes.
    // Double-quoted strings can have variables interpolated.
    dqStringLiteral: {
        stringEnd: { match: `"`, pop: true },
        startEquation: { match: '${', push: "interpolatedEquation" },
        variable,
        text: { match: /(?:\\"|\\\$|[^"\$\\])+/, lineBreaks: true },
    },

    // Contents of string literals with single quotes.
    // Single-quoted strings cannot have variables interpolated.
    sqStringLiteral: {
        stringEnd: { match: `'`, pop: true },
        text: { match: /(?:\\'|[^'\\])+/, lineBreaks: true },
    },

    // A top-level eqution, surrounded in parenthesis.
    equation: {
        ws,
        startEquation,
        endEquation: { match: ")", pop: true },
        startString,
        variable,
        nfloat, ufloat, nint, uint,
        plus, minus, multiply, divide,
        nl,
    },

    // An equation interpolated inside a string, surrounded by "${ ... }".
    interpolatedEquation: {
        ws,
        startEquation,
        endEquation: { match: "}", pop: true },
        startString,
        variable,
        nfloat, ufloat, nint, uint,
        plus, minus, multiply, divide,
        nl,
    },

});

module.exports = lexer;
