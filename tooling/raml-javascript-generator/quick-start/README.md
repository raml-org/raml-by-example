---
publication: 'RAML Playground'
tags: ['RAML', 'Quick Start', 'JavaScript', 'NPM']
license: 'cc-40-by'
---

# `raml-javascript-generator` Quick Start

[`raml-javascript-generator`](https://github.com/mulesoft-labs/raml-javascript-generator) is a tool that generates JavaScript API clients from RAML API definitions. It takes a RAML file as input and outputs a NPM package. 

Let's start by installing `raml-javascript-generator`:

```sh
$ npm install raml-javascript-generator -g
```

We now need a RAML file, let's use the `world-music-api` from the [`raml-org/raml-examples`](https://github.com/raml-org/raml-examples) repository. At this point, we can either reference a local RAML file or point to a remote one using an URL:

```sh
$ raml-javascript-generator https://raw.githubusercontent.com/raml-org/raml-examples/e91308b/others/world-music-api/api.raml -o world-music-api
```

Let's take a closer look inside:

```sh
$ cd world-music-api/
$ ls -1 ./
INSTALL.md
README.md
index.js
package.json

```

The result is an installable NPM package with all its dependencies defined in `package.json`. 

```sh
$ cat package.json | jq .dependencies
{
  "client-oauth2": "^2.1.0",
  "xtend": "^4.0.1",
  "request-promise": "^4.2.2",
  "request": "^2.34",
  "setprototypeof": "^1.0.1",
  "query-string": "^5.0.0"
}
```

It also generates a `README` with basic usage instructions. Let's take a look at some of those instructions:
```sh
$ grep -o '#### `.*' README.md 
#### `api.get([query, [options]])`
#### `api.post([body, [options]])`
#### `entry.post([body, [options]])`
#### `entry.get([query, [options]])`
#### `songs.get([query, [options]])`
#### `songs.post([body, [options]])`
#### `songs.songId({ songId }).get([query, [options]])`
```

Great! Now, we can install the generated library:

```sh
$ npm install
```

and use it in our JavaScript code. 

But before playing further, we'll need to have an API backend running. We'll use `osprey-mock-service` for that (don't forget to check-out this [`osprey-mock-service` post](https://medium.com/raml-api/quick-mocks-with-osprey-mock-service-ef46d72491b7)):

```
$ osprey-mock-service -f https://raw.githubusercontent.com/raml-org/raml-examples/e91308b/others/world-music-api/api.raml -p 1234
Mock service running at http://localhost:1234
```

Now that we have an API backend running, we can query using our `world-music-api` library:

```js
# test.js
const WorldMusicAPI = require('.')
const client = new WorldMusicAPI({baseUri: 'http://localhost:1234/v1'})

client.songs.songId({'songId': 1}).get().then((response) => {
  console.log(response.body)
})
```

Then, running this snippet will output:
```sh
node test.js 
{ title: 'My Song', length: 12 }
```