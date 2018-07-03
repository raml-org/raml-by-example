---
publication: 'RAML Playground'
tags: ['RAML', 'Quick Start', 'parsing', 'validation']
license: 'cc-40-by'
---

# `raml-cop` Quick Start

[`raml-cop`](https://github.com/thebinarypenguin/raml-cop) is a command-line tool for validating RAML files. It supports both RAML 0.8 and 1.0. It can validate included files as well as RAML 1.0 Fragments.

Let's give it a try. We'll start by installing `raml-cop` globally so that it's permanently availble in the terminal:

```sh
$ npm i -g raml-cop
```

Now, let's download a simple RAML example:

```sh
$ curl -o api.raml https://raw.githubusercontent.com/raml-org/raml-examples/master/typesystem/simple.raml
```

And let's validate it:

```sh
$ raml-cop api.raml
[api.raml] VALID
```

Now, let's make that RAML file invalid by removing its first line:

```sh
$ tail -n +2 api.raml > api-invalid.raml
```

and let's validate that invalid RAML again:

```sh
$ raml-cop api-invalid.raml
[api-invalid.raml] ERROR Invalid first line. A RAML document is expected to start with '#%RAML <version> <?fragment type>'.
```
