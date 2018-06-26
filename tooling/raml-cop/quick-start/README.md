---
publication: 'RAML Playground'
tags: ['RAML', 'tutorial']
license: 'cc-40-by'
---

# Intro to raml-cop

This is an introduction to [raml-cop](https://github.com/thebinarypenguin/raml-cop). raml-cop is a command line tool for validating RAML files.

## Install

```sh
$ npm install raml-cop -g
```

## Run

Download example RAML:

```sh
$ wget -O api.raml https://raw.githubusercontent.com/raml-org/raml-examples/master/typesystem/simple.raml
```

Try to validate it:

```sh
$ raml-cop api.raml
[api.raml] VALID
```

Now let's make our RAML file invalid and try to validate it again:

```sh
$ echo "types: foo: bar: baz" >> api.raml

$ raml-cop api.raml
[api.raml:16:10] ERROR JS-YAML: incomplete explicit mapping pair; a key node is missed at line 17, column 11
[api.raml:16:0] ERROR Property 'types' can not have scalar value
[api.raml:15:12] ERROR Inheriting from unknown type
```
