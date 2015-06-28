"use strict";

var url = require('url');
var mkdirp = require('mkdirp');
var WebPageTest = require('webpagetest');
var wpt = new WebPageTest('www.webpagetest.org');
var jf = new require('./jsonfile');
var config = require('./config');

var statusCheckPeriod = 10000;  // assuming test completion time to be 30 seconds.
var pendingStatusCheckPeriod = 30000;  // assuming test completion time to be 30 seconds.

for (var i = 0; i < config.url.length; i++) {
  wpt.runTest(config.url[i], config.options, getTestDetails);
}

function getTestDetails(err, resp) {
  if (err) {
    return console.log(err);
    // process.exit(err);
  }

  console.log(resp);

  var testId;

  if (resp.data) {
    testId = resp.data.testId;

    console.log('Test Id Created!, Test Id:', testId);

    // check test status periodically while the status is not 200
    checkTestStatus(testId);
  }
}

function checkTestStatus(testId) {
  wpt.getTestStatus(testId, function(err, resp) {
    console.log('--------------------------------------------');

    if (err) {
      return console.log(err);
    }

    console.log(resp.statusText);
    if (resp.statusCode === 200) {
      // get the result
      getTestResults(testId);

    } else if (resp.statusCode === 100) {
      console.log('Checking after ' + (statusCheckPeriod / 1000), 'seconds');
      setTimeout(function() { checkTestStatus(testId); }, statusCheckPeriod);
    } else if (resp.statusCode === 101) {
      var behindCount = resp.data.behindCount;
      var waitTimeForNextTry = pendingStatusCheckPeriod * (behindCount || 1);
      console.log(resp.statusText);
      console.log('Checking after ' + waitTimeForNextTry / 1000, 'seconds');
      setTimeout(function() { checkTestStatus(testId); }, waitTimeForNextTry);
    } else {
      console.log(resp);
    }
  });
}

function getTestResults(testId) {
  wpt.getTestResults(testId, function(err, resp) {
    if (err) {
      return console.log(err);
    }

    if (resp.statusCode !== 200) {
      return console.log('status code:', resp.statusCode);
    }

    if (!resp.data) {
        return console.log('data is null for', testId);
    }

    var viewData = ['docTime', 'loadTime', 'fullyLoaded', 'SpeedIndex', 'visualComplete', 'bytesIn', 'bytesInDoc', 'requestsDoc', 'domElements'];
    var fields = ['id', 'url', 'location', 'connectivity', {'runs': [{'1': [{'firstView': viewData}, {'repeatView': viewData}]}]}];
    var usefulData = extractRequiredData(resp.data, fields);
    usefulData.runTime = Date.now();
    var directoryPathToSaveData = __dirname + '/app/public/data/' + getDirectoryPathFromURL(resp.data.url);

    mkdirp(directoryPathToSaveData, function (err) {
      if (err) { return console.log(err); }
      jf.appendFile(directoryPathToSaveData + '/data.json', usefulData);
    });
  });
}

function getDirectoryPathFromURL(websiteUrl) {
  var parsedURL = url.parse(websiteUrl);
  var directoryPath = parsedURL.host + (parsedURL.pathname !== '/' ? parsedURL.pathname : '');

  console.log(directoryPath);

  return directoryPath;
}

function extractRequiredData(data, fields) {
  var resultData = {};
  var field;
  var fieldName;

  for (var i = 0; i < fields.length; i++) {
    field = fields[i];
    if (typeof field === 'string') {
      resultData[field] = data[field];
    } else {
      for (fieldName in field) {
        resultData[fieldName] = extractRequiredData(data[fieldName], field[fieldName]);
      }
    }
  }

  return resultData;
}
