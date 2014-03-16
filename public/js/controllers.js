var appControllers = angular.module('controllers', []);

appControllers.controller('mainController', ['$scope','$http','socket',
	function mainController($scope, $http, socket) {

		function Pedido(){
			this.items = [];
		}
		$scope.pedido = {};
		$scope.pedido.items = [];

		$scope.addItem = function(){
			$scope.pedido.items.push($scope.item);
			$scope.item = new Item();
		}

		function Item(){
			var item = {
				tipo : 'simples',
				quantidade : 1,
				descricao : '',
				tamanho : 'P', 
				valor :0,
				arroz : 'normal',
				embalagem: 'aluminio'
			};
			return item;
		}

		$scope.item = new Item();

		$scope.deletarItem = function(index){
			$scope.pedido.items.splice(index,1);
		}

		$scope.getTotal = function(item){
			var total = (getTamanho(item.tamanho).valor + getEmbalagem(item.embalagem).valor + getTipo(item.tipo).valor ) * item.quantidade ;
			return total;
		}

		function getTamanho(tamanho){
			this.P = {
				valor : 7.50
			}
			this.M = {
				valor : 9.50
			}
			return this[tamanho];
		}	

		function getTipo(tipo){
			this.simples = {
				valor : 0
			}
			this.executiva = {
				valor : 6
			}
			return this[tipo];	
		}

		function getEmbalagem(emb){
			this.aluminio = {
				valor : 0
			}
			this.caixa = {
				valor : 1
			}
			return this[emb];	
		}

	$scope.enviarPedido = function(){		
		if ($scope.pedido.items.length <= 0) 
			throw 'Itens devem ser adicionados.';

		$http.post('/pedidos', $scope.pedido.items)
		.success(function(data, stauts){
			console.log(data);			
			socket.emit('novoPedido', $scope.pedido.items);
			$scope.pedido = new Pedido();
			alert('Pedido Enviado!!!');
		})
		.error(function(data, stauts){
			alert('Pedido não pode ser enviado '+data);
		});
			
	}

}]);

appControllers.controller('listaController', ['$scope','$http','socket','$filter',
	function($scope, $http, socket, $filter){

		socket.on('novoPedido', function (data) {			
				console.log(data);
				var items = $scope.items;
				$scope.items = $scope.items.concat(data);
			});

		$http.get('/pedidos')
		.success(function(dados, status){
			$scope.items = dados;
		})
		.error(function(data, status){
			alert('erro ao buscar pedidos '+data);
		});

		$scope.deletarItem= function(index){
			console.log($scope.items[index]._id);

			$http.delete('/pedido/'+$scope.items[index]._id)
			.success(function(data, status){
				console.log(data.countDeleted);
				$scope.items.splice(index, 1);
			})
		 	.error(function( status){
		 		alert('Erro, o item não pode ser excluido. ' +status);
		 	});
			
		};

		$scope.filtrarData = function(){
			var dataAtual = new Date();

			$scope.query =  $filter('date')(new Date(), 'yyyy-MM-dd');
			
		}

	}]);
