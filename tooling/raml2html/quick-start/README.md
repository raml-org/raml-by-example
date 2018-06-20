---
publication: 'RAML Playground'
tags: ['RAML', 'Quick Start', 'documentation']
license: 'cc-40-by'
---

# `raml2html` Quick Start

raml2html is a documentation generator for RAML. It supports RAML 1.0. It provides both a CLI and a NodeJS library. It also supports custom themes.

To begin, let's download a sample RAML file:

```sh
$ curl https://raw.githubusercontent.com/raml-org/raml-examples/master/others/mobile-order-api/api.raml > api.raml
$ curl https://raw.githubusercontent.com/raml-org/raml-examples/master/others/mobile-order-api/assets.lib.raml > assets.lib.raml
```

Install `raml2html`:

```sh
$ npm install -g raml2html
```

Then the `raml2html` CLI can be used:

```sh
$ raml2html api.raml > api_spec.html
```

Which will generate an HTML file `api_spec.html` that can be opened in a browser.
