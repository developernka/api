var fs = require('fs');
var path = require('path');
var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      var fileName = file;
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          console.log(__dirname, file);
          results.push({
            path: file.replace(__dirname + '\\', '').replace(/[\\]/g, '/'),
            name: fileName,
            update: stat.mtime
          });
          if (!--pending) done(null, results);
        }
      });
    });
  });
};
walk(path.join(__dirname, 'data'), function(err, results) {
  if (err) throw err;
  fs.writeFileSync(
    path.join(__dirname, 'files.json'),
    JSON.stringify(results, null, 2)
  );
  console.log(results);
});
