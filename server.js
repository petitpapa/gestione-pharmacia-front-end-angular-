var http = require('http');
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({});



http.createServer(function (req, res) {
        setTimeout(function(){
 console.log('Request', req.method, req.url);
    proxy.web(req, res, { target: '127.0.0.1:5555' });
    proxy.on('error', function (e) {
        console.log(e);
    });

    }, 5000);
   
}).listen(4200);