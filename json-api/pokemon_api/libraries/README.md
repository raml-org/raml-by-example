RAML Fragments forked from [https://github.com/n2ygk/raml-snippets](https://github.com/n2ygk/raml-snippets).

## CHANGELOGS

* Removed unused `types`, `resourceTypes` and `traits` for clarity
* Split `jsonApiCollections.raml` in two files `jsonApiResourceTypes.raml` and `jsonApiResourceTraits.raml`
* Changed all occurences of `required: false` to the shorter equivalent `<type>?` syntax
* Removed all occurences ot `required: true` (default is `true`)
* Removed all occurences ot `additionalProperties: true` (default is `true`)
* Replaced `<<dataType>>_post` and `<<dataType>>_patch` with single param `<<dataType>>`
