---
publication: 'RAML Playground'
tags: ['API', 'Software Engineering', 'RAML']
license: 'cc-40-by'
---

# Modeling multipart requests

Given the following http multipart request:
```
POST /content HTTP/1.1
(...)

--34b21
Content-Disposition: form-data; name="text"
Content-Type: text/plain

Book
--34b21
Content-Disposition: form-data; name="file1"; filename="a.json"
Content-Type: application/json

{
  "title": "Java 8 in Action",
  "author": "Mario Fusco",
  "year": 2014
}
--34b21
Content-Disposition: form-data; name="file2"; filename="a.html"
Content-Type: text/html

<!DOCTYPE html>
<title>
  Available for download!
</title>
--34b21--
```

## How to model this request in RAML?

RAML provides a type [`file`](https://github.com/raml-org/raml-spec/blob/master/versions/raml-10/raml-10.md#file) which can be used in combination with `fileTypes` to define which content-type is allowed in each part of a multiplart request.

This is what it looks like:
```
#%RAML 1.0
title: My API

/content:
  post:
    body:
      multipart/form-data:
        properties:
          text: string
          file1:
            type: file
            fileTypes: ['application/json']
          file2:
            type: file
            fileTypes: ['text/html']

```
