var http = require("http"),
    url = require("url"),
    fs = require("fs");

var filed = require('filed');

var server = http.createServer(function (req, res) {
  req.setEncoding("utf8");
  
  req.buffer = ''
  req.on("data", function(data) {
    req.buffer += data;
  });
  
  req.on("end", function() {
    console.log(new Date);
    console.log(req.path);

    if(req.headers.cookie) {
      console.log("Has a cookie: %j", req.headers.cookie);
    }
    
    if(req.headers['content-type'] === 'application/json' && req.buffer.length > 0) {
      console.log("Parsed HTTP Body: " + JSON.stringify(JSON.parse(req.buffer), null, "  "));
    }
    
    var parsedURL = url.parse(req.url, true);
    
    var info = {
      method:req.method,
      path:parsedURL.pathname,
      query:parsedURL.query,
      headers:req.headers,
      body:req.buffer
    };
    
    setTimeout(function() {
      handleRequest(info, res);
    }, 0);
  });
});

function handleRequest(req, response) {
  console.log(req.path);
  
  if(req.path === "/test.html") {
    filed(__dirname + '/test.html').pipe(response);
    return;
  }
    
  if(req.path === "/auth") {
    var authHeader = req.headers.authorization || "";
    var token = authHeader.split(/\s+/).pop() || "";
    var auth = new Buffer(token, "base64").toString();
    var credentials = auth.split(":");
    var user = credentials[0], pass = credentials[1];
    
    if(user === "test" && pass === "test") {
      response.writeHead(200, { "Content-Type":"application/json" });
      response.end(JSON.stringify(req));
    } else {
      response.writeHead(401, {"WWW-Authenticate" : "Basic"});
      response.end();
    }
    
    return;
  }

  if(req.path === '/redirect') {
    response.writeHead(301, {'Location': '/hello'});
    response.end();
    return;
  }

  var responseHeaders = { "Content-Type":"application/json", "Test-Header-Encoding":"<b>not bold</b>"  };

  if(req.path === '/getcookie') { responseHeaders['Set-Cookie'] = 'a=b'; }

  response.writeHead(200, responseHeaders);

  if(req.query.callback) {
    response.write(req.query.callback + "(" + JSON.stringify(req) + ");");
  } else {
    response.write(JSON.stringify(req));
  }
  
  response.end();
}

server.listen(3000);
