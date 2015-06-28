var jf = require('jsonfile');

jf.appendFile = function(file, obj, callback) {
  console.log('file name', file);

  jf.readFile(file, function(err, objArray) {
    if (!objArray) {
      objArray = [];
    }

    objArray.push(obj);

    jf.writeFile(file, objArray, function(err) {
      if (err) {
        console.log('Error writing file...');
      }

      if (typeof callback === "function") {
        callback(err);
      }
    });
  });
}

module.exports = jf;
