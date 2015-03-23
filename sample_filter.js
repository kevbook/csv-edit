
module.exports = {
  row: [
    { column: 1, key: 'abc' },
    { column: 2, key: function(v) { return 'abc_'+v; } },
    { column: 3, key: function(v) { return Number(v) } },
  ],
  column: [
    { column: 1, key: 'key1' },
    { column: 1, key: 'key2', format: Number }
  ]
};
