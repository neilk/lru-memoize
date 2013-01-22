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
