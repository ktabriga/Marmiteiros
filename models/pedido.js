module.exports = function(sockets){

	var mongoose = require('mongoose')
		,Schema = mongoose.Schema;


	var connectionStr ='mongodb://localhost/marmiteiros';
	if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
	  connectionStr = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
	  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
	  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
	  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
	  process.env.OPENSHIFT_APP_NAME;
	}
	mongoose.connect(connectionStr);

	var db = mongoose.connection;

	db.on('error', function (err) {
		console.log('erro de conexão');
	});

	db.once('open', function(){
		console.log('conexão aberta');
	});

	var pedidoSchema = new Schema({
		nome : String,
		quantidade : Number,
		tipo : String,
		tamanho : String,
		embalagem : String,
		arroz : String,
		data : Date,
		observacao : String
	});

	var Model = mongoose.model('pedidoMarmita', pedidoSchema);

	var create = function(req, res){
		var data = req.body;
		var pedido = new Model(data);
		pedido.data = new Date();
		pedido.save(function(err, pedidoSalvo){
			if(err){
				res.send(err);
				return;
			}
			res.json(pedidoSalvo);
			sockets.emit('novoPedido', pedidoSalvo);
		});
	}

	var getAll = function(req, res){

		Model.find({}, function(err, pedidos){
			if(err){
				res.send(err);
				return;
			}
			res.send(pedidos);
		});
	}

	var getAllToday = function(req, res){
		var dataAtual =  new Date();
		dataAtual.setHours(0,0,0,0);
		Model.find({data : {$gte : dataAtual}}, function(err, pedidos){
			if(err){
				res.send(err);
				return;
			}
			res.send(pedidos);
		});
	}

	var deleteItem = function(req, res){
		var id = req.params.id;

		Model.remove({_id : id}, function(err, countDeleted){
			if(err){
				res.send(err);
				return;
			}
			res.send({countDeleted : countDeleted});
			sockets.emit('deletedPedido', {id : id});
		});
	}


	return{
		create : create
		,delete : deleteItem
		, getAll : getAll
		,getAllToday : getAllToday
	}
}