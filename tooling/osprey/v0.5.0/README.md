---
publication: 'RAML Playground'
tags: ['nodejs', 'osprey', 'Express', 'JavaScript', 'Oauth2']
license: 'cc-40-by'
---

# Osprey v0.5.0 released

A new version of Osprey -- [v0.5.0](https://github.com/mulesoft/osprey/releases/tag/v0.5.0) -- has been released today.

## Support for more Passport options 

For "basic" authentication, [`Passport-http`](https://github.com/jaredhanson/passport-http) has the option `passReqToCallback` to return the request as the callback's first parameter.

Now, Osprey supports that option. When using `basic_auth` in RAML:

```raml
# api.raml
(...)
securitySchemes:
  - basic_auth:
      type: Basic Authentication

```

the middleware below will pass `req` to the callback:
```js
osprey.security(raml, {
  basic_auth: {
    realm: 'Users',
    passReqToCallback: true,
    validateUser: function (req, username, password, done) {
      # do something with `req`
      (...)
    }
  }
})
```

## Updated dependencies

The (Osprey-specific) dependencies below have been updated. This is the updated dependency tree:

```
mulesoft/osprey@0.5.0
|- mulesoft-labs/osprey-method-handler@0.12.0
|- mulesoft-labs/osprey-resources@0.8.0
|- mulesoft-labs/osprey-router@0.6.0
|- mulesoft-labs/node-request-error-handler@1.1.0
|- mulesoft/js-client-oauth2@4.2.0
mulesoft/js-client-oauth2@4.2.0
mulesoft-labs/node-raml-sanitize@1.3.0
mulesoft-labs/node-raml-validate@1.2.0
mulesoft-labs/node-request-error-handler@@1.1.0
|- mulesoft-labs/osprey-method-handler@0.12.0
mulesoft-labs/raml-path-match@2.2.0
|- mulesoft-labs/node-raml-sanitize@1.3.0
|- mulesoft-labs/node-raml-validate@1.2.0
mulesoft-labs/osprey-method-handler@0.12.0
|- mulesoft-labs/osprey-router@0.6.0
|- mulesoft-labs/node-raml-sanitize@1.3.0
|- mulesoft-labs/node-raml-validate@1.2.0
mulesoft-labs/osprey-resources@0.8.0
|- mulesoft-labs/osprey-router@0.6.0
mulesoft-labs/osprey-router@0.6.0
|- mulesoft-labs/raml-path-match@2.2.0
```

Also, [Greenkeeper](https://greenkeeper.io) has been enabled to automatically track dependencies from now on.

## Bugfixes

- Handling of `additionalProperties: false` in Object type definitions:
```raml
(...)
types:
  FooBar:
    type: object
    properties:
      Foo: string
      Bar: number
    additionalProperties: false
```
Now `additionalProperties: false` tells Osprey not to allow any additional properties in an Object definition.

- Custom headers defined inside `securitySchemes` are now applied to the request:
```raml
#%RAML 1.0
title: My api

securitySchemes:
  - custom_auth:
      type: x-custom-auth
      describedBy:
        headers:
          Custom-Token:
            type: string
(...)

/foo:
  get: 
    securedBy: [custom_auth]
```
With the definition above, Osprey will now return `Custom-Token` as if it was defined under the resource/method.

- The following definition was causing an issue, but now works as expected:

```raml
#%RAML 1.0
title: My api
baseUri: http://localhost:3000

types:
  Foo: !include schemas/foo.json

/foo:
  post:
    body:
      application/json:
        type: Foo
```
