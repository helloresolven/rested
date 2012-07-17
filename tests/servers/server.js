var http = require("http");
var url = require("url");

var server = http.createServer(function (req, res) {
  req.setEncoding("utf8");
  
  var buffer = ''
  req.on("data", function(data) {
    buffer += data;
  });
  
  req.on("end", function() {
    var parsedURL = url.parse(req.url, true);
    
    var obj = {
      method:req.method,
      path:parsedURL.pathname,
      query:parsedURL.query,
      headers:req.headers,
      body:buffer
    };
    
    res.writeHead(200, {
      "Content-Type": "application/json"
    });
    
    res.end(JSON.stringify(obj));
  });
});

server.listen(3000);