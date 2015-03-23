
var _ = require('lodash');


var filterFn = function(criteria) {

  if (!criteria) throw new Error('criteria object must be passed.');

  var rowFn = [],
    columnFn,
    columnFormatFn = [],
    columnIndices,
    columnKeys;


  // Generate column functions
  _.forEach(criteria.row, function(item) {
    rowFn.push(function(data) {
      var i = (data && data[item.column - 1] && data[item.column - 1].trim());

      // Validation can be a string or a function
      if (i && typeof item.key === 'string') return i === item.key
      else if (i && typeof item.key === 'function') return item.key(i);
      return false;
    });
  });

  // Generate column functions
  columnIndices = _.reduce(criteria.column, function(ret, i) {
    ret.push(i.column - 1);
    return ret;
  }, []);

  columnKeys = _.reduce(criteria.column, function(ret, i) {
    ret.push(i.key);
    return ret;
  }, []);


  columnFn = function(data) {
    return _.zipObject(columnKeys, _.pullAt(data, columnIndices));
  }

  // Apply format filters
  _.forEach(criteria.column, function(item) {
    if (typeof item.format === 'function') {

      columnFormatFn.push(function(data) {
        data[item.key] = item.format(data[item.key]);
      });
    }
  });

  this._columnFn = columnFn;
  this._columnFormatFn = columnFormatFn;
  this._rowFn = rowFn;
  return this;
};

filterFn.prototype.run = function(data) {

  var passed = true;

  _.forEach(this._rowFn, function(fn) {
    if ( ! fn(data) ) {
      passed = false;
      return false;
    }
  });

  if (passed) {
    data = this._columnFn(data);

    return _.forEach(this._columnFormatFn, function(fn) {
      fn(data);
    }) && data;
  }

  return false;
};

module.exports = filterFn;
