## raml2html description

I think all necessary description can be taken from its repo README https://github.com/raml2html/raml2html/blob/master/README.md

## RAML features used in the example project

* RAML spec with complex Markdown documentation, version, title, baseUriParameters, protocols, media type, secured;
* Included documentation with snippets and structured Markdown;
* Included resourceTypes, traits, securitySchemes;
* Multiple nested endpoints using protocols, traits, resourceTypes;
* Endpoints and methods are documented with description and displayName;
* Endpoints methods requests and responses are documented with schemes defined as RAML Data Types;
* resourceTypes using reserved parameter names like resourcePath and resourcePathName;
* resourceTypes defining request/response bodies codes and schemes, headers, descriptions;
* Well documented oath2 security scheme describing various possible responses;
* Traits describing pagination, search and items images features;
* RAML Data Types including descriptions, well documented properties, examples, inheritance;

## Generating the html

First you need to install `raml2html` and `raml2html-slate-theme` scheme:

```sh
npm install -g raml2html
npm install -g raml2html-slate-theme
```

Then you can pefrorm conversion with:

```sh
raml2html --theme raml2html-slate-theme api.raml > api_spec.html
```

## Hosting the HTML

When this article is merged and finished, just submit the HTML link to `rawgit.com` and copy the link that it generates.
E.g. pasting [this link](https://github.com/postatum/raml-playground/blob/raml2html-outstanding-docs/raml2html-outstanding-docs/mobile-shoping-api/api_spec.html) produced [this link](https://rawgit.com/postatum/raml-playground/raml2html-outstanding-docs/raml2html-outstanding-docs/mobile-shoping-api/api_spec.html).

Note the link type that should be passed to rawgit - it's a link to the file on github, not its raw version.

## Notes

* Had to manually add `displayName` to methods that use traits because for some reason `raml2html` titled them by the trait name. E.g. `GET /items` was titled as `Searchable`
