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
- These identical calls tend to happen around the same time
- The function is *pure*; that is, the results depend entirely on the arguments, and not information looked up elsewhere like a database, the current time, etc.
- You can afford to burn more memory storing results
- You don't need the cache to persist between runs of Node.js

Note that the cache is right in the node process, and thus complex data structures do not need to be serialized, and can even share objects. This can make it much faster or
more convenient than using an external cache server like [memcached][2].

The underlying cache is a least-recently-used (LRU) cache. The cache tries to use a constant amount of memory, and when necessary throws away old results that 
haven't been requested in a while.

### Options

You can set options for how the underlying LRU cache should work, with a second parameter. See the documentation for [node-lru-cache][1]
for details.

```javascript
var reallyFast = memoize(reallySlow, { maxAge: 1000 * 60 * 60 });
```

There is one additional parameter not specified by node-lru-cache, which allows for results to be passed to a callback instead. This is useful if your 
slow function does IO, and thus becomes asynchronous. The convention of using the callback as the last argument is assumed.

```javascript
function reallySlow(foo, bar, next) {
  /* do something that takes a long time with foo and bar */
  next(results);
}

function cb(results) {
  console.log(results);
}

reallySlow(10, 20, cb);

var reallyFastCb = memoize(reallySlow, { next: true });

reallyFast(10, 20, cb); // faster!

// The last argument isn't part of the memoization, so you can alter it
reallyFast(10, 20, someOtherCb); // still fast!
```

### Caveats

This module does not work with functions which rely on 'this' context, or which take functions themselves.

The function arguments should be cleanly stringifiable.

Functions which use arguments that contain the control character '\001' may have surprising results.

[1]: https://github.com/isaacs/node-lru-cache/
[2]: http://memcached.org/
