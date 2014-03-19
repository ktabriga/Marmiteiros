var appControllers = angular.module('controllers', []);

appControllers.controller('mainController', ['$scope','$http',
	function mainController($scope, $http) {


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

		if (!confirm('Deseja confirmar o envio do pedido ?')) return;

		$http.post('/pedido', $scope.marmita)
		.success(function(marmitaSalva, stauts){
			console.log(marmitaSalva);			
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

		socket.on('deletedPedido', function(deleted){
			$scope.items.forEach(function removerItemDeletado(item){
				if(item._id == deleted.id){
					$scope.items.splice($scope.items.indexOf(item), 1);
					return;
				}
			});
		});

		socket.on('teste', function(data){
			alert(data);
		})

		$http.get('/pedidoHoje')
		.success(function(dados, status){
			$scope.items = dados;
		})
		.error(function(data, status){
			alert('erro ao buscar pedidos '+data);
		});

		$scope.deletarItem= function(item){
			console.log(item);
			var index = $scope.items.indexOf(item);
			$http.delete('/pedido/'+$scope.items[index]._id)
			.success(function(data, status){
				console.log(data.countDeleted);
				$scope.items.splice(index, 1);
			})
		 	.error(function( status){
		 		console.log('Erro, o item não pode ser excluido. ' +status);
		 	});
			
		};

		$scope.getTodos = function(){
			$http.get('/pedido')
				.success(function(dados, stauts){
					$scope.items = dados;
				})
				.error(function(dados, stauts){
					console.log('Erro,não foi possivel buscar todos os pedidos. '+dados);
				});
		}

	}]);
