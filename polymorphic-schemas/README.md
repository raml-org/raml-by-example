---
publication: 'RAML Playground'
tags: ['API', 'Api Design', 'RAML']
license: 'cc-40-by'
---

![Author: Phunk Studio (https://en.wikipedia.org/wiki/File:Control_chaos.jpg)](https://upload.wikimedia.org/wikipedia/en/b/ba/Control_chaos.jpg)

# Schema-less does not mean "no" schema

With the rise of so-called "schema-less" databases, we've seen an increasing number of Rest APIs returning collections of things that look different from one another. The term "schema-less" may be misleading because it suggests that those things don't follow any particular schema while, in fact, they follow many. The "less" in "schema-less databases" means that schemas and validation against those schemas has been taken out of the database layer. In most cases, this means that the validation happens at the application layer instead and this introduces new capabilities such as polymorphism. Now let's see how this works.

Here's a real-life example:
```
$ http :1234/users
HTTP/1.1 200 OK

[
  {
    "first_name": "Jane"
    "last_name": "Doe",
    "email": "jane@doe.com"
  },
  {
    "first_name": "John"
    "last_name": "Bear",
    "emails" [
        "john@bear.com",
        "john.bear@mail.com"
    ]
  }
]
```

here's another one:
```
$ http :1234/animals
HTTP/1.1 200 OK

[
  {
    "name": "bear",
    "legs": 4
  },
  {
    "name": "shark",
    "fins": 8
  }
]
```

and here's an even more common example:
```
$ http :1234/search?query=bear
HTTP/1.1 200 OK

[
  {
    "name": "bear",
    "legs": 4
  },
  {
    "first_name": "John"
    "last_name": "Bear",
    "emails" [
        "john@bear.com",
        "john.bear@mail.com"
    ]
  }
]
```

## So how do I model polymorphism?

Let's say we had a collection of vehicles that we wanted to expose via a REST API. We could create a base schema `vehicle.raml` that defined the common properties shared between all those vehicles:

<script src="https://gist.github.com/3c536a674f821259035eded1ed96bbb1"></script>

and then create separate schemas that inherited from this base schema and had vehicle type-specific information, such as a `Bicycle` schema:

<script src="https://gist.github.com/82b03c1085a6a701261d491072c2cb0d"></script>

a `Boat` schema:

<script src="https://gist.github.com/d21a505b6548d8b1ca29dbd19bbe83ce"></script>

a `Car` schema:

<script src="https://gist.github.com/31881615d68275953b56e1be96082681"></script>

and a `Plane` schema:

<script src="https://gist.github.com/cafd576f36f5471fb40080a87652fef1"></script>

## Ok, then what?

Now let's tie it all together under one `/vehicles` resource:

<script src="https://gist.github.com/dfe6ddfd4d98fac76ab180e38eef2d12.js"></script>

## Voilà!

In this example, we've created a base schema, created four schemas inheriting from that base schema, and then exposed those schemas under a single polymorphic resource using [RAML type expression](https://github.com/raml-org/raml-spec/blob/master/versions/raml-10/raml-10.md#type-expressions). We expressed a POST request with a union of those schemas and we expressed a GET response with an array of the same union. This means we can now use this RAML definition in front of our schema-less database to validate incoming and outgoing data. 

This illustrates that modeling a REST API along with its resources and data schemas is important, even more so when the backend database is "schema-less".

***

Notes:
- this post illustrates examples using the amazing command-line http-querying tool [HTTPie](https://httpie.org)
- this post does not cover [`discriminator`](https://github.com/raml-org/raml-spec/blob/master/versions/raml-10/raml-10.md#using-discriminator) which is another RAML feature that may be used in conjuction with Union types
