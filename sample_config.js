
module.exports = {

  rowFilter: [
    { column: 1, val: 'abc' },
    { column: 2, val: function(v) { return Number(v) > 2 } }
  ],

  columns: [
    { column: 1, key: 'key1' },
    { column: 2, key: 'key2', format: Number },
    { column: 3, key: 'key3', format: function(v) { return 'abc_'+v; } }
  ]
};
