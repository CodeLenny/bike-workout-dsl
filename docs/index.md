---
uid: home
---
<link rel="stylesheet" href="./css/milligram.min.css">

# powERGful Language

Human-readable structured workout files.

## Features

<div class="container">
<div class="row">

<div class="column">
<h4>Straightforward</h4>
<p>
Define each section of a workout in a linear list,
using syntax made for humans.
</p>
</div>

<div class="column">
<h4>Parameterizable</h4>
<p>
Program workouts based on direct wattage and heartrate targets,
or set percentage targets based on FTP or FTHR.
</p>
<p>
powERGful supports loops and other advanced constructs, which makes programming intervals easy.
</p>
</div>

<div class="column">
<h4>Outputs Standard Formats</h4>
<p>
Outputs `erg` and FIT files, which are compatible with most programs.
</p>
<p>
More formats may be supported later.
</p>
</div>

</div></div>

## Content

#### Tutorial

A walkthrough the creation of a basic workout file
is [available](xref:tutorial-landing).

#### Grammar Documentation

Documentation of each part of the language is [available](xref:grammar-landing), including railroad diagrams.

#### API Documentation

powERGful supplies a TypeScript/JavaScript API for people who want to compile workouts in their own programs.

[Documentation](xref:api-landing)

## Example powERGful File

[!code[example](./code/example.workout "Example powERGful File")]

## Command Line Usage

Want to convert powERGful files into `erg` or FIT files?  A simple command-line utility is provided.

### Pre-Requisites

You must have [Node.js][] and [NPM][] installed on your machine.

### Installation and Usage

# [Global Installation](#tab/install-global)

You can install powERGful globally, so you can use it anywhere on your machine.

First, install the package:

```sh
npm install --global powergful
```

Then you can execute `powergful` to convert files:

```sh
powergful convert --outdir ~/out/ ~/Documents/my-workout.workout
```

# [Local Installation](#tab/install-local)

You can install powERGful inside a single directory, so files aren't installed globally on your machine.

Move into the desired directory, and install `powergful` via NPM:

```sh
mkdir ~/workouts
cd ~/workouts
npm install powergful
```

Now you can use the `powergful` binary, either using the `$(npm bin)` shortcut, or fully specifying the path to the binary:

```sh
$(npm bin)/powergful --help
node_modules/.bin/powergful --help
```

***

[Node.js]: https://nodejs.org/en/
[NPM]: https://www.npmjs.com/
