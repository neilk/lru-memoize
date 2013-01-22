var fs = require('fs'),
    memoize = require("../"),
    test = require("tap").test;

test("basic", function(t) {
  function add(a, b) {
    return a + b;
  }
  var m_add = memoize(add);
  t.equal(add(10, 20), m_add(10, 20));
  t.notEqual(add(12, 34), m_add(10, 20));
  t.notEqual(add(12, 34), m_add(56, 78));
  t.end();
});

test("with async callback", function(t) {
  function countLines(filename, next) {
    var i;
    var count = 0;
    fs.createReadStream(filename)
      .on('data', function(chunk) {
        for (i=0; i < chunk.length; ++i) {
          if (chunk[i] == 10) {
            count++;
          }
        }
      })
      .on('end', function() {
        next(count);
      });
  }

  var m_countLines = memoize(countLines, { next: true });

  // unless we resort to more async libs here, have to nest them
  // to ensure outer available before inner
  countLines('lines-10.txt', function(count10) {
    m_countLines('lines-10.txt', function(memoizedCount10) {
      t.equal(count10, memoizedCount10);
      m_countLines('lines-12.txt', function(memoizedCount12) {
        t.notEqual(memoizedCount10, memoizedCount12);
        t.end();
      });
    });
  });

});
