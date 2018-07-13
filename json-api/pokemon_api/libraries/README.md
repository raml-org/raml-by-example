RAML Libraries `jsonApiCollections.raml` and `jsonApiLibrary.raml` taken from https://github.com/n2ygk/raml-snippets and reworked a little to only defined elements used in the example app and fix few issues.

## Things changed in libs

* Removed not used definitions (types, resourceTypes, traits) to make things simpler and avoid parsing errors;
* Replaced `<<dataType>>_post` and `<<dataType>>_post` definitions with single param `<<dataType>>` because parser coudn't find types referenced the old way. I think the original type of definition just wasn't valid.
* Had to split `success` type to `collectionSuccess` and `itemSuccess`. These represent collection/item response. Had to do it because `datatype-expansion` or something deeper doesn't process type unions (`foo | bar`) properly and validates schema against all types instead of "any".

These changes have no effect on the result, I'm just letting you know.
