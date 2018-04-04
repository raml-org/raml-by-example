---
publication: 'RAML Playground'
tags: ['nodejs', 'osprey', 'RAML', 'JavaScript', 'Mocking']
license: 'cc-40-by'
---

# `osprey-mock-service` v0.3.0 released 🚀

A new version of `osprey-mock-service` -- [v0.3.0](https://github.com/mulesoft-labs/osprey-mock-service/releases/tag/v0.3.0) -- has been released today. This is a summary of the new features and improvments included in this release.

## Returning different examples each time

When multiple examples are defined in a given RAML type, `osprey-mock-service` will now select one of them "randomly".

```raml
(...)

/users:
  get:
    responses:
      200:
        headers:
          foo:
            examples:
              first: one
              second: two
              third: three
              fourth: four
```

## Adding support for `{ext}` 

The `{ext}` URI parameter in RAML 1.0 -- fka `{mediaTypeExtension}` in RAML 0.8 -- provides a mechanism to define resources that have multiple media types defined. Given the following definition:

```raml
(...)

/file{ext}:
  get:
    responses:
      200:
        body:
          application/json:
            example:
            (...)
          application/xml:
            example:
            (...)

```

`/file.json` and `/file.xml` will return their respective content type's examples.

## Misc fixes

- Issue with examples of `type: boolean` [#44](https://github.com/mulesoft-labs/osprey-mock-service/issues/44). Thanks [@goodevilgenius](https://github.com/goodevilgenius) 🎉
- Issue with response headers defined as `default` [#30](https://github.com/mulesoft-labs/osprey-mock-service/issues/30): the issue reported by [Christian Flamm](https://github.com/leflamm) Thank you [@rkosenko](https://github.com/rkosenko) and [@sichvoge](https://github.com/sichvoge) 🚀
- Issue with using default RAML mediaType in responses [#22](https://github.com/mulesoft-labs/osprey-mock-service/issues/22)
