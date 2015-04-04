
var csv = require('csv').parse,
  fs = require('fs'),
  prettyMs = require('pretty-ms'),
  pathIsAbsolute = require('path-is-absolute'),
  Filter = require('./lib/filter'),
  argv = require('yargs')
    .help('h')
    .usage('Usage: $0 -i [input file] -o [output file] -c [config file]')
    .demand(['i','o','c'])
    .default({ i: 'input.csv', o: 'output.json', c: 'sample_config' })
    .argv;


var count = 0;
var output = [];
var t1 = Date.now();


var fileName = pathIsAbsolute(argv.i)
                ? argv.i : (__dirname+'/'+argv.i);

var ws = fs.createWriteStream(
            pathIsAbsolute(argv.o)
              ? argv.o : (__dirname+'/'+argv.o)
          );

var config = require(
              pathIsAbsolute(argv.c)
                ? argv.c : (__dirname+'/'+argv.c)
             );


// Init things, and the filter criteria
var filter = new Filter(config);
ws.write('[\n');


var parser = csv({
  delimiter: '  ',
  relax: true
})
.on('readable', function() {

  var record = parser.read();
  record = record && record[0];

  if (record) {
    console.log(++count);
    var out = record.split('\t');

    // Filtering logic
    out = filter.run(out);
    if (out && typeof out === 'object') {
      ws.write(JSON.stringify(out)+',\n');
    }
  }
})
.on('error', function(err) {
  console.log(err.message);
})
.on('finish', function() {
  ws.write(']');
  ws.end();
  console.log('Total Rows: %s', count);
  console.log('Time Taken rows: %s', prettyMs((Date.now() - t1)/1000, {compact: true}));
});

fs.createReadStream(fileName).pipe(parser);
