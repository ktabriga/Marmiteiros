
/**
 * Module dependencies.
 */
var express = require('express');
var app = express();
var routes = require('./routes');
var pedido = require('./models/pedido');
var http = require('http')
	,server= http.createServer(app);
var path = require('path');
var io = require('socket.io').listen(server);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/marmiteiros',function(req, res){
	res.sendfile(__dirname+'/public/index.html')
});

app.post('/pedidos', pedido.createAll);
app.get('/pedidos', pedido.getAll );
app.delete('/pedido/:id', pedido.delete );

io.sockets.on('connection', function (socket) {

  socket.on('novoPedido', function (data) {
  	for(i in data)
  		data[i].data = new Date();
  	socket.broadcast.emit('novoPedido', data);
    console.log(data);
  });

});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port') );
});

