## raml2html description

I think all necessary description can be taken from its repo README https://github.com/raml2html/raml2html/blob/master/README.md

## RAML features used in the example project

* Endpoints and methods are documented with description and displayName;
* Endpoints methods requests and responses are documented with schemes defined as RAML Data Types;
* resourceTypes defining response bodies codes and schemes, headers, descriptions;
* RAML Data Types.

## Generating the html

First download the RAML files we are going to use:

```sh
curl https://raw.githubusercontent.com/raml-org/raml-examples/master/others/mobile-order-api/api.raml > api.raml
curl https://raw.githubusercontent.com/raml-org/raml-examples/master/others/mobile-order-api/assets.lib.raml > assets.lib.raml
```

Then you need to install `raml2html`:

```sh
npm install -g raml2html
```

Then you can perform conversion with:

```sh
raml2html api.raml > api_spec.html
```

Now check out `api_spec.html` in your browser.

## Hosting the HTML

Generated html is hosted via [this gist](https://gist.github.com/postatum/aa4a25f8a5c677024d8d86942cd79568) at [this rawgit dev url](https://rawgit.com/postatum/aa4a25f8a5c677024d8d86942cd79568/raw/d9b246551440477e0ba2f70482bc6c2f3203ae15/api_spec.html)
