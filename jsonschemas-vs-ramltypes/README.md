---
publication: 'RAML Playground'
tags: ['API', 'Api Design', 'JSON', 'RAML']
license: 'cc-40-by'
---

# Why use RAML data types?

I was recently asked: "*Why should I use RAML data types when I can embed JSON schemas directly in my API definitions?*". 

***

I thought providing a simple side-by-side example would speak for itself. As I was writing the example, I thought it would be worth sharing.

Here's an API definition with two JSON schemas:

<script src="https://gist.github.com/a0c76b1d4800c77e6196ebe65de6167f"></script>

And here's an equivalent using RAML data types:

<script src="https://gist.github.com/952514e7e35b43e98c9db7e210a06312"></script>

Not that one is better than the other, and the nice part is that you can use either or both. However, the RAML type system makes schemas a lot easier to read, and a lot more concise because RAML types can be re-used and inherited from throughout an API definition.
