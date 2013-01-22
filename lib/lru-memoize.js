lru = require('lru-cache');
/**
 * Given a function,
 * return a memoized version using an LRU cache
 *
 * n.b. functions that take functions as arguments, or rely
 * on "this" context, won't work properly
 *
 * The options parameter is simply the options for the LRU cache,
 * which may be expressed as a simple number for number of entries to cache.
 * The option property 'next' can specify a callback to pass results.
 * This parameter will not be passed on to the LRU cache.
 *
 * @param {Function} fn
 * @param {Object|Number} options
 * @return {Function}
 */
module.exports = function(fn, options) {

  var usesNext;
  if (typeof options === 'undefined') {
    options = 10000;
  } else if (typeof options === 'object' && options.next) {
    usesNext = options.next;
    delete options.next;
  }

  var cache = lru(options);

  if (usesNext) {
    /* asynchronous function, with callback as last argument */
    return function() {
      var args = Array.prototype.slice.call(arguments);
      var next = args.pop();
      var key = args.join('\x01');
      if (cache.has(key)) {
        return next(cache.get(key));
      } else {
        args.push(function(results) {
          cache.set(key, results);
          return next(results);
        });
        fn.apply(null, args);
      }
    };
  } else {
    /* synchronous function */
    return function() {
      var args = Array.prototype.slice.call(arguments);
      var key = args.join('\x01');
      var results;
      if (cache.has(key)) {
        results = cache.get(key);
      } else {
        results = fn.apply(null, args);
        cache.set(key, results);
      }
      return results;
    };
  }
};


