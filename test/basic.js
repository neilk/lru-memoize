var test = require("tap").test,
    memoize = require("../")

test("basic", function(t) {
  function add(a, b) {
    return a + b;
  }
  var m_add = memoize(add);
  t.equal(add(10, 20), m_add(10, 20));
  t.end();
});

test("with callback", function(t) {
  function add(a, b) {
    return a + b;
  }
  var normalResult = add(11, 22);
  function cb(result) {
    t.equal(normalResult, result);
  }
  var m_add = memoize(add, { next: cb });
  m_add(11, 22);
  t.end();
});
