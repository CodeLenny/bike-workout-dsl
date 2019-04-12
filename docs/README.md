# powERGful Documentation

The documentation for powERGful is written using [DocFX][].

TypeScript documentation is imported into [DocFX][] using [TypeDoc][] and [Type2DocFx][].

## Local Build (Using Docker)

```sh
$(npm bin)/typedoc BikeWorkoutDSL.ts Model/*.ts --json docs/typedoc.json
$(npm bin)/type2docfx docs/typedoc.json docs/api
docker run \
    --rm \
    -it \
    -v $(pwd)/docs:/root/docs \
    -v $(pwd)/node_modules:/root/node_modules \
    -w /root/docs \
    tsgkadot/docker-docfx:latest \
    docfx build
```

Preview with `google-chrome out/index.html`.

The table of contents is broken if serving locally: the TOC attempts AJAX calls to the filesystem, which is blocked by the browser.

Use `npx serve out/` to quickly serve the documentation on `localhost`.

[DocFX]: https://dotnet.github.io/docfx/index.html
[TypeDoc]: http://typedoc.org/
[Type2DocFx]: https://www.npmjs.com/package/type2docfx
