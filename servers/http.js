var http = require("http"),
    url = require("url"),
    fs = require("fs");

var filed = require('filed');

var server = http.createServer(function (req, res) {
  req.setEncoding("utf8");
  
  var buffer = ''
  req.on("data", function(data) {
    buffer += data;
  });
  
  req.on("end", function() {
    console.log(new Date)
    
    var parsedURL = url.parse(req.url, true);
    var responseHeaders = {};
    
    if(req.headers.cookie) {
      console.log("Has a cookie: %j", req.headers.cookie);
    } else {
      responseHeaders["Set-Cookie"] = "uid=124";
    }
    
    if(req.headers['content-type'] === 'application/json' && buffer.length > 0) {
      console.log("Parsed HTTP Body: " + JSON.parse(buffer));
    }
    
    if(req.headers['accept'] === 'text/html') {
      responseHeaders["Content-Type"] = "text/html";
      filed(__dirname + '/test.html').pipe(res);
    } else {
      responseHeaders["Content-Type"] = "application/json";
      
      var obj = {
        method:req.method,
        path:parsedURL.pathname,
        query:parsedURL.query,
        headers:req.headers,
        body:buffer
      };
      
      res.writeHead(200, responseHeaders);
      res.end(JSON.stringify(obj));
    }
  });
});

server.listen(3000);