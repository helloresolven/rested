var http = require("http");
var url = require("url");

var server = http.createServer(function (req, res) {
  req.setEncoding("utf8");
  
  var buffer = ''
  req.on("data", function(data) {
    buffer += data;
  });
  
  req.on("end", function() {
    console.log(new Date)
    var parsedURL = url.parse(req.url, true);
    
    var responseHeaders = {"Content-Type" : "application/json"}
    
    
    if(req.headers.cookie) {
      console.log("Has a cookie! %j", req.headers.cookie);
      
    } else {
      console.log("No cookie :(!");
      responseHeaders["Set-Cookie"] = "uid=124";
    }
    
    if(req.headers['content-type'] === 'application/json' && buffer.length > 0) {
      console.log(JSON.parse(buffer));
    }
    
    var obj = {
      method:req.method,
      path:parsedURL.pathname,
      query:parsedURL.query,
      headers:req.headers,
      body:buffer
    };
    
    res.writeHead(200, responseHeaders);
    res.end(JSON.stringify(obj));
  });
});

server.listen(3000);