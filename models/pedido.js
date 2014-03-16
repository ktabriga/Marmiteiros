var mongoose = require('mongoose')
	,Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/marmiteiros');

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

exports.createAll = function(req, res){
	var dados = req.body;

	for(i in dados){
		dados[i].data = new Date();
		var pedido = new Model(dados[i]);
		pedido.save(function(err, pedidoSalvo){
			if(err){
				res.send(err);
				return;
			}
		});
	}

	res.send('ok');
}

exports.getAll = function(req, res){

	Model.find({}, function(err, pedidos){
		if(err){
			res.send(err);
			return;
		}
		res.send(pedidos);
	});
}

exports.delete = function(req, res){
	var id = req.params.id;

	Model.remove({_id : id}, function(err, countDeleted){
		if(err){
			res.send(err);
			return;
		}
		res.send({countDeleted : countDeleted});
	});
}