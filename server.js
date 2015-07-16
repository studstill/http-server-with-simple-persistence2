var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;


function startServer() {
  var app = express();
  app.listen(port, function() {
    console.log('Server started on port 3000');
  });
  app.use(bodyParser.json());

  /************************************************************
  /   Handle GET requests
  /************************************************************/

  // Handle Root URL GET request
  app.get('/', function(request, response) {
    var fileList = getDirInfo();
    response.send(fileList);
  });

  // Handle ANY OTHER GET Request
  app.get('/:id', function(request, response) {
    var fileList = getDirInfo();
    var fileIndex = request.params.id;
    if (!fileList.hasOwnProperty(fileIndex)) {
      response.send(JSON.stringify(fileList) + '\n\nPlease direct your request ' +
        'to a numbered enpoint to read the file\'s contents (example - "local' +
        'host:3000/0 GET")');
    } else {
      // Respond with contents of data directory
      fs.readFile('data/' + fileList[fileIndex], function(err, data) {
        if (err) throw err;
        response.send(JSON.parse(data));
      });
    }
  });

  /************************************************************
  /   Handle POST requests
  /************************************************************/

  // Handle Root URL POST request
  app.post('/', function(request, response) {
    var fileList = getDirInfo();
    response.send('Please direct your POST ' +
      'request to the endpoint "/data" (example - "localhost:3000/data POST ' +
      '\'{"username": "usernameToPost", "email": "emailToPost"\')');
  });

  // Handle ANY OTHER POST Request
  app.post('/data', function(request, response) {
    var fileList = getDirInfo();
    var fileIndex = request.params.id;
    var postBody = request.body;
    // Ensure that the POST data is properly formatted
    if (!postBody.username) {
      response.send('Please format your request like this: \n' +
        '{"username": "usernameToPost", "email": "emailToPost"\')');
    } else {
      // Make username lower case
      var username = JSON.stringify(request.body.username).toLowerCase();
      var username = JSON.parse(username);

      // Ensure that a file with this user doesn't already exist
      var canSave = true;
      for (var keys in fileList) {
        if (fileList[keys] === username + '.json') {
          canSave = false;
        }
      }
      if (!canSave) {
        response.send('A file for that username already exists! If you ' +
          'would like to change the file, please use PUT');
      } else {
        // Write contents of the file
        fs.writeFile('data/' + username + '.json',
          JSON.stringify(request.body), function(err, data) {
          if (err) throw err;
          response.send('File Sucessfully Saved!');
        });
      }
    }
  });

  /************************************************************
  /   Handle PUT requests
  /************************************************************/

  // Handle Root URL POST request
  app.put('/', function(request, response) {
    response.send('Please direct your endpoint to the username you would like' +
      ' to update (example - /Jim PUT \'{"fieldToUpdate": "updatedInfo"}\'');
  });

  // Handle ANY OTHER PUT Request
  app.put('/:id', function(request, response) {
    var fileList = getDirInfo();
    var fileIndex = request.params.id;
    var postBody = request.body;
    // Ensure that the POST data is properly formatted
    if (!postBody.username) {
      response.send('Please format your request like this: \n' +
        '{"username": "usernameToPost", "email": "emailToPost"\')');
    } else {
      // Make username lower case
      var username = JSON.stringify(request.body.username).toLowerCase();
      var username = JSON.parse(username);

      // Ensure that a file with this user doesn't already exist
      var canSave = false;
      for (var keys in fileList) {
        if (fileList[keys] === username + '.json') {
          canSave = true;
        }
      }
      if (!canSave) {
        response.send('A file for that username does not exist! If you ' +
          'would like to create the file, please use POST');
      } else {
        // Write contents of the file
        fs.writeFile('data/' + username + '.json',
          JSON.stringify(request.body), function(err, data) {
          if (err) throw err;
          response.send('File Sucessfully Updated!');
        });
      }
    }
  });

  /************************************************************
  /   Handle DELETE requests
  /************************************************************/

  app.delete('/:id', function(request, response) {
    var fileList = getDirInfo();
    var nameToDelete = request.params.id;
    var fileName = nameToDelete + '.json';

    // Ensure that the username actually exists
    var canDelete = false;
    for (var keys in fileList) {
        console.log(fileList[keys]);
      if (fileList[keys] === fileName) {
        canDelete = true;
      }
    }
    if (!canDelete) {
      response.send('That username does not exist!');
    } else {
      fs.unlink('./data/' + nameToDelete +'.json', function(err) {
        if (err) throw err;
        response.send('Successfully deleted the file ' + nameToDelete +'.json');
      });
    }
  });

  app.delete('/', function(request, response) {
    response.send('Please direct your endpoint to the username you would like ' +
      'to delete. (example - "/Johndoe DELETE")');
  });

  /************************************************************
  /   Helper Functions
  /************************************************************/

  function getDirInfo() {
    var fileList = {};
    var files = fs.readdirSync('./data');
    var fileNum = files.length;
    for (var i = 0; i < files.length; i++) {
      fileList[i] = files[i];
    }
    return fileList;
  }
}

startServer();
exports.startServer = startServer;


