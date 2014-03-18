var appControllers = angular.module('controllers', []);

appControllers.controller('mainController', ['$scope','$http','socket',
	function mainController($scope, $http, socket) {


		function Marmita(){
			var marmita = {
				tipo : 'simples',
				quantidade : 1,
				descricao : '',
				tamanho : 'P', 
				valor :0,
				arroz : 'normal',
				embalagem: 'aluminio'
			};
			return marmita;
		}

		$scope.marmita = new Marmita();


		$scope.getTotal = function(marmita){
			var total = (getTamanho(marmita.tamanho).valor + getEmbalagem(marmita.embalagem).valor 
				+ getTipo(marmita.tipo).valor ) * marmita.quantidade ;
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
		if ($scope.marmita.nome == '') 
			throw 'Deve ser inserido um nome.';

		$http.post('/pedido', $scope.marmita)
		.success(function(marmitaSalva, stauts){
			
			if (!confirm('Deseja confirmar o envio do pedido ?')) return;

			console.log(marmitaSalva);			
			socket.emit('novoPedido', marmitaSalva);
			successMessage();
			$scope.marmita = new Marmita();
			console.log('pedido enviado');
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
				$scope.items.push(data);
			});

		$http.get('/pedido')
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
		 		console.log('Erro, o item não pode ser excluido. ' +status);
		 	});
			
		};

		$scope.filtrarData = function(){
			var dataAtual = new Date();
			$scope.query =  $filter('date')(new Date(), 'yyyy-MM-dd');			
		}

	}]);
