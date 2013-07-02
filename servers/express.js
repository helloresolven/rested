var express = require('express'),
    filed = require('filed'),
    url = require('url'),
    fs = require('fs');

var app = express();

app.use(express.logger());
app.use(express.bodyParser());
app.use(express.cookieParser('rested loves you.'));
app.use(express.compress());

app.use(function(req, res, next) {
  var info = {
    method: req.method,
    path: req.path,
    query: req.query,
    headers: req.headers,
    body: req.body,
    cookie: req.signedCookies
  };

  req.info = info;

  next();
});

app.get('/test.html', function(req, res) {
  filed(__dirname + '/test.html').pipe(res);
});

var basicAuth = express.basicAuth(function(u, p) {
  return u === "test" && p === "test";
}, "Treat yo' self, with a password.");

app.all('/auth', basicAuth, function(req, res) {
  res.json(200, req.info);
});

app.all('/redirect', function(req, res) {
  res.redirect(301, '/redirect-result');
});

app.get('/cookie', function(req, res) {
  res.cookie('name', 'patrick', { signed: true });
  res.redirect(301, '/cookie-set');
});

app.get('/clear-cookie', function(req, res) {
  res.clearCookie('name');
  res.redirect(301, '/cookie-unset');
});

app.all('*', function(req, res) {
  res.json(200, req.info);
});

app.listen(3000);
