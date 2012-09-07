var https = require('https');
var fs = require('fs');
var url = require("url");

var options = {
  key: fs.readFileSync('./server.key'),
  cert: fs.readFileSync('./server.crt')
};

https.createServer(options, function (req, res) {
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
    console.log(obj);
    
    if(req.headers['content-type'] === 'application/json' && buffer.length > 0) {
      console.log(JSON.parse(buffer));
    }
    
    res.writeHead(200, {
      "Content-Type": "application/json"
    });
    
    res.end(JSON.stringify(obj));
  });
}).listen(3000);