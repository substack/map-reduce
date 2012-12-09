var mapReduce = require('../')
var levelup = require('levelup')
var assert = require('assert')
var mac = require('macgyver')().autoValidate()

var file = '/tmp/' + Math.random() + '.ldb'

levelup(file, { createIfMissing : true }, function (err, db) {
  if (err) assert.error(err)

  mapReduce(db)
  var mr = db.mapReduce
 
  mr.add({
    name : 'concat',
    map : function (key, doc, emit) {
      emit(key, doc)
    },
    reduce : function (acc, x) {
      var value = JSON.parse(x)
      var res = JSON.parse(acc)
      res.push(value)
      return JSON.stringify(res)
    },
    initial : '[]'
  })

  var v = mr.view('concat', [])
  v.on('data', mac(function (data) {
    assert.deepEqual(JSON.parse(data.value), [4,5])
  }).times(1))

  db.put('a', '4')
  db.put('b', '5')
})
