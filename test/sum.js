
var MR      = require('..')
var levelup = require('levelup')
var assert  = require('assert')

function parsed (fun) {
  return function () {
    var args = 
      [].slice.call(arguments)
        .map(function (e) {
          return JSON.parse(e)
        })
      return JSON.stringify(fun.apply(this, args))
  }
}


var mr = MR({
  path: '/tmp/map-reduce-sum-test',
  reduce: parsed(function (a, b) {
    return a + b
  }),
  initial: 0
})

mr.on('reduce', function (sum) {
  console.log(sum)
  assert.equal(JSON.parse(sum), ( 10000 * 10001 ) / 2)
})
