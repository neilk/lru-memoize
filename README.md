# lru-memoize

Memoize Node.JS functions with an LRU cache

## Usage

Memoization is a technique to speed up functions, by using a cache, without altering the function or calling it 
differently.

```javascript
var memoize = require('lru-memoize');

function reallySlow(foo, bar) {
   /* ... */
}

var reallyFast = memoize(reallySlow);

reallyFast(10, 20);
reallyFast(10, 20);  // faster!

```

Use this when:
- You have a function you want to speed up
- It is called repeatedly during its lifetime with the same parameters
- The function is *pure*; that is, the results depend entirely on the arguments, and not information looked up elsewhere like a database, the current time, etc.
- You can afford to burn more memory storing results
- You don't mind the cache lifetime being tied to node's lifetime

### Options

You can set options for how the underlying LRU cache should work, with a second parameter. See the documentation for [node-lru-cache][1]
for details.

```javascript
var reallyFast = memoize(reallySlow, { maxAge: 1000 * 60 * 60 });
```

There is one additional parameter not specified by node-lru-cache, which allows for results to be passed to a callback instead.

```javascript
function cb(results) {
  console.log(results);
}

var reallyFastCb = memoize(reallySlow, { next: cb });
```

### Caveats

This module does not work with functions which rely on 'this' context, or which take functions themselves.

The function arguments should be cleanly stringifiable.

Functions which use arguments that contain the control character '\001' may have surprising results.

[1]: https://github.com/isaacs/node-lru-cache/
